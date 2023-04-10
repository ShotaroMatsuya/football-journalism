export default {
  setArticles(state, payload) {
    state.articles = { ...state.articles, ...payload };
  },
  postArticle(state, payload) {
    state.articles = { ...state.articles, ...payload };
  },
  setFetchTimestampInJournalist(state) {
    state.lastFetch = new Date().getTime();
  },
  setFetchTimestampInArticle(state, payload) {
    console.log('setFetchTimestampInArticle', payload);
    // payloadにarticleID {articleId: xxxx}
    const { articleId, journalistId } = payload;
    const idx = state.articles[journalistId].findIndex((art) => {
      return art.articleId === articleId;
    });
    state.articles[journalistId][idx].lastFetch = new Date().getTime();
  },
  setJobStatus(state, payload) {
    console.log('setJobStatus', payload);
    // {status: xxxx, articleId: xxxx}
    const { isDone, articleId, journalistId } = payload;
    const idx = state.articles[journalistId].findIndex((art) => {
      return art.articleId === articleId;
    });
    state.articles[journalistId][idx].isDone = isDone;
  },
  updateArticle(state, payload) {
    // {articleId: xxx, isDone: xxx, articleData: xxx}
    const { articleId, isDone, articleData, journalistId } = payload;
    const newArticle = { ...articleData, isDone };
    const idx = state.articles[journalistId].findIndex((art) => {
      return art.articleId === articleId;
    });
    state.articles[journalistId][idx] = newArticle;
  },
  setJournalistId(state, payload) {
    state.journalistId = payload;
  },
  registerJobId(state, payload) {
    const { articleId, jobId, journalistId } = payload;
    const idx = state.articles[journalistId].findIndex((art) => {
      return art.articleId === articleId;
    });
    state.articles[journalistId][idx].jobId = jobId;
  },
};
