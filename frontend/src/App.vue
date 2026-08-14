<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import HeroSection from './components/sections/HeroSection.vue'
import FeaturesSection from './components/sections/FeaturesSection.vue'
import CatalogSection from './components/sections/CatalogSection.vue'
import HowItWorks from './components/sections/HowItWorks.vue'
import OwnerSection from './components/sections/OwnerSection.vue'
import TestimonialsSection from './components/sections/TestimonialsSection.vue'
import CtaBanner from './components/sections/CtaBanner.vue'
import TrustStrip from './components/sections/TrustStrip.vue'
import AuthModal from './components/modals/AuthModal.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main>
      <HeroSection />
      <TrustStrip />
      <FeaturesSection />
      <CatalogSection />
      <HowItWorks />
      <OwnerSection />
      <TestimonialsSection />
      <CtaBanner />
    </main>
    <AppFooter />
    <AuthModal />
  </div>
</template>

<style scoped></style>
