import { createStore } from 'vuex';

// import modules
import AuthModule from './modules/auth/index.js';
import CodeSpaceModule from './modules/codespace/index.js';

const store = createStore({
    modules:{
        auth: AuthModule,
        codespace: CodeSpaceModule,
    }
})

export default store;