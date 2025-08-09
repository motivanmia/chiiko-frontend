<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { watch, ref } from 'vue';

  const SchoolCategory = [
    {
      title: '植物性食材',
      value: 'vegetable',
      img: new URL('@/assets/image/School/vegetables.jpg', import.meta.url).href,
    },
    {
      title: '動物性食材',
      value: 'meat',
      img: new URL('@/assets/image/School/meat.jpg', import.meta.url).href,
    },
  ];

  const router = useRouter();
  const route = useRoute();
  const category = ref(route.query.category || '');
  watch(
    () => route.query.category,
    (newVal, oldVal) => {
      category.value = newVal;

      setTimeout(() => {
        window.scrollTo({
          top: 390,
          behavior: 'smooth',
        });
      }, 100);
    },
  );

  const onCategoryClick = (value) => {
    if (category.value === value) {
      router.push({ query: {} });
    } else {
      router.push({
        query: {
          category: value,
        },
      });
    }
  };
</script>

<template>
  <div class="category">
    <div
      class="category__buttons"
      v-for="item in SchoolCategory"
      :key="item.value"
      @click="onCategoryClick(item.value)"
    >
      <img
        :class="['category__img', { 'category__img--active': category === item.value }]"
        :src="item.img"
        alt=""
      />
      <h2>{{ item.title }}</h2>
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
    gap: 10px;
    padding: 0 10px;

    &__buttons {
      width: 494px;
      // background-color: aqua;
      border-radius: 20px;
      text-align: center;
      position: relative;
      overflow: hidden;
      cursor: pointer;

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
        font-weight: 700;
      }
    }
    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(4px) brightness(0.7);
      transition: all 0.3s ease;
      &:hover {
        filter: blur(0px);
        transform: scale(1.05);
      }
      &--active {
        filter: blur(0px);
        transform: scale(1.05);
      }
    }
  }
</style>
