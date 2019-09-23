import axios from 'axios';
import qs from 'qs'
import jwt from 'jsonwebtoken'

const api = axios.create({
    timeout: 10000,
    withCredentials:true    // axios 默认不发送cookie，需要全局设置true发送cookie
})
api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

api.interceptors.request.use(conf => {
        //请求带token
        conf.headers['Authorization'] = 'Bearer ' + localStorage.access_token;
        return conf
    },
    error => ({ status: 0, msg: error.message })
)
//请求返回拦截
api.interceptors.response.use(response => {
        return Promise.resolve(response).then(checkCode)
    },
    error => {
        checkStatus(error.response)
        return Promise.reject(error)
    }
)

// http状态码错误处理
const checkStatus = (res) => {
    switch (res.status)
    {
        case 401 :{        //登录过期
            console.log('登录过期')
            break;
        }
        default:
            console.error('服务器异常')
            break;
    }
}
// 后台自定义 code错误处理
const checkCode = (res) => {
    if(res){
        if(res.data.code === 200){       //code为0成功
            return res
        }else {
            console.log(res.data.message)  //统一处理错误
            return false
        }
    }else {
        return false
    }
}


const $axios = {
    host(url){
        const host = 'http://localhost:8088';
        if(!url.startsWith("/"))
            url = "/" + url;
        return host + url;
    },
    post(url, data, config){
        return api.post($axios.host(url), qs.stringify(data), config);
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
        return api.get($axios.host(url), config)
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
        return api.delete($axios.host(url), config)
    },
    put(url, data, config){
        return api.put($axios.host(url), qs.stringify(data), config);
    },
    refresh(){
        if(localStorage.refresh_token){
            let param = {
                refresh_token: localStorage.refresh_token,
                grant_type: 'refresh_token'
            }

            localStorage.access_token = 'Basic ZS1ib29rOjEyMzQ1Ng==';
            this.post("/oauth/token",param).then(res=>{
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
