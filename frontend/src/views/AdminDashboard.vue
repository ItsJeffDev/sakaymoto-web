<script setup>
import {
  Bell,
  BarChart3,
  ClipboardList,
  ChevronDown,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Menu,
  CreditCard,
  Package,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminManagementPanel from '../components/dashboard/AdminManagementPanel.vue'
import { api } from '../services/api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
  /\/api$/,
  '',
)
const isMenuOpen = ref(false)
const activeSection = ref('Dashboard')
const isLoading = ref(true)
const error = ref('')
const metrics = ref({
  customers: 0,
  motorcycles: 0,
  active_bookings: 0,
  verified_revenue: 0,
  pending_payments: 0,
  fleet: { total: 0, available: 0, rented: 0, maintenance: 0, inactive: 0, utilization: 0 },
})
const bookingRows = ref([])
const sections = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Customers', icon: Users },
  { label: 'Bookings', icon: ClipboardList },
  { label: 'Motorcycles', icon: Package },
  { label: 'Payments', icon: CreditCard },
  { label: 'Reports & analytics', icon: BarChart3 },
  { label: 'Notifications', icon: Bell },
  { label: 'Settings', icon: Settings },
]
const adminDisplayName = computed(() => auth.user?.name || 'SakayMoto Admin')
const adminInitials = computed(() => {
  const source = auth.user?.name || adminDisplayName.value
  return (
    source
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0])
      .join('')
      .toUpperCase() || 'SA'
  )
})
const profileImageSrc = computed(() => {
  if (!auth.user?.profile_image) return ''
  const imagePath = auth.user.profile_image.startsWith('/')
    ? auth.user.profile_image
    : `/${auth.user.profile_image}`
  return `${apiBaseUrl}${imagePath}`
})

const fleet = computed(() => metrics.value.fleet)
const fleetSegments = computed(() => [
  { key: 'available', label: 'Available', count: fleet.value.available },
  { key: 'rented', label: 'Rented now', count: fleet.value.rented },
  { key: 'maintenance', label: 'Maintenance', count: fleet.value.maintenance },
  { key: 'inactive', label: 'Inactive', count: fleet.value.inactive },
])
const fleetDonutStyle = computed(() => {
  const total = fleet.value.total
  if (!total) return { background: 'conic-gradient(#e3e8f0 0 100%)' }
  const colors = { available: '#2f9e6f', rented: '#2f66d9', maintenance: '#e0a030', inactive: '#b5bdc9' }
  let start = 0
  const stops = fleetSegments.value
    .filter((segment) => segment.count > 0)
    .map((segment) => {
      const end = start + (segment.count / total) * 100
      const stop = `${colors[segment.key]} ${start}% ${end}%`
      start = end
      return stop
    })
  return { background: `conic-gradient(${stops.join(', ')})` }
})

const currentDate = computed(() =>
  new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date()),
)

function selectSection(label) {
  activeSection.value = label
  // Coming back to the overview: pull fresh numbers instead of showing stale ones.
  if (label === 'Dashboard' && !isLoading.value) loadDashboard(true)
  isMenuOpen.value = false
}

function logout() {
  auth.logout()
  router.push('/')
}

async function loadDashboard(silent = false) {
  // silent = background refresh: no spinner, keep showing current data on failure.
  if (!silent) isLoading.value = true
  error.value = ''
  try {
    const [report, bookings] = await Promise.all([api.reports(), api.bookings()])
    metrics.value = { ...metrics.value, ...(report.data || {}) }
    bookingRows.value = (bookings.data || []).slice(0, 8).map((booking) => ({
      id: booking.id,
      rider: booking.customer_name,
      bike: `${booking.brand} ${booking.model}`,
      date: booking.start_date,
      status: booking.status,
      amount: `PHP ${Number(booking.total_price).toLocaleString()}`,
    }))
  } catch (loadError) {
    if (!silent) error.value = loadError.message
  } finally {
    isLoading.value = false
  }
}

const REFRESH_MS = 5000
let refreshTimer = null
const refreshIfVisible = () => {
  if (document.visibilityState === 'visible' && activeSection.value === 'Dashboard')
    loadDashboard(true)
}

onUnmounted(() => {
  clearInterval(refreshTimer)
  document.removeEventListener('visibilitychange', refreshIfVisible)
})

