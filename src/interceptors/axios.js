import axios from 'axios';
import store from '../store/index.js';

axios.defaults.baseURL = "http://0.0.0.0:8000/api/";
if (localStorage.getItem("access")){
    axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("access")}`;
}

// this variable is used to prevent infinite loop if refresh request will
// return 401
let refresh = false;
// interceptors are used to handle responses or requests
// before they are handled by then or catch
axios.interceptors.response.use(resp => resp, async error =>{
    // after every request if error occurs check if status code is 401,
    // if so try to refresh access token
    if (error.response.status === 401 && !refresh){
        refresh = true;
        const {status, data}  = await axios.post('auth/token/refresh/', {
            refresh: localStorage.getItem('refresh') || 'invalid',
        }, {
            withCredentials: true
        });
        
        if (status === 200){
            localStorage.setItem('access', data.access);
            // set default authorization header for all requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
            error.config.headers["Authorization"] = `Bearer ${data.access}`;
            // do previous request
            return axios(error.config);
        }
    }else if(error.response.status === 401){
        // set user to null
        store.dispatch("resetUserData");
    };
    refresh = false;
    return Promise.reject(error);
})