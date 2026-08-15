<script setup>
import { Calendar } from 'lucide-vue-next'
import MotoIcon from '../icons/MotoIcon.vue'
</script>

<template>
  <section class="hero" id="home">
    <div class="hero-bg" aria-hidden="true">
      <span class="grid-pattern"></span>
      <span class="blob blob-orange"></span>
      <span class="blob blob-blue"></span>
      <span class="ring ring-1"></span>
      <span class="ring ring-2"></span>
      <span class="speed-line line-1"></span>
      <span class="speed-line line-2"></span>
      <span class="speed-line line-3"></span>
    </div>

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
      </div>

      <div class="hero-visual">
        <span class="visual-glow" aria-hidden="true"></span>
        <span class="visual-ring" aria-hidden="true"></span>
        <div class="hero-card main">
          <img
            src="../../assets/images/motor_top2-removebg-preview.png"
            alt="Honda Click 125 scooter available for rent"
            class="bike-img"
          />
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

/* ===== Decorative background layer ===== */
.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.grid-pattern {
  position: absolute;
  inset: -1px;
  background-image: radial-gradient(rgba(255, 255, 255, 0.16) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 90% 70% at 50% 0%, #000 40%, transparent 90%);
  opacity: 0.6;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.55;
  animation: drift 14s ease-in-out infinite;
}
.blob-orange {
  width: 380px;
  height: 380px;
  right: -80px;
  top: -120px;
  background: radial-gradient(circle, rgba(255, 106, 61, 0.55), transparent 70%);
}
.blob-blue {
  width: 420px;
  height: 420px;
  left: -140px;
  bottom: -180px;
  background: radial-gradient(circle, rgba(47, 111, 237, 0.45), transparent 70%);
  animation-delay: -6s;
}
@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -18px) scale(1.06);
  }
}
.ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.14);
}
.ring-1 {
  width: 640px;
  height: 640px;
  right: -220px;
  top: -260px;
}
.ring-2 {
  width: 420px;
  height: 420px;
  right: -120px;
  top: -140px;
  border-color: rgba(255, 106, 61, 0.18);
}
.speed-line {
  position: absolute;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
}
.line-1 {
  width: 260px;
  left: 4%;
  top: 32%;
  transform: rotate(-8deg);
}
.line-2 {
  width: 180px;
  left: 10%;
  top: 40%;
  transform: rotate(-8deg);
  opacity: 0.6;
}
.line-3 {
  width: 140px;
  left: 2%;
  top: 48%;
  transform: rotate(-8deg);
  opacity: 0.35;
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
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

/* ===== Hero visual / bike image ===== */
.hero-visual {
  position: relative;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.visual-glow {
  position: absolute;
  width: 90%;
  height: 90%;
  max-width: 480px;
  max-height: 480px;
  background: radial-gradient(circle, rgba(255, 106, 61, 0.32), transparent 70%);
  filter: blur(10px);
  border-radius: 50%;
}
.visual-ring {
  position: absolute;
  width: 78%;
  height: 78%;
  max-width: 420px;
  max-height: 420px;
  border-radius: 50%;
  border: 1.5px dashed rgba(255, 255, 255, 0.18);
}
.hero-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 26px 26px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: visible;
}

.bike-img {
  position: relative;
  flex: 1;
  width: 116%;
  max-width: 116%;
  margin: 0 -8% 0;
  object-fit: contain;
  filter: drop-shadow(0 30px 34px rgba(0, 0, 0, 0.45));
  transition: transform 0.35s ease;
}
.hero-card:hover .bike-img {
  transform: translateY(-6px) scale(1.02);
}
.hero-card.main .price-row {
  position: relative;
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

@media (max-width: 1180px) {
  .hero-visual {
    height: 460px;
  }
}

@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .hero-visual {
    height: 420px;
    max-width: 460px;
    margin: 20px auto 0;
  }
}

@media (max-width: 560px) {
  .hero {
    padding: 150px 0 90px;
  }
  .hero-visual {
    height: 340px;
  }
  .hero-card {
    padding: 20px 20px 18px;
    border-radius: 20px;
  }
  .hero-stats {
    gap: 22px;
    margin-top: 40px;
  }
  .hero-stats .stat b {
    font-size: 1.4rem;
  }
}

@media (max-width: 380px) {
  .hero-visual {
    height: 280px;
  }
}
</style>
