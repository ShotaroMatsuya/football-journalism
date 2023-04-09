import os

import boto3
import requests

dynamodb = boto3.client("dynamodb")
table_name = os.environ.get("DYNAMODB_ARTICLES_TABLE", "Articles")
region = os.environ.get("REGION_NAME", "ap-northeast-1")


def put_list_item(userId, articleId, append_value):

    # list_appendでlist同士をつなぎ、SET命令で新しいリストを代入
    append_list = [append_value]
    res = dynamodb.update_item(
        TableName=table_name,
        Key={"UserID": {"S": userId}, "ArticleID": {"S": articleId}},
        UpdateExpression="ADD #attribute :val",
        ExpressionAttributeNames={"#attribute": "Faces"},
        ExpressionAttributeValues={":val": {"SS": append_list}},
        ReturnValues="UPDATED_NEW",
    )


def lambda_handler(event, context):
    print(event)
    user_id = event["UserID"]
    article_id = event["ArticleID"]

    # 画像URL
    image_url = event["url"]

    # 画像をバイナリデータとして取得
    response = requests.get(image_url)
    image_bytes = response.content
    # Rekognitionクライアントの初期化
    rekognition = boto3.client("rekognition")

    # RekognitionCelebrities APIの呼び出し
    data = rekognition.recognize_celebrities(Image={"Bytes": image_bytes})

    # 結果を出力
    print(data)
    for i in data["CelebrityFaces"]:
        put_list_item(user_id, article_id, i["Name"])

    return {"statuCode": 200, "body": "Success!"}
