import ast
import json
import os

import boto3
from aws_xray_sdk.core import patch_all
from boto3.dynamodb.conditions import Key

patch_all()
# dynamo
table_name = os.environ.get("DYNAMODB_ARTICLE_TABLE", "Articles")
region = os.environ.get("REGION_NAME", "ap-northeast-1")

article_table = boto3.resource("dynamodb", region_name=region).Table(table_name)


def clean_table(UserID):
    """コピー先のDynamoDBテーブルをcleanUpする."""
    print("コピー先のDynamoDBテーブルをcleanUpする.")
    getCleanTable = article_table.query(KeyConditionExpression=Key("UserID").eq(UserID))
    print(getCleanTable)

    for i in getCleanTable["Items"]:
        print(i)
        cleanupTable = boto3.client("dynamodb").batch_write_item(
            RequestItems={
                "Articles": [
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
    AccountName = data["URL"]
    clean_table(UserID)
    try:
        for i in range(len(contents_list)):
            Content = {
                "ArticleID": str(contents_list[i]["tweetId"]),
                "UserID": str(contents_list[i]["authorId"]),
                "AccountName": AccountName,
                "Detail": repr(contents_list[i]["body"]),
                "UserName": UserName,
                "ImgPath": set(contents_list[i]["imgPath"])
                if len(contents_list[i]["imgPath"]) > 0
                else list([]),
                "CreatedAt": contents_list[i]["createdAt"],
            }
            article_table.put_item(Item=Content)

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
            getdata = event["Records"][i - 1]["body"]
            put_dynamo(conv_dict(getdata))
    except Exception as error:
        raise error
