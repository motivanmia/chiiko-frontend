<script setup>
  const props = defineProps({
    img: {
      type: String,
      default: new URL('@/assets/image/School/banner.jpg', import.meta.url).href,
    },
    title: {
      type: String,
      default: '食材學堂',
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
    margin: 0 auto 50px;
    border-radius: 20px;
    position: relative;
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    padding: 0 10px;

    & > img {
      border-radius: 20px;
      max-width: 1200px;
      width: 100%;
      height: auto;
      object-fit: cover;
    }
    & > h2 {
      font-size: 40px;
      letter-spacing: 1.2px;
      color: color(text, light);
      position: absolute;
      bottom: 5%;
      left: 50%;
      transform: translateX(-50%);
      font-weight: 700;
      letter-spacing: 8px;
    }
  }
</style>
