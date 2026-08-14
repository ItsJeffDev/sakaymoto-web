<template>
  <section class="final-cta">
    <div class="container reveal" v-reveal>
      <span class="eyebrow">Ready when you are</span>
      <h2 style="margin-top:14px;">Your next ride is a few taps away.</h2>
      <p>Join SakayMoto and skip the Messenger queue entirely.</p>
      <div class="final-cta-actions">
        <button class="btn btn-primary" onclick="document.querySelector('#browse')?.scrollIntoView({ behavior: 'smooth' })">Browse motorcycles</button>
        <button class="btn btn-ghost" onclick="document.querySelector('#owners')?.scrollIntoView({ behavior: 'smooth' })">List your shop</button>
      </div>
    </div>
  </section>
</template>
