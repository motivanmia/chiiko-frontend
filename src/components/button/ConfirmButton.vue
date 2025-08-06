<script setup>
  import { defineProps } from 'vue';

  const props = defineProps({
    type: {
      type: String,
      default: 'button',
    },
  });
</script>

<template>
  <button
    :type="props.type"
    class="confirm__btn"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
  .confirm__btn {
    padding: var(--btn-padding, 14px 100px);
    background-color: color(button, main);
    border: none;
    border-radius: 20px;
    cursor: pointer;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(24),
      $color: color(text, light),
      $ls: 1.8px
    );
  }
  .confirm__btn:hover {
    background-color: color(orangeColor, base);
    transition: 0.2s ease;
  }
</style>
