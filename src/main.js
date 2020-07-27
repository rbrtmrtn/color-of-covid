import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronUp, faChevronDown, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'mapbox-gl/dist/mapbox-gl.css';
import VueAnalytics from 'vue-analytics';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// set up font awesome
library.add(faChevronUp, faChevronDown, faArrowDown);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// set up google analytics
Vue.use(VueAnalytics, {
  id: 'UA-77783625-3',
});

// set up sentry
Sentry.init({
  dsn: 'https://3179b3d05c92433580e7227b68a55fe5@o425159.ingest.sentry.io/5357929',
  integrations: [new VueIntegration({ Vue, attachProps: true })],
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
