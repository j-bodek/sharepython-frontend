import { createApp } from 'vue'
import 'mdb-vue-ui-kit/css/mdb.min.css';

import router from './router.js';

import App from './App.vue'

const app = createApp(App);
app.use(router);

app.mount('#app');