onMounted(async () => {
  loadDashboard()
  refreshTimer = setInterval(refreshIfVisible, REFRESH_MS)
  document.addEventListener('visibilitychange', refreshIfVisible)
})
</script>

<template>
  <div class="dashboard-frame admin-frame">
    <aside class="dashboard-sidebar admin-sidebar" :class="{ open: isMenuOpen }">
      <div class="dashboard-brand">Sakay<span>Moto</span><small>ADMIN CONSOLE</small></div>
      <div class="admin-profile">
        <div v-if="profileImageSrc" class="avatar avatar-image">
          <img :src="profileImageSrc" alt="Admin profile photo" />
        </div>
        <div v-else class="avatar avatar-blue">{{ adminInitials }}</div>
        <div>
          <strong>{{ adminDisplayName }}</strong
          ><span>Operations team</span>
        </div>
        <ShieldCheck :size="16" />
      </div>
      <nav class="dashboard-nav" aria-label="Admin navigation">
        <button
          v-for="item in sections"
          :key="item.label"
          type="button"
          :class="{ active: activeSection === item.label }"
          @click="selectSection(item.label)"
        >
          <component :is="item.icon" :size="18" /><span>{{ item.label }}</span
          ><b v-if="item.label === 'Notifications'">5</b>
        </button>
      </nav>
      <div class="sidebar-bottom">
        <a href="#"><FileBarChart :size="18" />System status <i></i></a
        ><a href="/" @click.prevent="logout"><LogOut :size="18" />Log out</a>
      </div>
      <button
        class="sidebar-close"
        type="button"
        aria-label="Close navigation"
        @click="isMenuOpen = false"
      >
        <X :size="20" />
      </button>
    </aside>

    <main class="dashboard-main">
      <header class="dashboard-topbar admin-topbar">
        <button
          class="mobile-menu"
          type="button"
          aria-label="Open navigation"
          @click="isMenuOpen = true"
        >
          <Menu :size="21" />
        </button>
        <div>
          <p class="dashboard-kicker">
            {{ currentDate }} <span class="live-chip"><i></i>All systems operational</span>
          </p>
          <h1>{{ activeSection === 'Dashboard' ? 'Overview' : activeSection }}</h1>
        </div>
        <div class="topbar-actions">
          <button
            class="icon-button has-dot"
            type="button"
            aria-label="Notifications"
            @click="selectSection('Notifications')"
          >
            <Bell :size="20" />
          </button>
          <div v-if="profileImageSrc" class="avatar avatar-image">
            <img :src="profileImageSrc" alt="Admin profile photo" />
          </div>
          <div v-else class="avatar avatar-blue">{{ adminInitials }}</div>
        </div>
      </header>

      <div v-if="activeSection === 'Dashboard'" class="dashboard-content">
        <section v-if="isLoading" class="dashboard-panel admin-state">
          <p>Loading live operations...</p>
        </section>
        <section v-else-if="error" class="dashboard-panel admin-state">
          <h2>Dashboard unavailable</h2>
          <p>{{ error }}</p>
          <button class="btn btn-navy btn-sm" type="button" @click="loadDashboard">
            Try again
          </button>
        </section>
        <template v-else>
          <section class="admin-toolbar">
            <div>
              <span class="panel-label">Command center</span>
              <p>Here is what's happening across SakayMoto today.</p>
            </div>
            <button class="btn btn-navy btn-sm" type="button" @click="selectSection('Reports & analytics')">
              <FileBarChart :size="16" /> View full report
            </button>
          </section>
          <div class="stat-grid admin-stat-grid">
            <article class="stat-card">
              <span class="stat-icon blue"><Users :size="19" /></span>
              <div>
                <strong>{{ metrics.customers }}</strong
                ><span>Total customers</span>
              </div>
              <small>Live database count</small>
            </article>
            <article class="stat-card">
              <span class="stat-icon orange"><ClipboardList :size="19" /></span>
              <div>
                <strong>{{ metrics.active_bookings }}</strong
                ><span>Active bookings</span>
              </div>
              <small>Pending or confirmed</small>
            </article>
            <article class="stat-card">
              <span class="stat-icon green"><Package :size="19" /></span>
              <div>
                <strong>{{ fleet.available }}</strong
                ><span>Available now</span>
              </div>
              <small>{{ fleet.rented }} rented · {{ fleet.maintenance }} in maintenance</small>
            </article>
            <article class="stat-card">
              <span class="stat-icon purple"><BarChart3 :size="19" /></span>
              <div>
                <strong>PHP {{ Number(metrics.verified_revenue).toLocaleString() }}</strong
                ><span>Verified revenue</span>
              </div>
              <small>
                {{ metrics.pending_payment_count || 0 }} pending
                (PHP {{ Number(metrics.pending_payments || 0).toLocaleString() }}) not counted
              </small>
            </article>
          </div>
          <div class="dashboard-columns admin-columns">
            <section class="dashboard-panel table-panel">
              <div class="panel-heading">
                <div>
                  <span class="panel-label">Live operations</span>
                  <h2>Recent bookings</h2>
                </div>
                <button class="text-button" type="button" @click="selectSection('Bookings')">
                  View all <ChevronDown :size="15" />
                </button>
              </div>
              <div v-if="!bookingRows.length" class="admin-state"><p>No bookings found.</p></div>
              <div v-else class="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Motorcycle</th>
                      <th>Pickup date</th>
                      <th>Status</th>
                      <th class="align-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in bookingRows" :key="row.id">
                      <td>
                        <div class="table-person">
                          <span class="avatar avatar-tiny">{{
                            row.rider
                              ?.split(' ')
                              .map((name) => name[0])
                              .join('')
                          }}</span
                          ><strong>{{ row.rider }}</strong>
                        </div>
                      </td>
                      <td>{{ row.bike }}</td>
                      <td>{{ row.date }}</td>
                      <td>
                        <span class="table-status" :class="row.status">{{ row.status }}</span>
                      </td>
                      <td class="align-right amount">{{ row.amount }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            <section class="dashboard-panel fleet-panel">
              <div class="panel-heading">
                <div>
                  <span class="panel-label">Fleet health</span>
                  <h2>Motorcycle status</h2>
                </div>
              </div>
              <div class="fleet-stat">
                <div class="donut" :style="fleetDonutStyle">
                  <strong>{{ fleet.total }}</strong
                  ><span>motorcycles</span>
                </div>
                <div class="fleet-legend">
                  <span v-for="segment in fleetSegments" :key="segment.key"
                    ><i :class="segment.key"></i>{{ segment.label }} <b>{{ segment.count }}</b></span
                  >
                </div>
              </div>
              <div class="fleet-footer">
                <span>Fleet utilization</span><strong>{{ fleet.utilization }}%</strong>
                <div class="progress"><i :style="{ width: fleet.utilization + '%' }"></i></div>
              </div>
            </section>
          </div>
        </template>
      </div>
      <div
        v-else-if="
          ['Customers', 'Bookings', 'Motorcycles', 'Payments', 'Reports & analytics'].includes(
            activeSection,
          )
        "
        class="dashboard-content management-content"
      >
        <AdminManagementPanel :section="activeSection" />
      </div>
      <div v-else class="dashboard-content empty-section">
        <div class="empty-icon">
          <component
            :is="sections.find((section) => section.label === activeSection)?.icon"
            :size="26"
          />
        </div>
        <span class="panel-label">Management workspace</span>
        <h2>{{ activeSection }}</h2>
        <p>This workspace is ready for your team's workflows.</p>
        <button class="btn btn-navy btn-sm" type="button" @click="selectSection('Dashboard')">
          Back to dashboard
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-frame {
  --dashboard-accent: var(--blue);
}
.admin-sidebar .dashboard-brand small {
  display: block;
  color: rgba(255, 255, 255, 0.42);
  font: 600 0.56rem var(--ff-body);
  letter-spacing: 0.15em;
  margin-top: 5px;
}
.admin-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 0 25px;
  margin: 0 0 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}
