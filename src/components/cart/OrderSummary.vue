<script setup>
  import { useRouter } from 'vue-router';
  import { useCartStore } from '@/stores/useCartStore';
  import { storeToRefs } from 'pinia';
  import ConfirmButton from '../button/ConfirmButton.vue';

  const router = useRouter();
  const cart = useCartStore();
  const { subtotal, shippingCost, total } = storeToRefs(cart);
  const { submitOrder, validateCheckoutForm } = cart;

  const handleSubmitOrder = () => {
    if (!validateCheckoutForm()) return;
    const data = submitOrder();
    router.push({ path: '/order-success' });
    console.log('submit', data);
  };
</script>

<template>
  <aside class="order-summary">
    <header class="order-summary__header">
      <h2 class="order-summary__title">結帳金額</h2>
    </header>
    <div class="order-summary__content">
      <div class="order-summary__calculate">
        <div class="order-summary__row">
          <span class="order-summary__label">小計</span>
          <span class="order-summary__price">
            NT$
            <span class="order-summary__price-number">{{ subtotal }}</span>
          </span>
        </div>
        <div class="order-summary__row">
          <span class="order-summary__label">運費</span>
          <span class="order-summary__price">
            NT$
            <span class="order-summary__price-number">{{ shippingCost }}</span>
          </span>
        </div>
        <div class="order-summary__free-shipping">單筆滿千免運</div>
      </div>
      <div class="order-summary__row order-summary__row--total">
        <span class="order-summary__label">應付總額</span>
        <span class="order-summary__price">
          NT$
          <span class="order-summary__price-number">{{ total }}</span>
        </span>
      </div>
      <ConfirmButton
        class="order-summary__submit"
        @click.prevent="handleSubmitOrder"
      >
        立即結帳
      </ConfirmButton>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
  .order-summary {
    @include cardBoxShadow;
    background-color: white;
    border-radius: px(20);
    margin-bottom: px(10);
    overflow: hidden;

    &__header {
      @include flex();
      padding: px(16) px(20);
      background-color: color(backgroundColor, panel);
      @include fontSet($size: px(24), $lh: 1.2, $color: white, $ls: 0.1em);
    }

    &__content {
      padding: px(20);
    }

    &__calculate {
      border-bottom: px(1) solid color(text, dark);
    }

    &__row {
      @include flex($jc: space-between);

      & + & {
        margin-top: px(40);
      }

      &--total {
        padding: px(25) 0;
        .order-summary__label {
          @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
        }

        .order-summary__price {
          @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
        }

        .order-summary__price-number {
          @include fontSet($size: px(28), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
        }
      }
    }

    &__free-shipping {
      @include fontSet($size: px(16), $lh: 1.2, $color: #969696, $ls: 0.1em);
      padding-top: px(10);
      padding-bottom: px(20);
    }

    &__label {
      @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
    }

    &__price {
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
    }

    &__submit {
      width: 100%;
      white-space: nowrap;
    }
  }
</style>
