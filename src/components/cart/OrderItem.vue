<script setup>
  defineProps({
    product: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <div class="order-item">
    <div class="order-item__pic">
      <img
        class="order-item__image"
        :src="product.preview_image"
        :alt="product.product_name"
      />
    </div>
    <div class="order-item__info">
      <h3 class="order-item__name">{{ product.product_name }}</h3>
      <span class="order-item__unit-price">
        NT$
        <span class="order-item__unit-price-number">{{ product.unit_price }}</span>
      </span>
    </div>
    <div class="order-item__quantity">數量 {{ product.quantity }}</div>
    <div class="order-item__subtotal">
      NT$
      <span class="order-item__subtotal-number">{{ product.subtotal }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .order-item {
    display: grid;
    grid-template-columns: px(110) 2fr 1fr 1fr;
    padding: px(20) 0;

    &:first-child {
      padding-top: 0;
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
      flex: 1;
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
    }

    &__unit-price {
      flex: 1;
      text-align: center;
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

      &-number {
        @include font-size(20);
      }
    }

    &__quantity {
      @include flex();
    }

    &__subtotal {
      @include flex($jc: flex-end);
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      text-align: center;
    }
  }

  @include rwdmax(768) {
    .order-item {
      position: relative;
      grid-template-columns: px(95) 1fr 1fr;

      border-bottom: 1px solid #f0f0f0;

      &__info {
        @include flex($d: column, $jc: space-evenly, $ai: flex-start);
        min-width: max-content;
      }

      &__name {
        flex: unset;
      }

      &__unit-price {
        flex: unset;
      }

      &__quantity {
        align-items: flex-end;
        justify-content: flex-end;
        margin-bottom: px(10);
      }

      &__subtotal {
        grid-column: span 3;
        margin-left: auto;
        margin-top: px(20);
      }
    }
  }
</style>
