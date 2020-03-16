import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入全局样式表
import "./assets/css/global.css";
// 导入字体图标
import "./assets/fonts/iconfont.css";
// 引入axios
import axios from "axios";
//导入树型表格
import TreeTable from "vue-table-with-tree-grid";
//导入moment 插件
import moment from "moment";
//导入 富文本编辑器
import VueQuillEditor from "vue-quill-editor";
//引入 富文本编辑器样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 设置请求的默认根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
//设置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  //在最后必须return config
  return config;
});

// 把axios 挂载到Vue的原型对象上 每个Vue的组件通过this.$http 发起ajax请求
Vue.prototype.axios = axios;

Vue.config.productionTip = false;
// 挂载树型表格
Vue.component("tree-table", TreeTable);

//定义时间格式化过滤器
Vue.filter("dateFilter", function(input) {
  return moment(input).format("YYYY-MM-DD");
});

Vue.use(VueQuillEditor);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
