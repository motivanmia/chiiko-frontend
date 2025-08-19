<script setup>
  import { useCartStore } from '@/stores/useCartStore';
  import { storeToRefs } from 'pinia';
  import FormGroup from './FormGroup.vue';
  import { computed } from 'vue';

  const cart = useCartStore();
  const { paymentForm, errors } = storeToRefs(cart);
  const { updatePaymentForm, validateCreditCardField } = cart;

  const cardNumber = computed({
    get: () => paymentForm.value.cardNumber,
    set: (val) => updatePaymentForm('cardNumber', val),
  });

  const expMonth = computed({
    get: () => paymentForm.value.expMonth,
    set: (val) => updatePaymentForm('expMonth', val),
  });

  const cvv = computed({
    get: () => paymentForm.value.cvv,
    set: (val) => updatePaymentForm('cvv', val),
  });

  const cardHolder = computed({
    get: () => paymentForm.value.cardHolder,
    set: (val) => updatePaymentForm('cardHolder', val),
  });
</script>

<template>
  <div class="credit-card-form">
    <FormGroup
      label="卡號"
      placeholder="＊＊＊＊-＊＊＊＊-＊＊＊＊-＊＊＊＊"
      v-model="cardNumber"
      :error="errors.payment.cardNumber"
      @blur="validateCreditCardField('cardNumber')"
    />

    <div class="credit-card-form__wrap">
      <FormGroup
        label="卡片有效年月"
        placeholder="MM/YY"
        v-model="expMonth"
        class="credit-card-form__wrap-item"
        :error="errors.payment.expMonth"
        @blur="validateCreditCardField('expMonth')"
      />
      <FormGroup
        label="CVV/CVC"
        placeholder="卡片背面檢查碼"
        v-model="cvv"
        class="credit-card-form__wrap-item"
        :error="errors.payment.cvv"
        @blur="validateCreditCardField('cvv')"
      />
    </div>

    <FormGroup
      label="持卡人姓名"
      placeholder="請輸入卡片上的姓名"
      v-model="cardHolder"
      :error="errors.payment.cardHolder"
      @blur="validateCreditCardField('cardHolder')"
    />
  </div>
</template>

<style lang="scss" scoped>
  .credit-card-form {
    &__wrap {
      @include flex($jc: space-between);
      column-gap: px(40);

      &-item {
        flex: 1;
      }
    }
  }

  @include rwdmax(768) {
    .credit-card-form {
      &__wrap {
        flex-direction: column;

        &-item {
          width: 100%;
        }
      }
    }
  }
</style>
