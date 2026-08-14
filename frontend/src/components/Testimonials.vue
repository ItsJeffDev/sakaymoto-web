<script setup>
import StarIcon from './StarIcon.vue'

const testimonials = [
  {
    quote: 'Booked a Click in under two minutes. No more waiting for a shop to reply on Messenger.',
    initials: 'MJ',
    name: 'Mika J.',
    role: 'Student, Los Baños'
  },
  {
    quote: "I finally stopped double-booking my motorcycles. The dashboard just makes sense.",
    initials: 'RD',
    name: 'Rico D.',
    role: 'Owner, RD Motorent'
  },
  {
    quote: 'Uploading my license once and reusing it for every rental saved me so much hassle.',
    initials: 'AT',
    name: 'Anton T.',
    role: 'Rider, Calamba'
  }
]
</script>

<template>
  <section class="section" id="faq">
    <div class="container">
      <div class="section-head reveal" v-reveal>
        <span class="eyebrow">Word on the street</span>
        <h2>Renters and owners, both relieved</h2>
      </div>
      <div class="testimonial-grid">
        <div class="testimonial-card reveal" v-reveal v-for="t in testimonials" :key="t.name">
          <div class="stars">
            <StarIcon v-for="n in 5" :key="n" />
          </div>
          <p class="quote">"{{ t.quote }}"</p>
          <div class="testimonial-who">
            <div class="testimonial-avatar">{{ t.initials }}</div>
            <div><strong>{{ t.name }}</strong><span>{{ t.role }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