.admin-profile > div:nth-child(2) {
  display: grid;
  gap: 2px;
  flex: 1;
}
.admin-profile strong {
  font-size: 0.77rem;
}
.admin-profile span {
  color: rgba(255, 255, 255, 0.48);
  font-size: 0.68rem;
}
.admin-profile > svg {
  color: #7bd3b0;
}
.admin-profile .avatar,
.topbar-actions .avatar {
  overflow: hidden;
  border-radius: 50%;
}
.admin-profile .avatar img,
.topbar-actions .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.admin-topbar {
  border-bottom: 1px solid var(--line);
}
.live-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #277754;
  background: #e9f8f0;
  border-radius: 5px;
  padding: 4px 7px;
  font-size: 0.64rem;
  margin-left: 9px;
  vertical-align: 2px;
}
.live-chip i,
.sidebar-bottom i {
  width: 6px;
  height: 6px;
  display: inline-block;
  border-radius: 50%;
  background: #39a879;
}
.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 21px;
}
.admin-toolbar p {
  color: var(--ink-soft);
  font-size: 0.82rem;
  margin-top: 5px;
}
.admin-toolbar .btn {
  gap: 8px;
}
.admin-stat-grid {
  grid-template-columns: repeat(4, 1fr);
}
.admin-columns {
  grid-template-columns: minmax(0, 1.7fr) minmax(260px, 0.8fr);
}
.table-panel {
  min-width: 0;
}
.table-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}
th {
  color: #919baa;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid var(--line);
}
td {
  color: var(--ink-soft);
  font-size: 0.76rem;
  padding: 14px 10px;
  border-bottom: 1px solid var(--line);
}
tr:last-child td {
  border-bottom: 0;
}
.table-person {
  display: flex;
  align-items: center;
  gap: 9px;
}
.table-person strong {
  color: var(--navy);
  font-size: 0.76rem;
}
.avatar-tiny {
  width: 25px;
  height: 25px;
  font-size: 0.55rem;
}
.align-right {
  text-align: right;
}
.amount {
  color: var(--navy);
  font-weight: 700;
}
.table-status {
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 0.64rem;
  font-weight: 700;
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
.fleet-stat {
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 20px 5px 25px;
}
.donut {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  display: grid;
  place-content: center;
  text-align: center;
  position: relative;
}
.donut::before {
  content: '';
  position: absolute;
  inset: 16px;
  border-radius: 50%;
  background: #fff;
}
.donut strong,
.donut span {
  position: relative;
}
.donut strong {
  color: var(--navy);
  font: 700 1.55rem var(--ff-display);
  line-height: 1;
}
.donut span {
  color: var(--ink-soft);
  font-size: 0.67rem;
}
.fleet-legend {
  display: grid;
  gap: 12px;
  flex: 1;
}
.fleet-legend span {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ink-soft);
  font-size: 0.73rem;
}
.fleet-legend i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.fleet-legend i.available {
  background: #2f9e6f;
}
.fleet-legend i.rented {
  background: #2f66d9;
}
.fleet-legend i.maintenance {
  background: #e0a030;
}
.fleet-legend i.inactive {
  background: #b5bdc9;
}
.fleet-legend b {
  margin-left: auto;
  color: var(--navy);
}
.fleet-footer {
  flex-wrap: wrap;
  border-top: 1px solid var(--line);
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  color: var(--ink-soft);
  font-size: 0.76rem;
}
.fleet-footer strong {
  color: var(--navy);
}
.progress {
  width: 100%;
  height: 6px;
  background: #edf1f7;
  border-radius: 9px;
  margin-top: 12px;
  overflow: hidden;
}
.progress i {
  display: block;
  height: 100%;
  background: var(--blue);
  border-radius: inherit;
}
.admin-state {
  min-height: 220px;
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
  color: var(--ink-soft);
  gap: 10px;
}
.admin-state h2 {
  font-size: 1.1rem;
}
.admin-state p {
  font-size: 0.8rem;
}
.management-content {
  align-items: start;
}
.empty-section {
  min-height: 480px;
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
}
.empty-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 15px;
  background: var(--blue-soft);
  color: var(--blue);
  margin-bottom: 18px;
}
.empty-section h2 {
  margin: 8px 0;
}
.empty-section p {
  color: var(--ink-soft);
  max-width: 360px;
  font-size: 0.85rem;
  margin-bottom: 20px;
}
.sidebar-bottom a:first-child {
  display: flex;
  align-items: center;
  gap: 9px;
}
.sidebar-bottom a:first-child i {
  margin-left: auto;
}
.topbar-chevron {
  color: #9ca7b6;
}
@media (max-width: 1080px) {
  .admin-stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 760px) {
  .admin-toolbar {
    align-items: flex-start;
    gap: 14px;
    flex-direction: column;
  }
  .admin-toolbar .btn {
    align-self: stretch;
  }
  .live-chip {
    display: none;
  }
  .admin-stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .admin-columns {
    grid-template-columns: 1fr;
  }
  .fleet-panel {
    min-height: 0;
  }
}
</style>
