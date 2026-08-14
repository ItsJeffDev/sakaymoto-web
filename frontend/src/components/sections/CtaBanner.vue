<script setup>
import { useModalStore } from '../../stores/modal'
const modal = useModalStore()
</script>

<template>
  <section class="section cta-section">
    <div class="container">
      <div class="cta-banner" v-reveal>
        <div>
          <h2>Ready to skip the Messenger queue?</h2>
          <p>Create an account and book your first ride in under five minutes.</p>
        </div>
        <button class="btn btn-navy" @click="modal.open('register')">Create Free Account</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  padding-top: 0;
}
.cta-banner {
  background: linear-gradient(120deg, var(--orange), var(--orange-deep));
  border-radius: 24px;
  padding: 60px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}
.cta-banner h2 {
  color: #fff;
  font-size: 1.9rem;
}
.cta-banner p {
  color: rgba(255, 255, 255, 0.85);
  margin-top: 8px;
}
.cta-banner .btn-navy {
  background: #fff;
  color: var(--orange-deep);
}
.cta-banner .btn-navy:hover {
  background: #fff5f0;
}

@media (max-width: 760px) {
  .cta-banner {
    padding: 40px 26px;
    text-align: center;
    justify-content: center;
  }
}
</style>
