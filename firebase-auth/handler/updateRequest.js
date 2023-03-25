const AWSXRay = require('aws-xray-sdk-core');
const aws = AWSXRay.captureAWS(require('aws-sdk'));
const dynamodb = new aws.DynamoDB({ region: 'ap-northeast-1' });

exports.updateRequestByJournalistId = async (event) => {
  return await main(event);
};

async function main(event) {
  // query parameter
  const journalistId = event.pathParameters.journalistId;
  if (journalistId != '') {
    // bodyを取得
    const body = JSON.parse(event.body);
    const params = {
      Item: {
        JournalistID: {
          S: journalistId,
        },
        UserID: {
          S: body.username,
        },
        Message: {
          S: body.message,
        },
        CreateDate: {
          S: body.created_at,
        },
      },
      TableName: 'Requests',
    };
    return await dynamodb
      .putItem(params)
      .promise()
      .then((data) => {
        console.log(data);
        return {
          statusCode: 200,
          ok: true,
          body: JSON.stringify(data),
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          statusCode: 500,
          message: 'Something went wrong',
          ok: false,
        };
      });
  } else {
    return {
      statusCode: 404,
      message: 'not specified resources',
      ok: false,
    };
  }
}
