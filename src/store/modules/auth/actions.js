import axios from 'axios';

export default {
    setUser(context, payload){
        context.commit("setUser", payload);
    }
}