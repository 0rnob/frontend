import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ListingView from '../views/ListingView.vue'
import ItemDetailView from '../views/ItemDetailView.vue'
import ReportView from '../views/ReportView.vue'
import TrackClaimView from '../views/TrackView.vue'
import ReviewView from '../views/ReviewView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/listing', component: ListingView },
  { path: '/item/:id', component: ItemDetailView },
  { path: '/report', component: ReportView },
  { path: '/track-claim', component: TrackClaimView },
  { path: '/review', component: ReviewView },
  { path: '/login', component: LoginView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
