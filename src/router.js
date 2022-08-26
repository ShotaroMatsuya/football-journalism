// import {defineAsyncComponent} from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import JournalistsList from './pages/journalists/JournalistsList.vue';
import NotFound from './pages/NotFound.vue';
import store from './store/index.js';

// It turns out, that it's NOT recommended to use async components
// for routing (you may use them to conditionally load and fetch
// component code when working with v-if etc. though).
const journalistDetail = () =>
  import('./pages/journalists/JournalistDetail.vue');
const journalistRegistration = () =>
  import('./pages/journalists/JournalistRegistration.vue');
const ContactJournalist = () =>
  import('./pages/requests/ContactJournalist.vue');
const RequestsReceived = () => import('./pages/requests/RequestsReceived.vue');
const UserAuth = () => import('./pages/auth/UserAuth.vue');
const ArticleRegister = () => import('./pages/articles/ArticleRegister.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/journalists' },
    { path: '/journalists', component: JournalistsList },
    {
      path: '/journalists/:id',
      component: journalistDetail,
      props: true,
      children: [{ path: 'contact', component: ContactJournalist }],
    },
    {
      path: '/register',
      component: journalistRegistration,
      meta: { requiresAuth: true },
    },
    {
      path: '/requests',
      component: RequestsReceived,
      meta: { requiresAuth: true },
    },
    {
      path: '/articles/:id',
      props: true,
      component: ArticleRegister,
      meth: { requiresAuth: true },
    },
    { path: '/auth', component: UserAuth },
    { path: '/:notFound(.*)', component: NotFound },
  ],
});

router.beforeEach(function (to, _, next) {
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    // 認証が必要なrouteに未認証でアクセスしたとき
    next('/auth');
  } else if (to.meta.requiresUnauth && store.getters.isAuthenticated) {
    //認証が不要なrouteに認証状態でアクセスしたら
    next('/journalists');
  } else {
    next();
  }
});

export default router;
