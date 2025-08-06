<script setup>
  import { useCartStore } from '@/stores/useCartStore';
  import CartStep from '@/components/cart/CartStep.vue';
  import OrderList from '@/components/cart/OrderList.vue';
  import OrderInfo from '@/components/cart/OrderInfo.vue';

  const cart = useCartStore();
  const { setCurrentStep } = cart;

  setCurrentStep(3);
</script>

<template>
  <div class="order-page__container container-large">
    <div class="order-page container">
      <CartStep class="order-page__step" />
      <h2 class="order-page__title">
        訂單已成立!!!
        <span class="order-page__title-second">感謝您的購買</span>
      </h2>
      <div class="order-page__main">
        <OrderList />
        <OrderInfo />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .order-page__container {
    position: relative;
  }

  .order-page {
    &__title {
      @include flex();
      column-gap: px(40);
      margin-bottom: px(85);
      @include fontSet($size: px(32), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
    }
  }

  @include rwdmax(768) {
    .order-page {
      &__title {
        flex-direction: column;
        row-gap: px(20);
        margin-bottom: px(15);
        @include font-size(24);
      }

      &__step {
        display: none;
      }
    }
  }
</style>
