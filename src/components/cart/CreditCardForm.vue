<script setup>
  import { useCartStore } from '@/stores/useCartStore';
  import { storeToRefs } from 'pinia';
  import FormGroup from './FormGroup.vue';

  const cart = useCartStore();
  const { paymentForm } = storeToRefs(cart);
  const { updatePaymentForm } = cart;
</script>

<template>
  <div class="credit-card-form">
    <FormGroup
      label="卡號"
      placeholder="＊＊＊＊-＊＊＊＊-＊＊＊＊-＊＊＊＊"
      :model-value="paymentForm.cardNumber"
      @update:modelValue="(val) => updatePaymentForm('cardNumber', val)"
    />

    <div class="credit-card-form__wrap">
      <FormGroup
        label="卡片有效年月"
        placeholder="MM/YY"
        :model-value="paymentForm.expMonth"
        @update:modelValue="(val) => updatePaymentForm('expMonth', val)"
        class="credit-card-form__wrap-item"
      />
      <FormGroup
        label="CVV/CVC"
        placeholder="卡片背面檢查碼"
        :model-value="paymentForm.cvv"
        @update:modelValue="(val) => updatePaymentForm('cvv', val)"
        class="credit-card-form__wrap-item"
      />
    </div>

    <FormGroup
      label="持卡人姓名"
      placeholder="請輸入卡片上的姓名"
      :model-value="paymentForm.cardHolder"
      @update:modelValue="(val) => updatePaymentForm('cardHolder', val)"
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
