import Vue from "vue";
import VueRouter from "vue-router";
import login from "../components/Login.vue";
import home from "../components/Home.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: login },
    { path: "/home", component: home }
  ]
});
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径  from 从哪个路径跳转过来 next是个函数  表示放行
  // next()  放行   next('/login') 强制跳转
  if (to.path === "/login") return next();
  //如果没有return 那么就是访问有权限的页面
  //先获取token
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
});

export default router;
