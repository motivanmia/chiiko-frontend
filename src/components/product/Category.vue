<script setup>
  import { useRoute, useRouter } from 'vue-router';
  import { watch, ref } from 'vue';

  const productCategory = [
    {
      title: '鍋具/鍋鏟',
      value: '1',
      img: new URL('@/assets/image/Product/pot1.png', import.meta.url).href,
    },
    {
      title: '烤箱/氣炸鍋',
      value: '2',
      img: new URL('@/assets/image/Product/oven1.png', import.meta.url).href,
    },
    {
      title: '刀具/砧板',
      value: '3',
      img: new URL('@/assets/image/Product/knife1.png', import.meta.url).href,
    },
    {
      title: '廚房小物  ',
      value: '4',
      img: new URL('@/assets/image/Product/life1.png', import.meta.url).href,
    },
  ];

  const router = useRouter();
  const route = useRoute();
  const category = ref(route.query.product_category_id || '');
  watch(
    () => route.query.product_category_id,
    (newVal) => {
      category.value = newVal || '';

      setTimeout(() => {
        window.scrollTo({
          top: 392,
          behavior: 'smooth',
        });
      }, 0);
    },
    { immediate: true },
  );

  const onCategoryClick = (value) => {
    router.push({
      path: '/products', // 導航到專門的商品分類頁面
      query: {
        product_category_id: value, // 使用後端 API 預期的參數名稱
      },
    });
  };
</script>

<template>
  <div class="category">
    <div
      class="category__buttons"
      v-for="item in productCategory"
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
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    @include rwdmax(768) {
      gap: 10px;
    }

    &__buttons {
      width: 285px;
      height: 80px;
      border-radius: 20px;
      text-align: center;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      @include rwdmax(768) {
        width: 173px;
        height: 65px;
      }
      &:hover {
        .category__img {
          filter: blur(0px);
          transform: scale(1.05);
        }
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
        font-weight: 700;
        @include rwdmax(768) {
          font-size: 20px;
        }
      }
    }
    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(4px) brightness(0.7);
      transition: all 0.3s ease;

      &--active {
        filter: blur(0px);
        transform: scale(1.05);
      }
    }
  }
</style>
