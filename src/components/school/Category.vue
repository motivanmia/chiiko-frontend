<script setup>
  const SchoolCategory = [
    { title: '植物性食材', img: '/src/assets/image/School/vegetables.jpg' },
    { title: '動物性食材', img: '/src/assets/image/School/meat.jpg' },
  ];
</script>

<template>
  <div class="category">
    <div
      class="category__buttons"
      v-for="Buttons in SchoolCategory"
    >
      <img
        :src="Buttons.img"
        alt=""
      />
      <h2>{{ Buttons.title }}</h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .category {
    display: flex;
    max-width: 1000px;
    width: 100%;
    height: 80px;
    margin: 50px auto;
    justify-content: space-around;

    &__buttons {
      width: 494px;
      background-color: aqua;
      border-radius: 20px;
      text-align: center;
      position: relative;
      overflow: hidden;

      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: blur(2px);
      }

      & > h2 {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 1;
        letter-spacing: 1.2px;
        color: color(text, light);
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        font-size: 24px;
        font-weight: larger;
        white-space: nowrap;
      }
    }
  }
</style>
