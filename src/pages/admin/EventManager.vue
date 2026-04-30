<script setup>
import { ref, reactive, onMounted } from 'vue'
import { eventService } from '../../services/api'
import { Plus, Trash2, X, Calendar, MapPin, Link as LinkIcon, Upload, Image, Pencil, Loader2 } from 'lucide-vue-next'

const events = ref([])
const showForm = ref(false)
const isSubmitting = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const coverFile = ref(null)
const coverPreview = ref(null)

const formData = reactive({
  title: '',
  description: '',
  date: '',
  location: '',
  driveLink: '',
})

const loadEvents = async () => {
  events.value = await eventService.getEvents()
}

onMounted(loadEvents)

const handleCoverSelect = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
}

const removeCover = () => {
  if (coverPreview.value && !coverPreview.value.startsWith('/storage')) {
    URL.revokeObjectURL(coverPreview.value)
  }
  coverFile.value = null
  coverPreview.value = null
}

const resetForm = () => {
  Object.assign(formData, { title: '', description: '', date: '', location: '', driveLink: '' })
  removeCover()
  showForm.value = false
  isEditing.value = false
  editingId.value = null
}

const openCreateForm = () => {
  resetForm()
  showForm.value = true
}

const openEditForm = (event) => {
  isEditing.value = true
  editingId.value = event.id
  Object.assign(formData, {
    title: event.title,
    description: event.description,
    date: event.date ? event.date.split('T')[0] : '',
    location: event.location,
    driveLink: event.driveLink || '',
  })
  coverFile.value = null
  coverPreview.value = event.coverImage || null
  showForm.value = true
}

const handleSubmit = async () => {
  if (!isEditing.value && !coverFile.value) {
    alert('Please select a cover image for the event')
    return
  }
  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('title', formData.title)
    fd.append('description', formData.description)
    fd.append('date', formData.date)
    fd.append('location', formData.location)
    if (formData.driveLink) fd.append('driveLink', formData.driveLink)
    if (coverFile.value) fd.append('coverImage', coverFile.value)

    if (isEditing.value) {
      await eventService.updateEvent(editingId.value, fd)
    } else {
      await eventService.createEvent(fd)
    }
    resetForm()
    await loadEvents()
  } catch (err) {
    alert('Operation failed')
  } finally {
    isSubmitting.value = false
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
        @click="showForm ? resetForm() : openCreateForm()"
        class="bg-white text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
      >
        <X v-if="showForm" class="w-5 h-5" />
        <Plus v-else class="w-5 h-5" />
        <span>{{ showForm ? 'Cancel' : 'Add Experience' }}</span>
      </button>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 overflow-hidden"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[900px]"
      leave-active-class="transition-all duration-300 overflow-hidden"
      leave-from-class="opacity-100 max-h-[900px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showForm">
        <form @submit.prevent="handleSubmit" class="glass-card p-6 space-y-6">
          <h3 class="text-lg font-serif opacity-60">{{ isEditing ? 'Edit Experience' : 'New Experience' }}</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <input required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" placeholder="Event Title" v-model="formData.title" />
              <input required type="date" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" v-model="formData.date" />
              <input required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" placeholder="Location" v-model="formData.location" />
              <input class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" placeholder="Google Drive Album Link (optional)" v-model="formData.driveLink" />
            </div>
            <div class="space-y-4 flex flex-col">
              <textarea required rows="4" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors resize-none flex-grow" placeholder="Description" v-model="formData.description" />
            </div>
          </div>

          <!-- Cover Image -->
          <div class="space-y-2">
            <label class="small-caps opacity-40 text-xs">Cover Image {{ isEditing ? '(change optional)' : '*' }}</label>
            <div v-if="!coverPreview" class="relative">
              <label class="flex items-center justify-center gap-3 border-2 border-dashed border-white/20 rounded-xl p-8 cursor-pointer hover:border-white/40 transition-all">
                <Upload class="w-6 h-6 opacity-40" />
                <span class="text-sm text-neutral-400">Click to select cover image</span>
                <input type="file" class="hidden" @change="handleCoverSelect" accept="image/*" />
              </label>
            </div>
            <div v-else class="relative group rounded-xl overflow-hidden aspect-video max-w-sm">
              <img :src="coverPreview" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <label class="p-3 bg-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all cursor-pointer">
                  <Pencil class="w-5 h-5" />
                  <input type="file" class="hidden" @change="handleCoverSelect" accept="image/*" />
                </label>
                <button type="button" @click="removeCover" class="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all">
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
              <div class="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] uppercase tracking-widest">Cover</div>
            </div>
          </div>

          <button
            :disabled="isSubmitting"
            class="w-full bg-white text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
            <span>{{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Event' : 'Save Event') }}</span>
          </button>
        </form>
      </div>
    </Transition>

    <div class="space-y-4">
      <p v-if="events.length === 0" class="text-center py-12 text-neutral-500 italic">No events yet.</p>
      <div v-for="event in events" :key="event.id" class="glass-card overflow-hidden flex flex-col md:flex-row gap-0 hover:bg-white/[0.08] transition-all">
        <div v-if="event.coverImage" class="md:w-48 h-32 md:h-auto shrink-0">
          <img :src="event.coverImage" :alt="event.title" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
        </div>
        <div v-else class="md:w-48 h-32 md:h-auto shrink-0 bg-white/5 flex items-center justify-center">
          <Image class="w-8 h-8 opacity-20" />
        </div>

        <div class="p-6 flex flex-col md:flex-row justify-between gap-6 flex-1">
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
              @click="openEditForm(event)"
              class="p-3 bg-white/10 rounded-full hover:bg-white hover:text-black transition-all"
            >
              <Pencil class="w-5 h-5" />
            </button>
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
  </div>
</template>
