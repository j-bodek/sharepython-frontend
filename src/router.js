import { createRouter, createWebHistory } from 'vue-router';
import store from './store/index.js';

// pages
import LandingPage from './pages/LandingPage.vue';
import LoginPage from './pages/LoginPage.vue';
import SignUpPage from './pages/SignUpPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path: '/', name:"home", component: LandingPage},
        {path: '/login', name:"login", "meta":{requiresGuest:true}, component: LoginPage},
        {path: '/signup', name:"signup", "meta":{requiresGuest:true}, component: SignUpPage},
    ]
});

router.beforeEach((to, from, next) => {
    const requiresGuest = to.matched.some((x) => x.meta.requiresGuest);
    const isLoggedin = store.getters["getUser"] !== null;
    if (requiresGuest && isLoggedin) {
      next("/");
    }  else {
      next();
    }
});

export default router;