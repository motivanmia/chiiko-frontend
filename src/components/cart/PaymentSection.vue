<script setup>
  import { computed } from 'vue';
  import { deliveryOptions, locationOptions, paymentOptions } from '@/constants/cartOption';
  import PaymentOption from './PaymentOption.vue';
  import CreditCardForm from './CreditCardForm.vue';

  const props = defineProps({
    paymentForm: {
      type: Object,
      required: true,
    },
  });

  const emit = defineEmits(['update:payment-form']);

  // radio 雙向綁定
  const selectedDelivery = computed({
    get: () => props.paymentForm.delivery,
    set: (val) => {
      emit('update:payment-form', { ...props.paymentForm, delivery: val });
    },
  });

  const selectedLocation = computed({
    get: () => props.paymentForm.location,
    set: (val) => {
      emit('update:payment-form', { ...props.paymentForm, location: val });
    },
  });

  const selectedPayment = computed({
    get: () => props.paymentForm.paymentMethod,
    set: (val) => {
      emit('update:payment-form', { ...props.paymentForm, paymentMethod: val });
    },
  });

  // 信用卡雙向綁定
  const cardNumber = computed({
    get: () => props.paymentForm.cardNumber,
    set: (val) => emit('update:payment-form', { ...props.paymentForm, cardNumber: val }),
  });

  const expMonth = computed({
    get: () => props.paymentForm.expMonth,
    set: (val) => emit('update:payment-form', { ...props.paymentForm, expMonth: val }),
  });

  const cvv = computed({
    get: () => props.paymentForm.cvv,
    set: (val) => emit('update:payment-form', { ...props.paymentForm, cvv: val }),
  });

  const cardHolder = computed({
    get: () => props.paymentForm.cardHolder,
    set: (val) => emit('update:payment-form', { ...props.paymentForm, cardHolder: val }),
  });
</script>

<template>
  <section class="payment-section">
    <header class="payment-section__header">
      <h2 class="payment-section__title">付款運送方式</h2>
    </header>

    <div class="payment-section__list">
      <PaymentOption
        title="配送方式"
        v-model="selectedDelivery"
        name="location"
        :options="deliveryOptions"
        class="payment-section__delivery"
      />
      <PaymentOption
        title="配送地區"
        v-model="selectedLocation"
        name="location"
        :options="locationOptions"
      />
      <PaymentOption
        title="付款方式"
        v-model="selectedPayment"
        name="paymentMethod"
        :options="paymentOptions"
      />

      <CreditCardForm
        v-if="selectedPayment === 'card'"
        v-model:card-number="cardNumber"
        v-model:exp-month="expMonth"
        v-model:cvv="cvv"
        v-model:card-holder="cardHolder"
      />
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
