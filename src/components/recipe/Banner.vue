<script setup>
  const props = defineProps({
    img: {
      type: String,
      default: '/src/assets/image/Recipes/banner.png',
    },
    title: {
      type: String,
      default: '靈感 X 食譜',
    },
  });
</script>

<template>
  <div class="banner-box">
    <img
      :src="img"
      alt="banner"
    />
    <h2>{{ title }}</h2>
  </div>
</template>

<style lang="scss" scoped>
  .banner-box {
    
    border-radius: 20px;
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;

    & > img {
      max-width: 1200px;
      width: 100%;
      height: auto;
    }
    & > h2 {
      font-size: 40px;
      letter-spacing: 1.2px;
      color: color(text, light);
      position: absolute;
      bottom: 5%;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
