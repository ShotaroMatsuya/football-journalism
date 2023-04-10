import json

import boto3

sf_client = boto3.client("stepfunctions")


def lambda_handler(event, context):
    request_body = json.loads(event["body"])
    # State Machine ARNの指定
    state_machine_arn = request_body["jobId"]

    # State Machineのステータスを取得
    response = sf_client.describe_execution(executionArn=state_machine_arn)

    # ステータスを表示
    status = response["status"]
    print(f"The status of the State Machine is {status}")

    # 必要に応じてステータスを返す
    return {
        "statusCode": 200,
        "body": json.dumps({"status": status}),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": False,
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "*",
        },
    }
