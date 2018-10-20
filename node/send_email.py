from botocore.exceptions import ClientError
import boto3

from config import AWS_REGION, CHARSET
from voting import generate_token


def send_email(election, url):
    # Replace sender@example.com with your "From" address.
    # This address must be verified with Amazon SES.
    SENDER = "Voting System <pau.argelaguet@hotmail.com>"

    # The subject line for the email.
    SUBJECT = election.get('name')

    # The email body for recipients with non-HTML email clients.
    BODY_TEXT = "Please, visualize as HTML\r\n"

    # Create a new SES resource and specify a region.
    client = boto3.client('ses', region_name=AWS_REGION)

    # Try to send the email.
    for user in election.get('users'):
        # The HTML body of the email.
        BODY_HTML = """<html>
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
                    'ToAddresses': [
                        user.get('email'),
                    ],
                },
                Message={
                    'Body': {
                        'Html': {
                            'Charset': CHARSET,
                            'Data': BODY_HTML,
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
