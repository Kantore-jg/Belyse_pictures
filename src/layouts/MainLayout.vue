<script setup>
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Menu, X, Camera, Instagram, Twitter, Mail } from 'lucide-vue-next'
import WhatsAppIcon from '../components/WhatsAppIcon.vue'

const isMenuOpen = ref(false)
const route = useRoute()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

watch(() => route.path, () => {
  isMenuOpen.value = false
})

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Experience', path: '/experience' },
  { name: 'Booking', path: '/booking' },
  { name: 'Contact', path: '/contact' },
]

const whatsappUrl = 'https://wa.me/72429849?text=Bonjour%2C%20je%20souhaite%20r%C3%A9server%20une%20s%C3%A9ance%20photo'
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans selection:bg-white selection:text-black">
    <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center mix-blend-difference pointer-events-none">
      <RouterLink to="/" class="pointer-events-auto">
        <div
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{ opacity: 1, x: 0 }"
          class="flex items-center gap-2"
        >
          <Camera class="w-6 h-6" />
          <span class="font-display font-semibold tracking-widest text-lg uppercase">Bely_Pictures</span>
        </div>
      </RouterLink>

      <!-- Desktop navbar -->
      <nav class="hidden lg:flex items-center gap-1 pointer-events-auto">
        <RouterLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          :class="[
            'nav-pill text-xs',
            route.path === link.path ? 'bg-white text-black' : ''
          ]"
        >
          {{ link.name }}
        </RouterLink>
      </nav>

      <!-- Mobile menu button -->
      <button
        @click="toggleMenu"
        class="pointer-events-auto p-2 focus:outline-none lg:hidden"
      >
        <X v-if="isMenuOpen" class="w-8 h-8" />
        <Menu v-else class="w-8 h-8" />
      </button>
    </header>

    <!-- Fullscreen mobile menu -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 -translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-500 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-full"
    >
      <div
        v-if="isMenuOpen"
        class="fixed inset-0 z-40 bg-neutral-950 flex flex-col items-center justify-center pt-20 lg:hidden"
      >
        <nav class="flex flex-col items-center gap-8 px-6">
          <div
            v-for="(link, i) in navLinks"
            :key="link.path"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: i * 100 } }"
          >
            <RouterLink
              :to="link.path"
              class="text-4xl md:text-7xl font-serif hover:italic hover:pl-4 transition-all duration-300"
            >
              {{ link.name }}
            </RouterLink>
          </div>
        </nav>

        <div class="absolute bottom-12 flex gap-8">
          <RouterLink to="/admin" class="small-caps hover:opacity-100 transition-opacity">Admin</RouterLink>
          <div class="flex gap-4 items-center">
            <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" title="WhatsApp">
              <WhatsAppIcon :size="20" class="text-green-500 opacity-80 hover:opacity-100 cursor-pointer" />
            </a>
            <Mail class="w-5 h-5 opacity-60 hover:opacity-100 cursor-pointer" />
          </div>
        </div>
      </div>
    </Transition>

    <main class="flex-grow">
      <slot />
    </main>

    <!-- Floating WhatsApp Button -->
    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      title="Contactez-nous sur WhatsApp"
    >
      <WhatsAppIcon :size="28" />
    </a>

    <footer class="px-6 py-12 border-t border-white/5 space-y-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div class="space-y-4">
          <h2 class="text-3xl font-serif">Let's capture beauty</h2>
          <RouterLink to="/booking" class="nav-pill inline-block">Book a Session</RouterLink>
        </div>
        <div class="grid grid-cols-2 gap-x-12 gap-y-4">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="small-caps hover:opacity-100"
          >
            {{ link.name }}
          </RouterLink>
        </div>
      </div>
      <div class="flex justify-between items-center pt-8 border-t border-white/5">
        <span class="small-caps">&copy; 2026 Bely_Pictures</span>
        <span class="small-caps">Handcrafted by Bely_Pictures</span>
      </div>
    </footer>
  </div>
</template>
