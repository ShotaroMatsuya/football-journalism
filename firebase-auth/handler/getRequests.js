const AWSXRay = require('aws-xray-sdk-core');
const aws = AWSXRay.captureAWS(require('aws-sdk'));
const dynamodb = new aws.DynamoDB({ region: 'ap-northeast-1' });

exports.getRequestByJournalistId = async (event) => {
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
  const userId = event.pathParameters.journalistId;
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
  const params = {
    ExpressionAttributeValues: {
      ':s': { S: sub },
    },
    FilterExpression: 'JournalistID = :s',
    TableName: 'Requests',
  };
  return await dynamodb
    .scan(params)
    .promise()
    .then((datas) => {
      console.log(datas);
      if (datas.Count > 0) {
        let results = [];
        for (const data of datas.Items) {
          let res = {};
          res.username = data.UserID.S;
          res.message = data.Message.S;
          res.id = data.CreateDate.S;
          results.push(res);
        }

        return {
          statusCode: 200,
          ok: true,
          body: JSON.stringify({ [sub]: results }),
        };
      } else {
        return {
          statusCode: 404,
          ok: false,
          body: JSON.stringify({
            message: 'No Resource Found',
          }),
        };
      }
    })
    .catch((err) => {
      return {
        statusCode: 500,
        message: err,
        ok: false,
      };
    });
}
