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
  <div>
    <Banner />
    <Category />
    <SearchBar placeholder="輸入想要了解的食材" />
    <IngredientsCards />
    <IngredientLightBox v-show="ingredient.active" />
    <Pagination />
  </div>
</template>

<style lang="scss" scoped>
  body {
    overflow: hidden;
  }
</style>
