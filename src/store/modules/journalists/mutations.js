export default {
  registerJournalist(state, payload) {
    state.journalists.push(payload);
  },
  setJournalists(state, payload) {
    state.journalists = payload;
  },
  setFetchTimestamp(state) {
    state.lastFetch = new Date().getTime();
  },
};
