<script setup>
import StarIcon from './StarIcon.vue'

defineProps({
  bike: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="bike-card reveal" v-reveal>
    <div class="bike-media">
      <span class="bike-status">{{ bike.status }}</span>
      <svg viewBox="0 0 64 40" fill="none" stroke="#047248" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="14" cy="30" r="7"/><circle cx="46" cy="30" r="7"/>
        <path d="M38 12a3 3 0 0 0-3 3v6l8 9h6l-6-12h-5z"/>
        <path d="M22 30h9L37 15H22L14 24"/>
      </svg>
    </div>
    <div class="bike-body">
      <div class="bk-top">
        <div>
          <h4>{{ bike.name }}</h4>
          <div class="bk-meta">{{ bike.meta }}</div>
        </div>
        <div class="bike-price">₱{{ bike.price }}<small>/day</small></div>
      </div>
      <div class="bike-footer">
        <div class="bike-rating"><StarIcon /> {{ bike.rating.toFixed(1) }}</div>
        <a href="#" class="btn btn-primary btn-sm">Book now</a>
      </div>
    </div>
  </article>
</template>
