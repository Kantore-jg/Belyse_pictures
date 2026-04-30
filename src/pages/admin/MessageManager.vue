<script setup>
import { ref, onMounted } from 'vue'
import { messageService } from '../../services/api'

const messages = ref([])

onMounted(async () => {
  const data = await messageService.getMessages()
  messages.value = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
</script>

<template>
  <div class="space-y-8">
    <h2 class="text-3xl font-serif">Contact Messages</h2>
    <div class="space-y-4">
      <p v-if="messages.length === 0" class="text-center py-12 text-neutral-500 italic">No messages found.</p>
      <div v-for="msg in messages" :key="msg.id" class="glass-card p-6 space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">{{ msg.name }}</h3>
            <p class="text-sm text-neutral-400">{{ msg.email }}</p>
          </div>
          <span class="text-[10px] small-caps opacity-40">{{ new Date(msg.createdAt).toLocaleDateString() }}</span>
        </div>
        <div class="space-y-1">
          <p class="small-caps opacity-40">Subject</p>
          <p class="font-medium">{{ msg.subject }}</p>
        </div>
        <p class="text-neutral-300 font-light leading-relaxed">{{ msg.message }}</p>
      </div>
    </div>
  </div>
</template>
