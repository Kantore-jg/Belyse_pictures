<script setup>
import { ref, onMounted } from 'vue'
import { bookingService } from '../../services/api'
import { Check, X, Mail, Loader2, Send } from 'lucide-vue-next'

const bookings = ref([])
const showResponseModal = ref(false)
const selectedBooking = ref(null)
const selectedAction = ref('')
const responseMessage = ref('')
const isSending = ref(false)

const loadBookings = async () => {
  const data = await bookingService.getBookings()
  bookings.value = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

onMounted(loadBookings)

const openResponseModal = (booking, action) => {
  selectedBooking.value = booking
  selectedAction.value = action
  responseMessage.value = ''
  showResponseModal.value = true
}

const closeModal = () => {
  showResponseModal.value = false
  selectedBooking.value = null
  selectedAction.value = ''
  responseMessage.value = ''
}

const handleConfirmAction = async () => {
  if (!selectedBooking.value) return
  isSending.value = true
  try {
    await bookingService.updateBookingStatus(
      selectedBooking.value.id,
      selectedAction.value,
      responseMessage.value || null
    )
    closeModal()
    await loadBookings()
  } catch (err) {
    alert('Failed to update booking')
  } finally {
    isSending.value = false
  }
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
          <div class="space-y-4 flex-1">
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

            <!-- Show admin response if already responded -->
            <div v-if="booking.adminResponse" class="p-4 bg-white/[0.03] border-l-2 border-white/20 rounded-r-xl">
              <p class="small-caps opacity-40 text-xs mb-1">Your Response</p>
              <p class="text-sm text-neutral-300 font-light italic">&ldquo;{{ booking.adminResponse }}&rdquo;</p>
            </div>
          </div>

          <div class="flex md:flex-col gap-2 justify-end">
            <button
              @click="openResponseModal(booking, 'confirmed')"
              class="p-3 bg-green-500/10 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition-all"
              title="Confirm booking"
            >
              <Check class="w-6 h-6" />
            </button>
            <button
              @click="openResponseModal(booking, 'rejected')"
              class="p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
              title="Reject booking"
            >
              <X class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Response Modal -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showResponseModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" @click.self="closeModal">
        <div class="bg-neutral-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-2xl font-serif">
              {{ selectedAction === 'confirmed' ? 'Confirm' : 'Reject' }} Booking
            </h3>
            <button @click="closeModal" class="p-2 hover:bg-white/10 rounded-full transition-all">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div v-if="selectedBooking" class="space-y-4">
            <div class="p-4 bg-white/5 rounded-xl space-y-2">
              <p class="font-semibold">{{ selectedBooking.name }}</p>
              <p class="text-sm text-neutral-400">{{ selectedBooking.email }}</p>
              <p class="text-xs text-neutral-500 capitalize">{{ selectedBooking.eventType }} &mdash; {{ new Date(selectedBooking.date).toLocaleDateString() }}</p>
            </div>

            <div
              :class="[
                'p-4 rounded-xl text-sm',
                selectedAction === 'confirmed' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              ]"
            >
              <div class="flex items-center gap-2 mb-1">
                <Mail class="w-4 h-4" />
                <span class="font-medium">An email will be sent to {{ selectedBooking.email }}</span>
              </div>
              <p class="text-xs opacity-70">The client will receive a notification about this decision.</p>
            </div>

            <div class="space-y-2">
              <label class="small-caps opacity-40 text-xs">Personal message (optional)</label>
              <textarea
                v-model="responseMessage"
                rows="4"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-colors resize-none"
                :placeholder="selectedAction === 'confirmed'
                  ? 'Ex: Looking forward to our session! I\'ll send you the details soon...'
                  : 'Ex: Unfortunately I\'m fully booked on that date. Please try another date...'"
              />
            </div>

            <div class="flex gap-3">
              <button
                @click="closeModal"
                class="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                @click="handleConfirmAction"
                :disabled="isSending"
                :class="[
                  'flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50',
                  selectedAction === 'confirmed'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-red-500 text-white hover:bg-red-600'
                ]"
              >
                <Loader2 v-if="isSending" class="w-5 h-5 animate-spin" />
                <Send v-else class="w-4 h-4" />
                <span>{{ selectedAction === 'confirmed' ? 'Confirm & Send' : 'Reject & Send' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
