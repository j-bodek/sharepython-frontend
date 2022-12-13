import axios from 'axios';

export default {
    resetUserData(context, payload){
        context.commit("setUser", {"user": null});
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    },
    setUser(context, payload){
        localStorage.setItem("user", JSON.stringify(payload.user));
        context.commit("setUser", payload);
    },
    setAuthData(context, payload){
        // set user data, access and refresh tokens
        context.commit("setUser", {"user":payload.data.user});
        localStorage.setItem("user", JSON.stringify(payload.data.user));
        localStorage.setItem("access", payload.data.access);
        localStorage.setItem("refresh", payload.data.refresh);
    },
}