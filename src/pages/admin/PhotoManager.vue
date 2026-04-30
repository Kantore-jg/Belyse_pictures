<script setup>
import { ref, onMounted } from 'vue'
import { photoService } from '../../services/api'
import { Plus, Trash2, Loader2, X, Star, Upload, Image, Pencil } from 'lucide-vue-next'

const photos = ref([])
const isUploading = ref(false)
const showUploadModal = ref(false)
const showEditModal = ref(false)
const isSaving = ref(false)

const uploadForm = ref({
  files: null,
  title: '',
  category: 'general',
  featured: false,
})
const previewUrls = ref([])

const editForm = ref({
  id: null,
  title: '',
  category: 'general',
  featured: false,
})

const categories = [
  { value: 'general', label: 'General' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'event', label: 'Event' },
  { value: 'commercial', label: 'Commercial' },
]

const loadPhotos = async () => {
  photos.value = await photoService.getPhotos()
}

onMounted(loadPhotos)

const handleFileSelect = (e) => {
  const files = e.target.files
  if (!files?.length) return
  uploadForm.value.files = files
  previewUrls.value = Array.from(files).map(f => URL.createObjectURL(f))
}

const resetUploadForm = () => {
  previewUrls.value.forEach(u => URL.revokeObjectURL(u))
  previewUrls.value = []
  uploadForm.value = { files: null, title: '', category: 'general', featured: false }
  showUploadModal.value = false
}

const handleUpload = async () => {
  if (!uploadForm.value.files?.length) return
  isUploading.value = true
  const formData = new FormData()
  Array.from(uploadForm.value.files).forEach(file => formData.append('images[]', file))
  formData.append('title', uploadForm.value.title || '')
  formData.append('category', uploadForm.value.category)
  formData.append('featured', uploadForm.value.featured ? 'true' : 'false')
  try {
    await photoService.uploadPhotos(formData)
    await loadPhotos()
    resetUploadForm()
  } catch (err) {
    alert('Upload failed')
  } finally {
    isUploading.value = false
  }
}

