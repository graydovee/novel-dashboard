import axios from 'axios';
import qs from 'qs'
import jwt from 'jsonwebtoken'
import router from '../router/index'


const host = function(url){
    let host = '';
    if(process.env.NODE_ENV === 'development'){
        host = 'https://admin.ndovel.com';
    }

    if(!url.startsWith("/"))
        url = "/" + url;
    return host + url;
}

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.timeout = 15000;
// axios.defaults.withCredentials = true;   // axios 默认不发送cookie，需要全局设置true发送cookie

axios.interceptors.request.use(conf => {
        //请求带token
        if(!localStorage.access_token.startsWith('Basic'))
            conf.headers['Authorization'] = 'Bearer ' + localStorage.access_token;
        else
            conf.headers['Authorization'] = localStorage.access_token;
        return conf
    },
    error => ({ status: 0, msg: error.message })
)
//请求返回拦截
axios.interceptors.response.use(response => {
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
            $axios.refresh();
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
        if(res.data.code === 200 || moreCodeFn(res)){       //code为0成功
            return res
        }else {
            console.log(res.data.message)  //统一处理错误
            return res
        }
    }else {
        return false
    }
}

//过滤 接口函数（这些接口可以自定义 错误处理）
const moreCodeFn = (res) =>{
    let url = res.config.url;    //当前URL
    let urlArray = ['/oauth/token'];
    for(let i=0;i<urlArray.length;i++){
        if(url.indexOf(urlArray[i])>=0){
            return true
        }
    }
    return false
}

const $axios = {
    post(url, data, config){
        return axios.post(host(url), qs.stringify(data), config);
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
        return axios.get(host(url), config)
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
        return axios.delete(host(url), config)
    },
    put(url, data, config){
        return axios.put(host(url), qs.stringify(data), config);
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
            }).catch(err=>{
                router.push('/login')
                console.error(err)
            })
        }else{
            router.push('/login')
        }
    }
};


export default $axios;
