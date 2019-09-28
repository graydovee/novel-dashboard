import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/userList',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/UserList.vue'),
                    meta: { title: '用户列表', permission: true }
                },
                {
                    path: '/novelList',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/NovelList.vue'),
                    meta: { title: '小说列表', permission: true }
                },
                {
                    path: '/rexList',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/RexList.vue'),
                    meta: { title: '爬虫规则列表', permission: true }
                },
                {
                    path: '/spiderForm',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/SpiderForm.vue'),
                    meta: { title: '爬取小说', permission: true }
                },
                {
                    path: '/RexForm',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/RexForm.vue'),
                    meta: { title: '新增规则', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403'}
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue')
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
