import axios from 'axios';

export default {
    async login(context, payload){
        const data = await axios.post('/api/token/verify/',payload.data,
        {
            // this will set refresh token in browser store automatically
            withCredentials: true
        })
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    }
}