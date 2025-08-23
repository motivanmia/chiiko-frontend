<script setup>
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useCartStore } from '@/stores/useCartStore';
  import CartStep from '@/components/cart/CartStep.vue';
  import CartList from '@/components/cart/CartList.vue';
  import PaymentSection from '@/components/cart/PaymentSection.vue';
  import RecipientSection from '@/components/cart/RecipientSection.vue';
  import OrderSummary from '@/components/cart/OrderSummary.vue';
  import ConfirmButton from '@/components/button/ConfirmButton.vue';

  const router = useRouter();

  const cart = useCartStore();
  const { products } = storeToRefs(cart);
  const { setCurrentStep, resetForms, loadCart, loadUserProfile } = cart;

  const goToProduct = () => {
    router.push({
      name: 'product',
    });
  };

  onMounted(() => {
    setCurrentStep(1);
    resetForms();
    loadCart();
    loadUserProfile();
  });
</script>

<template>
  <div class="cart-page__container container-large">
    <div
      v-if="products.length > 0"
      class="cart-page container"
    >
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
    <div
      v-else
      class="cart-page__empty container"
    >
      <h2 class="cart-page__empty-title">您的購物車是空的</h2>
      <ConfirmButton
        class="cart-page__empty-button"
        @click.prevent="goToProduct"
      >
        去好物精選逛逛
      </ConfirmButton>
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

    &__empty {
      @include flex;
      gap: px(40);
      flex-direction: column;
      text-align: center;

      &-title {
        @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      }
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
