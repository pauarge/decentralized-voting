import boto3
import json
import os


class Model:
    def __init__(self):
        if os.environ.get('LOCAL_DYNAMO', '0') == '1':
            print('local dynamo')
            self.dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000/')
        else:
            print('remote dynamo')
            self.dynamodb = boto3.resource('dynamodb')
        try:
            table = self.dynamodb.create_table(
                TableName='elections',
                KeySchema=[
                    {
                        'AttributeName': 'id',
                        'KeyType': 'HASH'
                    },
                ],
                AttributeDefinitions=[
                    {
                        'AttributeName': 'id',
                        'AttributeType': 'S'
                    },

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

    def save(self, election, sk):
        table = self.dynamodb.Table('elections')
        table.put_item(
            Item={
                'id': election[0].get('id'),
                'content': json.dumps(election),
                'sk': sk,
            }
        )
        return True
