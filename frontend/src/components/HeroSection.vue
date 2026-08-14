<script setup>
import { reactive } from 'vue'

const booking = reactive({
  location: 'Calamba, Laguna',
  pickup: '',
  return: '',
  type: 'Any type'
})

function submitBooking() {
  // Placeholder — wire this up to the real availability API later.
  document.querySelector('#browse')?.scrollIntoView({ behavior: 'smooth' })
}

const trustItems = [
  'Verified rental shops only',
  'Real-time availability',
  'In-app document upload',
  'Secure payment tracking',
  'No more Messenger inquiries'
]
</script>

<template>
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">Now booking in 12 cities</span>
        <h1>Rent a ride in minutes, <span class="accent">not messages.</span></h1>
        <p class="lead">SakayMoto replaces the back-and-forth on Messenger with real-time availability, instant booking, and verified rental shops — all in one place.</p>

        <div class="hero-actions">
          <a href="#browse" class="btn btn-primary">Browse motorcycles</a>
          <a href="#owners" class="btn btn-ghost">List your shop</a>
        </div>

        <div class="hero-proof">
          <div><strong>0</strong><span>Double bookings</span></div>
          <div><strong>&lt;2min</strong><span>Avg. booking time</span></div>
          <div><strong>24/7</strong><span>Live availability</span></div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="route-card">
          <span class="tag">Live booking · Sample</span>
          <div class="route-path">
            <div class="route-point">
              <span class="route-dot"></span>
              <div>
                <div class="rp-label">Pickup</div>
                <div class="rp-value">Poblacion Rental Hub</div>
              </div>
            </div>
            <div class="route-point">
              <span class="route-dot"></span>
              <div>
                <div class="rp-label">Return</div>
                <div class="rp-value">Same location · 3 days</div>
              </div>
            </div>
          </div>
        </div>
        <div class="plate-badge">
          <div class="pb-left">
            <span>Honda Click 125i</span>
            <strong>₱399 / day</strong>
          </div>
          <div class="pb-right">Available</div>
        </div>
      </div>
    </div>

    <!-- booking widget -->
    <div class="container">
      <div class="booking-widget reveal" v-reveal>
        <form @submit.prevent="submitBooking">
          <div class="field">
            <label for="loc">Location</label>
            <select id="loc" v-model="booking.location">
              <option>Calamba, Laguna</option>
              <option>Los Baños, Laguna</option>
              <option>Santa Rosa, Laguna</option>
            </select>
          </div>
          <div class="field">
            <label for="pickup">Pickup date</label>
            <input type="date" id="pickup" v-model="booking.pickup">
          </div>
          <div class="field">
            <label for="return">Return date</label>
            <input type="date" id="return" v-model="booking.return">
          </div>
          <div class="field">
            <label for="type">Motorcycle type</label>
            <select id="type" v-model="booking.type">
              <option>Any type</option>
              <option>Scooter</option>
              <option>Underbone</option>
              <option>Sport</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Check availability</button>
        </form>
      </div>
    </div>

    <div class="trust-strip">
      <div class="container">
        <div class="trust-track">
          <span v-for="n in 2" :key="n" style="display:contents;">
            <span v-for="item in trustItems" :key="item">★ {{ item }}</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
