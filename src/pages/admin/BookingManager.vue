<script setup>
import { ref, onMounted } from 'vue'
import { bookingService } from '../../services/api'
import { Check, X } from 'lucide-vue-next'

const bookings = ref([])

const loadBookings = async () => {
  const data = await bookingService.getBookings()
  bookings.value = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

onMounted(loadBookings)

const handleStatus = async (id, status) => {
  await bookingService.updateBookingStatus(id, status)
  await loadBookings()
}
</script>

<template>
  <div class="space-y-8">
    <h2 class="text-3xl font-serif">Manage Bookings</h2>
    <div class="space-y-6">
      <p v-if="bookings.length === 0" class="text-center py-12 text-neutral-500 italic">No bookings found.</p>
      <div v-for="booking in bookings" :key="booking.id" class="glass-card overflow-hidden">
        <div
          :class="[
            'h-1 w-full',
            booking.status === 'confirmed' ? 'bg-green-500' :
            booking.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
          ]"
        />
        <div class="p-6 flex flex-col md:flex-row justify-between gap-6">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <h3 class="text-xl font-semibold">{{ booking.name }}</h3>
              <span
                :class="[
                  'text-[10px] uppercase font-bold px-2 py-0.5 rounded-full',
                  booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                  booking.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                ]"
              >
                {{ booking.status }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div class="space-y-0.5"><p class="small-caps opacity-40">Email</p><p>{{ booking.email }}</p></div>
              <div class="space-y-0.5"><p class="small-caps opacity-40">Type</p><p class="capitalize">{{ booking.eventType }}</p></div>
              <div class="space-y-0.5"><p class="small-caps opacity-40">Date</p><p>{{ new Date(booking.date).toLocaleDateString() }}</p></div>
              <div class="space-y-0.5"><p class="small-caps opacity-40">Request Date</p><p>{{ new Date(booking.createdAt).toLocaleDateString() }}</p></div>
            </div>
            <div class="p-4 bg-white/5 rounded-xl italic font-light text-neutral-300">&ldquo;{{ booking.message }}&rdquo;</div>
          </div>
          <div class="flex md:flex-col gap-2 justify-end">
            <button @click="handleStatus(booking.id, 'confirmed')" class="p-3 bg-green-500/10 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all">
              <Check class="w-6 h-6" />
            </button>
            <button @click="handleStatus(booking.id, 'rejected')" class="p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all">
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
