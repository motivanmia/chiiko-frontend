<script setup>
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps({
    type: {
      type: String,
      default: 'button',
    },
  });

  const emit = defineEmits(['click']);
  const handleClick = (event) => {
    emit('click', event);
  };
</script>

<template>
  <button
    :type="props.type"
    class="cancel__btn"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
  .cancel__btn {
    padding: var(--btn-padding, 14px 100px);
    background-color: #fff;
    border: 1px solid color(backgroundColor, panel);
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(24),
      $color: color(text, dark),
      $ls: 1.8px
    );
    @include rwdmax(1200) {
      @include font-size(20);
    }
  }
  .cancel__btn:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
  }
</style>
