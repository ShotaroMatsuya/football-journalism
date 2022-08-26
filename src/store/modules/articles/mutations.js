export default {
  setArticles(state, payload) {
    state.articles = { ...state.articles, ...payload };
  },
  postArticle(state, payload) {
    state.articles = { ...state.articles, ...payload };
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime();
  },
  setJournalistId(state, payload) {
    state.journalistId = payload;
  },
};
