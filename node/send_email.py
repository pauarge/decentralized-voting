from botocore.exceptions import ClientError
import boto3
import os

from config import AWS_REGION, CHARSET, SENDER
from voting import generate_token

BODY_TEXT = "Please, visualize as HTML\r\n"
REMOTE = os.environ.get('LOCAL_DYNAMO', '0') == '1'


def send_register_email(election, url):
    if REMOTE:
        url += '/dev/'

    # The subject line for the email.
    SUBJECT = election.get('name')

    # Create a new SES resource and specify a region.
    client = boto3.client('ses', region_name=AWS_REGION)

    # Try to send the email.
    for user in election.get('users'):
        # The HTML body of the email.
        body_html = """<html>
                <head></head>
                <body>
                <h1>{}</h1>
                <p>You can obtain your code for voting here: <a href="http://{}/verify?token={}">Voting link</a>.</p>
                </body>
                </html>""".format(election.get('name'), url, generate_token(election, user))

        try:
            # Provide the contents of the email.
            response = client.send_email(
                Destination={
                    'ToAddresses': [user.get('email')],
                },
                Message={
                    'Body': {
                        'Html': {
                            'Charset': CHARSET,
                            'Data': body_html,
                        },
                        'Text': {
                            'Charset': CHARSET,
                            'Data': BODY_TEXT,
                        },
                    },
                    'Subject': {
                        'Charset': CHARSET,
                        'Data': SUBJECT,
                    },
                },
                Source=SENDER,
            )

        except ClientError as e:
            print(e.response['Error']['Message'])
        else:
            print("Email sent! Message ID:"),
            print(response['MessageId'])


def send_verification_email(election, url, token):
    if REMOTE:
        url += '/dev/'

    # The subject line for the email.
    SUBJECT = '{} - Voting Verification'.format(election.get('name'))

    # Create a new SES resource and specify a region.
    client = boto3.client('ses', region_name=AWS_REGION)

    # Try to send the email.
    for user in election.get('users'):
        # The HTML body of the email.
        body_html = """<html>
                <head></head>
                <body>
                <h1>{}</h1>
                <p>You can verify your vote here: <a href="http://{}/proof?token={}">Voting link</a>.</p>
                </body>
                </html>""".format(election.get('name'), url, token)

        try:
            # Provide the contents of the email.
            response = client.send_email(
                Destination={
                    'ToAddresses': [user.get('email')],
                },
                Message={
                    'Body': {
                        'Html': {
                            'Charset': CHARSET,
                            'Data': body_html,
                        },
                        'Text': {
                            'Charset': CHARSET,
                            'Data': BODY_TEXT,
                        },
                    },
                    'Subject': {
                        'Charset': CHARSET,
                        'Data': SUBJECT,
                    },
                },
                Source=SENDER,
            )

        except ClientError as e:
            print(e.response['Error']['Message'])
        else:
            print("Email sent! Message ID:"),
            print(response['MessageId'])
