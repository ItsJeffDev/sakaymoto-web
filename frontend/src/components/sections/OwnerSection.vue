<script setup>
import { Check } from 'lucide-vue-next'
import { useModalStore } from '../../stores/modal'

const modal = useModalStore()

const perks = [
  'Add, update, and retire listings in seconds',
  'Approve or reject bookings with full customer records on hand',
  'Generate rental and revenue reports without spreadsheets',
]

const barHeights = [40, 65, 50, 85, 60, 95, 70]
</script>

<template>
  <section class="section owner" id="owners">
    <div class="container owner-grid">
      <div v-reveal>
        <span class="eyebrow owner-eyebrow">Behind the Scenes</span>
        <h2>We run our rental shop from one dashboard, not five notebooks</h2>
        <p>
          We manage our fleet, review requests, and track payments in one place — no more doing
          this over Messenger and spreadsheets.
        </p>
        <ul class="owner-list">
          <li v-for="perk in perks" :key="perk">
            <Check :size="20" />
            {{ perk }}
          </li>
        </ul>
        <button class="btn btn-primary" @click="modal.open('register')">Create an Account</button>
      </div>

      <div v-reveal>
        <div class="dash-mock">
          <div class="dm-top">
            <b>Owner Dashboard</b>
            <span>Today, 2:40 PM</span>
          </div>
          <div class="dm-stats">
            <div><b>18</b><span>Bikes out</span></div>
            <div><b>7</b><span>Pending requests</span></div>
            <div><b>₱12.4k</b><span>Today's revenue</span></div>
          </div>
          <div class="dm-bars">
            <i v-for="(h, i) in barHeights" :key="i" :style="{ height: h + '%' }"></i>
          </div>
          <div class="dm-row">
            <span>Booking #1042 · J. Reyes</span>
            <span class="status-pill">Approved</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.owner {
  background: linear-gradient(160deg, var(--navy), var(--navy-deep));
  position: relative;
  overflow: hidden;
}
.owner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(500px 400px at 90% 10%, rgba(255, 106, 61, 0.16), transparent 60%);
}
.owner-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}
.owner h2 {
  color: #fff;
}
.owner p {
  color: rgba(255, 255, 255, 0.72);
  margin: 18px 0 30px;
  max-width: 460px;
}
.owner-eyebrow {
  background: rgba(255, 106, 61, 0.15);
  color: #ff9068;
}

.owner-list {
  margin-bottom: 32px;
}
.owner-list li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.94rem;
  margin-bottom: 14px;
}
.owner-list li :deep(svg) {
  stroke: var(--orange);
  flex-shrink: 0;
  margin-top: 2px;
}

.dash-mock {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 30px 60px -25px rgba(0, 0, 0, 0.5);
  padding: 22px;
}
.dash-mock .dm-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.dash-mock .dm-top b {
  font-family: var(--ff-display);
  color: var(--navy);
  font-size: 0.95rem;
}
.dash-mock .dm-top span {
  font-size: 0.72rem;
  color: var(--ink-soft);
}
.dm-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}
.dm-stats div {
  background: var(--bg);
  border-radius: 10px;
  padding: 12px;
}
.dm-stats b {
  display: block;
  font-family: var(--ff-display);
  color: var(--navy);
  font-size: 1.15rem;
}
.dm-stats span {
  font-size: 0.68rem;
  color: var(--ink-soft);
}
.dm-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 70px;
}
.dm-bars i {
  flex: 1;
  background: linear-gradient(180deg, var(--blue), var(--navy));
  border-radius: 5px 5px 0 0;
}
.dm-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}
.dm-row span {
  font-size: 0.78rem;
  color: var(--ink-soft);
}
.status-pill {
  font-size: 0.68rem;
  font-weight: 700;
  font-family: var(--ff-display);
  padding: 4px 10px;
  border-radius: 999px;
  background: #e7f8ef;
  color: #178a4c;
}

@media (max-width: 980px) {
  .owner-grid {
    grid-template-columns: 1fr;
  }
}
</style>
