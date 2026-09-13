<script setup>
import { onMounted, ref, watch } from 'vue'
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
const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '')
const motorcycleForm = ref({
  brand: '',
  model: '',
  year: '',
  plate_number: '',
  color: '',
  price_per_day: '',
  status: 'available',
  description: '',
})
const customerDocuments = ref({})
const selectedUser = ref(null)
const selectedDocumentPreview = ref('')
const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '')

function getFileUrl(path) {
  if (!path) return ''
  return path.startsWith('http') ? path : `${apiBaseUrl}${path}`
}

function formatDocumentType(type) {
  return {
    drivers_license: "Driver's license",
    valid_id: 'Valid ID',
    other: 'Other document',
  }[type] || type || 'Document'
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
    (document) => ['drivers_license', 'valid_id'].includes(document.document_type) && document.status === 'verified',
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

  const { brand, model, year, plate_number, color, price_per_day, status, description } = motorcycleForm.value

  if (!brand || !model || !year || !plate_number || !color || !price_per_day) {
    formError.value = 'Please fill in all required motorcycle fields.'
    return
  }

  const yearValue = Number(year)
  const priceValue = Number(price_per_day)

  if (!Number.isInteger(yearValue) || yearValue < 2000 || yearValue > new Date().getFullYear() + 1) {
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

watch(() => props.section, load)
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
        <button class="text-button" type="button" @click="load">Refresh</button>
      </div>
      <button class="text-button" type="button" @click="load">Refresh</button>
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
            <input id="motorcycle-brand" v-model="motorcycleForm.brand" type="text" placeholder="Honda" />
          </div>
          <div class="form-field">
            <label for="motorcycle-model">Model</label>
            <input id="motorcycle-model" v-model="motorcycleForm.model" type="text" placeholder="Click 125" />
          </div>
          <div class="form-field">
            <label for="motorcycle-year">Year</label>
            <input id="motorcycle-year" v-model="motorcycleForm.year" type="number" min="2000" placeholder="2026" />
          </div>
          <div class="form-field">
            <label for="motorcycle-plate">Plate number</label>
            <input id="motorcycle-plate" v-model="motorcycleForm.plate_number" type="text" placeholder="ABC 1234" />
          </div>
          <div class="form-field">
            <label for="motorcycle-color">Color</label>
            <input id="motorcycle-color" v-model="motorcycleForm.color" type="text" placeholder="Black" />
          </div>
          <div class="form-field">
            <label for="motorcycle-price">Price per day</label>
            <input id="motorcycle-price" v-model="motorcycleForm.price_per_day" type="number" min="1" step="0.01" placeholder="850" />
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
          <button class="text-button" type="button" @click="showAddMotorcycleForm = false; resetMotorcycleForm()">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div v-else-if="section === 'Reports & analytics'" class="report-grid">
      <div>
        <strong>{{ report?.customers || 0 }}</strong
        ><span>Customers</span>
      </div>
      <div>
        <strong>{{ report?.active_bookings || 0 }}</strong
        ><span>Active bookings</span>
      </div>
      <div>
        <strong>PHP {{ Number(report?.verified_revenue || 0).toLocaleString() }}</strong
        ><span>Verified revenue</span>
      </div>
    </div>
    <div v-else-if="section === 'Customers'" class="table-scroll">
      <table>
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
            <td class="amount">{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone || 'Not provided' }}</td>
            <td>
              <span class="table-status" :class="getCustomerIdentitySummary(user.id).tone">
                {{ getCustomerIdentitySummary(user.id).label }}
              </span>
            </td>
            <td>
              <div class="customer-docs-cell">
                <span>{{ getCustomerDocuments(user.id).length }} uploaded</span>
                <button class="table-action" type="button" @click="inspectUser(user)">
                  Inspect
                </button>
              </div>
            </td>
            <td>{{ user.created_at?.slice(0, 10) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="management-state">No customers found.</p>
    </div>

    <div
      v-if="selectedUser"
      class="customer-inspect-overlay"
      @click.self="closeInspection"
    >
      <div class="customer-inspect-panel">
        <button class="dialog-close" type="button" aria-label="Close inspection" @click="closeInspection">
          ×
        </button>

        <div class="customer-inspect-header">
          <div class="customer-inspect-avatar">
            <img
              v-if="selectedUser.profile_image"
              :src="getFileUrl(selectedUser.profile_image)"
              :alt="`${selectedUser.name} profile`"
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
            <p>Joined {{ selectedUser.created_at?.slice(0, 10) }}</p>
          </div>
          <div class="customer-inspect-card">
            <span class="card-label">Verification</span>
            <p class="identity-check">
              <strong>{{ getCustomerIdentitySummary(selectedUser.id).label }}</strong>
            </p>
            <p>
              {{ getCustomerDocuments(selectedUser.id).length
                ? `${getCustomerDocuments(selectedUser.id).length} uploaded file(s)`
                : 'No uploaded files yet' }}
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
                <button class="table-action" type="button" @click="updateDocumentStatus(document.id, 'verified')">
                  Confirm
                </button>
                <button class="table-action danger" type="button" @click="updateDocumentStatus(document.id, 'rejected')">
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
    <div v-else-if="section === 'Bookings'" class="table-scroll">
      <table>
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
            <td class="amount">{{ booking.customer_name }}</td>
            <td>{{ booking.brand }} {{ booking.model }}</td>
            <td>{{ booking.start_date }} - {{ booking.end_date }}</td>
            <td>
              <span class="table-status" :class="booking.status">{{ booking.status }}</span>
            </td>
            <td>
              <button
                v-if="booking.status === 'pending'"
                class="table-action"
                type="button"
                @click="updateBooking(booking.id, 'confirmed')"
              >
                Approve</button
              ><button
                v-if="booking.status === 'pending'"
                class="table-action danger"
                type="button"
                @click="updateBooking(booking.id, 'cancelled')"
              >
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="management-state">No bookings found.</p>
    </div>
    <div v-else class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Motorcycle</th>
            <th>Plate number</th>
            <th>Price/day</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bike in rows" :key="bike.id">
            <td class="amount">{{ bike.brand || 'Unknown' }} {{ bike.model || '' }}</td>
            <td>{{ bike.plate_number || 'Not provided' }}</td>
            <td>{{ formatMotorcyclePrice(bike.price_per_day) }}</td>
            <td>
              <span class="table-status" :class="bike.status || 'pending'">{{ bike.status || 'Unknown' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="!rows.length" class="management-state">No motorcycles found.</p>
    </div>
  </section>
</template>

<style scoped>
.management-panel {
  width: 100%;
  max-width: 1100px;
  text-align: left;
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
  place-items: center;
  color: var(--navy);
  font: 700 1rem var(--ff-display);
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
@media (max-width: 700px) {
  .report-grid,
  .form-grid {
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
.table-status.cancelled {
  background: #fff0ed;
  color: #a33b32;
}
.management-panel .table-action {
  padding: 5px 0;
}
.management-panel .table-action:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 3px;
}
</style>
