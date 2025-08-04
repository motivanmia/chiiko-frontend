<script setup>
  import { useRouter } from 'vue-router';
  import Icon from '../common/Icon.vue';

  const router = useRouter();

  const handleClick = () => {
    router.back();
  };
</script>

<template>
  <button
    class="go-back"
    @click="handleClick"
  >
    <Icon
      icon-name="leftA"
      class="go-back__icon"
    />
    <div class="go-back__title">回前頁</div>
  </button>
</template>

<style lang="scss" scoped>
  .go-back {
    @include flex();
    color: color(text, light);
    background-color: color(backgroundColor, recipe);
    padding: px(10) px(20);
    border: unset;
    border-radius: px(20);
    cursor: pointer;

    &__icon {
      @include font-size(30);
      margin-right: px(10);
    }

    &__title {
      @include fontSet($size: px(20), $lh: 1.2, $ls: 0.1em);
    }
  }
</style>
