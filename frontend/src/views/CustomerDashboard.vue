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
      <div class="profile-mini"><div class="avatar avatar-coral">JD</div><div><strong>Juan Dela Cruz</strong><span>Rider account</span></div></div>
      <nav class="dashboard-nav" aria-label="Customer navigation">
        <button v-for="item in navItems" :key="item.label" :class="{ active: activeSection === item.label }" @click="selectSection(item.label)"><component :is="item.icon" :size="18" /><span>{{ item.label }}</span><b v-if="item.count">{{ item.count }}</b></button>
      </nav>
      <div class="sidebar-bottom"><a href="#"><CircleHelp :size="18" />Help center</a><a href="/"><LogOut :size="18" />Log out</a></div>
      <button class="sidebar-close" aria-label="Close navigation" @click="isMenuOpen = false"><X :size="20" /></button>
    </aside>
    <main class="dashboard-main">
      <header class="dashboard-topbar"><button class="mobile-menu" aria-label="Open navigation" @click="isMenuOpen = true"><Menu :size="21" /></button><div><p class="dashboard-kicker">Monday, September 7, 2026</p><h1>{{ activeSection === 'Dashboard' ? 'Good morning, Juan' : activeSection }}</h1></div><div class="topbar-actions"><button class="icon-button has-dot" aria-label="Notifications" @click="selectSection('Notifications')"><Bell :size="20" /></button><div class="avatar avatar-coral">JD</div></div></header>
      <div v-if="activeSection === 'Dashboard'" class="dashboard-content">
        <section class="welcome-panel"><div><span class="eyebrow">Your next adventure</span><h2>Ready for the open road?</h2><p>Find a ride that fits your plans and book it in a few taps.</p><a href="#" class="btn btn-primary btn-sm">Browse motorcycles <ChevronRight :size="16" /></a></div><div class="welcome-mark"><CalendarDays :size="60" stroke-width="1.2" /></div></section>
        <div class="stat-grid"><article class="stat-card"><span class="stat-icon blue"><ClipboardList :size="19" /></span><div><strong>12</strong><span>Total bookings</span></div><small>+2 this month</small></article><article class="stat-card"><span class="stat-icon orange"><CalendarDays :size="19" /></span><div><strong>1</strong><span>Upcoming ride</span></div><small>Starts Sep 14</small></article><article class="stat-card"><span class="stat-icon green"><UserRound :size="19" /></span><div><strong>4.9</strong><span>Rider rating</span></div><small>Top rated rider</small></article></div>
        <div class="dashboard-columns"><section class="dashboard-panel"><div class="panel-heading"><div><span class="panel-label">Activity</span><h2>Recent bookings</h2></div><a href="#">View all <ChevronRight :size="15" /></a></div><div class="booking-list"><div v-for="booking in bookings" :key="booking.bike" class="booking-row"><div class="bike-thumb"><span>SM</span></div><div class="booking-info"><strong>{{ booking.bike }}</strong><span>{{ booking.date }}</span></div><div class="booking-status" :class="booking.status.toLowerCase()">{{ booking.status }}</div><strong class="booking-amount">{{ booking.amount }}</strong><ChevronRight class="row-arrow" :size="17" /></div></div></section><section class="dashboard-panel notifications-panel"><div class="panel-heading"><div><span class="panel-label">Stay in the loop</span><h2>Notifications</h2></div><button class="text-button">Mark all read</button></div><div class="notice"><span class="notice-dot orange"></span><div><strong>Your booking is confirmed</strong><p>Honda Click 160 is ready for pickup.</p><small>2 hours ago</small></div></div><div class="notice"><span class="notice-dot blue"></span><div><strong>New bikes near you</strong><p>Three new rides were added in Makati.</p><small>Yesterday</small></div></div><div class="notice"><span class="notice-dot green"></span><div><strong>Thanks for riding with us</strong><p>Leave a review for your last booking.</p><small>Sep 2, 2026</small></div></div></section></div>
      </div>
      <div v-else class="dashboard-content customer-subpage">
        <section class="dashboard-panel subpage-panel">
          <div class="panel-heading"><div><span class="panel-label">{{ sectionContent[activeSection].eyebrow }}</span><h2>{{ sectionContent[activeSection].title }}</h2></div><button class="btn btn-primary btn-sm">{{ sectionContent[activeSection].action }}</button></div>
          <p class="subpage-description">{{ sectionContent[activeSection].description }}</p>
          <div class="customer-detail-list"><div v-for="(item, index) in sectionContent[activeSection].items" :key="item" class="customer-detail-row"><span class="detail-number">0{{ index + 1 }}</span><strong>{{ item }}</strong><ChevronRight :size="17" /></div></div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.customer-frame { --dashboard-accent: var(--orange); }
