<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { api } from '../../services/api'

const props = defineProps({ section: { type: String, required: true } })
const rows = ref([])
const report = ref(null)
const isLoading = ref(false)
const error = ref('')
const formError = ref('')
const successMessage = ref('')
const customerDocuments = ref({})
const selectedUser = ref(null)
const selectedDocumentPreview = ref('')
const showAddMotorcycleForm = ref(false)
const selectedImage = ref(null)
const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
  /\/api$/,
  '',
)
const actionError = ref('')
const busyBikeId = ref(null)
const motorcycleFilter = ref('all')
const motorcycleFilters = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'rented', label: 'Rented now' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'inactive', label: 'Inactive' },
]
const motorcycleForm = ref({
  motorcycle_type: '',
  brand: '',
  model: '',
  year: '',
  plate_number: '',
  color: '',
  price_per_day: '',
  status: 'available',
  description: '',
})
function getFileUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `${apiBaseUrl}${path}`
}

function formatDocumentType(type) {
  return (
    {
      drivers_license: "Driver's license",
      valid_id: 'Valid ID',
      other: 'Other document',
    }[type] ||
    type ||
    'Document'
  )
}

function getCustomerDocuments(userId) {
  return customerDocuments.value[userId] || []
}

function getCustomerIdentitySummary(userId) {
  const documents = getCustomerDocuments(userId)

  if (!documents.length) {
    return { label: 'No ID / docs', tone: 'muted' }
  }

  const hasVerifiedIdentity = documents.some(
    (document) =>
      ['drivers_license', 'valid_id'].includes(document.document_type) &&
      document.status === 'verified',
  )

  const hasPendingDocuments = documents.some((document) => document.status === 'pending')

  if (hasVerifiedIdentity) {
    return { label: 'Verified identity', tone: 'verified' }
  }

  if (hasPendingDocuments) {
    return { label: 'Pending review', tone: 'pending' }
  }

  return { label: 'ID uploaded', tone: 'info' }
}

function formatMotorcyclePrice(value) {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return 'Price unavailable'
  }

  return `PHP ${numericValue.toLocaleString()}`
}

async function loadCustomerDocuments(users = []) {
  if (!users.length) {
    customerDocuments.value = {}
    return
  }

  const results = await Promise.all(
    users.map(async (user) => {
      const response = await api.documents(user.id)
      return [user.id, response.data || []]
    }),
  )

  customerDocuments.value = Object.fromEntries(results)
}

function resetMotorcycleForm() {
  motorcycleForm.value = {
    motorcycle_type: '',
    brand: '',
    model: '',
    year: '',
    plate_number: '',
    color: '',
    price_per_day: '',
    status: 'available',
    description: '',
  }
  selectedImage.value = null
  formError.value = ''
}

function onImageChange(event) {
  selectedImage.value = event.target.files?.[0] || null
}

async function submitMotorcycle() {
  formError.value = ''
  successMessage.value = ''

  const { brand, model, year, plate_number, color, price_per_day, status, description } =
    motorcycleForm.value

  if (!brand || !model || !year || !plate_number || !color || !price_per_day) {
    formError.value = 'Please fill in all required motorcycle fields.'
    return
  }

  const yearValue = Number(year)
  const priceValue = Number(price_per_day)

  if (
    !Number.isInteger(yearValue) ||
    yearValue < 2000 ||
    yearValue > new Date().getFullYear() + 1
  ) {
    formError.value = 'Please enter a valid year between 2000 and the next year.'
    return
  }

  if (!Number.isFinite(priceValue) || priceValue <= 0) {
    formError.value = 'Please enter a valid daily rate greater than zero.'
    return
  }

  try {
    const createdMotorcycle = await api.createMotorcycle({
      brand: brand.trim(),
      model: model.trim(),
      year: yearValue,
      plate_number: plate_number.trim(),
      color: color.trim(),
      price_per_day: priceValue,
      status,
      description: description.trim() || null,
      motorcycle_type: motorcycleForm.value.motorcycle_type.trim() || null,
    })

    if (selectedImage.value) {
      const imagePayload = new FormData()
      imagePayload.append('image', selectedImage.value)
      imagePayload.append('is_primary', 'true')
      await api.uploadMotorcycleImage(createdMotorcycle.id, imagePayload)
    }

    successMessage.value = 'Motorcycle added successfully.'
    resetMotorcycleForm()
    showAddMotorcycleForm.value = false
    await load()
  } catch (submitError) {
    formError.value = submitError.message
  }
}

async function load() {
  isLoading.value = true
  error.value = ''
  try {
    if (props.section === 'Customers') {
      const response = await api.users()
      rows.value = response.data || []
      await loadCustomerDocuments(rows.value)
    }
    if (props.section === 'Bookings') rows.value = (await api.bookings()).data || []
    if (props.section === 'Motorcycles') rows.value = await api.motorcyclesAdmin()
    if (props.section === 'Payments') rows.value = (await api.payments()).data || []
    if (props.section === 'Reports & analytics') report.value = (await api.reports()).data
  } catch (loadError) {
    error.value = loadError.message
  } finally {
    isLoading.value = false
  }
}

