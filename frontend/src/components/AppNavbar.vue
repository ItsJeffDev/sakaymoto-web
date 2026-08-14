<script setup>
import { ref } from 'vue'

const isMobileOpen = ref(false)

function toggleMenu() {
  isMobileOpen.value = !isMobileOpen.value
}

function closeMenu() {
  isMobileOpen.value = false
}
</script>

<template>
  <header class="navbar" :class="{ 'mobile-open': isMobileOpen }">
    <div class="container">
      <a href="#" class="brand" @click="closeMenu">
        <img src="" alt="">
        SakayMoto
      </a>

      <nav class="nav-links">
        <a href="#browse" @click="closeMenu">Browse</a>
        <a href="#how-it-works" @click="closeMenu">How it works</a>
        <a href="#owners" @click="closeMenu">For owners</a>
        <a href="#faq" @click="closeMenu">FAQ</a>
      </nav>

      <div class="nav-actions">
        <a href="#" class="btn btn-ghost btn-sm">Log in</a>
        <a href="#" class="btn btn-primary btn-sm">Sign up</a>
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
