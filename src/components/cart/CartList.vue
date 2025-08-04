<script setup>
  import CartItem from './CartItem.vue';

  defineProps({
    products: {
      type: Array,
      required: true,
    },
  });

  defineEmits(['increase-quantity', 'decrease-quantity', 'remove-product']);
</script>

<template>
  <section class="cart-list">
    <header class="cart-list__header">
      <span class="cart-list__title">商品明細</span>
      <span class="cart-list__hidden"></span>
      <span class="cart-list__unit-price">單價</span>
      <span class="cart-list__count">數量</span>
      <span class="cart-list__price">小計</span>
    </header>

    <div class="cart-list__items">
      <CartItem
        v-for="product in products"
        :key="product.id"
        :product="product"
        @increase-quantity="$emit('increase-quantity', product.id)"
        @decrease-quantity="$emit('decrease-quantity', product.id)"
        @remove-product="$emit('remove-product', product.id)"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .cart-list {
    @include cardBoxShadow;
    background-color: white;
    border-radius: px(20);
    margin-bottom: px(10);
    overflow: hidden;

    &__header {
      display: grid;
      grid-template-columns: 2fr px(110) 1fr 1fr 1fr px(30);
      background-color: color(backgroundColor, panel);
      padding: px(16) px(20);

      @include fontSet($size: px(24), $lh: 1.2, $color: white, $ls: 0.1em);
    }

    &__unit-price,
    &__count,
    &__price {
      text-align: center;
    }

    &__items {
      padding: px(30) px(20);
    }
  }

  @include rwdmax(768) {
    .cart-list {
      background-color: white;

      &__header {
        @include flex();
        padding: px(20) px(10);
      }

      &__unit-price,
      &__count,
      &__price {
        display: none;
      }

      &__items {
        padding: px(20) px(10);
      }
    }
  }
</style>
