<script setup></script>

<template>
  <button class="confirm__btn">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
  .confirm__btn {
    padding: 14px 100px;
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
