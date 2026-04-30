<script setup>
import { ref, reactive } from 'vue'
import { messageService } from '../services/api'
import { Send, Mail, Phone, MapPin, Instagram, Twitter, MessageCircle } from 'lucide-vue-next'

const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const sent = ref(false)
const whatsappUrl = 'https://wa.me/72429849?text=Bonjour%2C%20je%20souhaite%20r%C3%A9server%20une%20s%C3%A9ance%20photo'

const handleSubmit = async () => {
  try {
    await messageService.sendMessage({ ...formData })
    sent.value = true
    Object.assign(formData, { name: '', email: '', subject: '', message: '' })
  } catch (err) {
    alert('Error sending message')
  }
}
</script>

<template>
  <div class="pt-32 px-6 pb-24 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-16">
      <header class="max-w-3xl space-y-6">
        <p class="small-caps">Get In Touch</p>
        <h1 class="text-5xl md:text-8xl">Connect <span class="italic">With Me</span></h1>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div class="lg:col-span-5 space-y-12">
          <div class="space-y-8">
            <div class="flex items-start gap-6">
              <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                <Mail class="w-5 h-5 text-neutral-400" />
              </div>
              <div class="space-y-1">
                <h4 class="small-caps">Email</h4>
                <p class="text-xl font-light">akimanaberry@gmail.com</p>
              </div>
            </div>

            <div class="flex items-start gap-6">
              <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                <Phone class="w-5 h-5 text-neutral-400" />
              </div>
              <div class="space-y-1">
                <h4 class="small-caps">Phone</h4>
                <p class="text-xl font-light">+257 72429849</p>
              </div>
            </div>

            <div class="flex items-start gap-6">
              <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                <MessageCircle class="w-5 h-5 text-green-500" />
              </div>
              <div class="space-y-1">
                <h4 class="small-caps">WhatsApp</h4>
                <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="text-xl font-light text-green-400 hover:text-green-300 transition-colors">
                  Send a message
                </a>
              </div>
            </div>

            <div class="flex items-start gap-6">
              <div class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                <MapPin class="w-5 h-5 text-neutral-400" />
              </div>
              <div class="space-y-1">
                <h4 class="small-caps">Studio</h4>
                <p class="text-xl font-light">Bujumbura, en face de St Michel</p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <h4 class="small-caps">Follow My Journey</h4>
            <div class="flex gap-4">
              <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-green-500 hover:text-white hover:border-green-500 transition-all">
                <MessageCircle class="w-6 h-6" />
              </a>
              <a href="#" class="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Instagram class="w-6 h-6" />
              </a>
              <a href="#" class="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Twitter class="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl">
          <div v-if="sent" class="h-full flex flex-col items-center justify-center text-center space-y-4">
            <h3 class="text-3xl font-serif text-green-500">Message Sent</h3>
            <p class="text-neutral-400">I'll get back to you as soon as possible.</p>
            <button @click="sent = false" class="nav-pill">Send Another Message</button>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="small-caps opacity-40">Name</label>
                <input
                  required
                  type="text"
                  v-model="formData.name"
                  class="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-white transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div class="space-y-2">
                <label class="small-caps opacity-40">Email</label>
                <input
                  required
                  type="email"
                  v-model="formData.email"
                  class="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-white transition-colors"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="small-caps opacity-40">Subject</label>
              <input
                required
                type="text"
                v-model="formData.subject"
                class="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="What's this about?"
              />
            </div>
            <div class="space-y-2">
              <label class="small-caps opacity-40">Message</label>
              <textarea
                required
                rows="5"
                v-model="formData.message"
                class="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-white transition-colors resize-none"
                placeholder="Your message..."
              />
            </div>
            <button class="flex items-center gap-2 small-caps opacity-100 hover:italic transition-all group">
              Send Message <Send class="w-4 h-4 group-hover:-rotate-45 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
