<script setup>
  import { deliveryOptions, locationOptions, paymentOptions } from '@/constants/cartOption';
  import { useCartStore } from '@/stores/useCartStore';
  import { storeToRefs } from 'pinia';
  import PaymentOption from './PaymentOption.vue';
  import CreditCardForm from './CreditCardForm.vue';

  const cart = useCartStore();
  const { paymentForm } = storeToRefs(cart);
</script>

<template>
  <section class="payment-section">
    <header class="payment-section__header">
      <h2 class="payment-section__title">付款運送方式</h2>
    </header>

    <div class="payment-section__list">
      <PaymentOption
        title="配送方式"
        v-model="paymentForm.delivery"
        name="location"
        :options="deliveryOptions"
        class="payment-section__delivery"
      />
      <PaymentOption
        title="配送地區"
        v-model="paymentForm.location"
        name="location"
        :options="locationOptions"
      />
      <PaymentOption
        title="付款方式"
        v-model="paymentForm.paymentMethod"
        name="paymentMethod"
        :options="paymentOptions"
      />
      <CreditCardForm v-show="paymentForm.paymentMethod === 'card'" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .payment-section {
    @include cardBoxShadow;
    background-color: white;
    border-radius: px(20);
    margin-bottom: px(10);
    overflow: hidden;

    &__header {
      padding: px(16) px(20);
      background-color: color(backgroundColor, panel);
      @include fontSet($size: px(24), $lh: 1.2, $color: white, $ls: 0.1em);
    }

    &__list {
      padding: px(30) px(20);
    }
  }

  @include rwdmax(768) {
    .payment-section {
      &__title {
        text-align: center;
      }
    }
  }
</style>