.welcome-panel { background: var(--navy); border-radius: 18px; padding: 30px 34px; color: #fff; display: flex; justify-content: space-between; overflow: hidden; position: relative; }.welcome-panel h2 { color: #fff; font-size: 1.75rem; margin: 2px 0 8px; }.welcome-panel p { color: rgba(255,255,255,.7); font-size: .91rem; margin-bottom: 20px; }.welcome-panel .eyebrow { color: #ffc0ad; background: rgba(255,255,255,.1); margin-bottom: 10px; }.welcome-mark { display: grid; place-items: center; width: 150px; color: rgba(255,255,255,.17); transform: rotate(-12deg); }.welcome-panel::after { content: ''; position: absolute; width: 230px; height: 230px; border: 1px solid rgba(255,255,255,.1); border-radius: 50%; right: 18px; top: -100px; }.booking-list { display: grid; gap: 2px; }.booking-row { display: grid; grid-template-columns: 48px 1fr auto 100px 18px; align-items: center; gap: 13px; padding: 14px 0; border-bottom: 1px solid var(--line); }.booking-row:last-child { border-bottom: 0; }.bike-thumb { width: 48px; height: 48px; border-radius: 12px; background: #e9effb; display: grid; place-items: center; color: var(--blue); font: 700 .72rem var(--ff-display); }.booking-info { display: grid; gap: 3px; }.booking-info strong, .booking-amount { color: var(--navy); font-size: .87rem; }.booking-info span, .notice p, .notice small { color: var(--ink-soft); font-size: .76rem; }.booking-status { justify-self: start; padding: 5px 9px; border-radius: 6px; font-size: .68rem; font-weight: 700; }.booking-status.confirmed { color: #18734d; background: #e7f7ef; }.booking-status.completed { color: #667085; background: #f0f2f5; }.booking-amount { text-align: right; }.row-arrow { color: #aab3c0; }.notifications-panel .text-button { color: var(--blue); font-size: .74rem; }.notice { display: flex; gap: 13px; padding: 14px 0; border-bottom: 1px solid var(--line); }.notice:last-child { border-bottom: 0; }.notice > div { display: grid; gap: 3px; }.notice strong { font-size: .82rem; color: var(--navy); }.notice small { font-size: .68rem; color: #99a3b2; margin-top: 3px; }.notice-dot { flex: 0 0 9px; width: 9px; height: 9px; border-radius: 50%; margin-top: 6px; }.notice-dot.orange { background: var(--orange); }.notice-dot.blue { background: var(--blue); }.notice-dot.green { background: #39a879; }
@media (max-width: 760px) { .welcome-panel { padding: 25px; }.welcome-mark { position: absolute; right: -15px; opacity: .65; }.booking-row { grid-template-columns: 42px 1fr auto 16px; gap: 10px; }.bike-thumb { width: 42px; height: 42px; }.booking-status { grid-column: 2; grid-row: 2; justify-self: start; }.booking-amount { grid-column: 3; grid-row: 1 / span 2; }.row-arrow { grid-column: 4; grid-row: 1 / span 2; } }
</style>