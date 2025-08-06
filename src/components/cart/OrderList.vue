<script setup>
  import OrderItem from './OrderItem.vue';
  import { useCartStore } from '@/stores/useCartStore';

  const cart = useCartStore();
  const { submitOrder } = cart;
  const { products, shippingCost, total } = submitOrder();
</script>

<template>
  <section class="order-list">
    <header class="order-list__header">
      <div class="order-list__id">您的訂單編號 #12345</div>
      <div class="order-list__date">訂購日期 2025-07-01</div>
    </header>

    <div class="order-list__items">
      <OrderItem
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
      <div class="order-list__shipping-cost">
        <div class="order-list__shipping-cost-content">
          運費
          <span class="order-list__shipping-cost-price">NT${{ shippingCost }}</span>
        </div>
      </div>
      <div class="order-list__total">
        <div class="order-list__total-content">
          總金額
          <span class="order-list__total-price">NT${{ total }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .order-list {
    @include cardBoxShadow;
    background-color: white;
    border-radius: px(20);
    margin-bottom: px(10);
    overflow: hidden;

    &__header {
      @include flex($jc: flex-start);
      column-gap: px(80);
      background-color: color(backgroundColor, panel);
      padding: px(16) px(20);

      @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
    }

    &__items {
      padding: px(30) px(20);
    }

    &__shipping-cost {
      padding: px(30) 0;
      border-top: px(1) solid color(text, dark);

      &-content {
        width: fit-content;
        margin-left: auto;
        @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      }

      &-price {
        margin-left: px(70);
      }
    }

    &__total {
      padding-top: px(30);
      border-top: px(1) solid color(text, dark);

      &-content {
        width: fit-content;
        margin-left: auto;
        @include fontSet($size: px(32), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      }

      &-price {
        margin-left: px(70);
      }
    }
  }

  @include rwdmax(768) {
    .order-list {
      @include cardBoxShadow;
      background-color: white;
      border-radius: px(20);
      margin-bottom: px(10);
      overflow: hidden;

      &__header {
        @include flex($ai: flex-start);
        flex-direction: column;
        row-gap: px(15);
        @include font-size(20);
      }

      &__shipping-cost {
        &-price {
          margin-left: px(20);
        }
      }

      &__total {
        &-content {
          @include font-size(24);
        }

        &-price {
          margin-left: px(20);
        }
      }
    }
  }
</style>
