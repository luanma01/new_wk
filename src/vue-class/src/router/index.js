import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import RoomPage from '@/components/RoomPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RoomPage',
      component: RoomPage
    }
  ]
})
