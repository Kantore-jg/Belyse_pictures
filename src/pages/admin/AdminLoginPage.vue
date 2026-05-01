<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../../services/api'
import { Lock, Mail, Loader2 } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const router = useRouter()

onMounted(() => {
  if (authService.isAuthenticated()) {
    router.push('/admin/dashboard')
  }
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authService.login(email.value, password.value)
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen pt-32 px-6 flex flex-col items-center justify-center">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
      class="w-full max-w-md bg-white/5 p-8 rounded-3xl border border-white/10 space-y-8"
    >
      <div class="text-center space-y-2">
        <h1 class="text-4xl font-serif">Admin Login</h1>
        <p class="small-caps opacity-40">Access Dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label class="small-caps opacity-40 flex items-center gap-2">
            <Mail class="w-3 h-3" /> Email
          </label>
          <input
            required
            type="email"
            v-model="email"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            placeholder="email"
          />  
        </div>

        <div class="space-y-2">
          <label class="small-caps opacity-40 flex items-center gap-2">
            <Lock class="w-3 h-3" /> Password
          </label>
          <input
            required
            type="password"
            v-model="password"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <button
          :disabled="loading"
          class="w-full bg-white text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          <span v-else>Login</span>
        </button>
      </form>
      <p class="text-xs text-center text-neutral-500 italic">Bely_Pictures</p>
    </div>
  </div>
</template>
