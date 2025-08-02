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

<div class="section-box">
<SectionTitle/>
</div>

<RecipeCards/>

<div class="section-box">
<SectionTitle/>
</div>

<RecipeCards/>

<div class="section-box">
<SectionTitle/>
</div>

<RecipeCards/>


</template>

<style lang="scss" scoped>

.section-box{
  margin: auto;
}


</style>