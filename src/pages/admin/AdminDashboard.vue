<script setup>
import { onMounted } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { authService } from '../../services/api'
import { Camera, Calendar, ClipboardList, MessageSquare, LogOut } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  if (!authService.isAuthenticated()) {
    router.push('/admin')
  }
})

const handleLogout = () => {
  authService.logout()
  router.push('/admin')
}

const navItems = [
  { name: 'Photos', path: '/admin/dashboard', icon: Camera },
  { name: 'Events', path: '/admin/dashboard/events', icon: Calendar },
  { name: 'Bookings', path: '/admin/dashboard/bookings', icon: ClipboardList },
  { name: 'Messages', path: '/admin/dashboard/messages', icon: MessageSquare },
]
</script>

<template>
  <div class="pt-24 min-h-screen bg-neutral-950">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
      <aside class="lg:col-span-3 space-y-8">
        <div class="glass-card p-6 space-y-6">
          <h2 class="small-caps">Admin Panel</h2>
          <nav class="flex flex-col gap-2">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                route.path === item.path ? 'bg-white text-black' : 'hover:bg-white/5'
              ]"
            >
              <component :is="item.icon" class="w-5 h-5" />
              <span class="font-medium">{{ item.name }}</span>
            </RouterLink>
          </nav>
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-500 transition-all border border-red-500/20"
          >
            <LogOut class="w-5 h-5" /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main class="lg:col-span-9">
        <router-view />
      </main>
    </div>
  </div>
</template>
