import Vue from 'vue'
// eslint-disable-next-line import/no-duplicates
import { Button, Form, FormItem, Input } from 'element-ui'

// 导入消息弹出框组件
// eslint-disable-next-line import/no-duplicates
import { Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
    // 挂载到全局Vue原型对象
Vue.prototype.$message = Message
