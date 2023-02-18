import json
import os

import boto3

sns_client = boto3.client("sns")
table_name = os.environ.get("DYNAMODB_SCRAPING_TABLE", "Scraping")
region = os.environ.get("REGION_NAME", "ap-northeast-1")

scraping_table = boto3.resource("dynamodb", region_name=region).Table(table_name)


def lambda_handler(event, context):

    mail = os.environ["NOTIFICATION_EMAIL"]
    contents_name = ["shotaro59432703", "fabrizioromano", "whoscored", "sofascoreint"]
    contents_flag = [True, True, True, True]
    sabun_flag = [True, True, True, True]

    for i in range(len(contents_name)):
        print(i)
        state = main(mail, contents_name[i], contents_flag[i], sabun_flag[i])
        if state is False:
            return {
                "statusCode": 200,
                "body": json.dumps(
                    "Process aborted becaouse an error occurred. " + contents_name
                ),
            }

    return {"statusCode": 200, "body": json.dumps("The Notify process is complete.")}


def main(mail, contents_name, contents_flag, sabun_flag):

    update_flag = 0
    contents = ""
    sabun = ""
    url = ""
    selecter = ""

    # Check it has been updated.
    try:
        # Get existing data
        exist_data = scraping_table.get_item(Key={"ContentsName": contents_name})
        update_flag = exist_data["Item"]["UpdateFlag"]
        contents = exist_data["Item"]["Contents"]
        sabun = exist_data["Item"]["Sabun"]
        url = exist_data["Item"]["URL"]
        selecter = exist_data["Item"]["Selecter"]

    except KeyError:
        print("Not found data. OK. Do nothing.")
    except Exception as e:
        print("Select Error!!!")
        print(e)
        return False

    if update_flag != 1:
        print("No change, so normal termination.")
        return True

    print("change!")

    body = contents_name + "\n\n" + url + "\n\n"
    if contents_flag is True:
        body = body + contents + "\n\n"
    if sabun_flag is True:
        body = body + sabun + "\n\n"

    # Email notification as it is updated.
    sns_client.publish(
        TopicArn=os.environ["SNS_TOPIC_ARN"],
        Message="The website has been updated as a result of scraping. "
        + "\n\n"
        + body,
    )

    # Reset the UpdateFlag.
    try:
        response = scraping_table.put_item(
            Item={
                "ContentsName": contents_name,
                "UpdateFlag": 0,
                "Contents": contents,
                "Sabun": sabun,
                "URL": url,
                "Selecter": selecter,
            }
        )

    except Exception as e:
        print("Insert(Update) Error!!!")
        print(e)
        raise False

    return True
