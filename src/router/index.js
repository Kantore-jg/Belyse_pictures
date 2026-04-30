import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import AboutPage from '../pages/AboutPage.vue'
import PortfolioPage from '../pages/PortfolioPage.vue'
import ExperiencePage from '../pages/ExperiencePage.vue'
import BookingPage from '../pages/BookingPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import AdminLoginPage from '../pages/admin/AdminLoginPage.vue'
import AdminDashboard from '../pages/admin/AdminDashboard.vue'
import PhotoManager from '../pages/admin/PhotoManager.vue'
import EventManager from '../pages/admin/EventManager.vue'
import BookingManager from '../pages/admin/BookingManager.vue'
import MessageManager from '../pages/admin/MessageManager.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
    { path: '/portfolio', component: PortfolioPage },
    { path: '/experience', component: ExperiencePage },
    { path: '/booking', component: BookingPage },
    { path: '/contact', component: ContactPage },
    { path: '/admin', component: AdminLoginPage },
    {
      path: '/admin/dashboard',
      component: AdminDashboard,
      children: [
        { path: '', component: PhotoManager },
        { path: 'events', component: EventManager },
        { path: 'bookings', component: BookingManager },
        { path: 'messages', component: MessageManager },
      ],
    },
  ],
})

export default router
