import axios from 'axios'
import $qs from 'qs'
import router from '../router'
import bus from '../components/common/bus'

let baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:8090' : 'https://admin.ndovel.com'

let service = axios.create({
    baseURL: baseURL,
    timeout: 15000
})

// 是否允许携带cookie
service.defaults.withCredentials = false

service.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        if (localStorage.getItem('token')) {
            let token = JSON.parse(localStorage.getItem('token'))
            config.headers['Authorization'] = token.prefix + " " + token.token;
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)


service.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            console.log(error.response)
            if (error.response.status === 401) {
                bus.$message.error("登录失效")
                router.push('/login')
            }
        }
        return Promise.reject(error)
    }
)

export default {
    post (url, data = {}) {
        return new Promise((resolve, reject) => {
            service.post(url, $qs.stringify(data))
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
        })
    },
    get (url, params = {}) {
        return new Promise((resolve, reject) => {
            service.get(url, {
                params: params
            })
            .then(response => {
                resolve(response.data)
            })
            .catch(err => {
                reject(err)
            })
        })
    },
    put (url, data = {}) {
        return new Promise((resolve, reject) => {
            service.put(url, $qs.stringify(data))
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
        })
    },
    delete (url, params = {}) {
        return new Promise((resolve, reject) => {
            service.delete(url, {
                params: params
            })
            .then(response => {
                resolve(response.data)
            })
            .catch(err => {
                reject(err)
            })
        })
    }
}
