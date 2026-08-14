<script setup>
const steps = [
  { num: '01', title: 'Browse & compare', body: 'Filter by type, price, and location to find the right motorcycle nearby.' },
  { num: '02', title: 'Book your dates', body: 'Pick pickup and return dates. Availability updates in real time.' },
  { num: '03', title: 'Upload requirements', body: 'Submit your ID and license once — reused for future rentals.' },
  { num: '04', title: 'Confirm & ride', body: "Get approved, pay securely, and pick up your motorcycle. That's it." }
]
</script>

<template>
  <section class="section" id="how-it-works">
    <div class="container">
      <div class="section-head center reveal" v-reveal style="margin-left:auto;margin-right:auto;">
        <span class="eyebrow">The process</span>
        <h2>From browsing to riding, in four steps</h2>
      </div>

      <div class="steps">
        <div v-for="(step, i) in steps" :key="step.num" class="step-card reveal" v-reveal>
          <div class="step-num">{{ step.num }}</div>
          <h4>{{ step.title }}</h4>
          <p>{{ step.body }}</p>
          <div class="step-connector" v-if="i < steps.length - 1"></div>
        </div>
      </div>
    </div>
  </section>
</template>
