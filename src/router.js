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
    history: createWebHistory(),
    routes:[
        {path: '/', name:"home", component: LandingPage},
        {path: '/login', name:"login", "meta":{requiresGuest:true}, component: LoginPage},
        {path: '/signup', name:"signup", "meta":{requiresGuest:true}, component: SignUpPage},
        {path: '/settings', name:"settings", "meta":{requiresAuthentication:true}, component: SettingsPage},
        {path: '/codespace/:uuid/', name:"codespace", component: CodeSpacePage},
    ]
});

router.beforeEach((to, from, next) => {
    // if token is invalid and refresh token is expired, user
    // credentials will be set to null
    if (localStorage.getItem("access") || localStorage.getItem("refresh")){
      axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access")}`;
      axios.get("auth/token/verify/");
    }
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
});

export default router;