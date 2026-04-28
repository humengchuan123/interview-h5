import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/tasks' },
  { path: '/tasks', name: 'TaskList', component: () => import('../views/TaskList.vue') },
  { path: '/tasks/:id', name: 'TaskExecute', component: () => import('../views/TaskExecute.vue') },
  { path: '/history', name: 'History', component: () => import('../views/History.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
