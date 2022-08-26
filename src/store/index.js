import { createStore } from 'vuex';

import journalistsModules from './modules/journalists/index.js';
import requestsModule from './modules/requests/index.js';
import authModule from './modules/auth/index.js';
import articlesModule from './modules/articles/index.js';

const store = createStore({
  modules: {
    journalists: journalistsModules,
    requests: requestsModule,
    auth: authModule,
    articles: articlesModule,
  },
});

export default store;