const openEditModal = (photo) => {
  editForm.value = {
    id: photo.id,
    title: photo.title,
    category: photo.category,
    featured: photo.featured,
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = { id: null, title: '', category: 'general', featured: false }
}

const handleEdit = async () => {
  isSaving.value = true
  try {
    await photoService.updatePhoto(editForm.value.id, {
      title: editForm.value.title,
      category: editForm.value.category,
      featured: editForm.value.featured,
    })
    await loadPhotos()
    closeEditModal()
  } catch (err) {
    alert('Update failed')
  } finally {
    isSaving.value = false
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
      <button
        @click="showUploadModal = true"
        class="bg-white text-black px-6 py-3 rounded-xl font-semibold cursor-pointer flex items-center gap-2 hover:bg-neutral-200 transition-all"
      >
        <Plus class="w-5 h-5" />
        <span>Upload New</span>
      </button>
    </div>

    <!-- Upload Modal -->
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showUploadModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" @click.self="resetUploadForm">
        <div class="bg-neutral-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-2xl font-serif">Upload Photos</h3>
            <button @click="resetUploadForm" class="p-2 hover:bg-white/10 rounded-full transition-all"><X class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="handleUpload" class="space-y-5">
            <label class="block border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-white/40 transition-all">
              <div v-if="!previewUrls.length" class="space-y-3">
                <Upload class="w-10 h-10 mx-auto opacity-40" />
                <p class="text-sm text-neutral-400">Click to select images</p>
                <p class="text-xs text-neutral-600">PNG, JPG, WEBP up to 10MB</p>
              </div>
              <div v-else class="flex flex-wrap gap-2 justify-center">
                <div v-for="(url, i) in previewUrls" :key="i" class="w-16 h-16 rounded-lg overflow-hidden">
                  <img :src="url" class="w-full h-full object-cover" />
                </div>
                <p class="w-full text-xs text-neutral-400 mt-2">{{ previewUrls.length }} image(s) selected</p>
              </div>
              <input type="file" multiple class="hidden" @change="handleFileSelect" accept="image/*" />
            </label>
            <div class="space-y-2">
              <label class="small-caps opacity-40 text-xs">Title (optional)</label>
              <input type="text" v-model="uploadForm.title" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" placeholder="Give your photos a name..." />
            </div>
            <div class="space-y-2">
              <label class="small-caps opacity-40 text-xs">Category</label>
              <select v-model="uploadForm.category" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors appearance-none">
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
              </select>
            </div>
            <label class="flex items-center gap-3 cursor-pointer" @click.prevent="uploadForm.featured = !uploadForm.featured">
              <div :class="['w-11 h-6 rounded-full transition-colors flex items-center px-0.5', uploadForm.featured ? 'bg-amber-500' : 'bg-white/10']">
                <div :class="['w-5 h-5 bg-white rounded-full transition-transform shadow', uploadForm.featured ? 'translate-x-5' : 'translate-x-0']" />
              </div>
              <span class="flex items-center gap-2 text-sm">
                <Star class="w-4 h-4" :class="uploadForm.featured ? 'text-amber-500' : 'opacity-40'" />
                Featured on homepage
              </span>
            </label>
            <button :disabled="isUploading || !uploadForm.files?.length" class="w-full bg-white text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <Loader2 v-if="isUploading" class="w-5 h-5 animate-spin" />
              <Upload v-else class="w-5 h-5" />
              <span>{{ isUploading ? 'Uploading...' : 'Upload Photos' }}</span>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Edit Modal -->
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showEditModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" @click.self="closeEditModal">
        <div class="bg-neutral-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-2xl font-serif">Edit Photo</h3>
            <button @click="closeEditModal" class="p-2 hover:bg-white/10 rounded-full transition-all"><X class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="handleEdit" class="space-y-5">
            <div class="space-y-2">
              <label class="small-caps opacity-40 text-xs">Title</label>
              <input type="text" v-model="editForm.title" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors" placeholder="Photo title" />
            </div>
            <div class="space-y-2">
              <label class="small-caps opacity-40 text-xs">Category</label>
              <select v-model="editForm.category" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors appearance-none">
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
              </select>
            </div>
            <label class="flex items-center gap-3 cursor-pointer" @click.prevent="editForm.featured = !editForm.featured">
              <div :class="['w-11 h-6 rounded-full transition-colors flex items-center px-0.5', editForm.featured ? 'bg-amber-500' : 'bg-white/10']">
                <div :class="['w-5 h-5 bg-white rounded-full transition-transform shadow', editForm.featured ? 'translate-x-5' : 'translate-x-0']" />
              </div>
              <span class="flex items-center gap-2 text-sm">
                <Star class="w-4 h-4" :class="editForm.featured ? 'text-amber-500' : 'opacity-40'" />
                Featured on homepage
              </span>
            </label>
            <button :disabled="isSaving" class="w-full bg-white text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50">
              <Loader2 v-if="isSaving" class="w-5 h-5 animate-spin" />
              <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Photo Grid -->
    <div v-if="photos.length === 0" class="text-center py-16 border border-white/5 bg-white/5 rounded-2xl">
      <Image class="w-12 h-12 mx-auto opacity-20 mb-4" />
      <p class="text-neutral-500 italic">No photos yet. Upload your first one!</p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="photo in photos" :key="photo.id" class="group relative aspect-square bg-white/5 rounded-xl overflow-hidden ring-1 ring-white/10">
        <img :src="photo.url" :alt="photo.title" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
        <div v-if="photo.featured" class="absolute top-2 right-2 z-10">
          <Star class="w-4 h-4 text-amber-500 fill-amber-500" />
        </div>
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
          <div class="flex gap-2">
            <button @click="openEditModal(photo)" class="p-3 bg-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all">
              <Pencil class="w-5 h-5" />
            </button>
            <button @click="handleDelete(photo.id)" class="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-all">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
          <div class="text-center">
            <p class="text-xs font-medium truncate max-w-[120px]">{{ photo.title }}</p>
            <span class="text-[10px] uppercase tracking-widest opacity-60">{{ photo.category }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
