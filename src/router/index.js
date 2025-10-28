import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/add',
      name: 'addClient',
      component: () => import('../views/addClient.vue'),
    },
    {
      path: '/detail',
      name: 'clientDetail',
      component: () => import('../views/clientDetail.vue'),
    },
  ],
})

export default router
