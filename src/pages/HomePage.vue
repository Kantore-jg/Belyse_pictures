<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { photoService } from '../services/api'

const featuredPhotos = ref([])

onMounted(async () => {
  const photos = await photoService.getPhotos()
  featuredPhotos.value = photos.filter(p => p.featured).slice(0, 3)
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <section class="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        v-motion
        :initial="{ scale: 1.1, opacity: 0 }"
        :enter="{ scale: 1, opacity: 1, transition: { duration: 1500 } }"
        class="absolute inset-0 z-0"
      >
        <img
          :src="'/uploads/kantore.png'"
          alt="Kantore"
          class="w-full h-full object-cover filter brightness-50"
          referrerpolicy="no-referrer"
        />
      </div>
      
      <div class="relative z-10 text-center space-y-6 max-w-4xl px-6">
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 500 } }"
          class="small-caps"
        >
          Belyse Akimana
        </p>
        <h1
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 700 } }"
          class="text-6xl md:text-9xl tracking-tight leading-[0.9]"
        >
          Get In Touch <br />
          <span class="italic font-light">With Me</span>
        </h1>
        <div
          v-motion
          :initial="{ opacity: 0, y: 40 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 900 } }"
          class="flex flex-wrap justify-center gap-6 pt-8"
        >
          <RouterLink to="/portfolio" class="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors">
            View Portfolio
          </RouterLink>
          <RouterLink to="/booking" class="nav-pill">
            Book a Session
          </RouterLink>
        </div>
      </div>

      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-40 animate-bounce">
        <div class="w-px h-12 bg-white"></div>
      </div>
    </section>

    <section class="px-6 py-24 space-y-16">
      <div class="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
        <div class="max-w-2xl space-y-4">
          <p class="small-caps">Check Out Most Relevant</p>
          <h2 class="text-4xl md:text-6xl">Featured <span class="italic">Works</span></h2>
        </div>
        <RouterLink to="/portfolio" class="group flex items-center gap-2 small-caps hover:opacity-100">
          Explore All <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(photo, i) in featuredPhotos"
          :key="photo.id"
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :visible-once="{ opacity: 1, scale: 1, transition: { delay: i * 200 } }"
          class="group cursor-pointer relative aspect-[3/4] overflow-hidden"
        >
          <img
            :src="photo.url"
            :alt="photo.title"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerpolicy="no-referrer"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
            <span class="small-caps mb-2">{{ photo.category }}</span>
            <h3 class="text-2xl font-serif">{{ photo.title }}</h3>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-neutral-900 px-6 py-32 flex flex-col items-center text-center space-y-12">
      <p class="small-caps">what motivates me</p>
      <h2 class="text-4xl md:text-7xl max-w-5xl md:leading-tight">
        &ldquo;Photography is the story I fail to put into words.&rdquo;
      </h2>
      <div class="horizontal-line max-w-xs"></div>
      <p class="text-neutral-400 max-w-2xl text-lg font-light leading-relaxed">
        I believe every shadow, every highlight, and every expression tells a unique narrative. My mission is to translate your most precious moments into timeless visual poetry.
      </p>
    </section>
  </div>
</template>
