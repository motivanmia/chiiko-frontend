<script setup>
  import CartStep from '@/components/cart/CartStep.vue';
  import CartList from '@/components/cart/CartList.vue';
  import PaymentSection from '@/components/cart/PaymentSection.vue';
  import RecipientSection from '@/components/cart/RecipientSection.vue';
  import OrderSummary from '@/components/cart/OrderSummary.vue';

  import { ref, computed } from 'vue';

  const products = ref([
    {
      id: 1,
      name: '不鏽鋼防夾刀',
      price: 200,
      quantity: 1,
      image: new URL('../assets/image/footer/01.png', import.meta.url).href,
    },
    {
      id: 2,
      name: '魚鱗刮刀',
      price: 1350,
      quantity: 1,
      image: new URL('../assets/image/footer/01.png', import.meta.url).href,
    },
    {
      id: 3,
      name: '日式長麵條板',
      price: 1150,
      quantity: 1,
      image: new URL('../assets/image/footer/01.png', import.meta.url).href,
    },
  ]);

  // 付款表單
  const paymentForm = ref({
    delivery: 'home',
    location: 'mainIsland',
    paymentMethod: 'card',
    cardNumber: '',
    expMonth: '',
    cvv: '',
    cardHolder: '',
  });

  // 收貨人表單
  const recipientForm = ref({
    buyerName: '小胖子',
    buyerPhone: '0912345678',
    buyerCity: '桃園市',
    buyerDistrict: '中壢區',
    buyerPostal: '320',
    buyerAddress: '復興路46號9樓',
    recipientName: '',
    recipientPhone: '',
    recipientCity: '',
    recipientDistrict: '',
    recipientPostal: '',
    recipientAddress: '',
  });

  const sameAsRecipient = ref(false);

  const subtotal = computed(() => {
    return products.value.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);
  });

  const shippingCost = computed(() => {
    if (subtotal.value >= 1000) return 0;
    return paymentForm.value.location === 'mainIsland' ? 100 : 200;
  });

  const total = computed(() => {
    return subtotal.value + shippingCost.value;
  });

  // const increaseQuantity = (productId) => {
  //   const product = products.value.find((p) => p.id === productId);
  //   if (product) {
  //     product.quantity++;
  //   }
  // };

  // const decreaseQuantity = (productId) => {
  //   const product = products.value.find((p) => p.id === productId);
  //   if (product && product.quantity > 1) {
  //     product.quantity--;
  //   }
  // };

  // const removeProduct = (productId) => {
  //   const index = products.value.findIndex((p) => p.id === productId);
  //   if (index > -1) {
  //     products.value.splice(index, 1);
  //   }
  // };

  const handleSubmitOrder = () => {
    console.log('提交訂單', {
      products: products.value,
      payment: paymentForm.value,
      recipient: recipientForm.value,
      total: total.value,
    });
  };
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
