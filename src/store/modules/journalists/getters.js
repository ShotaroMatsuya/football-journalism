export default {
  journalists(state) {
    return state.journalists;
  },
  hasJournalists(state) {
    return state.journalists && state.journalists.length > 0;
  },
  isJournalist(_, getters, _2, rootGetters) {
    const journalists = getters.journalists;
    const userId = rootGetters.userId;
    // テストとしてc3だったら自分ということにしている
    return journalists.some((journalist) => journalist.id === userId);
  },
  shouldUpdate(state) {
    const lastFetch = state.lastFetch;
    if (!lastFetch) {
      return true;
    } else {
      const currentTimeStamp = new Date().getTime();
      return (currentTimeStamp - lastFetch) / 1000 > 1; // more then 1 minutes ago
    }
  },
};
