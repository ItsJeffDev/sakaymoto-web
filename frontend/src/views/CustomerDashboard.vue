<script setup>
import { Bell, CalendarDays, ChevronRight, CircleHelp, ClipboardList, LayoutDashboard, LogOut, Menu, Settings, UserRound, X } from 'lucide-vue-next'
import { ref } from 'vue'

const isMenuOpen = ref(false)
const activeSection = ref('Dashboard')
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
const bookings = [
  { bike: 'Honda Click 160', date: 'Sep 14 - Sep 16, 2026', status: 'Confirmed', amount: 'PHP 1,800' },
  { bike: 'Yamaha NMAX', date: 'Aug 02 - Aug 04, 2026', status: 'Completed', amount: 'PHP 2,400' },
]

function selectSection(label) {
  activeSection.value = label
  isMenuOpen.value = false
}
</script>

<template>
  <div class="dashboard-frame customer-frame">
    <aside class="dashboard-sidebar" :class="{ open: isMenuOpen }">
      <div class="dashboard-brand">Sakay<span>Moto</span></div>
      <div class="profile-mini">
        <div class="avatar avatar-coral">JD</div>
        <div><strong>Juan Dela Cruz</strong><span>Rider account</span></div>
      </div>
      <nav class="dashboard-nav" aria-label="Customer navigation">
        <button v-for="item in navItems" :key="item.label" :class="{ active: activeSection === item.label }"
          @click="selectSection(item.label)">
          <component :is="item.icon" :size="18" /><span>{{ item.label }}</span><b v-if="item.count">{{ item.count }}</b>
        </button>
      </nav>
      <div class="sidebar-bottom"><a href="#">
          <CircleHelp :size="18" />Help center
        </a><a href="/">
          <LogOut :size="18" />Log out
        </a></div>
      <button class="sidebar-close" aria-label="Close navigation" @click="isMenuOpen = false">
        <X :size="20" />
      </button>
    </aside>
    <main class="dashboard-main">
      <header class="dashboard-topbar"><button class="mobile-menu" aria-label="Open navigation"
          @click="isMenuOpen = true">
          <Menu :size="21" />
        </button>
        <div>
          <p class="dashboard-kicker">Monday, September 7, 2026</p>
          <h1>{{ activeSection === 'Dashboard' ? 'Good morning, Juan' : activeSection }}</h1>
        </div>
        <div class="topbar-actions"><button class="icon-button has-dot" aria-label="Notifications"
            @click="selectSection('Notifications')">
            <Bell :size="20" />
          </button>
          <div class="avatar avatar-coral">JD</div>
        </div>
      </header>
      <div v-if="activeSection === 'Dashboard'" class="dashboard-content">
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
            <div><strong>12</strong><span>Total bookings</span></div><small>+2 this month</small>
          </article>
          <article class="stat-card"><span class="stat-icon orange">
              <CalendarDays :size="19" />
            </span>
            <div><strong>1</strong><span>Upcoming ride</span></div><small>Starts Sep 14</small>
          </article>
          <article class="stat-card"><span class="stat-icon green">
              <UserRound :size="19" />
            </span>
            <div><strong>4.9</strong><span>Rider rating</span></div><small>Top rated rider</small>
          </article>
        </div>
        <div class="dashboard-columns">
          <section class="dashboard-panel">
            <div class="panel-heading">
              <div><span class="panel-label">Activity</span>
                <h2>Recent bookings</h2>
              </div><a href="#">View all
                <ChevronRight :size="15" />
              </a>
            </div>
            <div class="booking-list">
              <div v-for="booking in bookings" :key="booking.bike" class="booking-row">
                <div class="bike-thumb"><span>SM</span></div>
                <div class="booking-info"><strong>{{ booking.bike }}</strong><span>{{ booking.date }}</span></div>
                <div class="booking-status" :class="booking.status.toLowerCase()">{{ booking.status }}</div><strong
                  class="booking-amount">{{ booking.amount }}</strong>
                <ChevronRight class="row-arrow" :size="17" />
              </div>
            </div>
          </section>
          <section class="dashboard-panel notifications-panel">
            <div class="panel-heading">
              <div><span class="panel-label">Stay in the loop</span>
                <h2>Notifications</h2>
              </div><button class="text-button">Mark all read</button>
            </div>
            <div class="notice"><span class="notice-dot orange"></span>
              <div><strong>Your booking is confirmed</strong>
                <p>Honda Click 160 is ready for pickup.</p><small>2 hours ago</small>
              </div>
            </div>
            <div class="notice"><span class="notice-dot blue"></span>
              <div><strong>New bikes near you</strong>
                <p>Three new rides were added in Makati.</p><small>Yesterday</small>
              </div>
            </div>
            <div class="notice"><span class="notice-dot green"></span>
              <div><strong>Thanks for riding with us</strong>
                <p>Leave a review for your last booking.</p><small>Sep 2, 2026</small>
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
              <ClipboardList :size="24" />
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
                <div class="profile-upload-wrap">
                  <label class="btn btn-secondary btn-sm profile-upload">
                    Change photo
                    <input type="file" accept="image/*" @change="profileImageFile = $event.target.files[0]" />
                  </label>
                  <small v-if="profileImageFile">Selected: {{ profileImageFile.name }}</small>
                </div>
              </div>
              <label>Full name<input v-model="profile.name" required /></label>
              <label>Email address<input :value="profile.email" type="email" disabled /></label>
              <label>Phone<input v-model="profile.phone" type="tel" placeholder="09XX XXX XXXX" /></label>
              <label>Address<input v-model="profile.address" placeholder="Your address" /></label>
              <button class="btn btn-primary btn-sm" type="submit" :disabled="isSaving">{{ isSaving ? 'Saving...' :
                'Save profile' }}</button>
            </form>
          </template>
          <template v-else-if="activeSection === 'Notifications'">
            <p class="subpage-description">Booking updates and verification notices appear here.</p>
            <div class="notification-list">
              <div v-for="item in notifications" :key="item.id" class="notice notification-item">
                <span class="notice-dot" :class="item.tone"></span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.description }}</p>
                  <small>{{ formatNotificationDate(item.date) }}</small>
                </div>
              </div>
              <div v-if="!notifications.length" class="panel-empty">
                <Bell :size="24" />
                <p>No notifications yet.</p>
              </div>
            </div>
          </template>
          <template v-else>
            <p class="subpage-description">Review the account preferences supported by your SakayMoto profile.</p>
            <div class="settings-grid">
              <div v-for="item in settingsList" :key="item.key" class="setting-card">
                <div class="setting-copy">
                  <strong>{{ item.label }}</strong>
                  <span>{{ item.description }}</span>
                </div>
                <button class="toggle-button" :class="{ active: item.enabled }" type="button"
                  @click="toggleSetting(item.key)">
                  <span>{{ item.enabled ? 'On' : 'Off' }}</span>
                </button>
              </div>
            </div>

            <div class="document-upload">
              <div v-if="editingDocumentId" class="document-edit-banner">
                Editing document #{{ editingDocumentId }}
                <button class="text-button doc-edit-button" type="button" @click="cancelDocumentEdit">Cancel</button>
              </div>
              <label>Document type<select v-model="documentType">
                  <option value="drivers_license">Driver's license</option>
                  <option value="valid_id">Valid ID</option>
                  <option value="other">Other</option>
                </select></label>
              <label class="file-input">Upload requirement<input type="file" accept="image/*,.pdf"
                  @change="handleDocumentSelection" /></label>

              <div v-if="selectedDocumentPreview" class="document-preview-box">
                <img :src="selectedDocumentPreview" alt="Selected document preview" />
              </div>
              <div v-else-if="selectedDocument" class="document-preview-box placeholder">
                <span>{{ selectedDocument.name }}</span>
              </div>

              <button class="btn btn-primary btn-sm" type="button" :disabled="!selectedDocument || isSaving"
                @click="uploadDocument">{{ isSaving ?
                  'Uploading...' : editingDocumentId ? 'Update document' : 'Upload document' }}</button>
            </div>

            <div class="customer-detail-list">
              <div v-for="document in documents" :key="document.id" class="customer-detail-row"><span
                  class="detail-number">{{ document.document_type }}</span><strong>{{ document.status
                  }}</strong><span>{{ document.uploaded_at?.slice(0, 10) }}</span><button
                  class="text-button doc-edit-button" type="button" @click="editDocument(document)">Edit</button></div>
              <div v-if="!documents.length" class="panel-empty">
                <Bell :size="24" />
                <p>No documents submitted yet.</p>
              </div>
              <div class="customer-detail-row"><span class="detail-number">01</span><strong>Booking
                  reminders</strong><span class="setting-state">{{ settings.bookingReminders ? 'On' : 'Off' }}</span>
              </div>
              <div class="customer-detail-row"><span class="detail-number">02</span><strong>Account
                  verification</strong><span class="setting-state" :class="verificationState.tone">{{
                  verificationState.label }}</span></div>
              <div class="customer-detail-row"><span class="detail-number">03</span><strong>Uploaded
                  documents</strong><span class="setting-state">{{ documents.length }}</span></div>
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
</style>