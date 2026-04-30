<script setup>
import { ref, onMounted } from 'vue'
import { eventService } from '../services/api'
import { MapPin, Calendar, ExternalLink } from 'lucide-vue-next'

const events = ref([])

onMounted(async () => {
  events.value = await eventService.getEvents()
})
</script>

<template>
  <div class="pt-32 px-6 pb-24 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-16">
      <header class="space-y-6">
        <p class="small-caps">Where I've Been</p>
        <h1 class="text-5xl md:text-8xl">Experiences</h1>
      </header>

      <div class="grid grid-cols-1 gap-24">
        <div v-if="events.length === 0" class="text-center py-20 border border-white/5 bg-white/5 rounded-3xl">
          <p class="text-neutral-500 italic">No public experiences listed yet. Check back soon for the latest coverage.</p>
        </div>

        <div
          v-for="(event, i) in events"
          :key="event.id"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { delay: i * 100 } }"
          class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div :class="['space-y-8', i % 2 === 1 ? 'lg:order-last' : '']">
            <div class="flex flex-wrap gap-4">
              <div class="flex items-center gap-2 small-caps bg-white/5 px-3 py-1 rounded-full">
                <Calendar class="w-3 h-3" />
                {{ new Date(event.date).toLocaleDateString() }}
              </div>
              <div class="flex items-center gap-2 small-caps bg-white/5 px-3 py-1 rounded-full">
                <MapPin class="w-3 h-3" />
                {{ event.location }}
              </div>
            </div>

            <h2 class="text-4xl md:text-6xl font-serif leading-tight">{{ event.title }}</h2>
            <p class="text-neutral-400 text-lg leading-relaxed font-light">{{ event.description }}</p>

            <a
              v-if="event.driveLink"
              :href="event.driveLink"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center gap-2 small-caps text-white hover:italic transition-all"
            >
              View Full Album <ExternalLink class="w-4 h-4" />
            </a>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="(url, idx) in event.photos.slice(0, 4)"
              :key="idx"
              :class="['relative overflow-hidden rounded-xl', idx === 0 || idx === 3 ? 'aspect-[4/5]' : 'aspect-square']"
            >
              <img
                :src="url"
                alt="Event Detail"
                class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                referrerpolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
