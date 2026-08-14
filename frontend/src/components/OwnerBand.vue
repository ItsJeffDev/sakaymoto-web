<script setup>
const stats = [
  {
    title: 'Live fleet dashboard',
    body: "Track every motorcycle's status at a glance",
    icon: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/>'
  },
  {
    title: 'One-tap approvals',
    body: 'Review documents and approve bookings fast',
    icon: '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>'
  },
  {
    title: 'Automated reports',
    body: 'Revenue and rental history, generated for you',
    icon: '<path d="M4 19V9M12 19V5M20 19v-7"/>'
  }
]
</script>

<template>
  <section class="section" id="owners" style="padding-top:0;">
    <div class="container">
      <div class="owner-band reveal" v-reveal>
        <div>
          <span class="eyebrow" style="color:var(--plate-yellow);">For business owners</span>
          <h2>Run your rental shop without the spreadsheet chaos.</h2>
          <p>Manage your fleet, approve bookings, track payments, and generate reports — all from one dashboard built for how rental shops actually operate.</p>
          <a href="#" class="btn btn-inverse">List your motorcycles</a>
        </div>
        <div class="owner-stats">
          <div class="owner-stat" v-for="stat in stats" :key="stat.title">
            <span class="os-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="stat.icon"></svg>
            </span>
            <div><strong>{{ stat.title }}</strong><span>{{ stat.body }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