const money = (value) => `PHP ${Number(value || 0).toLocaleString()}`
const methodLabel = (method) =>
  ({ cash: 'Cash', gcash: 'GCash', bank_transfer: 'Bank transfer' })[method] || method || '—'
const monthLabel = (ym) => {
  const [year, month] = String(ym).split('-')
  return new Date(Number(year), Number(month) - 1, 1).toLocaleString('en-US', {
    month: 'short',
    year: '2-digit',
  })
}
const barHeight = (value, max) => (max > 0 ? Math.max(Math.round((Number(value) / max) * 100), 3) : 0)
const maxMonthly = computed(() =>
  Math.max(0, ...(report.value?.monthlyRevenue || []).map((m) => Number(m.total))),
)
const inServiceCount = computed(() => {
  const f = report.value?.fleet
  return f ? f.total - f.inactive : 0
})
const fleetRows = computed(() => {
  const f = report.value?.fleet || {}
  return [
    { key: 'available', label: 'Available', count: f.available || 0 },
    { key: 'rented', label: 'Rented now', count: f.rented || 0 },
    { key: 'maintenance', label: 'Maintenance', count: f.maintenance || 0 },
    { key: 'inactive', label: 'Inactive', count: f.inactive || 0 },
  ]
})

const paymentTotals = computed(() => {
  const sum = (statuses) =>
    rows.value
      .filter((p) => statuses.includes(p.status))
      .reduce((total, p) => total + Number(p.amount), 0)
  return {
    verified: sum(['verified']),
    pending: sum(['pending']),
    other: sum(['rejected', 'refunded']),
  }
})

const motorcycleCounts = computed(() => {
  const counts = { total: 0, available: 0, rented: 0, maintenance: 0, inactive: 0 }
  if (props.section !== 'Motorcycles') return counts
  for (const bike of rows.value) {
    counts.total += 1
    counts[bike.display_status || bike.status] += 1
  }
  return counts
})
const filteredMotorcycles = computed(() =>
  props.section !== 'Motorcycles'
    ? []
    : motorcycleFilter.value === 'all'
      ? rows.value
      : rows.value.filter((bike) => (bike.display_status || bike.status) === motorcycleFilter.value),
)

async function changeMotorcycleStatus(bike, status) {
  if (status === bike.status) return
  actionError.value = ''
  busyBikeId.value = bike.id
  try {
    await api.updateMotorcycle(bike.id, { status })
    await load()
  } catch (updateError) {
    actionError.value = updateError.message
  } finally {
    busyBikeId.value = null
  }
}

async function removeMotorcycle(bike) {
  if (!window.confirm(`Delete ${bike.brand} ${bike.model} (${bike.plate_number})?`)) return
  actionError.value = ''
  busyBikeId.value = bike.id
  try {
    await api.deleteMotorcycle(bike.id)
    await load()
  } catch (deleteError) {
    actionError.value = `${deleteError.message}. Set it to Inactive instead to hide it.`
  } finally {
    busyBikeId.value = null
  }
}

async function setPaymentStatus(id, status) {
  actionError.value = ''
  try {
    await api.updatePaymentStatus(id, status)
    await load()
  } catch (updateError) {
    error.value = updateError.message
  }
}

