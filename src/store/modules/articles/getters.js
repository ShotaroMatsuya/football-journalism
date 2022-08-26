export default {
  articles(state, getters) {
    const journalistId = getters.journalistId; // 表示している記事のuserId
    return state.articles[journalistId];
  },
  journalistId(state) {
    return state.journalistId; //login userのid
  },
  hasArticles(_, getters) {
    return getters.articles && getters.articles.length > 0;
  },
  shouldUpdate(state) {
    const lastFetch = state.lastFetch;
    if (!lastFetch) {
      return true;
    } else {
      // const currentTimeStamp = new Date().getTime();
      // return (currentTimeStamp - lastFetch) / 1000 > 10; // more then 10 sec ago
      return true;
    }
  },
};
