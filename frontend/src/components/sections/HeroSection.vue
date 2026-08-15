<script setup>
import { Calendar } from 'lucide-vue-next'
import MotoIcon from '../icons/MotoIcon.vue'

const stats = [
  { value: '120+', label: 'Motorcycles listed' },
  { value: '4.8/5', label: 'Average rider rating' },
  { value: '< 15 min', label: 'Average approval time' },
]
</script>

<template>
  <section class="hero" id="home">
    <div class="container hero-grid">
      <div>
        <h1>Renting a motorcycle<br />should feel as fast <em>as riding one.</em></h1>
        <p class="lead">
          SakayMoto replaces the back-and-forth Messenger chats and paper logbooks with real-time
          availability, instant booking requests, and a simple dashboard we use to run things
          smoothly.
        </p>
        <div class="hero-cta">
          <a href="#motorcycles" class="btn btn-primary">Browse Motorcycles</a>
          <a href="#how" class="btn btn-outline">See How Booking Works</a>
        </div>
        <div class="hero-stats">
          <div class="stat" v-for="s in stats" :key="s.label">
            <b>{{ s.value }}</b
            ><span>{{ s.label }}</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-card main">
          <img src="../../assets/images/motor_top2-removebg-preview.png" alt="" />
          <div class="price-row">
            <div><b>Honda Click 125</b> <br /><span>Scooter · Automatic</span></div>
            <div><b>₱450 </b><span>per day</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 180px 0 130px;
  overflow: hidden;
  background: linear-gradient(155deg, var(--navy) 0%, var(--navy-deep) 62%, #061729 100%);
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(680px 420px at 82% 18%, rgba(47, 111, 237, 0.35), transparent 60%),
    radial-gradient(520px 400px at 100% 100%, rgba(255, 106, 61, 0.18), transparent 60%);
  pointer-events: none;
}
.hero-grid {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 40px;
  align-items: center;
}
.hero h1 {
  color: #fff;
  font-size: clamp(2.4rem, 4.4vw, 3.6rem);
  font-weight: 700;
}
.hero h1 em {
  font-style: normal;
  color: var(--orange);
}
.hero p.lead {
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.12rem;
  max-width: 520px;
  margin: 22px 0 34px;
}
.hero-cta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.hero-stats {
  display: flex;
  gap: 34px;
  margin-top: 56px;
  flex-wrap: wrap;
}
.hero-stats .stat b {
  display: block;
  font-family: var(--ff-display);
  color: #fff;
  font-size: 1.7rem;
  font-weight: 700;
}
.hero-stats .stat span {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.hero-visual {
  position: relative;
  height: 440px;
}
.hero-card {
  position: absolute;
  background: #fff;
  border-radius: 20px;
  box-shadow: var(--shadow);
  padding: 22px;
}
.hero-card.main {
  right: 0;
  top: 10px;
  width: 90%;
  height: 560px;
  background: linear-gradient(160deg, #123469, #0b2545);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero-card.main img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.hero-card.main :deep(.bike-illustration) {
  align-self: center;
  width: 78%;
}
.hero-card.main .price-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: #fff;
}
.hero-card.main .price-row b {
  font-family: var(--ff-display);
  font-size: 1.5rem;
}
.hero-card.main .price-row span {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.78rem;
}

.float-card {
  position: absolute;
  left: -10px;
  bottom: -6px;
  width: 230px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  z-index: 3;
}
.float-card .icon-tile {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: var(--blue-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--blue);
}
.float-card b {
  display: block;
  font-family: var(--ff-display);
  font-size: 0.92rem;
  color: var(--navy);
}
.float-card span {
  font-size: 0.76rem;
  color: var(--ink-soft);
}

.float-card2 {
  right: -14px;
  top: 36px;
  width: 170px;
  padding: 14px 16px;
  z-index: 3;
}
.float-card2 .pulse {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
}
.float-card2 .row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.float-card2 span {
  font-size: 0.75rem;
  color: var(--ink-soft);
}
.float-card2 b {
  font-family: var(--ff-display);
  font-size: 0.85rem;
  color: var(--navy);
}

@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .hero-visual {
    height: 380px;
    margin-top: 20px;
  }
}
</style>
