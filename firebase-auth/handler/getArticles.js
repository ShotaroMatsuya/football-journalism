const AWSXRay = require('aws-xray-sdk-core');
const aws = AWSXRay.captureAWS(require('aws-sdk'));
const dynamodb = new aws.DynamoDB({ region: 'ap-northeast-1' });

exports.getArticlesByJournalistId = async (event) => {
  return await main(event);
};

async function main(event) {
  // query stringを取得
  const journalistId = event.pathParameters.journalistId;
  if (journalistId !== '') {
    const params = {
      ExpressionAttributeValues: {
        ':s': { S: journalistId },
      },
      KeyConditionExpression: 'UserID = :s',
      TableName: 'Articles',
    };
    console.log(journalistId);

    return await dynamodb
      .query(params)
      .promise()
      .then((datas) => {
        console.log(datas);
        let results = [];
        for (const data of datas.Items) {
          let res = {};
          res.accountName = data.AccountName.S;
          res.username = data.UserName.S;
          res.articleBody = data.Detail.S;
          res.articleId = data.ArticleID.S;
          res.createdAt = data.CreatedAt.S;
          res.imagePath = data.ImgPath.S;
          results.push(res);
        }
        return {
          statusCode: 200,
          ok: true,
          body: JSON.stringify(results),
        };
      })
      .catch((err) => {
        return {
          statusCode: 500,
          message: err,
          ok: false,
        };
      });
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Not Found Resource.',
      }),
    };
  }
}
