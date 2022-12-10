import { createRouter, createWebHistory } from 'vue-router';

// pages
import LandingPage from './pages/LandingPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {path: '/', component: LandingPage}
    ]
});

export default router;