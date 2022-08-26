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
      return context.commit('setFetchTimestamp');
    }

    const articles = [];

    for (const res of responseData) {
      const article = {
        accountName: res.accountName,
        username: res.username,
        articleBody: res.articleBody,
        articleId: res.articleId,
      };
      articles.push(article);
    }
    context.commit(`setJournalistId`, journalistId);
    context.commit('setArticles', { [journalistId]: articles });
    context.commit('setFetchTimestamp');
  },
  async postArticle(context, data) {
    const userId = context.rootGetters.userId;
    const oldArticles = context.getters.articles || [];
    const articleData = {
      username: data.username,
      accountName: data.accountName,
      articleBody: data.articleBody.val,
      articleId: new Date().toISOString(),
    };
    const newArticles = [...oldArticles, articleData];
    const token = context.rootGetters.token;
    // NOTE: token必要箇所（Authorization Headerに変える）
    const response = await fetch(
      `${process.env.VUE_APP_DB_HOST_URL}/articles/${userId}` + token,
      {
        method: 'PUT',
        body: JSON.stringify(newArticles),
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
};
