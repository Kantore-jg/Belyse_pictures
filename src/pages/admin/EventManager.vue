<script setup>
import { ref, reactive, onMounted } from 'vue'
import { eventService } from '../../services/api'
import { Plus, Trash2, X, Calendar, MapPin, Link as LinkIcon } from 'lucide-vue-next'

const events = ref([])
const showAdd = ref(false)
const newEvent = reactive({
  title: '',
  description: '',
  date: '',
  location: '',
  driveLink: '',
  photos: [],
})

const loadEvents = async () => {
  events.value = await eventService.getEvents()
}

onMounted(loadEvents)

const handleSubmit = async () => {
  try {
    await eventService.createEvent({ ...newEvent })
    Object.assign(newEvent, { title: '', description: '', date: '', location: '', driveLink: '', photos: [] })
    showAdd.value = false
    await loadEvents()
  } catch (err) {
    alert('Event creation failed')
  }
}

const handleDelete = async (id) => {
  if (confirm('Delete this event experience?')) {
    await eventService.deleteEvent(id)
    await loadEvents()
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-serif">Manage Events</h2>
      <button
        @click="showAdd = !showAdd"
        class="bg-white text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
      >
        <X v-if="showAdd" class="w-5 h-5" />
        <Plus v-else class="w-5 h-5" />
        <span>{{ showAdd ? 'Cancel' : 'Add Experience' }}</span>
      </button>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 overflow-hidden"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[600px]"
      leave-active-class="transition-all duration-300 overflow-hidden"
      leave-from-class="opacity-100 max-h-[600px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showAdd">
        <form @submit.prevent="handleSubmit" class="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <input required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none" placeholder="Event Title" v-model="newEvent.title" />
            <input required type="date" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none" v-model="newEvent.date" />
            <input required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none" placeholder="Location" v-model="newEvent.location" />
            <input class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none" placeholder="Google Drive Album Link" v-model="newEvent.driveLink" />
          </div>
          <div class="space-y-4 flex flex-col">
            <textarea required rows="4" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none resize-none flex-grow" placeholder="Description" v-model="newEvent.description" />
            <p class="text-xs text-neutral-500 italic">Photo management for events is coming soon. Using drive links for now.</p>
            <button class="w-full bg-white text-black py-3 rounded-xl font-semibold">Save Event</button>
          </div>
        </form>
      </div>
    </Transition>

    <div class="space-y-4">
      <div v-for="event in events" :key="event.id" class="glass-card p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-white/[0.08] transition-all">
        <div class="space-y-2">
          <h3 class="text-xl font-serif">{{ event.title }}</h3>
          <div class="flex gap-4 text-xs small-caps opacity-60">
            <span class="flex items-center gap-1"><Calendar class="w-3 h-3" /> {{ new Date(event.date).toLocaleDateString() }}</span>
            <span class="flex items-center gap-1"><MapPin class="w-3 h-3" /> {{ event.location }}</span>
          </div>
          <p class="text-sm text-neutral-400 line-clamp-2 max-w-lg">{{ event.description }}</p>
        </div>
        <div class="flex items-center gap-3">
          <a v-if="event.driveLink" :href="event.driveLink" target="_blank" class="p-3 bg-white/10 rounded-full hover:bg-blue-500 transition-all">
            <LinkIcon class="w-5 h-5" />
          </a>
          <button
            @click="handleDelete(event.id)"
            class="p-3 bg-white/10 rounded-full hover:bg-red-500 transition-all text-red-500"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
