<script setup>
import { ref, watch, onUnmounted } from 'vue'
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

watch(isNavOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <header :class="{ scrolled: isScrolled, 'nav-open': isNavOpen }">
    <div class="container nav">
      <a href="#home" class="brand" @click="closeNav">Sakay<span class="dot">Moto</span></a>

      <nav class="nav-links" :class="{ open: isNavOpen }">
        <a v-for="link in navLinks" :key="link.href" :href="link.href" @click="closeNav">
          {{ link.label }}
        </a>
        <div class="nav-links-actions">
          <a href="#" class="link-btn" @click.prevent="(modal.open('login'), closeNav())">Log In</a>
          <a
            href="#"
            class="btn btn-primary btn-block"
            @click.prevent="(modal.open('register'), closeNav())"
            >Get Started</a
          >
        </div>
      </nav>

      <div class="nav-actions">
        <a href="#" class="link-btn" @click.prevent="modal.open('login')">Log In</a>
        <a href="#" class="btn btn-primary btn-sm" @click.prevent="modal.open('register')"
          >Get Started</a
        >
        <button
          class="burger"
          aria-label="Toggle menu"
          :aria-expanded="isNavOpen"
          @click="isNavOpen = !isNavOpen"
        >
          <Menu v-if="!isNavOpen" :size="24" />
          <X v-else :size="24" />
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="isNavOpen" class="nav-backdrop" @click="closeNav"></div>
    </transition>
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
  position: relative;
  z-index: 1101;
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
  white-space: nowrap;
  transition: color 0.2s;
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
  gap: clamp(18px, 2.4vw, 36px);
}
.nav-links a {
  font-family: var(--ff-display);
  font-weight: 500;
  font-size: 0.93rem;
  color: var(--navy);
  opacity: 0.85;
  transition: opacity 0.2s;
  position: relative;
}
header:not(.scrolled) .nav-links a {
  color: #fff;
}
.nav-links > a::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.22s ease;
}
.nav-links > a:hover {
  opacity: 1;
}
.nav-links > a:hover::after {
  transform: scaleX(1);
}
.nav-links-actions {
  display: none;
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
  transition: color 0.2s;
}
header:not(.scrolled) .nav-actions .link-btn {
  color: #fff;
}

.burger {
  display: none;
  align-items: center;
  justify-content: center;
  color: var(--navy);
  transition: color 0.2s;
}
header:not(.scrolled) .burger {
  color: #fff;
}

.nav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(6, 17, 33, 0.45);
  backdrop-filter: blur(2px);
  z-index: 1090;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 980px) {
  .nav-links {
    gap: 20px;
  }
}

@media (max-width: 760px) {
  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    height: 100dvh;
    width: 80%;
    max-width: 320px;
    background: #fff;
    flex-direction: column;
    align-items: flex-start;
    padding: 96px 28px 32px;
    gap: 22px;
    transform: translateX(100%);
    transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: -12px 0 36px rgba(0, 0, 0, 0.18);
    overflow-y: auto;
    z-index: 1095;
  }
  .nav-links.open {
    transform: translateX(0);
  }
  .nav-links a {
    color: var(--navy) !important;
    font-size: 1.02rem;
    width: 100%;
  }
  .nav-links > a::after {
    display: none;
  }
  .nav-links-actions {
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 100%;
    margin-top: 8px;
    padding-top: 22px;
    border-top: 1px solid var(--line);
  }
  .nav-links-actions .link-btn {
    color: var(--navy) !important;
    font-family: var(--ff-display);
    font-weight: 600;
    font-size: 0.95rem;
    text-align: center;
  }
  .burger {
    display: flex;
    z-index: 1100;
  }
  .nav-actions .link-btn,
  .nav-actions .btn-primary {
    display: none;
  }
}

@media (max-width: 400px) {
  header {
    padding: 16px 0;
  }
  header.scrolled {
    padding: 12px 0;
  }
  .brand {
    font-size: 1.12rem;
  }
  .nav-links {
    width: 88%;
    padding: 88px 22px 28px;
  }
}
</style>
