<script setup>
</script>

<template>
  <div class="Home">
    <section class="section-1">
      <div class="section-1-content">

        <div class="section-1-image">
          <img src="../assets/images/sectionImg.png" alt="Motorcycle" />
        </div>

        <div class="section-1-title">
          <h1>Rent Your Dream Motorcycle</h1>
          <p>
            Explore our collection of premium motorcycles and enjoy a smooth ride
            wherever you go.
          </p>

          <button>Explore Motorcycles</button>
        </div>

      </div>
    </section>
  </div>
</template>

<style scoped>
.Home {
  width: 100%;
  max-width: 1200px;
  margin: auto;
}

.section-1 {
  width: 100%;
  height: 520px;
}

.section-1-content {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
}

/* LEFT IMAGE */
.section-1-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.section-1-image img {
  width: 100%;
  max-width: 600px;
  height: auto;
  object-fit: contain;
}


/* RIGHT TEXT */
.section-1-title {
  flex: 1;
}

.section-1-title h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
}

.section-1-title p {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.section-1-title button {
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  background: var(--primary-color);
  color: white;
  font-weight: 700;
  cursor: pointer;
}


/* MOBILE */
@media (max-width:768px) {
  .section-1-content {
    flex-direction: column;
    text-align: center;
  }

  .section-1-title h1 {
    font-size: 32px;
  }

  .section-1 {
    height: auto;
  }
}


/* IMAGE ANIMATION */
.section-1-image {
  animation: slideLeft 1s ease-out forwards;
}

.section-1-image img {
  animation: float 3s ease-in-out infinite;
}


/* TEXT ANIMATION */
.section-1-title {
  animation: slideRight 1s ease-out forwards;
}

.section-1-title h1 {
  animation: fadeUp 1s ease-out 0.3s both;
}

.section-1-title p {
  animation: fadeUp 1s ease-out 0.5s both;
}

.section-1-title button {
  animation: fadeUp 1s ease-out 0.7s both;
}


/* BUTTON HOVER */
.section-1-title button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.section-1-title button:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}


/* KEYFRAMES */

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(-80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}


@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}


@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


@keyframes float {
  0%, 100% {
    transform: translateX(0);
  }

  50% {
    transform: translateX(-12px);
  }
}
</style>