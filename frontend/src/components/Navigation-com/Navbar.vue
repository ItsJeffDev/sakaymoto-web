<script setup>
import "../../styles/Navbar.css";
</script>

<template>
  <nav class="Navbar">
    <div class="Navbar-in">
      <div class="Logo">
        <router-link to="/">
          <img src="../../assets/images/logo.png" alt="Logo" loading="lazy" />
        </router-link>
      </div>

      <div class="Nav-links">
        <ul>
          <li>
            <router-link to="/" active-class="active">Home</router-link>
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

      <div class="Nav-btn">
        <router-link to="/rent">Rent Now</router-link>
      </div>
    </div>
  </nav>
</template>