const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
exports.getArticleByArticleId = async (event) => {
  return await main(event);
};

async function main(event) {
  // query stringを取得
  const journalistId = event.pathParameters.journalistId;
  const articleId = event.pathParameters.articleId;
  console.log(articleId);
  if (journalistId !== '' && articleId !== '') {
    const params = {
      Key: {
        UserID: journalistId,
        ArticleID: articleId,
      },
      TableName: 'Articles',
    };
    console.log(journalistId);

    return await dynamoDb
      .get(params)
      .promise()
      .then((data) => {
        const result = data.Item;

        let res = {};
        res.accountName = result.AccountName;
        res.username = result.UserName;
        res.articleBody = result.Detail;
        res.articleId = result.ArticleID;
        res.createdAt = result.CreatedAt;
        res.imagePath = result.ImgPath ? result.ImgPath : [];
        res.pollyOutput = result.S3URL_ja ? result.S3URL_ja : null;
        res.japaneseVersion = result.JapaneseVersion
          ? result.JapaneseVersion
          : null;
        res.sentiment = result.Sentiment ? result.Sentiment : null;
        res.faces = result.Faces ? result.Faces : [];
        res.keyOrgs = result.KeyOrgs ? result.KeyOrgs : [];
        res.keyPersons = result.KeyPerson ? result.KeyPerson : [];

        return {
          statusCode: 200,
          ok: true,
          body: JSON.stringify(res),
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
