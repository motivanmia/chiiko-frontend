<script setup>
  import { useCartStore } from '@/stores/useCartStore';
  import { storeToRefs } from 'pinia';

  const cart = useCartStore();
  const { currentStep } = storeToRefs(cart);
</script>

<template>
  <section class="cart-step">
    <ol class="cart-step__list">
      <li
        class="cart-step__item"
        :class="{ 'cart-step__item--active': currentStep >= 1 }"
      >
        <div class="cart-step__number">1</div>
        <h2 class="cart-step__title">確認訂單明細</h2>
      </li>
      <li
        class="cart-step__dots"
        :class="{ 'cart-step__dots--active': currentStep >= 1 }"
      >
        <div
          v-for="dot in 8"
          class="cart-step__dot"
        ></div>
      </li>
      <li
        class="cart-step__item"
        :class="{ 'cart-step__item--active': currentStep >= 2 }"
      >
        <div class="cart-step__number">2</div>
        <h2 class="cart-step__title">前往付款</h2>
      </li>
      <li
        class="cart-step__dots"
        :class="{ 'cart-step__dots--active': currentStep >= 2 }"
      >
        <div
          v-for="dot in 8"
          class="cart-step__dot"
        ></div>
      </li>
      <li
        class="cart-step__item"
        :class="{ 'cart-step__item--active': currentStep >= 3 }"
      >
        <div class="cart-step__number">3</div>
        <h2 class="cart-step__title">訂單成立</h2>
      </li>
    </ol>
  </section>
</template>

<style lang="scss" scoped>
  .cart-step {
    margin-bottom: px(85);

    &__list {
      @include flex($jc: space-evenly, $ai: center);
      height: px(81);
    }

    &__item {
      position: relative;
      @include flex($ai: flex-end);
      opacity: 0.3;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        width: px(70);
        height: px(70);
        background-color: color(backgroundColor, panel);
        border-radius: 50%;
        box-shadow:
          0 0 0 px(5) white,
          0 0 0 px(6) color(backgroundColor, panel);

        @include rwdmax(768) {
          display: none;
        }
      }

      &--active {
        opacity: 1;
      }

      &:not(&--active) {
        @include rwdmax(768) {
          display: none;
        }
      }
    }

    &__number {
      position: relative;
      z-index: 1;
      @include fontSet($basic-font, normal, px(60), unset, color(text, dark), 0.1em);

      @include rwdmax(768) {
        display: none;
      }
    }

    &__title {
      position: relative;
      z-index: 1;
      @include fontSet($basic-font, normal, px(24), 1.2, color(text, dark), 0.1em);
      white-space: nowrap;
    }

    &__dots {
      @include flex($jc: space-evenly, $ai: flex-end);
      height: fit-content;
      margin-top: auto;
      opacity: 0.3;

      @include rwdmax(768) {
        display: none;
      }

      &--active {
        opacity: 1;
      }
    }

    &__dot {
      margin-top: auto;
      width: px(8);
      height: px(8);
      background-color: color(text, dark);
      border-radius: 50%;
      margin-right: pxTovw(15);
    }
  }

  @include rwdmax(768) {
    .cart-step {
      margin-bottom: px(30);

      &__list {
        height: auto;
      }

      &__item {
        &::before {
          @include rwdmax(768) {
            display: none;
          }
        }

        &:not(&--active) {
          @include rwdmax(768) {
            display: none;
          }
        }
      }

      &__number {
        @include rwdmax(768) {
          display: none;
        }
      }

      &__dots {
        @include rwdmax(768) {
          display: none;
        }
      }
    }
  }
</style>
