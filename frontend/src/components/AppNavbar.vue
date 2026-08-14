<script setup>
import { ref } from 'vue'

const isMobileOpen = ref(false)

function toggleMenu() {
  isMobileOpen.value = !isMobileOpen.value
}

function closeMenu() {
  isMobileOpen.value = false
}

function scrollToSection(sectionId) {
  const element = document.querySelector(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  closeMenu()
}
</script>

<template>
  <header class="navbar" :class="{ 'mobile-open': isMobileOpen }">
    <div class="container">
      <button class="brand" @click="closeMenu">
        <img src="../assets/images/logo.png" alt="sakaymoto image">
      </button>

      <nav class="nav-links">
        <button @click="scrollToSection('#browse')">Browse</button>
        <button @click="scrollToSection('#how-it-works')">How it works</button>
        <button @click="scrollToSection('#owners')">For owners</button>
        <button @click="scrollToSection('#faq')">FAQ</button>
      </nav>

      <div class="nav-actions">
        <button class="btn btn-ghost btn-sm">Log in</button>
        <button class="btn btn-primary btn-sm">Sign up</button>
        <button
          class="nav-toggle"
          :class="{ active: isMobileOpen }"
          aria-label="Toggle menu"
          :aria-expanded="isMobileOpen"
          @click="toggleMenu"
        >
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>
