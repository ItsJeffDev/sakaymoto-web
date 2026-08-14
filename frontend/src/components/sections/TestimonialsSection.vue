<script setup>
import { testimonials } from '../../data/testimonials'

const avatarBg = {
  blue: 'var(--blue)',
  orange: 'var(--orange)',
  navy: 'var(--navy)',
}
</script>

<template>
  <section class="section" id="testimonials">
    <div class="container">
      <div class="section-head center" v-reveal>
        <span class="eyebrow">Riders &amp; Owners</span>
        <h2>What people say after switching from Messenger</h2>
      </div>

      <div class="test-grid">
        <div class="test-card" v-reveal v-for="t in testimonials" :key="t.id">
          <div class="stars">★★★★★</div>
          <p>"{{ t.quote }}"</p>
          <div class="test-person">
            <div class="avatar" :style="{ background: avatarBg[t.accent] }">{{ t.initials }}</div>
            <div>
              <b>{{ t.name }}</b
              ><span>{{ t.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-head.center {
  margin-left: auto;
  margin-right: auto;
}
.test-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
.test-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 28px;
}
.stars {
  color: var(--orange);
  letter-spacing: 2px;
  margin-bottom: 14px;
  font-size: 0.9rem;
}
.test-card p {
  color: var(--ink);
  font-size: 0.95rem;
  margin-bottom: 22px;
}
.test-person {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: var(--ff-display);
  font-weight: 700;
  font-size: 0.9rem;
}
.test-person b {
  display: block;
  font-size: 0.88rem;
  color: var(--navy);
}
.test-person span {
  font-size: 0.76rem;
  color: var(--ink-soft);
}

@media (max-width: 980px) {
  .test-grid {
    grid-template-columns: 1fr;
  }
}
</style>
