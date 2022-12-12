export default {
    getUser(state){
        if (state.user !== null && localStorage.getItem("user") === null){
            state.user = null;
        }
        return state.user;
    }
}