function exportReportCsv() {
  const r = report.value
  if (!r) return
  const lines = [
    ['Metric', 'Value'],
    ['Verified revenue', r.verified_revenue],
    ['Pending payments', r.pending_payments],
    ['Refunded', r.refunded_amount],
    ['Booked value', r.booked_value],
    ['Outstanding balance', r.outstanding_balance],
    ['Customers', r.customers],
    ['Active bookings', r.active_bookings],
    ['Total bookings', r.total_bookings],
    ['Fleet utilization %', r.fleet?.utilization],
    [],
    ['Month', 'Verified revenue'],
    ...(r.monthlyRevenue || []).map((m) => [m.month, m.total]),
  ]
  const csv = lines.map((line) => line.join(',')).join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  link.download = `sakaymoto-report-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

async function updateBooking(id, status) {
  try {
    await api.updateBookingStatus(id, status)
    await load()
  } catch (updateError) {
    error.value = updateError.message
  }
}

async function updateDocumentStatus(documentId, status) {
  try {
    await api.updateDocumentStatus(documentId, status)
    await load()
  } catch (updateError) {
    error.value = updateError.message
  }
}

function inspectUser(user) {
  selectedUser.value = user
  selectedDocumentPreview.value = ''
}

function closeInspection() {
  selectedUser.value = null
  selectedDocumentPreview.value = ''
}

watch(() => props.section, () => {
  actionError.value = ''
  motorcycleFilter.value = 'all'
  load()
})
onMounted(load)
</script>

<template>
  <section class="management-panel dashboard-panel">
    <div class="panel-heading">
      <div>
        <span class="panel-label">Management</span>
        <h2>{{ section }}</h2>
      </div>
      <div class="panel-actions">
        <button
          v-if="section === 'Motorcycles'"
          class="btn btn-navy btn-sm"
          type="button"
          @click="showAddMotorcycleForm = !showAddMotorcycleForm"
        >
          {{ showAddMotorcycleForm ? 'Close form' : 'Add motorcycle' }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="management-state">Loading {{ section.toLowerCase() }}...</div>
    <div v-else-if="error" class="management-state error">
      <p>{{ error }}</p>
      <button class="btn btn-navy btn-sm" type="button" @click="load">Try again</button>
    </div>
    <div
      v-else-if="section === 'Motorcycles' && showAddMotorcycleForm"
      class="motorcycle-form-panel"
    >
      <div class="motorcycle-form-header">
        <div>
          <span class="panel-label">New inventory</span>
          <h3>Add a motorcycle</h3>
        </div>
      </div>

      <div v-if="formError" class="form-message error">{{ formError }}</div>
      <div v-if="successMessage" class="form-message success">{{ successMessage }}</div>

      <form class="motorcycle-form" @submit.prevent="submitMotorcycle">
        <div class="form-grid">
          <div class="form-field">
            <label for="motorcycle-brand">Brand</label>
            <input
              id="motorcycle-brand"
              v-model="motorcycleForm.brand"
              type="text"
              placeholder="Honda"
            />
          </div>
          <div class="form-field">
            <label for="motorcycle-model">Model</label>
            <input
              id="motorcycle-model"
              v-model="motorcycleForm.model"
              type="text"
              placeholder="Click 125"
            />
          </div>
          <div class="form-field">
            <label for="motorcycle-year">Year</label>
            <input
              id="motorcycle-year"
              v-model="motorcycleForm.year"
              type="number"
              min="2000"
              placeholder="2026"
            />
          </div>
          <div class="form-field">
            <label for="motorcycle-plate">Plate number</label>
            <input
              id="motorcycle-plate"
              v-model="motorcycleForm.plate_number"
              type="text"
              placeholder="ABC 1234"
            />
          </div>
          <div class="form-field">
            <label for="motorcycle-color">Color</label>
            <input
              id="motorcycle-color"
              v-model="motorcycleForm.color"
              type="text"
              placeholder="Black"
            />
          </div>
          <div class="form-field">
            <label for="motorcycle-price">Price per day</label>
            <input
              id="motorcycle-price"
              v-model="motorcycleForm.price_per_day"
              type="number"
              min="1"
              step="0.01"
              placeholder="850"
            />
          </div>
          <div class="form-field">
            <label for="motorcycle-status">Status</label>
            <select id="motorcycle-status" v-model="motorcycleForm.status">
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="form-field">
            <label for="motorcycle-type">Type</label>
            <select id="motorcycle-type" v-model="motorcycleForm.motorcycle_type">
              <option value="">Select type</option>
              <option>Scooter</option>
              <option>Standard</option>
              <option>Sport</option>
              <option>Underbone</option>
              <option>Adventure</option>
            </select>
          </div>
          <div class="form-field">
            <label for="motorcycle-image">Image</label>
            <input id="motorcycle-image" type="file" accept="image/*" @change="onImageChange" />
          </div>
        </div>

        <div class="form-field full-width">
          <label for="motorcycle-description">Description</label>
          <textarea
            id="motorcycle-description"
            v-model="motorcycleForm.description"
            rows="4"
            placeholder="Optional notes about the bike, condition, or features"
          />
        </div>

        <div class="motorcycle-form-actions">
          <button class="btn btn-navy btn-sm" type="submit">Save motorcycle</button>
          <button
            class="text-button"
            type="button"
            @click="((showAddMotorcycleForm = false), resetMotorcycleForm())"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div v-else-if="section === 'Reports & analytics'" class="analytics">
      <div class="analytics-toolbar">
        <span class="analytics-note"
          >Revenue counts <b>verified</b> payments only. Pending payments are shown separately.</span
        >
        <button class="btn btn-navy btn-sm" type="button" @click="exportReportCsv">
          Download CSV
        </button>
      </div>

      <div class="report-grid report-grid-4">
        <div>
          <strong>{{ money(report?.verified_revenue) }}</strong
          ><span>Verified revenue</span>
          <small>{{ report?.verified_payment_count || 0 }} verified payment(s)</small>
        </div>
        <div>
          <strong>{{ money(report?.pending_payments) }}</strong
          ><span>Pending payments</span>
          <small>{{ report?.pending_payment_count || 0 }} awaiting verification</small>
        </div>
        <div>
          <strong>{{ money(report?.outstanding_balance) }}</strong
          ><span>Outstanding balance</span>
          <small>Booked value {{ money(report?.booked_value) }}</small>
        </div>
        <div>
          <strong>{{ money(report?.average_payment) }}</strong
          ><span>Average payment</span>
          <small>Refunded {{ money(report?.refunded_amount) }}</small>
        </div>
        <div>
          <strong>{{ report?.customers || 0 }}</strong
          ><span>Customers</span>
          <small>Registered accounts</small>
        </div>
        <div>
          <strong>{{ report?.active_bookings || 0 }}</strong
          ><span>Active bookings</span>
          <small>{{ report?.total_bookings || 0 }} total bookings</small>
        </div>
        <div>
          <strong>{{ report?.fleet?.utilization || 0 }}%</strong
          ><span>Fleet utilization</span>
          <small>{{ report?.fleet?.rented || 0 }} of {{ inServiceCount }} bikes rented now</small>
        </div>
        <div>
          <strong>{{ report?.review_count ? report.average_rating + ' / 5' : '—' }}</strong
          ><span>Customer rating</span>
          <small>{{ report?.review_count || 0 }} review(s)</small>
        </div>
      </div>

      <div class="analytics-columns">
        <section class="analytics-card wide">
          <h3>Monthly revenue</h3>
          <p v-if="!report?.monthlyRevenue?.length" class="analytics-empty">
            No verified payments yet.
          </p>
          <div v-else class="bar-chart">
            <div v-for="m in report.monthlyRevenue" :key="m.month" class="bar-col">
              <span class="bar-value">{{ money(m.total) }}</span>
              <div class="bar-track">
                <i :style="{ height: barHeight(m.total, maxMonthly) + '%' }"></i>
              </div>
              <span class="bar-label">{{ monthLabel(m.month) }}</span>
            </div>
          </div>
        </section>

        <section class="analytics-card">
          <h3>Fleet status</h3>
          <div class="mini-list">
            <div v-for="seg in fleetRows" :key="seg.key" class="mini-row">
              <span><i class="dot" :class="seg.key"></i>{{ seg.label }}</span>
              <b>{{ seg.count }}</b>
            </div>
          </div>
        </section>
      </div>

      <div class="analytics-columns three">
        <section class="analytics-card">
          <h3>Bookings by status</h3>
          <p v-if="!report?.bookingBreakdown?.length" class="analytics-empty">No bookings yet.</p>
          <div v-for="b in report?.bookingBreakdown || []" :key="b.status" class="hbar-row">
            <span class="table-status" :class="b.status">{{ b.status }}</span>
            <div class="hbar"><i :style="{ width: barHeight(b.count, report.total_bookings) + '%' }"></i></div>
            <b>{{ b.count }}</b>
          </div>
        </section>

        <section class="analytics-card">
          <h3>Verified revenue by method</h3>
          <p v-if="!report?.paymentMethods?.length" class="analytics-empty">No verified payments yet.</p>
          <div v-for="pm in report?.paymentMethods || []" :key="pm.method" class="hbar-row">
            <span class="method-name">{{ methodLabel(pm.method) }}</span>
            <div class="hbar"><i :style="{ width: barHeight(pm.total, report.verified_revenue) + '%' }"></i></div>
            <b>{{ money(pm.total) }}</b>
          </div>
        </section>

        <section class="analytics-card">
          <h3>Top motorcycles by revenue</h3>
          <p v-if="!report?.topMotorcycles?.length" class="analytics-empty">No motorcycles yet.</p>
          <div v-for="bike in report?.topMotorcycles || []" :key="bike.id" class="mini-row">
            <span>{{ bike.brand }} {{ bike.model }}<small>{{ bike.bookings }} booking(s)</small></span>
            <b>{{ money(bike.revenue) }}</b>
          </div>
        </section>
      </div>

      <section class="analytics-card">
        <h3>Recent payments</h3>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Motorcycle</th>
                <th>Method</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in report?.recentPayments || []" :key="p.id">
                <td class="amount">{{ p.customer_name }}</td>
                <td>{{ p.brand }} {{ p.model }}</td>
                <td>{{ methodLabel(p.payment_method) }}</td>
                <td><span class="table-status" :class="p.status">{{ p.status }}</span></td>
                <td class="amount">{{ money(p.amount) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-if="!report?.recentPayments?.length" class="management-state">No payments yet.</p>
        </div>
      </section>
    </div>
    <div v-else-if="section === 'Customers'" class="table-scroll customer-table-scroll">
      <table class="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Identity</th>
            <th>Documents</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in rows" :key="user.id">
            <td class="amount" data-label="Name">{{ user.name }}</td>
            <td data-label="Email">{{ user.email }}</td>
            <td data-label="Phone">{{ user.phone || 'Not provided' }}</td>
            <td data-label="Identity">
              <span class="table-status" :class="getCustomerIdentitySummary(user.id).tone">
                {{ getCustomerIdentitySummary(user.id).label }}
              </span>
            </td>
            <td data-label="Documents">
              <div class="customer-docs-cell">
                <span>{{ getCustomerDocuments(user.id).length }} uploaded</span>
                <button class="table-action" type="button" @click="inspectUser(user)">
                  Inspect
                </button>
              </div>
            </td>
            <td data-label="Joined">{{ user.created_at?.slice(0, 10) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="management-state">No customers found.</p>
    </div>

    <div v-else-if="section === 'Bookings'" class="table-scroll booking-table-scroll">
      <table class="booking-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Motorcycle</th>
            <th>Dates</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in rows" :key="booking.id">
            <td class="amount" data-label="Customer">{{ booking.customer_name }}</td>
            <td data-label="Motorcycle">{{ booking.brand }} {{ booking.model }}</td>
            <td data-label="Dates">
              <span class="booking-dates">{{ booking.start_date }} - {{ booking.end_date }}</span>
            </td>
            <td data-label="Status">
              <span class="table-status" :class="booking.status">{{ booking.status }}</span>
            </td>
            <td data-label="Actions">
              <button v-if="booking.status === 'pending'" class="table-action" type="button"
                @click="updateBooking(booking.id, 'confirmed')">
                Approve</button><button v-if="booking.status === 'pending'" class="table-action danger" type="button"
                @click="updateBooking(booking.id, 'cancelled')">
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="management-state">No bookings found.</p>
    </div>
    <div v-else-if="section === 'Payments'" class="analytics">
      <div class="report-grid">
        <div>
          <strong>{{ money(paymentTotals.verified) }}</strong><span>Verified revenue</span>
          <small>Real income — verified payments only</small>
        </div>
        <div>
          <strong>{{ money(paymentTotals.pending) }}</strong><span>Pending</span>
          <small>Waiting for your verification</small>
        </div>
        <div>
          <strong>{{ money(paymentTotals.other) }}</strong><span>Rejected / refunded</span>
          <small>Not counted as revenue</small>
        </div>
      </div>
      <div class="table-scroll payment-table-scroll">
        <table class="payment-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Motorcycle</th>
              <th>Method</th>
              <th>Reference</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in rows" :key="p.id">
              <td class="amount" data-label="Customer">{{ p.customer_name }}</td>
              <td data-label="Motorcycle">{{ p.brand }} {{ p.model }}</td>
              <td data-label="Method">{{ methodLabel(p.payment_method) }}</td>
              <td data-label="Reference">{{ p.reference_number || '—' }}</td>
              <td class="amount" data-label="Amount">{{ money(p.amount) }}</td>
              <td data-label="Status">
                <span class="table-status" :class="p.status">{{ p.status }}</span>
              </td>
              <td data-label="Actions">
                <template v-if="p.status === 'pending'">
                  <button class="table-action" type="button" @click="setPaymentStatus(p.id, 'verified')">Verify</button>
                  <button class="table-action danger" type="button" @click="setPaymentStatus(p.id, 'rejected')">Reject</button>
                </template>
                <button
                  v-else-if="p.status === 'verified'"
                  class="table-action danger"
                  type="button"
                  @click="setPaymentStatus(p.id, 'refunded')"
                >
                  Refund
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!rows.length" class="management-state">No payments found.</p>
      </div>
    </div>
    <div v-else class="motorcycle-manager">
      <div class="fleet-chips">
        <div class="fleet-chip">
          <strong>{{ motorcycleCounts.total }}</strong><span>Total</span>
        </div>
        <div class="fleet-chip available">
          <strong>{{ motorcycleCounts.available }}</strong><span>Available</span>
        </div>
        <div class="fleet-chip rented">
          <strong>{{ motorcycleCounts.rented }}</strong><span>Rented now</span>
        </div>
        <div class="fleet-chip maintenance">
          <strong>{{ motorcycleCounts.maintenance }}</strong><span>Maintenance</span>
        </div>
        <div class="fleet-chip inactive">
          <strong>{{ motorcycleCounts.inactive }}</strong><span>Inactive</span>
        </div>
      </div>
      <div class="status-filters">
        <button
          v-for="f in motorcycleFilters"
          :key="f.key"
          type="button"
          :class="{ active: motorcycleFilter === f.key }"
          @click="motorcycleFilter = f.key"
        >
          {{ f.label }}
        </button>
      </div>
      <div v-if="actionError" class="form-message error">{{ actionError }}</div>
      <div class="table-scroll motorcycle-table-scroll">
        <table class="motorcycle-table">
          <thead>
            <tr>
              <th>Motorcycle</th>
              <th>Plate number</th>
              <th>Type</th>
              <th>Price/day</th>
              <th>Current status</th>
              <th>Change status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bike in filteredMotorcycles" :key="bike.id">
              <td class="amount" data-label="Motorcycle">
                {{ bike.brand || 'Unknown' }} {{ bike.model || '' }}
                <small class="bike-year">{{ bike.year }} · {{ bike.color }}</small>
              </td>
              <td data-label="Plate number">{{ bike.plate_number || 'Not provided' }}</td>
              <td data-label="Type">{{ bike.motorcycle_type || '—' }}</td>
              <td data-label="Price/day">{{ formatMotorcyclePrice(bike.price_per_day) }}</td>
              <td data-label="Current status">
                <span class="table-status" :class="bike.display_status || bike.status">{{
                  bike.display_status || bike.status
                }}</span>
              </td>
              <td data-label="Change status">
                <select
                  class="status-select"
                  :value="bike.status"
                  :disabled="busyBikeId === bike.id"
                  @change="changeMotorcycleStatus(bike, $event.target.value)"
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td data-label="">
                <button
                  class="table-action danger"
                  type="button"
                  :disabled="busyBikeId === bike.id"
                  @click="removeMotorcycle(bike)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="!filteredMotorcycles.length" class="management-state">No motorcycles found.</p>
      </div>
    </div>
    <div v-if="selectedUser" class="customer-inspect-overlay" @click.self="closeInspection">
      <div class="customer-inspect-panel">
        <button
          class="dialog-close"
          type="button"
          aria-label="Close inspection"
          @click="closeInspection"
        >
          ×
        </button>

        <div class="customer-inspect-header">
          <div class="customer-inspect-avatar">
            <img
              v-if="selectedUser.profile_image"
              :src="getFileUrl(selectedUser.profile_image)"
              :alt="'User Profile'"
            />
            <span v-else>{{ selectedUser.name?.slice(0, 2).toUpperCase() || 'US' }}</span>
          </div>
          <div>
            <span class="panel-label">Customer identity</span>
            <h3>{{ selectedUser.name }}</h3>
          </div>
        </div>

        <div class="customer-inspect-grid">
          <div class="customer-inspect-card">
            <span class="card-label">Contact</span>
            <p>{{ selectedUser.email }}</p>
            <p>{{ selectedUser.phone || 'No phone number provided' }}</p>
            <p>{{ selectedUser.address }}</p>
            <p>Joined {{ selectedUser.created_at?.slice(0, 10) }}</p>
          </div>
          <div class="customer-inspect-card">
            <span class="card-label">Verification</span>
            <p class="identity-check">
              <strong>{{ getCustomerIdentitySummary(selectedUser.id).label }}</strong>
            </p>
            <p>
              {{
                getCustomerDocuments(selectedUser.id).length
                  ? `${getCustomerDocuments(selectedUser.id).length} uploaded file(s)`
                  : 'No uploaded files yet'
              }}
            </p>
          </div>
        </div>

        <div v-if="getCustomerDocuments(selectedUser.id).length" class="document-grid">
          <article
            v-for="document in getCustomerDocuments(selectedUser.id)"
            :key="document.id"
            class="document-card"
          >
            <button
              class="document-preview"
              type="button"
              @click="selectedDocumentPreview = getFileUrl(document.file_url)"
            >
              <img
                v-if="document.file_url"
                :src="getFileUrl(document.file_url)"
                :alt="`${formatDocumentType(document.document_type)} preview`"
              />
              <span v-else>No preview</span>
            </button>
            <div class="document-details">
              <span>{{ formatDocumentType(document.document_type) }}</span>
              <strong>{{ document.status }}</strong>
              <small>Uploaded {{ document.uploaded_at?.slice(0, 10) }}</small>
              <div v-if="document.status === 'pending'" class="document-actions">
                <button
                  class="table-action"
                  type="button"
                  @click="updateDocumentStatus(document.id, 'verified')"
                >
                  Confirm
                </button>
                <button
                  class="table-action danger"
                  type="button"
                  @click="updateDocumentStatus(document.id, 'rejected')"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="management-state no-documents">
          <p>No uploaded ID or documents found for this customer.</p>
        </div>
      </div>
    </div>

    <div
      v-if="selectedDocumentPreview"
      class="image-preview-overlay"
      @click.self="selectedDocumentPreview = ''"
    >
      <div class="image-preview-panel">
        <button
          class="dialog-close"
          type="button"
          aria-label="Close preview"
          @click="selectedDocumentPreview = ''"
        >
          ×
        </button>
        <img :src="selectedDocumentPreview" alt="Document preview" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.management-panel {
  width: 100%;
  max-width: 1100px;
  text-align: left;
}

.management-panel table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

.management-panel th {
  color: #919baa;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid var(--line);
}

.management-panel td {
  color: var(--ink-soft);
  font-size: 0.76rem;
  padding: 14px 10px;
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.management-panel tr:last-child td {
  border-bottom: 0;
}

.management-panel .amount {
  color: var(--navy);
  font-weight: 700;
}

.table-status {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: capitalize;
}

.table-status.confirmed {
  background: #e7f7ef;
  color: #18734d;
}

.table-status.pending {
  background: #fff4dc;
  color: #a96c11;
}

.table-status.completed {
  background: #f0f2f5;
  color: #667085;
}

.table-status.cancelled,
.table-status.rejected {
  background: #fff0ed;
  color: #a33b32;
}

.management-panel .table-action {
  color: var(--blue);
  font-size: 0.7rem;
  font-weight: 700;
  margin-right: 10px;
}

.management-panel .table-action.danger {
  color: #a33b32;
}

.management-state {
  min-height: 130px;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  color: var(--ink-soft);
  font-size: 0.8rem;
}

.management-state.error {
  color: #a33b32;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.report-grid div {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 10px;
}

.report-grid strong,
.report-grid span {
  display: block;
}

.report-grid strong {
  color: var(--navy);
  font: 700 1.35rem var(--ff-display);
}

.report-grid span {
  color: var(--ink-soft);
  font-size: 0.74rem;
  margin-top: 5px;
}

.table-action {
  color: var(--blue);
  font-size: 0.7rem;
  font-weight: 700;
  margin-right: 10px;
}

.table-action.danger {
  color: #a33b32;
}

.customer-docs-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.customer-docs-cell span {
  color: var(--ink-soft);
}

.booking-dates {
  min-width: 0;
  overflow-wrap: anywhere;
}

.customer-inspect-overlay,
.image-preview-overlay {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(8, 27, 54, 0.6);
}

.customer-inspect-panel {
  width: min(100%, 760px);
  padding: 26px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 25px 70px -20px rgba(8, 27, 54, 0.45);
  position: relative;
}

.customer-inspect-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.customer-inspect-avatar {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  background: linear-gradient(160deg, #dfeeff, #cfe0ff);
  display: grid;
  text-align: center;
  place-items: center;
  color: var(--navy);
  font: 600 0.9rem var(--ff-display);
  overflow: hidden;
}

.customer-inspect-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.customer-inspect-header h3 {
  font-size: 1.4rem;
  margin-top: 4px;
}

.customer-inspect-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.customer-inspect-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px;
  background: var(--bg);
}

.card-label {
  display: block;
  color: var(--ink-soft);
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  margin-bottom: 10px;
}

.customer-inspect-card p {
  color: var(--ink-soft);
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.identity-check strong {
  color: var(--navy);
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.document-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
}

.document-preview {
  display: block;
  width: 100%;
  height: 160px;
  background: #edf3fb;
  border: 0;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
}

.document-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.document-details {
  display: grid;
  gap: 4px;
  padding: 12px 14px 14px;
}

.document-details span,
.document-details small {
  color: var(--ink-soft);
  font-size: 0.72rem;
}

.document-details strong {
  color: var(--navy);
  font-size: 0.82rem;
}

.no-documents {
  min-height: 120px;
  color: var(--ink-soft);
}

.image-preview-panel {
  width: min(100%, 760px);
  position: relative;
  border-radius: 18px;
  background: #fff;
  padding: 18px;
  box-shadow: 0 25px 70px -20px rgba(8, 27, 54, 0.45);
}

.image-preview-panel img {
  width: 100%;
  max-height: 74vh;
  object-fit: contain;
  border-radius: 12px;
  display: block;
}

.dialog-close {
  position: absolute;
  top: 14px;
  right: 16px;
  color: var(--ink-soft);
  font-size: 1.5rem;
  line-height: 1;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.panel-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.motorcycle-form-panel {
  margin-bottom: 18px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: linear-gradient(180deg, #f8fbff, #ffffff);
}

.motorcycle-form-header {
  margin-bottom: 14px;
}

.motorcycle-form-header h3 {
  margin-top: 6px;
  font-size: 1.1rem;
}

.motorcycle-form {
  display: grid;
  gap: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-field {
  display: grid;
  gap: 6px;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  color: var(--navy);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 10px 12px;
  background: #fff;
  color: var(--navy);
  font: inherit;
}

.form-field textarea {
  resize: vertical;
  min-height: 100px;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  outline: 2px solid rgba(58, 113, 221, 0.22);
  border-color: var(--blue);
}

.motorcycle-form-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.form-message {
  padding: 10px 12px;
  border-radius: 10px;
  margin-bottom: 14px;
  font-size: 0.8rem;
}

.form-message.error {
  background: #fff0ed;
  color: #a33b32;
  border: 1px solid rgba(163, 59, 50, 0.2);
}

.form-message.success {
  background: #eafaf1;
  color: #18734d;
  border: 1px solid rgba(24, 115, 77, 0.2);
}

.table-status.available,
.table-status.verified {
  background: #e7f7ef;
  color: #18734d;
}
.table-status.rented {
  background: #e4edff;
  color: #2457c5;
}
.table-status.maintenance {
  background: #fff4dc;
  color: #a96c11;
}
.table-status.inactive,
.table-status.refunded {
  background: #f0f2f5;
  color: #667085;
}
.table-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.bike-year {
  display: block;
  color: var(--ink-soft);
  font-weight: 500;
  font-size: 0.66rem;
  margin-top: 2px;
}
.status-select {
  border: 1px solid var(--line);
  border-radius: 7px;
  padding: 6px 8px;
  font-size: 0.72rem;
  background: #fff;
  color: var(--navy);
}
.fleet-chips {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}
.fleet-chip {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px 14px;
  border-left: 4px solid #c8d0dc;
}
.fleet-chip strong,
.fleet-chip span {
  display: block;
}
.fleet-chip strong {
  font-size: 1.3rem;
  color: var(--navy);
}
.fleet-chip span {
  font-size: 0.68rem;
  color: var(--ink-soft);
}
.fleet-chip.available { border-left-color: #2f9e6f; }
.fleet-chip.rented { border-left-color: #2f66d9; }
.fleet-chip.maintenance { border-left-color: #e0a030; }
.fleet-chip.inactive { border-left-color: #b5bdc9; }
.status-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.status-filters button {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--ink-soft);
  cursor: pointer;
}
.status-filters button.active {
  background: var(--navy);
  border-color: var(--navy);
  color: #fff;
}
.analytics {
  display: grid;
  gap: 16px;
}
.analytics-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.analytics-note {
  color: var(--ink-soft);
  font-size: 0.74rem;
}
.report-grid-4 {
  grid-template-columns: repeat(4, 1fr);
}
.report-grid small {
  display: block;
  color: var(--ink-soft);
  font-size: 0.66rem;
  margin-top: 6px;
}
.analytics-columns {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 14px;
}
.analytics-columns.three {
  grid-template-columns: repeat(3, 1fr);
}
.analytics-card {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 18px;
  min-width: 0;
}
.analytics-card h3 {
  font-size: 0.82rem;
  color: var(--navy);
  margin-bottom: 14px;
}
.analytics-empty {
  color: var(--ink-soft);
  font-size: 0.74rem;
}
.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  min-height: 190px;
  overflow-x: auto;
}
.bar-col {
  flex: 1;
  min-width: 56px;
  display: grid;
  justify-items: center;
  gap: 6px;
}
.bar-track {
  width: 100%;
  max-width: 54px;
  height: 130px;
  display: flex;
  align-items: flex-end;
  background: #f1f4f9;
  border-radius: 6px;
  overflow: hidden;
}
.bar-track i {
  width: 100%;
  background: var(--blue);
  border-radius: 6px 6px 0 0;
}
.bar-value {
  font-size: 0.64rem;
  font-weight: 700;
  color: var(--navy);
}
.bar-label {
  font-size: 0.66rem;
  color: var(--ink-soft);
}
.mini-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--line);
  font-size: 0.76rem;
  color: var(--ink-soft);
}
.mini-row:last-child {
  border-bottom: 0;
}
.mini-row b {
  color: var(--navy);
}
.mini-row small {
  display: block;
  font-size: 0.64rem;
}
.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  background: #b5bdc9;
}
.dot.available { background: #2f9e6f; }
.dot.rented { background: #2f66d9; }
.dot.maintenance { background: #e0a030; }
.hbar-row {
  display: grid;
  grid-template-columns: 90px 1fr auto;
  align-items: center;
  gap: 10px;
  margin-bottom: 11px;
  font-size: 0.72rem;
}
.hbar-row b {
  color: var(--navy);
}
.method-name {
  color: var(--ink-soft);
}
.hbar {
  height: 8px;
  background: #edf1f7;
  border-radius: 9px;
  overflow: hidden;
}
.hbar i {
  display: block;
  height: 100%;
  background: var(--blue);
  border-radius: inherit;
}
@media (max-width: 900px) {
  .report-grid-4,
  .fleet-chips {
    grid-template-columns: repeat(2, 1fr);
  }
  .analytics-columns,
  .analytics-columns.three {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .report-grid {
    grid-template-columns: 1fr;
  }

  .customer-inspect-grid {
    grid-template-columns: 1fr;
  }

  .panel-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .customer-table-scroll {
    overflow: visible;
  }

  .customer-table {
    display: block;
    white-space: normal;
  }

  .customer-table thead {
    display: none;
  }

  .customer-table tbody,
  .customer-table tr {
    display: block;
  }

  .customer-table tr {
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
  }

  .customer-table tr:last-child {
    border-bottom: 0;
  }

  .customer-table td {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 5px 0;
    border: 0;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .customer-table td::before {
    content: attr(data-label);
    flex: 0 0 78px;
    color: #919baa;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-align: left;
    text-transform: uppercase;
  }

  .customer-table .customer-docs-cell {
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .customer-table .customer-docs-cell::before {
    margin-right: auto;
  }

  .customer-table .table-status {
    margin-left: auto;
  }

  .booking-table-scroll,
  .payment-table-scroll,
  .motorcycle-table-scroll {
    overflow: visible;
  }

  .booking-table,
  .payment-table,
  .motorcycle-table {
    display: block;
    white-space: normal;
  }

  .booking-table thead,
  .payment-table thead,
  .motorcycle-table thead {
    display: none;
  }

  .booking-table tbody,
  .booking-table tr,
  .payment-table tbody,
  .payment-table tr,
  .payment-table tr,
  .motorcycle-table tbody,
  .motorcycle-table tr {
    display: block;
  }

  .booking-table tr,
  .payment-table tr,
  .motorcycle-table tr {
    padding: 14px 0;
    border-bottom: 1px solid var(--line);
  }

  .booking-table tr:last-child,
  .payment-table tr:last-child,
  .motorcycle-table tr:last-child {
    border-bottom: 0;
  }

  .booking-table td,
  .payment-table td,
  .motorcycle-table td {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    width: 100%;
    padding: 5px 0;
    border: 0;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .booking-table td::before,
  .payment-table td::before,
  .motorcycle-table td::before {
    content: attr(data-label);
    flex: 0 0 88px;
    color: #919baa;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-align: left;
    text-transform: uppercase;
  }

  .booking-table .table-status,
  .payment-table .table-status,
  .motorcycle-table .table-status {
    margin-left: auto;
  }

  .booking-table .booking-dates {
    flex: 1 1 auto;
    max-width: 100%;
    text-align: right;
    white-space: normal;
  }

  .booking-table td:last-child {
    flex-wrap: wrap;
  }

  .booking-table td:last-child::before {
    margin-right: auto;
  }

  .report-grid div {
    padding: 16px;
  }

  .report-grid strong {
    overflow-wrap: anywhere;
  }

  .management-panel .table-action {
    padding: 5px 0;
  }

  .management-panel .table-action:focus-visible {
    outline: 2px solid var(--blue);
    outline-offset: 3px;
  }
}
</style>
