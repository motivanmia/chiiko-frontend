<script setup>
import { categoryName } from '@/constants/recipeCategory';

import MainHeader from '@/components/common/MainHeader.vue';

import Banner from '@/components/recipe/Banner.vue';

import Category from '@/components/recipe/Category.vue';

import SectionTitle from '@/components/SectionTitle.vue';

import RecipeCards from '@/components/recipe/RecipeCards.vue';


</script>

<template>

<MainHeader/>

<Banner/>

<Category/>


<SectionTitle title="/當季熱門\" class="section"></SectionTitle>


<RecipeCards/>


<SectionTitle title="/最多收藏\" class="section"></SectionTitle>


<RecipeCards/>


<SectionTitle title="/最新投稿\" class="section"></SectionTitle>


<RecipeCards/>


</template>

<style lang="scss" scoped>

.section{
  margin: px(200) auto px(100); //暫時設定
}


</style>