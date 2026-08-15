<script setup>
import { Clock, CalendarCheck, UserCircle2, CreditCard } from 'lucide-vue-next'

const features = [
  {
    icon: Clock,
    tile: 'tile-blue',
    title: 'Real-time availability',
    desc: "See exactly which bikes are free before you request — no more waiting on a reply to find out it's already out.",
  },
  {
    icon: CalendarCheck,
    tile: 'tile-orange',
    title: 'Instant booking requests',
    desc: 'Pick your dates, submit a request, and track its status from pending to approved without leaving the page.',
  },
  {
    icon: UserCircle2,
    tile: 'tile-navy',
    title: 'One account, full history',
    desc: 'Upload your requirements once, then reuse your profile for every future rental and see your full history.',
  },
  {
    icon: CreditCard,
    tile: 'tile-blue',
    title: 'Tracked payments',
    desc: "Every payment is logged against its booking, so both riders and the shop always know what's settled.",
  },
]
</script>

<template>
  <section class="section section2" id="features">
    <div class="container">
      <div class="section-head" v-reveal>
        <span class="eyebrow">Why SakayMoto</span>
        <h2>Built to fix what Messenger and logbooks couldn't</h2>
        <p>
          Every feature here maps to a problem we actually ran into — slow replies, unclear
          availability, and records that lived in three different notebooks.
        </p>
      </div>

      <div class="feat-grid">
        <div class="feat-card" v-reveal v-for="f in features" :key="f.title">
          <div class="icon-tile" :class="f.tile">
            <component :is="f.icon" :size="24" />
          </div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section2 {
}

.feat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.feat-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 30px 26px;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.feat-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow);
  border-color: transparent;
}

.feat-card .icon-tile {
  width: 50px;
  height: 50px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feat-card h3 {
  font-size: 1.08rem;
  margin-bottom: 10px;
}

.feat-card p {
  color: var(--ink-soft);
  font-size: 0.92rem;
}

.tile-blue {
  background: var(--blue-soft);
  color: var(--blue);
}

.tile-orange {
  background: #fff0e9;
  color: var(--orange-deep);
}

.tile-navy {
  background: #e7ecf5;
  color: var(--navy);
}

@media (max-width: 980px) {
  .feat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .feat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
