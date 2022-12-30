import { createRouter, createWebHistory } from 'vue-router';
import store from './store/index.js';
import axios from 'axios';

// pages
import LandingPage from './pages/LandingPage.vue';
import LoginPage from './pages/LoginPage.vue';
import SignUpPage from './pages/SignUpPage.vue';
import SettingsPage from './pages/SettingsPage.vue';
import CodeSpacePage from './pages/CodeSpacePage.vue'

const router = createRouter({
    base: 'https://example.com/app',
    history: createWebHistory(),
    routes:[
        {path: '/', name:"home", component: LandingPage},
        {path: '/login', name:"login", "meta":{requiresGuest:true}, component: LoginPage},
        {path: '/signup', name:"signup", "meta":{requiresGuest:true}, component: SignUpPage},
        {path: '/settings', name:"settings", "meta":{requiresAuthentication:true}, component: SettingsPage},
        {path: '/codespace/:uuid(tmp-[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}|[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12})/', name:"codespace_with_uuid", component: CodeSpacePage},
        {path: '/codespace/:token([a-zA-Z0-9_-]*={0,3})/', name:"codespace_with_token", component: CodeSpacePage},
    ]
});

router.beforeEach((to, from, next) => {
    function checkPermissions(){
      const requiresGuest = to.matched.some((x) => x.meta.requiresGuest);
      const requiresAuthentication = to.matched.some((x) => x.meta.requiresAuthentication)
      const isLoggedin = store.getters["getUser"] !== null;
      if (requiresGuest && isLoggedin) {
        next("/");
      } else if(requiresAuthentication && !isLoggedin) {
        next("/login");
      } else {
        next();
      }
    };

    // if token is invalid and refresh token is expired, user
    // credentials will be set to null
    if (localStorage.getItem("access") || localStorage.getItem("refresh")){
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access")}`;
      axios.get("auth/token/verify/")
      .then(response => {
        checkPermissions();
      });
    }else{
      checkPermissions();
    }

});

export default router;