import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import myLogin from '@/components/myLogin'
import myHome from '@/components/myHome'
import Welcome from '@/components/Welcome'
import Users from '../components/user/Users'
Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: myLogin},
    {
      path: '/home',
      component: myHome,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        }
      ]},
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
