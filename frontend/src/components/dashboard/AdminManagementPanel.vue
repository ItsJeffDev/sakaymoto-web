<script setup>
import { onMounted, ref, watch } from 'vue'
import { api } from '../../services/api'

const props = defineProps({ section: { type: String, required: true } })
const rows = ref([])
const report = ref(null)
const isLoading = ref(false)
const error = ref('')

async function load() {
  isLoading.value = true
  error.value = ''
  try {
    if (props.section === 'Customers') rows.value = (await api.users()).data || []
    if (props.section === 'Bookings') rows.value = (await api.bookings()).data || []
    if (props.section === 'Motorcycles') rows.value = await api.motorcyclesAdmin()
    if (props.section === 'Reports & analytics') report.value = (await api.reports()).data
  } catch (loadError) {
    error.value = loadError.message
  } finally {
    isLoading.value = false
  }
}

async function updateBooking(id, status) {
  try {
    await api.updateBookingStatus(id, status)
    await load()
  } catch (updateError) {
    error.value = updateError.message
  }
}

watch(() => props.section, load)
onMounted(load)
</script>

<template>
  <section class="management-panel dashboard-panel">
    <div class="panel-heading"><div><span class="panel-label">Management</span><h2>{{ section }}</h2></div><button class="text-button" type="button" @click="load">Refresh</button></div>
    <div v-if="isLoading" class="management-state">Loading {{ section.toLowerCase() }}...</div>
    <div v-else-if="error" class="management-state error"><p>{{ error }}</p><button class="btn btn-navy btn-sm" type="button" @click="load">Try again</button></div>
    <div v-else-if="section === 'Reports & analytics'" class="report-grid"><div><strong>{{ report?.customers || 0 }}</strong><span>Customers</span></div><div><strong>{{ report?.active_bookings || 0 }}</strong><span>Active bookings</span></div><div><strong>PHP {{ Number(report?.verified_revenue || 0).toLocaleString() }}</strong><span>Verified revenue</span></div></div>
    <div v-else-if="section === 'Customers'" class="table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead><tbody><tr v-for="user in rows" :key="user.id"><td class="amount">{{ user.name }}</td><td>{{ user.email }}</td><td>{{ user.phone || 'Not provided' }}</td><td>{{ user.created_at?.slice(0, 10) }}</td></tr></tbody></table><p v-if="!rows.length" class="management-state">No customers found.</p></div>
    <div v-else-if="section === 'Bookings'" class="table-scroll"><table><thead><tr><th>Customer</th><th>Motorcycle</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead><tbody><tr v-for="booking in rows" :key="booking.id"><td class="amount">{{ booking.customer_name }}</td><td>{{ booking.brand }} {{ booking.model }}</td><td>{{ booking.start_date }} - {{ booking.end_date }}</td><td><span class="table-status" :class="booking.status">{{ booking.status }}</span></td><td><button v-if="booking.status === 'pending'" class="table-action" type="button" @click="updateBooking(booking.id, 'confirmed')">Approve</button><button v-if="booking.status === 'pending'" class="table-action danger" type="button" @click="updateBooking(booking.id, 'cancelled')">Reject</button></td></tr></tbody></table><p v-if="!rows.length" class="management-state">No bookings found.</p></div>
    <div v-else class="table-scroll"><table><thead><tr><th>Motorcycle</th><th>Plate number</th><th>Price/day</th><th>Status</th></tr></thead><tbody><tr v-for="bike in rows" :key="bike.id"><td class="amount">{{ bike.brand }} {{ bike.model }}</td><td>{{ bike.plate_number }}</td><td>PHP {{ Number(bike.price_per_day).toLocaleString() }}</td><td><span class="table-status" :class="bike.status">{{ bike.status }}</span></td></tr></tbody></table><p v-if="!rows.length" class="management-state">No motorcycles found.</p></div>
  </section>
</template>

<style scoped>
.management-panel { width: 100%; max-width: 1100px; text-align: left; }.management-state { min-height: 130px; display: grid; place-content: center; justify-items: center; gap: 10px; color: var(--ink-soft); font-size: .8rem; }.management-state.error { color: #a33b32; }.report-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }.report-grid div { padding: 20px; border: 1px solid var(--line); border-radius: 10px; }.report-grid strong, .report-grid span { display: block; }.report-grid strong { color: var(--navy); font: 700 1.35rem var(--ff-display); }.report-grid span { color: var(--ink-soft); font-size: .74rem; margin-top: 5px; }.table-action { color: var(--blue); font-size: .7rem; font-weight: 700; margin-right: 10px; }.table-action.danger { color: #a33b32; }@media (max-width: 700px) { .report-grid { grid-template-columns: 1fr; } }
.management-panel table { width: 100%; border-collapse: collapse; white-space: nowrap; }.management-panel th { color: #919baa; font-size: .65rem; text-transform: uppercase; letter-spacing: .07em; font-weight: 700; text-align: left; padding: 12px 10px; border-bottom: 1px solid var(--line); }.management-panel td { color: var(--ink-soft); font-size: .76rem; padding: 14px 10px; border-bottom: 1px solid var(--line); }.management-panel tr:last-child td { border-bottom: 0; }.management-panel .amount { color: var(--navy); font-weight: 700; }.table-status { display: inline-block; padding: 5px 8px; border-radius: 5px; font-size: .64rem; font-weight: 700; text-transform: capitalize; }.table-status.confirmed { background: #e7f7ef; color: #18734d; }.table-status.pending { background: #fff4dc; color: #a96c11; }.table-status.completed { background: #f0f2f5; color: #667085; }.table-status.cancelled { background: #fff0ed; color: #a33b32; }.management-panel .table-action { padding: 5px 0; }.management-panel .table-action:focus-visible { outline: 2px solid var(--blue); outline-offset: 3px; }
</style>
