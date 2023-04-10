export default {
  async loadArticles(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }
    const journalistId = payload.journalistId;

    const response = await fetch(
      `${process.env.VUE_APP_DB_HOST_URL}/articles/${journalistId}`
    );
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error('記事取得に失敗しました');
      throw error;
    }

    if (!responseData) {
      context.commit(`setJournalistId`, journalistId);
      context.commit('setArticles', { [journalistId]: [] });
      return context.commit('setFetchTimestampInJournalist');
    }

    const articles = [];

    for (const res of responseData) {
      const article = {
        accountName: res.accountName,
        username: res.username,
        articleBody: res.articleBody,
        articleId: res.articleId,
        createdAt: res.createdAt,
        imagePath: res.imagePath ? res.imagePath : [],
        pollyOutput: res.pollyOutput ? res.pollyOutput : null,
        japaneseVersion: res.japaneseVersion ? res.japaneseVersion : null,
        sentiment: res.sentiment ? res.sentiment : null,
        faces: res.faces ? res.faces : [],
        keyOrgs: res.keyOrgs ? res.keyOrgs : [],
        keyPersons: res.keyPersons ? res.keyPersons : [],
      };
      article.isDone =
        article.faces.length > 0 ||
        article.keyOrgs > 0 ||
        article.keyPersons > 0 ||
        article.pollyOutput !== null ||
        article.japaneseVersion !== null ||
        article.sentiment !== null;
      articles.push(article);
    }
    context.commit(`setJournalistId`, journalistId);
    context.commit('setArticles', { [journalistId]: articles });
    context.commit('setFetchTimestampInJournalist');
  },
  async postArticle(context, data) {
    const userId = context.rootGetters.userId;
    const oldArticles = context.getters.articles || [];
    const articleData = {
      username: data.username,
      accountName: data.accountName,
      articleBody: data.articleBody.val,
      articleId: new Date().getUTCMilliseconds(),
      createdAt: new Date().toLocaleString(),
    };
    const newArticles = [...oldArticles, articleData];
    const token = context.rootGetters.token;
    const response = await fetch(
      `${process.env.VUE_APP_DB_HOST_URL}/articles/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(articleData),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      console.log(response);
    }
    context.commit('postArticle', { [userId]: newArticles });
  },
  async triggerAI(context, payload) {
    // payload = {articleId: xxx, journalistId: xxx, forceRefresh: bool, isDone, lastFetch}
    // TODO:isDoneがtrueかつlastFetchがセットされていたら、ハッカしないようにする
    if (
      !payload.forceRefresh ||
      payload.isDone ||
      payload.lastFetch > new Date().getTime() - 30 * 60 * 1000
    ) {
      return Promise.resolve();
    }
    const { articleId, journalistId } = payload;
    const response = await fetch(`${process.env.VUE_APP_AI_ENDPOINT_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        ArticleID: String(articleId),
        UserID: String(journalistId),
      }),
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
    });
    context.commit('setFetchTimestampInArticle', { articleId, journalistId });
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error('JOBのリクエストに失敗しました');

      return Promise.reject(error);
    }
    // jobIdを登録
    context.commit('registerJobId', {
      articleId,
      jobId: responseData.executionArn,
      journalistId,
    });
    return Promise.resolve(responseData.executionArn);
  },

  async getStatus(context, payload) {
    // {jobId: xxxx, articleId: xxxxx}
    // isDoneがtrueだったら発火しないようにする
    // TODO: jobIDを使ってstatusを取得(5秒おき)
    let timeout = (ms) => new Promise((done) => setTimeout(done, ms));
    const { jobId, articleId, journalistId } = payload;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log('looping ...');
      await timeout(5000);
      const response = await fetch(
        `${process.env.VUE_APP_AI_ENDPOINT_URL}/status`,
        {
          method: 'POST',
          body: JSON.stringify({
            jobId,
          }),
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
        }
      );
      const responseData = await response.json();
      if (responseData.status === 'SUCCEEDED') {
        context.commit('setJobStatus', {
          isDone: true,
          articleId,
          journalistId,
        });
        context.commit('setFetchTimestampInArticle', {
          articleId,
          journalistId,
        });
        return Promise.resolve(responseData.status);
      } else if (
        responseData.status === 'FAILED' ||
        responseData.status === 'TIMED_OUT' ||
        responseData.status === 'ABORTED'
      ) {
        context.commit('setJobStatus', {
          isDone: false,
          articleId,
          journalistId,
        });
        context.commit('setFetchTimestampInArticle', {
          articleId,
          journalistId,
        });
        return Promise.reject(responseData.status);
      }
    }
  },
  async updateArticle(context, payload) {
    const { articleId, isDone, journalistId } = payload;
    const response = await fetch(
      `${process.env.VUE_APP_DB_HOST_URL}/article/${journalistId}/${articleId}`
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error('記事の取得に失敗しました');
      return Promise.reject(error);
    }
    if (!responseData) {
      context.commit('setFetchTimestampInArticle', {
        articleId,
        journalistId,
      });
      const error = new Error('記事の取得に失敗しました');
      return Promise.reject(error);
    }
    context.commit(`updateArticle`, {
      articleId,
      isDone,
      articleData: responseData,
      journalistId,
    });
    return Promise.resolve(responseData);
  },
};
