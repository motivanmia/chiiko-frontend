<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    product: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="product-card__box">
    <div class="product-card__pic">
      <img
        :src="props.product.preview_image"
        :alt="props.product.name"
        class="product-card__img"
      />
    </div>
    <div class="product-card__content">
      <p class="product-card__name">{{ props.product.name }}</p>
      <!-- <p class="product-card__desc">{{ product.product_info }}</p> -->
      <div class="product-card__price">${{ props.product.unit_price }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .product-card {
    &__box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      flex: 0 1 calc(33.333% - 47px); // 三欄布局，扣除 gap
      min-width: 0;
      @include rwdmax(1024) {
        flex: 0 1 calc(33.333% - 20px); // 三欄布局，扣除 gap
      }

      @include rwdmax(768) {
        flex: 0 1 calc(50% - 15px); // 手機：單欄
      }
    }

    &__pic {
      width: 100%;
      height: 20vw;
      padding-bottom: 110%;
      height: 0;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      border-radius: 20px;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-10px);
      }
    }

    &__img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover; // 核心屬性，讓圖片填滿並裁切多餘部分
      object-position: center; // 可選，確保圖片置中
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &__content {
      text-align: left;
      font-family: Arial, sans-serif;
      text-decoration: none;
      color: inherit;
      width: 100%;
      overflow: hidden;
      display: block;
      @include rwdmax(768) {
        padding-inline: 10px;
      }
    }
    &__name {
      margin-top: 28px;
      font-size: 30px;
      color: color(text, dark);
      font-weight: normal;
      letter-spacing: 0.2em;
      @include rwdmax(1200) {
        margin-top: 20px;
        font-size: 24px;
      }
      @include rwdmax(768) {
        margin-top: 10px;
        font-size: 18px;
      }
    }
    &__desc {
      font-size: 16px;
      color: color(text, base);
      letter-spacing: 0.2em;
      margin-top: 10px;
      @include rwdmax(1024) {
        font-size: 14px;
      }
      @include rwdmax(768) {
        margin-top: 5px;
      }
    }
    &__name,
    &__desc {
      display: block;
      max-width: 100%; // 確保寬度不超過父容器
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &__price {
      letter-spacing: 0.1em;
      font-size: 30px;
      font-weight: normal;
      color: color(text, dark);
      margin-top: 20px;
      @include rwdmax(1200) {
        margin-top: 15px;
        font-size: 24px;
      }
      @include rwdmax(768) {
        margin-top: 10px;
        font-size: 18px;
      }
    }
  }
</style>
