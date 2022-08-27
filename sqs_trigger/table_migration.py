import boto3
import os
import ast
import json
from boto3.dynamodb.conditions import Key

# dynamo
DYNAMO = boto3.resource("dynamodb")
DYNAMO_CLIENT = DYNAMO.meta.client
DYNAMO_TABLE_NAME = os.getenv("TABLE_NAME", "Article")
TABLE = DYNAMO.Table(DYNAMO_TABLE_NAME)


def clean_table(UserID):
    """コピー先のDynamoDBテーブルをcleanUpする."""
    print("コピー先のDynamoDBテーブルをcleanUpする.")
    getCleanTable = TABLE.query(KeyConditionExpression=Key("UserID").eq(UserID))
    print(getCleanTable)

    for i in getCleanTable["Items"]:
        print(i)
        boto3.client("dynamodb").batch_write_item(
            RequestItems={
                "Article": [
                    {
                        "DeleteRequest": {
                            "Key": {
                                "UserID": {"S": i["UserID"]},
                                "ArticleID": {"S": i["ArticleID"]},
                            }
                        }
                    }
                ]
            }
        )


def put_dynamo(data):
    """コピー先のDynamoDBテーブルへputする."""
    print("コピー先のDynamoDBテーブルへputする.")
    UserName = data["ContentsName"]
    contents_list = json.loads(data["Contents"])
    UserID = str(contents_list[0]["authorId"])
    print(UserID)
    AccountName = data["URL"]
    clean_table(UserID)
    try:
        for i in range(len(contents_list)):
            Content = {
                "ArticleID": str(contents_list[i]["tweetId"]),
                "UserID": str(contents_list[i]["authorId"]),
                "AccountName": AccountName,
                "Detail": contents_list[i]["body"],
                "UserName": UserName,
            }
            TABLE.put_item(Item=Content)

    except Exception as error:
        raise error


def conv_dict(strings):
    """Str -> Dict."""
    print("Str -> Dict.")
    dict = ast.literal_eval(str(strings))
    return dict


def lambda_handler(event, context):
    """main."""
    print("main.")
    try:
        for i in range(len(event["Records"])):
            print(event["Records"][i - 1]["body"])
            getdata = event["Records"][i - 1]["body"]
            put_dynamo(conv_dict(getdata))
    except Exception as error:
        raise error
