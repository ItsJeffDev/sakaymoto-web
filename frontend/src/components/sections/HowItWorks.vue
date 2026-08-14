<script setup>
const steps = [
  {
    num: 1,
    title: 'Browse & select',
    desc: 'Check live availability, compare specs, and pick the bike that fits your trip.',
  },
  {
    num: 2,
    title: 'Book & upload',
    desc: 'Submit your rental dates and upload your ID and requirements in one go.',
  },
  {
    num: 3,
    title: 'Get approved',
    desc: 'The shop reviews your request and confirms — most within 15 minutes.',
  },
  {
    num: 4,
    title: 'Pay & ride',
    desc: 'Settle payment through the platform and pick up your ride, logged and tracked.',
  },
]
</script>

<template>
  <section class="section how" id="how">
    <div class="container">
      <div class="section-head center" v-reveal>
        <span class="eyebrow">The Journey</span>
        <h2>From browsing to riding, in four stops</h2>
        <p>
          The same road, every time — no back-and-forth messages needed to find out where you are in
          the process.
        </p>
      </div>

      <div class="route-wrap" v-reveal>
        <svg class="route-svg" viewBox="0 0 1000 60" preserveAspectRatio="none">
          <path d="M60 20 Q 300 60 500 20 T 940 20" />
        </svg>
        <div class="steps-row">
          <div class="step" v-for="step in steps" :key="step.num">
            <div class="num-node">{{ step.num }}</div>
            <h4>{{ step.title }}</h4>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.how {
  background: var(--bg);
}
.section-head.center {
  margin-left: auto;
  margin-right: auto;
}
.route-wrap {
  position: relative;
  margin-top: 20px;
}
.route-svg {
  position: absolute;
  top: 36px;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 0;
}
.route-svg path {
  stroke: var(--line);
  stroke-width: 2.5;
  fill: none;
  stroke-dasharray: 8 8;
}

.steps-row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}
.step {
  text-align: left;
}
.step .num-node {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fff;
  border: 2.5px solid var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ff-display);
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 20px;
  position: relative;
}
.step:nth-child(2) .num-node {
  border-color: var(--orange);
  color: var(--orange-deep);
}
.step:nth-child(4) .num-node {
  border-color: var(--navy);
  color: var(--navy);
}
.step h4 {
  font-size: 1.02rem;
  margin-bottom: 8px;
}
.step p {
  color: var(--ink-soft);
  font-size: 0.88rem;
}

@media (max-width: 980px) {
  .steps-row {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 40px;
  }
  .route-svg {
    display: none;
  }
}
@media (max-width: 760px) {
  .steps-row {
    grid-template-columns: 1fr;
  }
}
</style>
