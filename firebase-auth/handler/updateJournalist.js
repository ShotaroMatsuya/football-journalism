const AWSXRay = require('aws-xray-sdk-core');
const aws = AWSXRay.captureAWS(require('aws-sdk'));
const dynamodb = new aws.DynamoDB({ region: 'ap-northeast-1' });

exports.updateJournalistByUserId = async (event) => {
  let sub;
  try {
    // tokenを確認
    const { jwt } = event.requestContext.authorizer;
    sub = jwt.claims.sub;
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Something wrong.',
      }),
    };
  }
  // query stringを取得
  const userId = event.pathParameters.userId;
  if (userId != sub) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: 'Not Permitted.',
      }),
    };
  }
  return await main(event, sub);
};

async function main(event, sub) {
  // bodyを取得
  const body = JSON.parse(event.body);
  const params = {
    Item: {
      UserID: {
        S: sub,
      },
      UserName: {
        S: body.username,
      },
      AccountName: {
        S: body.accountName,
      },
      Description: {
        S: body.description,
      },
      Area: {
        SS: body.areas,
      },
    },
    TableName: 'Journalists',
  };

  return await dynamodb
    .putItem(params)
    .promise()
    .then((data) => {
      return {
        statusCode: 200,
        ok: true,
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
}
