import decimal
import json
import os
from time import sleep

import boto3
from aws_xray_sdk.core import patch_all
from botocore.exceptions import ClientError

patch_all()
# dynamo
table_name = os.environ.get("DYNAMODB_SCRAPING_TABLE", "Scrapings")
region = os.environ.get("REGION_NAME", "ap-northeast-1")

scraping_table = boto3.resource("dynamodb", region_name=region).Table(table_name)


# SQS
SQS = boto3.resource("sqs")
QUEUE = SQS.Queue("url")
URL = os.environ["QUEUE_URL"]


class DecimalEncoder(json.JSONEncoder):
    """dynamodb get_item return number type for encoder."""

    def default(self, obj):
        """Return encode data."""
        print("Return encode data.")
        if isinstance(obj, decimal.Decimal):
            if obj % 1 > 0:
                return float(obj)
            else:
                return int(obj)
        return super(DecimalEncoder, self).default(obj)


def get_item(key):
    """DynamoDBからitemを取得する."""
    print("DynamoDBからitemを取得する.")
    try:
        response = scraping_table.get_item(Key={"ContentsName": str(key)})
        encode = json.dumps(response["Item"], cls=DecimalEncoder, ensure_ascii=False)
        return encode
    except ClientError as e:
        print(e.response["Error"]["Message"])
        raise e


def put_sqs(item):
    """sqsのキューにメッセージをputする."""
    print("sqsのキューにメッセージをput")
    print(item)
    QUEUE.send_message(MessageBody=item, QueueUrl=URL, DelaySeconds=0)


def key_list(filename):
    """コピー対象のuseridをテキストから取得."""
    print("コピー対象のuseridをテキストから取得.")
    path = os.getcwd() + f"/list/{filename}"
    with open(path) as f:
        # 一行ごとをリストに入れてreturn
        return f.read().split()


def lambda_handler(event, context):
    """main."""
    try:
        for i in ["whoscored", "fabrizioromano", "sofascoreint", "shotaro59432703"]:
            result = get_item(i)
            put_sqs(result)
            # 1秒スリープ処理
            sleep(1)
    except Exception as e:
        raise e
