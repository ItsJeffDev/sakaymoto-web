<script setup>
import { ref } from "vue";
import "../../styles/Navbar.css";

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<template>
  <nav class="Navbar">
    <div class="Navbar-in">
      <div class="Logo">
        <router-link to="/">
          <img src="../../assets/images/logo.png" alt="Logo" loading="lazy" />
        </router-link>
      </div>

      <div class="Nav-links" :class="{ active: menuOpen }">
        <ul>
          <li>
            <router-link to="/" active-class="active" @click="menuOpen = false">Home</router-link>
          </li>
          <li>
            <router-link to="/motorcycles" active-class="active">Motorcycles</router-link>
          </li>

          <li>
            <router-link to="/booking" exact-active-class="active">My Bookings</router-link>
          </li>

          <li>
            <router-link to="/about" active-class="active">Rental History</router-link>
          </li>

          <li>
            <router-link to="/contact" active-class="active">Profile</router-link>
          </li>
        </ul>
      </div>

      <div class="Nav-actions">
        <div class="Nav-btn">
          <router-link to="/rent">Rent Now</router-link>
        </div>

        <div class="Hamburger" :class="{ active: menuOpen }" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </nav>
</template>