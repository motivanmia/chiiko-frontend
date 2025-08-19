<script setup>
  import { onMounted } from 'vue';
  import { useCartStore } from '@/stores/useCartStore';
  import CartStep from '@/components/cart/CartStep.vue';
  import CartList from '@/components/cart/CartList.vue';
  import PaymentSection from '@/components/cart/PaymentSection.vue';
  import RecipientSection from '@/components/cart/RecipientSection.vue';
  import OrderSummary from '@/components/cart/OrderSummary.vue';

  const cart = useCartStore();
  const { setCurrentStep, resetForms } = cart;

  onMounted(() => {
    setCurrentStep(1);
    resetForms();
  });
</script>

<template>
  <div class="cart-page__container container-large">
    <div class="cart-page container">
      <CartStep />
      <div class="cart-page__wrap">
        <main class="cart-page__main">
          <CartList />

          <PaymentSection />

          <RecipientSection />
        </main>

        <OrderSummary class="cart-page__summary" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .cart-page__container {
    position: relative;
  }

  .cart-page {
    &__wrap {
      @include flex($wrap: wrap, $ai: flex-start);
      column-gap: px(10);
    }

    &__main {
      flex-grow: 1;
      flex-basis: px(680);
    }

    &__summary {
      flex-grow: 1;
      flex-basis: px(300);
      position: sticky;
      top: px(170);
    }
  }

  @include rwdmax(768) {
    .cart-page {
      &__main {
        width: 100%;
      }

      &__summary {
        width: 100%;
      }
    }
  }
</style>
