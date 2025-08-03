<script setup>

import { category_name } from '@/constants/recipeCategory';

import MainHeader from '@/components/common/MainHeader.vue';

import Banner from '@/components/recipe/Banner.vue';

import Category from '@/components/recipe/Category.vue';

import BreadCrumb from '@/components/recipe/BreadCrumb.vue';

import SectionTitle from '@/components/SectionTitle.vue';

import RecipeCards from '@/components/recipe/RecipeCards.vue';

import Pagination from '@/components/Pagination.vue';

</script>

<template>
  
  <MainHeader/>

  <Banner/>

  <Category/>

  <BreadCrumb/>

  <SectionTitle/>

  <RecipeCards/>

  <Pagination/>


</template>

<style lang="scss" scoped>
  
</style>