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
        articleBody: unescapeHtml(
          removeBackSlash(
            removeDuplicateDoubleQuotes(removeSingleQuotes(res.articleBody))
          )
        ),
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
};

const unescapeHtml = (target) => {
  if (typeof target !== 'string') return target;

  const patterns = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`',
  };
  return target.replace(/&(lt|gt|amp|quot|#x27|#x60);/g, (match) => {
    return patterns[match];
  });
};

const removeSingleQuotes = (target) => {
  if (typeof target !== 'string') return target;
  return target.replace(/^'(.*)'$/, '$1');
};

const removeBackSlash = (target) => {
  const combined = target.split("\\'").join("'");
  return combined;
};

const removeDuplicateDoubleQuotes = (target) => {
  if (typeof target !== 'string') return target;
  return target.replace(/^"(.*)"$/, '$1');
};
