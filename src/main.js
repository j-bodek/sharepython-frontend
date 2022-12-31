import { createApp } from 'vue'
import 'mdb-vue-ui-kit/css/mdb.min.css';
import VueCodemirror from 'vue-codemirror';
import PortalVue from 'portal-vue'


import router from './router.js';
import store from './store/index.js';
import "./interceptors/axios.js";

import App from './App.vue'

const app = createApp(App);

app.use(router);
app.use(store);

app.use(VueCodemirror, {
    autofocus: true,
    disabled: false,
    indentWithTab: true,
    tabSize: 2,
    placeholder: 'Code goes here...',
});

app.use(PortalVue);

app.mount('#app');
