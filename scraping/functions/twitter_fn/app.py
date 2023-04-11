import difflib
import json
import os

import boto3
import tweepy
from aws_xray_sdk.core import patch_all

patch_all()
table_name = os.environ.get("DYNAMODB_SCRAPING_TABLE", "Scrapings")
region = os.environ.get("REGION_NAME", "ap-northeast-1")

scraping_table = boto3.resource("dynamodb", region_name=region).Table(table_name)

API_KEY = os.environ["API_KEY"]
API_KEY_SECRET = os.environ["API_KEY_SECRET"]
ACCESS_TOKEN = os.environ["ACCESS_TOKEN"]
ACCESS_TOKEN_SECRET = os.environ["ACCESS_TOKEN_SECRET"]
BEARER_TOKEN = os.environ["BEARER_TOKEN"]


def lambda_handler(event, context):
    contents_name = [
        "footballdaily",
        "fabrizioromano",
        "sofascoreint",
        "DeadlineDayLive",
        "LaLiga",
    ]
    user_id = [
        "278038673",
        "330262748",
        "1054258421942358016",
        "1030711922",
        "423384542",
    ]

    for i in range(len(user_id)):
        state = main(contents_name[i], user_id[i])
        if state is False:
            return {
                "statusCode": 200,
                "body": json.dumps(
                    "Process aborted becaouse an error occurred. " + contents_name[i]
                ),
            }

    return {"statusCode": 200, "body": json.dumps("Hello from Lambda!")}


def main(contents_name, user_id):
    file_contents = ""
    state = ""
    exist_contents = ""

    try:
        # Get existing data
        exist_data = scraping_table.get_item(Key={"ContentsName": contents_name})
        exist_contents = exist_data["Item"]["Contents"]

    except KeyError:
        print("Not found data. OK. Insert new data.")
    except Exception as e:
        print("Select DB Error!!!")
        print(e)
        return False

    file_contents = scraping_tweets(contents_name, user_id)
    if file_contents is False:
        return False

    try:
        if file_contents != exist_contents:
            print("changed!")
            state = "changed!"
            res = difflib.ndiff(exist_contents.split(), file_contents.split())
            sabun = ""
            for r in res:
                if r[0:1] in ["+"]:
                    sabun = sabun + r + "\n"

            # if the data has been altered,
            response = scraping_table.put_item(
                Item={
                    "ContentsName": contents_name,
                    "UpdateFlag": 1,
                    "Contents": file_contents,
                    "Sabun": sabun,
                    "URL": "https://twitter.com/" + contents_name,
                    "Selecter": "",
                }
            )
        else:
            print("same...")
            state = "same..."

    except Exception as e:
        print("Insert(Update) Error!!!")
        print(e)
        return False

    return state


# Get data by scraping tweets.
def scraping_tweets(contents_name, user_id):
    file_contents = []

    try:
        client = tweepy.Client(
            BEARER_TOKEN, API_KEY, API_KEY_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET
        )
        buf = client.get_users_tweets(
            user_id,
            max_results=10,
            expansions="attachments.media_keys",
            exclude=["replies", "retweets"],
            media_fields=["url", "media_key", "preview_image_url"],
            tweet_fields=["author_id", "created_at"],
        )
        tweets_data = buf.data
        tweets_media_map = {}
        if hasattr(buf, "includes"):
            if "media" in buf.includes:
                tweets_media = buf.includes["media"]
                tweets_media_map = storeMediaMap(tweets_media)

        for tweet in tweets_data:
            tweetObj = {}
            tweetObj["imgPath"] = []
            if tweet.attachments is not None:
                img_path_list = attachImgToData(
                    tweets_media_map, tweet.attachments["media_keys"]
                )
                tweetObj["imgPath"] = img_path_list

            # if 'media' in tweet.attachments:
            # print(tweet.attachments['media'])

            tweetObj["tweetId"] = tweet.id
            tweetObj["createdAt"] = tweet.created_at.isoformat()
            tweetObj["authorId"] = tweet.author_id
            tweetObj["tweetUrl"] = (
                "https://twitter.com/" + contents_name + "/status/" + str(tweet.id)
            )
            tweetObj["body"] = tweet.text
            file_contents.append(tweetObj)

        if file_contents == "":
            print("not found tweets...")
            return False

    except Exception as e:
        print("Scraping Error!!! " + contents_name)
        print(e)
        return False

    return json.dumps(file_contents)


def storeMediaMap(tweets_media_list):
    mediaObj = {}
    for media in tweets_media_list:
        if media.url is not None:
            mediaObj[media.media_key] = media.url
        elif media.preview_image_url is not None:
            mediaObj[media.media_key] = media.preview_image_url
    print(mediaObj)
    return mediaObj


def attachImgToData(map, keys):
    imgPath = []
    for key in keys:
        imgPath.append(map[key])
    return imgPath
