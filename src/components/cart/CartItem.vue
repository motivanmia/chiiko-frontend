<script setup>
  import { useCartStore } from '@/stores/useCartStore';
  import Icon from '../common/Icon.vue';
  import QuantityControl from './QuantityControl.vue';

  const cart = useCartStore();
  const { removeProduct } = cart;

  defineProps({
    product: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="cart-item">
    <div class="cart-item__pic">
      <img
        class="cart-item__image"
        :src="product.image"
        :alt="product.name"
      />
    </div>
    <div class="cart-item__info">
      <h3 class="cart-item__name">{{ product.name }}</h3>
      <span class="cart-item__unit-price">
        NT$
        <span class="cart-item__unit-price-number">{{ product.price }}</span>
      </span>
    </div>
    <QuantityControl
      :quantity="product.quantity"
      :product-id="product.id"
      class="cart-item__quantity"
    />
    <div class="cart-item__subtotal">
      NT$
      <span class="cart-item__subtotal-number">{{ product.price * product.quantity }}</span>
    </div>
    <button
      class="cart-item__remove"
      @click="removeProduct(product.id)"
    >
      <Icon icon-name="remove" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .cart-item {
    display: grid;
    grid-template-columns: px(110) 3fr 1fr 1fr px(30);
    padding: px(20) 0;

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }

    & + & {
      border-top: px(1) solid color(text, dark);
    }

    &__pic {
      width: px(80);
      height: px(80);
      border-radius: px(20);
      overflow: hidden;
    }

    &__image {
      @include fit();
      aspect-ratio: 1 / 1;
    }

    &__info {
      @include flex();
    }

    &__name {
      flex: 2;
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
    }

    &__unit-price {
      flex: 1;
      text-align: center;
      @include fontSet($size: px(16), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

      &-number {
        @include font-size(20);
      }
    }

    &__subtotal {
      @include flex();
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      text-align: center;

      &-number {
        @include font-size(24);
      }
    }

    &__remove {
      width: px(30);
      background: none;
      border: none;
      @include fontSet($size: px(20), $color: color(text, dark));
      cursor: pointer;

      &:hover {
        color: color(text, error);
      }
    }
  }

  @include rwdmax(768) {
    .cart-item {
      position: relative;
      grid-template-columns: px(95) 1fr;
      // border-bottom: 1px solid #f0f0f0;

      &:first-child &__remove {
        top: px(10);
      }

      &__info {
        @include flex($d: column, $jc: space-evenly, $ai: flex-start);
      }

      &__name {
        flex: unset;
      }

      &__unit-price {
        flex: unset;
      }

      &__quantity {
        margin-right: auto;
        margin-top: px(20);
      }

      &__subtotal {
        margin-left: auto;
        margin-top: px(20);
      }

      &__remove {
        position: absolute;
        top: px(30);
        right: 0;
        width: fit-content;
      }
    }
  }
</style>
