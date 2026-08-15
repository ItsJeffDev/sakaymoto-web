<script setup>
import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-vue-next'
import { useModalStore } from '../../stores/modal'

const modal = useModalStore()

const exploreLinks = [
  { label: 'Motorcycles', href: '#motorcycles' },
  { label: 'How It Works', href: '#how' },
  { label: 'Behind the Scenes', href: '#owners' },
  { label: 'Reviews', href: '#testimonials' },
]
</script>

<template>
  <footer id="contact">
    <div class="container">
      <div class="foot-grid">
        <div class="foot-brand">
          <a href="#home" class="brand">Sakay<span class="dot">Moto</span></a>
          <p>
            Our online booking system for motorcycle rentals in Calamba, Laguna — check
            availability, book, and manage your rental all in one place.
          </p>
          <div class="social-row">
            <a href="#" aria-label="Facebook"><Facebook :size="16" /></a>
            <a href="#" aria-label="Instagram"><Instagram :size="16" /></a>
            <a href="#" aria-label="Messenger"><MessageCircle :size="16" /></a>
          </div>
        </div>

        <div>
          <h5>Explore</h5>
          <ul>
            <li v-for="link in exploreLinks" :key="link.href">
              <a :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        </div>

        <div>
          <h5>Account</h5>
          <ul>
            <li><a href="#" @click.prevent="modal.open('login')">Log In</a></li>
            <li><a href="#" @click.prevent="modal.open('register')">Register</a></li>
            <li><a href="#">My Bookings</a></li>
            <li><a href="#">Rental History</a></li>
          </ul>
        </div>

        <div>
          <h5>Contact</h5>
          <ul class="foot-contact">
            <li><MapPin :size="17" /> Calamba, Laguna, Philippines</li>
            <li><Phone :size="17" /> 0917 000 0000</li>
            <li><Mail :size="17" /> hello@sakaymoto.ph</li>
          </ul>
        </div>
      </div>

      <div class="foot-bottom">
        <span>© 2026 SakayMoto. All rights reserved.</span>
        <span>Privacy Policy · Terms of Service</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background: var(--navy-deep);
  color: rgba(255, 255, 255, 0.7);
  padding-top: 80px;
}
.foot-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
  gap: 40px;
  padding-bottom: 50px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.brand {
  display: flex;
  align-items: center;
  font-family: var(--ff-display);
  font-weight: 800;
  font-size: 1.3rem;
}
.foot-brand .brand {
  color: #fff;
  margin-bottom: 14px;
}
.brand .dot {
  color: var(--orange);
}
.foot-brand p {
  font-size: 0.88rem;
  max-width: 280px;
  margin-bottom: 20px;
}

.social-row {
  display: flex;
  gap: 10px;
}
.social-row a {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: #fff;
}
.social-row a:hover {
  background: var(--orange);
}

footer h5 {
  font-family: var(--ff-display);
  color: #fff;
  font-size: 0.88rem;
  margin-bottom: 20px;
  letter-spacing: 0.03em;
}
footer ul li {
  margin-bottom: 12px;
  font-size: 0.87rem;
}
footer ul li a:hover {
  color: #fff;
}
.foot-contact li {
  display: flex;
  gap: 10px;
  font-size: 0.87rem;
  margin-bottom: 16px;
}
.foot-contact li :deep(svg) {
  stroke: var(--orange);
  flex-shrink: 0;
  margin-top: 2px;
}

.foot-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px 0;
  font-size: 0.8rem;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 980px) {
  .foot-grid {
    grid-template-columns: 1fr 1fr;
    row-gap: 40px;
  }
}
@media (max-width: 760px) {
  .foot-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  footer {
    padding-top: 56px;
  }
  .foot-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
