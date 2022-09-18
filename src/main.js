// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/rest.css'
import './assets/global.css'
import axios from 'axios'
import ElementUI, {Message, MessageBox} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(ElementUI)
Vue.prototype.$http = axios
Vue.prototype.$message = Message
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* eslint-disable no-new */
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
