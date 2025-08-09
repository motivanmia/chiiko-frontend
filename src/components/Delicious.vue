<template>
  <div class="marquee-wrapper">
    <div class="marquee-content">
      <div class="marquee-track">
        <template
          v-for="r in 2"
          :key="r"
        >
          <span
            v-for="i in repeatCount"
            :key="`${r}-${i}`"
          >
            {{ text }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    text: {
      type: String,
      default: 'DELICIOUS',
    },
    repeatCount: {
      type: Number,
      default: 4,
    },
  });
</script>

<style lang="scss" scoped>
  .marquee-wrapper {
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }

  .marquee-content {
    display: flex;
  }

  .marquee-track {
    display: flex;
    animation: marquee 40s linear infinite;
  }

  .marquee-track span {
    font-size: 60px;
    font-weight: bold;
    color: rgb(250, 200, 155, 0.5);
    padding-right: 60px;
    font-family: Serif Tamil;
    font-style: italic;
    letter-spacing: 0.2em;
    @include rwdmax(768) {
      font-size: 40px;
    }
  }

  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }
</style>
