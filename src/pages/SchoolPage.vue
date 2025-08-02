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
  <Banner></Banner>

  <Category></Category>

  <SearchBar></SearchBar>

  <IngredientsCards></IngredientsCards>

  <IngredientLightBox v-if="ingredient.active" />
</template>

<style lang="scss" scoped></style>
