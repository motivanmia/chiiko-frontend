<script setup>
  import { useCartStore } from '@/stores/useCartStore';
  import Icon from '../common/Icon.vue';

  const cart = useCartStore();
  const { increaseQuantity, decreaseQuantity } = cart;

  defineProps({
    productId: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  });
</script>

<template>
  <div class="quantity-control">
    <button
      class="quantity-control__button quantity-control__button--decrease"
      @click="decreaseQuantity(productId)"
    >
      <Icon
        icon-name="minus"
        class="quantity-control__icon"
      />
    </button>
    <input
      type="number"
      class="quantity-control__input"
      :value="quantity"
      min="1"
      readonly
    />
    <button
      class="quantity-control__button quantity-control__button--increase"
      @click="increaseQuantity(productId)"
    >
      <Icon
        icon-name="plus"
        class="quantity-control__icon"
      />
    </button>
  </div>
</template>

<style lang="scss" scoped>
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  .quantity-control {
    @include flex();

    &__button {
      background-color: white;
      border: unset;
      @include fontSet($size: px(20));
      cursor: pointer;

      &--decrease {
        border-radius: px(20) 0 0 px(20);
      }

      &--increase {
        border-radius: 0 px(20) px(20) 0;
      }
    }

    &__input {
      width: 100%;
      padding: 0;
      border: unset;
      text-align: center;
      @include fontSet($size: px(20));

      &:focus {
        outline: none;
      }
    }
  }
</style>
