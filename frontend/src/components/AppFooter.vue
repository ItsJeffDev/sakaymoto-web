<template>
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <button class="brand">
            <span class="brand-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 0 0-1 1v3l3.5 3.5H21l-3-6h-3z"/><path d="M9 17.5H12L14.5 10H9L6.5 14.5"/></svg>
            </span>
            SakayMoto
          </button>
          <p>The booking and management platform for local motorcycle rental businesses.</p>
          <div class="social-row" style="margin-top:20px;">
            <button aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M14 9h3V6h-3a4 4 0 0 0-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2a1 1 0 0 1 1-1z"/></svg></button>
            <button aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg></button>
            <button aria-label="Mail"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></button>
          </div>
        </div>
        <div class="footer-col">
          <h5>Platform</h5>
          <button onclick="document.querySelector('#browse')?.scrollIntoView({ behavior: 'smooth' })">Browse motorcycles</button>
          <button onclick="document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })">How it works</button>
          <button onclick="document.querySelector('#owners')?.scrollIntoView({ behavior: 'smooth' })">For owners</button>
        </div>
        <div class="footer-col">
          <h5>Support</h5>
          <button onclick="document.querySelector('#faq')?.scrollIntoView({ behavior: 'smooth' })">FAQ</button>
          <button>Contact us</button>
          <button>Safety guidelines</button>
        </div>
        <div class="footer-col">
          <h5>Legal</h5>
          <button>Terms of service</button>
          <button>Privacy policy</button>
          <button>Rental agreement</button>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 SakayMoto.</span>
        <span>Made for local rental shops, everywhere.</span>
      </div>
    </div>
  </footer>
</template>
