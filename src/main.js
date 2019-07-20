import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'

Vue.config.productionTip = false

Vue.prototype.$host = function (uri) {
  let host = "http://www.graydove.cn/"
  return host + uri
}

Vue.prototype.$post = function (url, data, config) {
  return axios.post(this.$host(url),qs.stringify(data),config)
}

Vue.prototype.$get = function (url, config) {
  return axios.get(this.$host(url, config))
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
