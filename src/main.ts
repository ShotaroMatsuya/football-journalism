import { createApp, defineAsyncComponent } from 'vue';

import router from './router.js';
import store from './store/index.js';
import App from './App.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseButton from './components/ui/BaseButton.vue';
import BaseBadge from './components/ui/BaseBadge.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';
import BaseSPinner2 from './components/ui/BaseSpinner2.vue';

const BaseDialog = defineAsyncComponent(
  () => import('./components/ui/BaseDialog.vue')
);

const app = createApp(App);

app.use(router);
app.use(store);

app.component('BaseCard', BaseCard);
app.component('BaseButton', BaseButton);
app.component('BaseBadge', BaseBadge);
app.component('BaseSpinner', BaseSpinner);
app.component('BaseDialog', BaseDialog);
app.component('BaseSpinner2', BaseSPinner2);

app.mount('#app');
