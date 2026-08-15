<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { useScrollHeader } from '../../composables/useScrollHeader'
import { useModalStore } from '../../stores/modal'

const { isScrolled } = useScrollHeader()
const modal = useModalStore()
const isNavOpen = ref(false)

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Motorcycles', href: '#motorcycles' },
  { label: 'How It Works', href: '#how' },
  { label: 'Behind the Scenes', href: '#owners' },
  { label: 'Contact', href: '#contact' },
]

function closeNav() {
  isNavOpen.value = false
}
</script>

<template>
  <header :class="{ scrolled: isScrolled }">
    <div class="container nav">
      <a href="#home" class="brand">Sakay<span class="dot">Moto</span></a>

      <nav class="nav-links" :class="{ open: isNavOpen }">
        <a v-for="link in navLinks" :key="link.href" :href="link.href" @click="closeNav">
          {{ link.label }}
        </a>
      </nav>

      <div class="nav-actions">
        <a href="#" class="link-btn" @click.prevent="modal.open('login')">Log In</a>
        <a href="#" class="btn btn-primary btn-sm" @click.prevent="modal.open('register')"
          >Get Started</a
        >
        <button class="burger" aria-label="Toggle menu" @click="isNavOpen = !isNavOpen">
          <Menu v-if="!isNavOpen" :size="24" />
          <X v-else :size="24" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: transparent;
  transition:
    background 0.25s ease,
    box-shadow 0.25s ease,
    padding 0.25s ease;
  padding: 22px 0;
}
header.scrolled {
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(10px);
  box-shadow: 0 6px 24px -12px rgba(11, 37, 69, 0.18);
  padding: 14px 0;
}
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.brand {
  display: flex;
  align-items: center;
  font-family: var(--ff-display);
  font-weight: 800;
  font-size: 1.3rem;
  color: var(--navy);
}
header:not(.scrolled) .brand {
  color: #fff;
}
.brand .dot {
  color: var(--orange);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 36px;
}
.nav-links a {
  font-family: var(--ff-display);
  font-weight: 500;
  font-size: 0.93rem;
  color: var(--navy);
  opacity: 0.85;
  transition: opacity 0.2s;
}
header:not(.scrolled) .nav-links a {
  color: #fff;
}
.nav-links a:hover {
  opacity: 1;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-actions .link-btn {
  font-family: var(--ff-display);
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--navy);
  padding: 10px 6px;
}
header:not(.scrolled) .nav-actions .link-btn {
  color: #fff;
}

.burger {
  display: none;
  align-items: center;
  justify-content: center;
  color: var(--navy);
}
header:not(.scrolled) .burger {
  color: #fff;
}

@media (max-width: 760px) {
  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 78%;
    max-width: 320px;
    background: #fff;
    flex-direction: column;
    align-items: flex-start;
    padding: 100px 30px 30px;
    gap: 26px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
  }
  .nav-links.open {
    transform: translateX(0);
  }
  .nav-links a {
    color: var(--navy) !important;
    font-size: 1rem;
  }
  .burger {
    display: flex;
    z-index: 1100;
  }
  .nav-actions .link-btn {
    display: none;
  }
}
</style>
