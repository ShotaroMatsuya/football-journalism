export default {
  requests(state, _, _2, rootGetters) {
    const journalistId = rootGetters.userId;
    return state.requests.filter((req) => req.journalistId === journalistId);
  },
  hasRequests(_, getters) {
    return getters.requests && getters.requests.length > 0;
  },
};
