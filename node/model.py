import boto3
import json


class Model:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000/')
        try:
            table = self.dynamodb.create_table(
                TableName='elections',
                KeySchema=[
                    {
                        'AttributeName': 'id',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'content',
                        'KeyType': 'RANGE'
                    }
                ],
                AttributeDefinitions=[
                    {
                        'AttributeName': 'id',
                        'AttributeType': 'S'
                    },
                    {
                        'AttributeName': 'content',
                        'AttributeType': 'S'
                    }

                ],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 1,
                    'WriteCapacityUnits': 1
                }
            )
            table.meta.client.get_waiter('table_exists').wait(TableName='elections')
            print('table ok')
        except:
            print('table already existed')

    def save(self, election):
        table = self.dynamodb.Table('elections')
        table.put_item(
            Item={
                'id': election.get('id'),
                'content': json.dumps(election),
            }
        )
        return True