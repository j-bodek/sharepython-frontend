import { createApp } from 'vue'
import 'mdb-vue-ui-kit/css/mdb.min.css';

import router from './router.js';
import store from './store/index.js';
import "./interceptors/axios.js";

import App from './App.vue'

const app = createApp(App);

app.use(router);
app.use(store);

app.mount('#app');
