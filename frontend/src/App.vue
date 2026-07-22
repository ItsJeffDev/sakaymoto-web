<script setup>
import Navbar from "./components/Navigation-com/Navbar.vue";
</script>

<template>
  <div>
    <Navbar />

    <main class="Page-content">
      <router-view />
    </main>
  </div>
</template>

<style>

</style>