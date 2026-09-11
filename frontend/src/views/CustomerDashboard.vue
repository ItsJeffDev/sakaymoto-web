<script setup>
import { Bell, CalendarDays, ChevronRight, CircleHelp, ClipboardList, LayoutDashboard, LogOut, Menu, Settings, UserRound, X } from 'lucide-vue-next'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { useAuthStore } from '../stores/auth'

const isMenuOpen = ref(false)
const activeSection = ref('Dashboard')
const isLoading = ref(true)
const loadError = ref('')
const auth = useAuthStore()
const router = useRouter()
const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '')
const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'My bookings', icon: ClipboardList },
  { label: 'Profile & account', icon: UserRound },
  { label: 'Notifications', icon: Bell, count: 3 },
  { label: 'Settings', icon: Settings },
]
const sectionContent = {
  'My bookings': { eyebrow: 'Ride history', title: 'Your bookings', description: 'Keep track of upcoming rides and revisit your rental history.', action: 'Find another ride', items: ['Honda Click 160 - Confirmed', 'Yamaha NMAX - Completed'] },
  'Profile & account': { eyebrow: 'Personal details', title: 'Profile & account', description: 'Manage the information used for bookings and rider verification.', action: 'Edit profile', items: ['Juan Dela Cruz', 'juan.delacruz@email.com', 'Verified rider'] },
  Notifications: { eyebrow: 'Stay in the loop', title: 'Your notifications', description: 'Updates about your bookings, payments, and new rides near you.', action: 'Mark all as read', items: ['Your Honda Click 160 booking is confirmed', 'Three new rides were added in Makati', 'Leave a review for your last booking'] },
  Settings: { eyebrow: 'Preferences', title: 'Account settings', description: 'Control your alerts, privacy, and account preferences.', action: 'Save changes', items: ['Booking reminders', 'Promotional updates', 'Two-factor authentication'] },
}
const bookings = ref([])
const bookingCount = computed(() => bookings.value.length)
const upcomingCount = computed(() => bookings.value.filter((booking) => ['pending', 'confirmed'].includes(booking.status)).length)
const profile = reactive({ name: '', email: '', phone: '', address: '', profile_image: '' })
const profileImageFile = ref(null)
const documents = ref([])
const selectedDocument = ref(null)
const documentType = ref('drivers_license')
const isSaving = ref(false)
const actionMessage = ref('')
const actionError = ref('')
const displayName = computed(() => auth.user?.name || profile.name || 'Rider')
const initials = computed(() => displayName.value.split(' ').filter(Boolean).slice(0, 2).map((name) => name[0]).join('').toUpperCase() || 'R')
const profileImageSrc = computed(() => {
  if (!profile.profile_image) return ''
  const imagePath = profile.profile_image.startsWith('/') ? profile.profile_image : `/${profile.profile_image}`
  return `${apiBaseUrl}${imagePath}`
})

async function loadDashboard() {
  isLoading.value = true
  loadError.value = ''
  try {
    const response = await api.bookings()
    bookings.value = response.data || []
  } catch (error) {
    loadError.value = error.message
  } finally {
    isLoading.value = false
  }
}

function selectSection(label) {
  activeSection.value = label
  isMenuOpen.value = false
  actionMessage.value = ''
  actionError.value = ''
  if (label === 'Profile & account') loadProfile()
  if (label === 'Notifications') loadDocuments()
}

async function loadProfile() {
  try {
    const response = await api.profile()
    Object.assign(profile, response.data)
    auth.user = response.data
    localStorage.setItem('sakaymoto_user', JSON.stringify(response.data))
  } catch (error) {
    actionError.value = error.message
  }
}

async function loadDocuments() {
  try {
    const response = await api.documents()
    documents.value = response.data || []
  } catch (error) {
    actionError.value = error.message
  }
}

async function saveProfile() {
  isSaving.value = true
  actionError.value = ''
  try {
    const formData = new FormData()
    formData.append('name', profile.name)
    formData.append('phone', profile.phone || '')
    formData.append('address', profile.address || '')

    if (profileImageFile.value) {
      formData.append('profile_image', profileImageFile.value)
    }

    const response = await api.updateProfile(formData)
    Object.assign(profile, response.data)
    profileImageFile.value = null
    actionMessage.value = 'Profile updated successfully.'
  } catch (error) {
    actionError.value = error.message
  } finally {
    isSaving.value = false
  }
}

