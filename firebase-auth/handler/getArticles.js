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
          res.imagePath = data.ImgPath ? data.ImgPath.SS : [];
          res.pollyOutput = data.S3URL_ja ? data.S3URL_ja.S : null;
          res.japaneseVersion = data.JapaneseVersion
            ? data.JapaneseVersion.S
            : null;
          res.sentiment = data.Sentiment ? data.Sentiment.S : null;
          res.faces = data.Faces ? data.Faces.SS : [];
          res.keyOrgs = data.KeyOrgs ? data.KeyOrgs.SS : [];
          res.keyPersons = data.KeyPersons ? data.keyPersons.SS : [];
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
