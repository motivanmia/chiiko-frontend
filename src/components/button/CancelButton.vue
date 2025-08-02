<script setup></script>

<template>
  <button class="cancel__btn">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
  .cancel__btn {
    padding: 14px 100px;
    background-color: #fff;
    border: 1px solid color(backgroundColor, panel);
    border-radius: 20px;
    cursor: pointer;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(24),
      $color: color(text, dark),
      $ls: 1.8px
    );
  }
  .cancel__btn:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
  }
</style>