async function uploadDocument() {
  if (!selectedDocument.value) return
  isSaving.value = true
  actionError.value = ''
  const formData = new FormData()
  formData.append('document', selectedDocument.value)
  formData.append('document_type', documentType.value)
  try {
    await api.uploadDocument(formData)
    selectedDocument.value = null
    actionMessage.value = 'Document uploaded for verification.'
    await loadDocuments()
  } catch (error) {
    actionError.value = error.message
  } finally {
    isSaving.value = false
  }
}

async function submitPayment(booking) {
  isSaving.value = true
  actionError.value = ''
  try {
    await api.payment({ booking_id: booking.id, payment_method: 'cash', amount: booking.total_price })
    actionMessage.value = 'Payment submitted for verification.'
    await loadDashboard()
  } catch (error) {
    actionError.value = error.message
  } finally {
    isSaving.value = false
  }
}

function logout() {
  auth.logout()
  router.push('/')
}

onMounted(async () => {
  await auth.hydrate()
  await loadDashboard()
  await loadProfile()
})

</script>

<template>
  <div class="dashboard-frame customer-frame">
    <aside class="dashboard-sidebar" :class="{ open: isMenuOpen }">
      <div class="dashboard-brand">Sakay<span>Moto</span></div>
      <div class="profile-mini">
        <div class="avatar avatar-coral">{{ initials }}</div>
        <div><strong>{{ displayName }}</strong><span>Rider account</span></div>
      </div>
      <nav class="dashboard-nav" aria-label="Customer navigation">
        <button v-for="item in navItems" :key="item.label" type="button"
          :class="{ active: activeSection === item.label }" @click="selectSection(item.label)">
          <component :is="item.icon" :size="18" /><span>{{ item.label }}</span><b v-if="item.count">{{ item.count }}</b>
        </button>
      </nav>
      <div class="sidebar-bottom"><a href="#">
          <CircleHelp :size="18" />Help center
        </a><a href="/" @click.prevent="logout">
          <LogOut :size="18" />Log out
        </a></div>
      <button class="sidebar-close" type="button" aria-label="Close navigation" @click="isMenuOpen = false">
        <X :size="20" />
      </button>
    </aside>
    <main class="dashboard-main">
      <header class="dashboard-topbar"><button class="mobile-menu" type="button" aria-label="Open navigation"
          @click="isMenuOpen = true">
          <Menu :size="21" />
        </button>
        <div>
          <p class="dashboard-kicker">Monday, September 7, 2026</p>
          <h1>{{ activeSection === 'Dashboard' ? `Good morning, ${displayName.split(' ')[0]}` : activeSection }}</h1>
        </div>
        <div class="topbar-actions"><button class="icon-button has-dot" type="button" aria-label="Notifications"
            @click="selectSection('Notifications')">
            <Bell :size="20" />
          </button>
          <div v-if="profileImageSrc" class="avatar avatar-image">
            <img :src="profileImageSrc" alt="Profile photo" />
          </div>
          <div v-else class="avatar avatar-coral">{{ initials }}</div>
        </div>
      </header>
      <div v-if="activeSection === 'Dashboard' && isLoading" class="dashboard-content dashboard-state">
        <div class="state-spinner"></div>
        <p>Loading your rental activity...</p>
      </div>
      <div v-else-if="activeSection === 'Dashboard' && loadError" class="dashboard-content dashboard-state">
        <div class="state-icon error">!</div>
        <h2>We couldn't load your dashboard</h2>
        <p>{{ loadError }}</p><button class="btn btn-navy btn-sm" type="button" @click="loadDashboard">Try
          again</button>
      </div>
      <div v-else-if="activeSection === 'Dashboard'" class="dashboard-content">
        <section class="welcome-panel">
          <div><span class="eyebrow">Your next adventure</span>
            <h2>Ready for the open road?</h2>
            <p>Find a ride that fits your plans and book it in a few taps.</p><a href="#"
              class="btn btn-primary btn-sm">Browse motorcycles
              <ChevronRight :size="16" />
            </a>
          </div>
          <div class="welcome-mark">
            <CalendarDays :size="60" stroke-width="1.2" />
          </div>
        </section>
        <div class="stat-grid">
          <article class="stat-card"><span class="stat-icon blue">
              <ClipboardList :size="19" />
            </span>
            <div><strong>{{ bookingCount }}</strong><span>Total bookings</span></div><small>Your rental history</small>
          </article>
          <article class="stat-card"><span class="stat-icon orange">
              <CalendarDays :size="19" />
            </span>
            <div><strong>{{ upcomingCount }}</strong><span>Upcoming rides</span></div><small>Pending or
              confirmed</small>
          </article>
          <article class="stat-card"><span class="stat-icon green">
              <UserRound :size="19" />
            </span>
            <div><strong>--</strong><span>Rider rating</span></div><small>Complete a ride to review</small>
          </article>
        </div>
        <div class="dashboard-columns">
          <section class="dashboard-panel">
            <div class="panel-heading">
              <div><span class="panel-label">Activity</span>
                <h2>Recent bookings</h2>
              </div> <button class="text-button" type="button" @click="selectSection('My bookings')"> View all
              </button>
            </div>
            <div v-if="!bookings.length" class="panel-empty">
              <ClipboardList :size="24" />
              <p>No bookings yet. Your rental activity will appear here.</p>
            </div>
            <div v-else class="booking-list">
              <div v-for="booking in bookings.slice(0, 3)" :key="booking.id" class="booking-row">
                <div class="bike-thumb"><span>SM</span></div>
                <div class="booking-info"><strong>{{ booking.brand }} {{ booking.model }}</strong><span>{{
                    booking.start_date }} - {{ booking.end_date }}</span></div>
                <div class="booking-status" :class="booking.status">{{ booking.status }}</div><strong
                  class="booking-amount">PHP {{ Number(booking.total_price).toLocaleString() }}</strong>
                <ChevronRight class="row-arrow" :size="17" />
              </div>
            </div>
          </section>
          <section class="dashboard-panel notifications-panel">
            <div class="panel-heading">
              <div><span class="panel-label">Stay in the loop</span>
                <h2>Booking updates</h2>
              </div><button class="text-button" type="button" @click="selectSection('Notifications')">View all</button>
            </div>
            <div v-if="!bookings.length" class="panel-empty">
              <Bell :size="24" />
              <p>No new booking updates.</p>
            </div>
            <div v-else class="notice"><span class="notice-dot orange"></span>
              <div><strong>{{ bookings[0].brand }} {{ bookings[0].model }} is {{ bookings[0].status }}</strong>
                <p>Booking #{{ bookings[0].id }} is in your rental history.</p><small>Updated recently</small>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div v-else class="dashboard-content customer-subpage">
        <section class="dashboard-panel subpage-panel">
          <div class="panel-heading">
            <div><span class="panel-label">{{ sectionContent[activeSection].eyebrow }}</span>
              <h2>{{ sectionContent[activeSection].title }}</h2>
            </div>
          </div>
          <p v-if="actionMessage" class="form-message success">{{ actionMessage }}</p>
          <p v-if="actionError" class="form-message error">{{ actionError }}</p>
          <template v-if="activeSection === 'My bookings'">
            <p class="subpage-description">Keep track of upcoming rides, payments, and your rental history.</p>
            <div v-if="!bookings.length" class="panel-empty">
              <ClipboardL`ist :size="24" />
              <p>No bookings yet. Browse available motorcycles to get started.</p>
            </div>
            <div v-else class="subpage-bookings">
              <div v-for="booking in bookings" :key="booking.id" class="subpage-booking">
                <div><strong>{{ booking.brand }} {{ booking.model }}</strong><span>{{ booking.start_date }} to {{
                    booking.end_date }} · {{ booking.status }}</span></div><b>PHP {{
                      Number(booking.total_price).toLocaleString() }}</b><button
                  v-if="booking.status === 'confirmed' && !booking.payment_id" class="btn btn-navy btn-sm" type="button"
                  :disabled="isSaving" @click="submitPayment(booking)">Pay now</button>
              </div>
            </div>
          </template>
          <template v-else-if="activeSection === 'Profile & account'">
            <p class="subpage-description">Keep your contact information current for booking and verification.</p>
            <form class="profile-form" @submit.prevent="saveProfile">
              <div class="profile-photo-preview">
                <div v-if="profileImageSrc" class="avatar avatar-image avatar-large">
                  <img :src="profileImageSrc" alt="Profile photo preview" />
                </div>
                <div v-else class="avatar avatar-coral avatar-large">{{ initials }}</div>
                <label class="file-input profile-upload">
                  Upload profile photo
                  <input type="file" accept="image/*" @change="profileImageFile = $event.target.files[0]" />
                </label>
              </div>
              <label>Full name<input v-model="profile.name" required /></label>
              <label>Email address<input :value="profile.email" type="email" disabled /></label>
              <label>Phone<input v-model="profile.phone" type="tel" placeholder="09XX XXX XXXX" /></label>
              <label>Address<input v-model="profile.address" placeholder="Your address" /></label>
              <button class="btn btn-primary btn-sm" type="submit" :disabled="isSaving">{{ isSaving ? 'Saving...' : 'Save profile' }}</button>
            </form>
          </template>
          <template v-else-if="activeSection === 'Notifications'">
            <p class="subpage-description">Booking updates and verification notices appear here.</p>
            <div class="document-upload"><label>Document type<select v-model="documentType">
                  <option value="drivers_license">Driver's license</option>
                  <option value="valid_id">Valid ID</option>
                  <option value="other">Other</option>
                </select></label><label class="file-input">Upload requirement<input type="file" accept="image/*,.pdf"
                  @change="selectedDocument = $event.target.files[0]" /></label><button class="btn btn-primary btn-sm"
                type="button" :disabled="!selectedDocument || isSaving" @click="uploadDocument">{{ isSaving ?
                  'Uploading...' : 'Upload document' }}</button></div>
            <div class="customer-detail-list">
              <div v-for="document in documents" :key="document.id" class="customer-detail-row"><span
                  class="detail-number">{{ document.document_type }}</span><strong>{{ document.status
                  }}</strong><span>{{ document.uploaded_at?.slice(0, 10) }}</span></div>
              <div v-if="!documents.length" class="panel-empty">
                <Bell :size="24" />
                <p>No documents submitted yet.</p>
              </div>
            </div>
          </template>
          <template v-else>
            <p class="subpage-description">Review the account preferences supported by your SakayMoto profile.</p>
            <div class="customer-detail-list">
              <div class="customer-detail-row"><span class="detail-number">01</span><strong>Booking
                  reminders</strong><span class="setting-state">On</span></div>
              <div class="customer-detail-row"><span class="detail-number">02</span><strong>Account
                  verification</strong><span class="setting-state">Required</span></div>
            </div>
          </template>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.customer-frame {
  --dashboard-accent: var(--orange);
}

.customer-subpage {
  min-height: calc(100vh - 104px);
  display: grid;
  align-content: start;
}

.subpage-panel {
  min-height: 360px;
}

.subpage-description {
  max-width: 560px;
  color: var(--ink-soft);
  font-size: .9rem;
  margin: 8px 0 26px;
}

.customer-detail-list {
  display: grid;
  max-width: 720px;
  border-top: 1px solid var(--line);
}

.customer-detail-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 4px;
  border-bottom: 1px solid var(--line);
  color: var(--navy);
}

.customer-detail-row strong {
  flex: 1;
  font-size: .86rem;
}

.customer-detail-row svg {
  color: #aab3c0;
}

.detail-number {
  color: var(--orange);
  font: 700 .7rem var(--ff-display);
}

.dashboard-state {
  min-height: calc(100vh - 104px);
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
  color: var(--ink-soft);
  gap: 12px;
}

.dashboard-state h2 {
  color: var(--navy);
  font-size: 1.2rem;
}

.dashboard-state p {
  max-width: 360px;
  font-size: .84rem;
}

.state-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--blue-soft);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: dashboard-spin .8s linear infinite;
}

.state-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font: 700 1rem var(--ff-display);
}

.state-icon.error {
  color: #a33b32;
  background: #fff0ed;
}

.panel-empty {
  min-height: 130px;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 8px;
  color: #9ba5b4;
  text-align: center;
}

.panel-empty p {
  max-width: 230px;
  font-size: .76rem;
}

@keyframes dashboard-spin {
  to {
    transform: rotate(360deg);
  }
}

.subpage-bookings {
  display: grid;
  border-top: 1px solid var(--line);
}

.subpage-booking {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 20px;
  padding: 17px 4px;
  border-bottom: 1px solid var(--line);
}

.subpage-booking div {
  display: grid;
  gap: 4px;
}

.subpage-booking strong {
  color: var(--navy);
  font-size: .86rem;
}

.subpage-booking span {
  color: var(--ink-soft);
  font-size: .75rem;
}

.subpage-booking b {
  color: var(--navy);
  font-size: .82rem;
}

.profile-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
  max-width: 680px;
}

.profile-form label,
.document-upload label {
  display: grid;
  gap: 7px;
  color: var(--navy);
  font: 600 .76rem var(--ff-display);
}

.profile-form input,
.document-upload input,
.document-upload select {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: 9px;
  color: var(--ink);
  background: #fff;
  font: 400 .84rem var(--ff-body);
}

.profile-form input:disabled {
  background: var(--bg);
  color: var(--ink-soft);
}

.profile-form button {
  justify-self: start;
}

.document-upload {
  display: grid;
  grid-template-columns: 180px 1fr auto;
  align-items: end;
  gap: 14px;
  margin-bottom: 25px;
}

.file-input input {
  padding: 8px 10px;
}

.setting-state {
  color: #26976a;
  font-size: .75rem;
}

.welcome-panel {
  background: var(--navy);
  border-radius: 18px;
  padding: 30px 34px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
}

.welcome-panel h2 {
  color: #fff;
  font-size: 1.75rem;
  margin: 2px 0 8px;
}

.welcome-panel p {
  color: rgba(255, 255, 255, .7);
  font-size: .91rem;
  margin-bottom: 20px;
}

.welcome-panel .eyebrow {
  color: #ffc0ad;
  background: rgba(255, 255, 255, .1);
  margin-bottom: 10px;
}

.welcome-mark {
  display: grid;
  place-items: center;
  width: 150px;
  color: rgba(255, 255, 255, .17);
  transform: rotate(-12deg);
}

.welcome-panel::after {
  content: '';
  position: absolute;
  width: 230px;
  height: 230px;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 50%;
  right: 18px;
  top: -100px;
}

.booking-list {
  display: grid;
  gap: 2px;
}

.booking-row {
  display: grid;
  grid-template-columns: 48px 1fr auto 100px 18px;
  align-items: center;
  gap: 13px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.booking-row:last-child {
  border-bottom: 0;
}

.bike-thumb {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #e9effb;
  display: grid;
  place-items: center;
  color: var(--blue);
  font: 700 .72rem var(--ff-display);
}

.booking-info {
  display: grid;
  gap: 3px;
}

.booking-info strong,
.booking-amount {
  color: var(--navy);
  font-size: .87rem;
}

.booking-info span,
.notice p,
.notice small {
  color: var(--ink-soft);
  font-size: .76rem;
}

.booking-status {
  justify-self: start;
  padding: 5px 9px;
  border-radius: 6px;
  font-size: .68rem;
  font-weight: 700;
}

.booking-status.confirmed {
  color: #18734d;
  background: #e7f7ef;
}

.booking-status.completed {
  color: #667085;
  background: #f0f2f5;
}

.booking-amount {
  text-align: right;
}

.row-arrow {
  color: #aab3c0;
}

.notifications-panel .text-button {
  color: var(--blue);
  font-size: .74rem;
}

.notice {
  display: flex;
  gap: 13px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.notice:last-child {
  border-bottom: 0;
}

.notice>div {
  display: grid;
  gap: 3px;
}

.notice strong {
  font-size: .82rem;
  color: var(--navy);
}

.notice small {
  font-size: .68rem;
  color: #99a3b2;
  margin-top: 3px;
}

.notice-dot {
  flex: 0 0 9px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-top: 6px;
}

.notice-dot.orange {
  background: var(--orange);
}

.notice-dot.blue {
  background: var(--blue);
}

.notice-dot.green {
  background: #39a879;
}

@media (max-width: 760px) {
  .welcome-panel {
    padding: 25px;
  }

  .welcome-mark {
    position: absolute;
    right: -15px;
    opacity: .65;
  }

  .booking-row {
    grid-template-columns: 42px 1fr auto 16px;
    gap: 10px;
  }

  .bike-thumb {
    width: 42px;
    height: 42px;
  }

  .booking-status {
    grid-column: 2;
    grid-row: 2;
    justify-self: start;
  }

  .booking-amount {
    grid-column: 3;
    grid-row: 1 / span 2;
  }

  .row-arrow {
    grid-column: 4;
    grid-row: 1 / span 2;
  }
}

@media (max-width: 760px) {
  .subpage-booking {
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  .subpage-booking b {
    grid-column: 2;
    grid-row: 1;
  }

  .subpage-booking button {
    grid-column: 1 / -1;
    justify-self: start;
  }

  .profile-form {
    grid-template-columns: 1fr;
  }

  .document-upload {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
}
</style>