import { createRouter, createWebHistory } from 'vue-router';

// pages
import LandingPage from './pages/LandingPage.vue';
import LoginPage from './pages/LoginPage.vue';
import SignUpPage from './pages/SignUpPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path: '/', component: LandingPage},
        {path: '/login', component: LoginPage},
        {path: '/signup', component: SignUpPage},
    ]
});

export default router;