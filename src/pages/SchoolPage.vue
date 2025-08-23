<script setup>
  import { useIngredientStore } from '@/stores/ingredient';
  const ingredient = useIngredientStore();
  import Banner from '@/components/school/Banner.vue';
  import Category from '@/components/school/Category.vue';
  import IngredientsCards from '@/components/school/IngredientsCards.vue';
  import SearchBar from '@/components/common/SearchBar.vue';
  import IngredientLightBox from '@/components/school/IngredientLightBox.vue';
</script>

<template>
  <div>
    <Banner />
    <Category />
    <IngredientsCards />
    <Transition name="fade">
      <IngredientLightBox v-if="ingredient.active" />
    </Transition>
    <!-- <Transition name="fade"> -->
    <div
      v-if="ingredient.active"
      class="overlay"
      @click="ingredient.updateActive(null)"
    ></div>
    <!-- </Transition> -->
  </div>
</template>

<style lang="scss" scoped>
  body {
    overflow: hidden;
  }
  .overlay {
    position: fixed;
    z-index: 998;
    height: 150vh;
    width: 150%;
    opacity: 0.6;
    background-color: black;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
</style>
