<template>
  <section class="section-1">
    <div class="section-1-container">
      <!-- Motorcycle Image -->
      <div class="section-1-image">
        <img src="../assets/images/sectionImg.png" alt="Motorcycle" />
      </div>

      <!-- Text Content -->
      <div class="section-1-title">
        <h1>Rent Your Dream Motorcycle</h1>

        <p>
          Explore our collection of premium motorcycles and enjoy a smooth ride
          wherever you go.
        </p>

        <button type="button">Explore Motorcycles</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ========================================
   RESET
======================================== */

* {
  box-sizing: border-box;
}

/* ========================================
   SECTION
======================================== */

.section-1 {
  width: 100%;
  min-height: 100vh;

  display: flex;
  align-items: center;

  padding: 80px 5%;
}

/* ========================================
   CONTAINER
======================================== */

.section-1-container {
  width: 100%;
  max-width: 1200px;

  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 60px;
}

/* ========================================
   IMAGE
======================================== */

.section-1-image {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
}

.section-1-image img {
  width: 100%;
  max-width: 600px;
  height: auto;

  display: block;

  object-fit: contain;
}

/* ========================================
   TEXT
======================================== */

.section-1-title {
  flex: 1;
  max-width: 550px;
}

.section-1-title h1 {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.1;

  margin: 0 0 25px;
}

.section-1-title p {
  font-size: 1.1rem;
  line-height: 1.7;

  color: #666;

  max-width: 500px;

  margin: 0 0 30px;
}

/* ========================================
   BUTTON
======================================== */

.section-1-title button {
  border: none;

  background-color: #111;
  color: white;

  padding: 15px 28px;

  border-radius: 6px;

  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;

  transition: 0.3s ease;
}

.section-1-title button:hover {
  background-color: #333;
}

/* ========================================
   TABLET
======================================== */

@media (max-width: 1024px) {
  .section-1 {
    padding: 60px 5%;
  }

  .section-1-container {
    gap: 40px;
  }

  .section-1-title h1 {
    font-size: clamp(2.2rem, 5vw, 3.5rem);
  }

  .section-1-title p {
    font-size: 1rem;
  }
}

/* ========================================
   MOBILE
======================================== */

@media (max-width: 768px) {
  .section-1 {
    min-height: auto;

    padding: 60px 20px;
  }

  .section-1-container {
    /* Side by side → stacked */
    flex-direction: column;

    gap: 40px;

    text-align: center;
  }

  /* Image */

  .section-1-image {
    width: 100%;

    order: 1;
  }

  .section-1-image img {
    width: 100%;

    max-width: 500px;
  }

  /* Text */

  .section-1-title {
    width: 100%;
    max-width: 600px;

    order: 2;
  }

  .section-1-title h1 {
    font-size: clamp(2rem, 9vw, 3rem);

    margin-bottom: 20px;
  }

  .section-1-title p {
    margin-left: auto;
    margin-right: auto;

    font-size: 1rem;

    line-height: 1.6;
  }

  /* Button */

  .section-1-title button {
    padding: 14px 24px;
  }
}

/* ========================================
   SMALL PHONE
======================================== */

@media (max-width: 480px) {
  .section-1 {
    padding: 40px 15px;
  }

  .section-1-container {
    gap: 30px;
  }

  .section-1-title h1 {
    font-size: 2rem;
  }

  .section-1-title p {
    font-size: 0.95rem;
  }

  .section-1-title button {
    width: 100%;

    padding: 14px 20px;
  }
}
</style>
