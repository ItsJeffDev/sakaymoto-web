<script setup>
import { ShieldCheck, Clock, CreditCard, Zap } from 'lucide-vue-next'

const items = [
  { icon: ShieldCheck, title: 'Verified renters only', desc: 'ID & requirements checked' },
  { icon: Clock, title: 'Real-time availability', desc: 'No more double bookings' },
  { icon: CreditCard, title: 'Secure payments', desc: 'Tracked from request to receipt' },
  { icon: Zap, title: 'Same-day approval', desc: 'Most requests reviewed within minutes' },
]
</script>

<template>
  <div class="trust-strip">
    <div class="container trust-inner">
      <div class="trust-item" v-for="item in items" :key="item.title">
        <component :is="item.icon" :size="26" />
        <div>
          <b>{{ item.title }}</b
          ><span>{{ item.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trust-strip {
  background: #fff;
  border-bottom: 1px solid var(--line);
}
.trust-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 34px 0;
  flex-wrap: wrap;
  gap: 24px;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.trust-item :deep(svg) {
  stroke: var(--blue);
  flex-shrink: 0;
}
.trust-item b {
  display: block;
  font-family: var(--ff-display);
  font-size: 1rem;
  color: var(--navy);
}
.trust-item span {
  font-size: 0.8rem;
  color: var(--ink-soft);
}

@media (max-width: 760px) {
  .trust-inner {
    justify-content: center;
    text-align: center;
  }
}
</style>
