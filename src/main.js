import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import 'babel-polyfill';
import './components/common/bus'

import axios from './utils/request'

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | EBook-manage-system`;
    const user_info = localStorage.user_info;

    if (!user_info && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        const roles = JSON.parse(user_info).authorities;
        let role = {}
        let need = '';
        for (let authority of roles) {
            role[authority.name] = true;
        }
        if(to.path==='/userList'){
            need =  'ROLE_ROOT'
        }else{
            need = 'ROLE_USER'
        }
        role[need] ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

let vm = new Vue({
    router,
    render: h => h(App)
}).$mount('#app');


