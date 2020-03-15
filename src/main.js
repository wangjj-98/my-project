import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 设置请求的默认根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//设置请求拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //在最后必须return config
  return config
})

// 把axios 挂载到Vue的原型对象上 每个Vue的组件通过this.$http 发起ajax请求
Vue.prototype.axios = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

new Vue({
  router,  
  render: h => h(App)
}).$mount('#app')
