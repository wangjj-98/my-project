import Vue from 'vue'
// eslint-disable-next-line import/no-duplicates
import { Button, Form, FormItem, Input, Container, Header, Aside, Main, Menu,
Submenu, MenuItemGroup, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col,
Table, TableColumn, Switch, Pagination, Dialog} from 'element-ui'

// 导入消息弹出框组件
// eslint-disable-next-line import/no-duplicates
import { Message } from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)


    // 挂载到全局Vue原型对象
Vue.prototype.$message = Message
