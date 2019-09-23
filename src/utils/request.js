import axios from 'axios';
import qs from 'qs'
import jwt from 'jsonwebtoken'
import Vue from 'vue'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 15000;
// axios.defaults.withCredentials = true;   // axios 默认不发送cookie，需要全局设置true发送cookie

axios.interceptors.response.use(response=>{
    if (response.status === 200) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(response);
    }
},error => {
    if(error.response.status === 401){
        Vue.prototype.$router.push("/login");
        console.log("login invalid");
    }
    return Promise.resolve(error);
})

const $axios = {
    get_axios(){
        return axios;
    },
    host(url){
        const host = 'http://localhost:8088';
        if(!url.startsWith("/"))
            url = "/" + url;
        return host + url;
    },
    post(url, data, config){
        return axios.post($axios.host(url), qs.stringify(data), config);
    },
    get(url, data, config){
        if(data){
            if(config)
                config.params = data;
            else
                config = {
                    params: data
                }
        }
        return axios.get($axios.host(url), config)
    },
    delete(url, data, config){
        if(data){
            if(config)
                config.params = data;
            else
                config = {
                    params: data
                }
        }
        return axios.delete($axios.host(url), config)
    },
    put(url, data, config){
        return axios.put($axios.host(url), qs.stringify(data), config);
    },
    basic(){
        axios.defaults.headers.common['Authorization'] = 'Basic ZS1ib29rOjEyMzQ1Ng==';
        return $axios;
    },
    token(token){
        if(!token)
            token = localStorage.access_token
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        return $axios;
    },
    refresh(){
        if(localStorage.refresh_token){
            let param = {
                refresh_token: localStorage.refresh_token,
                grant_type: 'refresh_token'
            }

            this.basic().post("/oauth/token",param).then(res=>{
                let data = res.data;
                localStorage.access_token = data.access_token;
                localStorage.refresh_token = data.refresh_token;

                localStorage.user_info = JSON.stringify(jwt.decode(data.access_token));
                console.log(data.access_token);
                this.token(data.access_token);
            }).catch(err=>{
                console.log(err)
            })
        }
    }
};


export default $axios;
