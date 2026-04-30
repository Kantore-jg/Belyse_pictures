<script setup>
import { ref, reactive } from 'vue'
import { bookingService } from '../services/api'
import { CheckCircle2, Loader2 } from 'lucide-vue-next'

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  eventType: 'portrait',
  date: '',
  message: '',
})

const isSubmitting = ref(false)
const isSuccess = ref(false)

const steps = [
  { step: '1', title: 'Consultation', desc: 'We discuss your vision, location, and aesthetic preferences.' },
  { step: '2', title: 'Curation', desc: 'I scout locations and prepare a moodboard for the shoot.' },
  { step: '3', title: 'The Shoot', desc: 'A relaxed, collaborative environment to capture the essence.' },
  { step: '4', title: 'Delivery', desc: 'High-res edited gallery delivered within 2 weeks.' },
]

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await bookingService.createBooking({ ...formData })
    isSuccess.value = true
  } catch (err) {
    console.error(err)
    alert('Failed to send booking. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="isSuccess" class="pt-32 px-6 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
    <div
      v-motion
      :initial="{ scale: 0 }"
      :enter="{ scale: 1 }"
      class="text-green-500"
    >
      <CheckCircle2 class="w-24 h-24" />
    </div>
    <h1 class="text-5xl font-serif">Booking Received</h1>
    <p class="text-neutral-400 max-w-md">
      Thank you for reaching out! I'll review your request and get back to you within 24-48 hours.
    </p>
    <button @click="isSuccess = false" class="nav-pill">
      Back to Bookings
    </button>
  </div>

  <div v-else class="pt-32 px-6 pb-24 min-h-screen">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div
        v-motion
        :initial="{ opacity: 0, x: -30 }"
        :enter="{ opacity: 1, x: 0 }"
        class="space-y-12"
      >
        <div class="space-y-6">
          <p class="small-caps">Availability &amp; Booking</p>
          <h1 class="text-5xl md:text-8xl">Secure Your <span class="italic">Session</span></h1>
          <p class="text-neutral-400 text-lg font-light leading-relaxed max-w-xl">
            I only take a limited number of bookings per month to ensure every client receives my full creative attention. Fill out the form to check availability.
          </p>
        </div>

        <div class="space-y-8">
          <h3 class="text-2xl font-serif">Standard Process</h3>
          <ol class="space-y-6">
            <li
              v-for="item in steps"
              :key="item.step"
              class="flex gap-6 pb-6 border-b border-white/5"
            >
              <span class="font-serif italic text-2xl opacity-40">{{ item.step }}</span>
              <div class="space-y-1">
                <h4 class="text-lg font-medium">{{ item.title }}</h4>
                <p class="text-sm text-neutral-500 font-light">{{ item.desc }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, x: 30 }"
        :enter="{ opacity: 1, x: 0 }"
        class="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="small-caps opacity-40 block">Full Name</label>
              <input
                required
                type="text"
                v-model="formData.name"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="name"
              />
            </div>
            <div class="space-y-2">
              <label class="small-caps opacity-40 block">Email Address</label>
              <input
                required
                type="email"
                v-model="formData.email"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="email"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="small-caps opacity-40 block">Phone (Optional)</label>
              <input
                type="tel"
                v-model="formData.phone"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="+257....."
              />
            </div>
            <div class="space-y-2">
              <label class="small-caps opacity-40 block">Event Type</label>
              <select
                v-model="formData.eventType"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors appearance-none"
              >
                <option value="portrait">Portrait</option>
                <option value="wedding">Wedding</option>
                <option value="fashion">Fashion</option>
                <option value="event">Event</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="small-caps opacity-40 block">Preferred Date</label>
            <input
              required
              type="date"
              v-model="formData.date"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div class="space-y-2">
            <label class="small-caps opacity-40 block">Tell me about your event</label>
            <textarea
              required
              rows="4"
              v-model="formData.message"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white transition-colors resize-none"
              placeholder="Share your ideas, location, duration..."
            />
          </div>

          <button
            :disabled="isSubmitting"
            class="w-full bg-white text-black py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
            <span v-else>Request Booking</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
