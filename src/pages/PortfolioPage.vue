<script setup>
import { ref, computed, onMounted } from 'vue'
import { photoService } from '../services/api'
import { X, Maximize2 } from 'lucide-vue-next'

const photos = ref([])
const filter = ref('all')
const selectedPhoto = ref(null)

onMounted(async () => {
  photos.value = await photoService.getPhotos()
})

const categories = computed(() => {
  return ['all', ...new Set(photos.value.map(p => p.category))]
})

const filteredPhotos = computed(() => {
  return filter.value === 'all'
    ? photos.value
    : photos.value.filter(p => p.category === filter.value)
})
</script>

<template>
  <div class="pt-32 px-6 pb-24 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-16">
      <header class="space-y-6">
        <p class="small-caps">What I Make</p>
        <h1 class="text-5xl md:text-8xl">Portfolio</h1>
        <div class="flex flex-wrap gap-4 pt-6">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="filter = cat"
            :class="['nav-pill', filter === cat ? 'bg-white text-black' : '']"
          >
            {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}
          </button>
        </div>
      </header>

      <TransitionGroup
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        enter-active-class="transition-all duration-400"
        enter-from-class="opacity-0 scale-90"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-400"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-90"
      >
        <div
          v-for="photo in filteredPhotos"
          :key="photo.id"
          class="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-neutral-900 rounded-lg"
          @click="selectedPhoto = photo"
        >
          <img
            :src="photo.url"
            :alt="photo.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerpolicy="no-referrer"
          />
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 class="text-white w-8 h-8" />
          </div>
          <div class="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 class="text-xl font-serif">{{ photo.title }}</h3>
            <p class="small-caps text-white/60">{{ photo.category }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="selectedPhoto"
        class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
        @click="selectedPhoto = null"
      >
        <button class="absolute top-8 right-8 text-white p-2">
          <X class="w-10 h-10" />
        </button>
        <img
          :src="selectedPhoto.url"
          :alt="selectedPhoto.title"
          class="max-w-full max-h-full object-contain shadow-2xl"
          referrerpolicy="no-referrer"
          @click.stop
        />
        <div class="absolute bottom-12 left-12 text-white">
          <h2 class="text-3xl font-serif">{{ selectedPhoto.title }}</h2>
          <p class="small-caps opacity-60">{{ selectedPhoto.category }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
