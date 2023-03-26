const AWSXRay = require('aws-xray-sdk-core');
const aws = AWSXRay.captureAWS(require('aws-sdk'));
const dynamodb = new aws.DynamoDB({ region: 'ap-northeast-1' });

exports.getJournalists = async (event) => {
  return await main(event);
};

async function main(event) {
  const params = {
    ProjectionExpression: 'UserID, AccountName, Area, Description, UserName',
    TableName: 'Journalists',
  };

  return await dynamodb
    .scan(params)
    .promise()
    .then((datas) => {
      if (datas.Count > 0) {
        console.log(datas);
        let results = [];
        for (const data of datas.Items) {
          let res = {};
          res.id = data.UserID.S;
          res.accountName = data.AccountName.S;
          res.username = data.UserName.S;
          res.description = data.Description.S;
          res.areas = data.Area.SS;
          results.push(res);
        }
        console.log(results);
        return {
          statusCode: 200,
          ok: true,
          body: JSON.stringify(results),
        };
      } else {
        return {
          statusCode: 404,
          ok: false,
          body: JSON.stringify({
            message: 'Not Found Resource.',
          }),
        };
      }
    })
    .catch((err) => {
      console.log(err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Something went wrong',
        }),
        ok: false,
      };
    });
}
