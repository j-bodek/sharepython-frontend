import axios from 'axios';

export default {
    setUser(context, payload){
        localStorage.setItem("user", JSON.stringify(payload.user));
        context.commit("setUser", payload);
    }
}