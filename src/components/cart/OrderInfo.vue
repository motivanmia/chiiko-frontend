<script setup>
  import { useCartStore } from '@/stores/useCartStore';
  import { useRouter } from 'vue-router';
  import CancelButton from '../button/CancelButton.vue';
  import ConfirmButton from '../button/ConfirmButton.vue';
  const cart = useCartStore();
  const router = useRouter();

  const { submitOrder } = cart;
  const { recipient, payment } = submitOrder();

  const goHome = () => {
    router.push({ path: '/home' });
  };

  const goToOrder = () => {
    router.push({ path: '/account/orders' });
  };
</script>

<template>
  <section class="order-info">
    <header class="order-info__header">
      <h2 class="order-info__title">收件資訊</h2>
    </header>

    <div class="order-info__list">
      <div class="order-info__content">
        <div class="order-info__label">收件人</div>
        <span class="order-info__desc">{{ recipient.name }}</span>
        <div class="order-info__label">連絡電話</div>
        <span class="order-info__desc">{{ recipient.phone }}</span>
        <div class="order-info__label">收件地址</div>
        <span class="order-info__desc">
          {{ recipient.postal }} {{ recipient.city }}{{ recipient.district }}{{ recipient.address }}
        </span>
        <div class="order-info__label">付款方式</div>
        <span class="order-info__desc">{{ payment.paymentMethod }}</span>
      </div>

      <div class="order-info__button-container">
        <CancelButton
          class="order-info__button"
          @click="goToOrder"
        >
          訂單查詢
        </CancelButton>
        <ConfirmButton
          class="order-info__button"
          @click="goHome"
        >
          前往首頁
        </ConfirmButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .order-info {
    @include cardBoxShadow;
    background-color: white;
    border-radius: px(20);
    margin-bottom: px(10);
    overflow: hidden;

    &__header {
      padding: px(16) px(20);
      background-color: color(backgroundColor, panel);
      @include fontSet($size: px(32), $lh: 1.2, $color: white, $ls: 0.1em);
    }

    &__list {
      padding: px(30) px(20);
    }

    &__content {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: px(20) px(160);

      @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
    }

    &__button-container {
      @include flex($jc: space-between);
      gap: px(100);
      margin-top: px(70);
    }

    &__button {
      flex: 1;
      @include font-size(32);
      padding: px(10) px(50);
    }
  }

  @include rwdmax(768) {
    .order-info {
      &__header {
        @include font-size(24);
      }

      &__title {
        text-align: center;
      }

      &__content {
        gap: px(20) px(40);
        @include font-size(20);
      }

      &__button-container {
        flex-direction: column;
        row-gap: px(20);
        margin-top: px(30);
      }

      &__button {
        width: 100%;
        @include font-size(24);
      }
    }
  }
</style>
