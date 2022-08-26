exports.lambdaHandler = async (event, context) => {
  try {
    const { jwt } = event.requestContext.authorizer;
    const { email } = jwt.claims;
    return {
      statusCode: 200,
      body: JSON.stringify({
        jwt: jwt,
        email: email,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Something wrong.',
      }),
    };
  }
};
