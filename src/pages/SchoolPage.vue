<script setup>
  import { useIngredientStore } from '@/stores/ingredient';
  const ingredient = useIngredientStore();
  import Banner from '@/components/school/Banner.vue';
  import Category from '@/components/school/Category.vue';
  import IngredientsCards from '@/components/school/IngredientsCards.vue';
  import SearchBar from '@/components/common/SearchBar.vue';
  import IngredientLightBox from '@/components/school/IngredientLightBox.vue';
  import Pagination from '@/components/Pagination.vue';
</script>

<template>
  <Banner></Banner>

  <Category></Category>

  <SearchBar placeholder="輸入想要了解的食材"></SearchBar>

  <IngredientsCards></IngredientsCards>

  <IngredientLightBox v-if="ingredient.active" />

  <Pagination />
</template>

<style lang="scss" scoped></style>
