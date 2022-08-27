import boto3
import os
import json
import decimal
from time import sleep

from botocore.exceptions import ClientError

# dynamo
DYNAMO = boto3.resource("dynamodb")
DYNAMO_CLIENT = DYNAMO.meta.client
DYNAMO_TABLE_NAME = os.getenv("TABLE_NAME", "Scraping")
TABLE = DYNAMO.Table(DYNAMO_TABLE_NAME)

# SQS
SQS = boto3.resource("sqs")
QUEUE = SQS.Queue("url")
URL = "https://sqs.ap-northeast-1.amazonaws.com/528163014577/ScrapingToArticle"


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
        response = TABLE.get_item(Key={"ContentsName": str(key)})
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


def main():
    """main."""
    try:
        filelist = ["get_key_list.txt"]
        for f in filelist:
            # for i in key_list(f):
            for i in ["whoscored", "fabrizioromano", "sofascoreint", "shotaro59432703"]:
                result = get_item(i)
                put_sqs(result)
                # 1秒スリープ処理
                sleep(1)
    except Exception as e:
        raise e


if __name__ == "__main__":
    main()
