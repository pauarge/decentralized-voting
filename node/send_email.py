import hashlib

from botocore.exceptions import ClientError
import boto3


def send_email(current_election, url):
    # Replace sender@example.com with your "From" address.
    # This address must be verified with Amazon SES.
    SENDER = "Voting System <pau.argelaguet@hotmail.com>"

    # Specify a configuration set. If you do not want to use a configuration
    # set, comment the following variable, and the
    # ConfigurationSetName=CONFIGURATION_SET argument below.
    # CONFIGURATION_SET = "ConfigSet"

    # If necessary, replace us-west-2 with the AWS Region you're using for Amazon SES.
    AWS_REGION = "eu-west-1"

    # The subject line for the email.
    SUBJECT = current_election.get('name')

    # The email body for recipients with non-HTML email clients.
    BODY_TEXT = "Please, visualize as HTML\r\n"

    # The character encoding for the email.
    CHARSET = "UTF-8"

    # Create a new SES resource and specify a region.
    client = boto3.client('ses', region_name=AWS_REGION)

    # Try to send the email.
    for user in current_election.get('users'):
        sha_1 = hashlib.sha1()
        sha_1.update("{}{}".format(user.get('email'), user.get('id')).encode('utf-8'))

        # The HTML body of the email.
        BODY_HTML = """<html>
                <head></head>
                <body>
                <h1>{}</h1>
                <p>You can obtain your code for voting here: <a href="http://{}/verify?token={}">Voting link</a>.</p>
                </body>
                </html>""".format(current_election.get('name'), url, sha_1.hexdigest())

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
                # If you are not using a configuration set, comment or delete the
                # following line
                # ConfigurationSetName=CONFIGURATION_SET,
            )
        # Display an error if something goes wrong.
        except ClientError as e:
            print("Shit")
            print(e.response['Error']['Message'])
        else:
            print("Email sent! Message ID:"),
            print(response['MessageId'])
