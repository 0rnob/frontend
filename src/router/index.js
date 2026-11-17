
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ListingView from '../views/ListingView.vue'
import ReportView from '../views/ReportView.vue'
import TrackClaimView from '../views/TrackView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/listing',
    component: ListingView
  },
  {
    path: '/report',
    component: ReportView
  },
  {
    path: '/track-claim',
    component: TrackClaimView
  },
  {
    path: '/login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
