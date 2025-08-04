<script setup>
import { categoryName } from '@/constants/recipeCategory';

import Banner from '@/components/recipe/Banner.vue';
import Category from '@/components/recipe/Category.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import SearchBar from '@/components/common/SearchBar.vue';
import HotSearch from '@/components/common/HotSearch.vue';
import BreadCrumb from '@/components/recipe/BreadCrumb.vue';
import RecipeCardSolo from '@/components/recipe/RecipeCardSolo.vue';
import Pagination from '@/components/Pagination.vue';
</script>

<template>
  <Banner/>
  <Category/>
  
  <div class="search-container">
    <SearchBar/>
    <HotSearch/>
  </div>
  
  <SectionTitle title="/一人料理\" class="section"></SectionTitle>
  
  <div class="content-wrapper">
    <BreadCrumb class="bread-crumb"/>
    <RecipeCardSolo class="solo"/>
  </div>
  
  <Pagination/>
</template>

<style lang="scss" scoped>
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}

.search-container > * {
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;
}

.section {
  margin: px(200) auto px(100);
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px; // 添加左右 padding
  box-sizing: border-box;
}

// 響應式調整
@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 15px;
  }
}
</style>
