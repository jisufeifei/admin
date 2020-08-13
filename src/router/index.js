import Vue from "vue";
import VueRouter from "vue-router";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    meta: "首页",
    component: ()=> import("../views/Home.vue")
  },
  {
    path: "/about",
    name: "About",
    meta: "关于",
    component: ()=> import("../views/About.vue")
  },
  {
    path: "/login",
    name: "Login",
    meta: "登录",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/signup",
    name: "SignUp",
    meta: "注册",
    component: ()=>  import("../views/Signup.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});



export default router;
