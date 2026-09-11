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
  Package,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminManagementPanel from '../components/dashboard/AdminManagementPanel.vue'
import { api } from '../services/api'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '')
const isMenuOpen = ref(false)
const activeSection = ref('Dashboard')
const isLoading = ref(true)
const error = ref('')
const metrics = ref({ customers: 0, motorcycles: 0, active_bookings: 0, verified_revenue: 0 })
const bookingRows = ref([])
const sections = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Customers', icon: Users },
  { label: 'Bookings', icon: ClipboardList },
  { label: 'Motorcycles', icon: Package },
  { label: 'Reports & analytics', icon: BarChart3 },
  { label: 'Notifications', icon: Bell },
  { label: 'Settings', icon: Settings },
]
const adminDisplayName = computed(() => auth.user?.name || 'SakayMoto Admin')
const adminInitials = computed(() => {
  const source = auth.user?.name || adminDisplayName.value
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase() || 'SA'
})
const profileImageSrc = computed(() => {
  if (!auth.user?.profile_image) return ''
  const imagePath = auth.user.profile_image.startsWith('/') ? auth.user.profile_image : `/${auth.user.profile_image}`
  return `${apiBaseUrl}${imagePath}`
})

function selectSection(label) {
  activeSection.value = label
  isMenuOpen.value = false
}

function logout() {
  auth.logout()
  router.push('/')
}

async function loadDashboard() {
  isLoading.value = true
  error.value = ''
  try {
    const [report, bookings] = await Promise.all([api.reports(), api.bookings()])
    metrics.value = report.data || metrics.value
    bookingRows.value = (bookings.data || []).slice(0, 8).map((booking) => ({
      id: booking.id,
      rider: booking.customer_name,
      bike: `${booking.brand} ${booking.model}`,
      date: booking.start_date,
      status: booking.status,
      amount: `PHP ${Number(booking.total_price).toLocaleString()}`,
    }))
  } catch (loadError) {
    error.value = loadError.message
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await auth.hydrate()
  loadDashboard()
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
        <div><strong>{{ adminDisplayName }}</strong><span>Operations team</span></div>
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
            Monday, September 7, 2026 <span class="live-chip"><i></i>All systems operational</span>
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
          <ChevronDown :size="16" class="topbar-chevron" />
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
            <button class="btn btn-navy btn-sm" type="button">
              <FileBarChart :size="16" /> Export report
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
                <strong>{{ metrics.motorcycles }}</strong
                ><span>Motorcycles listed</span>
              </div>
              <small>Active fleet</small>
            </article>
            <article class="stat-card">
              <span class="stat-icon purple"><BarChart3 :size="19" /></span>
              <div>
                <strong>PHP {{ Number(metrics.verified_revenue).toLocaleString() }}</strong
                ><span>Verified revenue</span>
              </div>
              <small>Payment total</small>
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
                <div class="donut">
                  <strong>{{ metrics.motorcycles }}</strong
                  ><span>listed</span>
                </div>
                <div class="fleet-legend">
                  <span
                    ><i class="available"></i>Active fleet <b>{{ metrics.motorcycles }}</b></span
                  ><span
                    ><i class="rented"></i>Active bookings
                    <b>{{ metrics.active_bookings }}</b></span
                  >
                </div>
              </div>
              <div class="fleet-footer">
                <span>Current records</span><strong>Live</strong>
                <div class="progress"><i></i></div>
              </div>
            </section>
          </div>
        </template>
      </div>
      <div
        v-else-if="
          ['Customers', 'Bookings', 'Motorcycles', 'Reports & analytics'].includes(activeSection)
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
  background:
    radial-gradient(circle at center, #fff 0 57%, transparent 58%),
    conic-gradient(var(--blue) 0 72%, #dce7fb 72% 100%);
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
  background: var(--blue);
}
.fleet-legend i.rented {
  background: #88a9ec;
}
.fleet-legend b {
  margin-left: auto;
  color: var(--navy);
}
.fleet-footer {
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
  width: 72%;
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
