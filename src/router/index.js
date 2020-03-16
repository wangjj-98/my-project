import Vue from "vue";
import VueRouter from "vue-router";
import login from "../components/Login.vue";
import home from "../components/Home.vue";
import welcome from "../components/Welcome.vue"; //为home 组件的子组件
import users from "../components/user/Users.vue"; //用户管理组件
import rights from "../components/power/Rights.vue"; //权限列表组件
import roles from "../components/power/Roles.vue"; //角色列表组件
import cate from "../components/goods/Cate.vue";
import params from "../components/goods/params.vue";
import goods from "../components/goods/goods.vue";
import add from "../components/goods/add.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: login },
    {
      path: "/home",
      component: home,
      redirect: "/welcome",
      children: [
        { path: "/welcome", component: welcome },
        { path: "/users", component: users },
        { path: "/rights", component: rights },
        { path: "/roles", component: roles },
        { path: "/categories", component: cate },
        { path: "/params", component: params },
        { path: "/goods", component: goods },
        { path: "/goods-add", component: add }
      ]
    }
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
