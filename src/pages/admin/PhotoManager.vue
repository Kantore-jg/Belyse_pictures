<script setup>
import { ref, onMounted } from 'vue'
import { photoService } from '../../services/api'
import { Plus, Trash2, Loader2 } from 'lucide-vue-next'

const photos = ref([])
const isUploading = ref(false)

const loadPhotos = async () => {
  photos.value = await photoService.getPhotos()
}

onMounted(loadPhotos)

const handleUpload = async (e) => {
  const target = e.target
  if (!target.files?.length) return
  isUploading.value = true
  const formData = new FormData()
  Array.from(target.files).forEach(file => formData.append('images', file))
  formData.append('category', 'general')
  try {
    await photoService.uploadPhotos(formData)
    await loadPhotos()
  } catch (err) {
    alert('Upload failed')
  } finally {
    isUploading.value = false
  }
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this photo?')) {
    await photoService.deletePhoto(id)
    await loadPhotos()
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-serif">Manage Photos</h2>
      <label class="bg-white text-black px-6 py-3 rounded-xl font-semibold cursor-pointer flex items-center gap-2 hover:bg-neutral-200 transition-all">
        <Loader2 v-if="isUploading" class="w-5 h-5 animate-spin" />
        <Plus v-else class="w-5 h-5" />
        <span>Upload New</span>
        <input type="file" multiple class="hidden" @change="handleUpload" accept="image/*" :disabled="isUploading" />
      </label>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="photo in photos" :key="photo.id" class="group relative aspect-square bg-white/5 rounded-xl overflow-hidden ring-1 ring-white/10">
        <img :src="photo.url" :alt="photo.title" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <button
            @click="handleDelete(photo.id)"
            class="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all"
          >
            <Trash2 class="w-5 h-5" />
          </button>
          <span class="text-[10px] uppercase tracking-widest">{{ photo.category }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
