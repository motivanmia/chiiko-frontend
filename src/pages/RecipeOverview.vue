<script setup>
// import { categoryName } from '@/constants/recipeCategory';

import MainHeader from '@/components/common/MainHeader.vue';

import Banner from '@/components/recipe/Banner.vue';

import Category from '@/components/recipe/Category.vue';

import SectionTitle from '@/components/SectionTitle.vue';

import RecipeCards from '@/components/recipe/RecipeCards.vue';

import SearchBar from '@/components/common/SearchBar.vue';

import HotSearch from '@/components/common/HotSearch.vue';



</script>

<template>

<MainHeader/>

<Banner/>

<Category/>

<div class="search-container">
<SearchBar/>
<HotSearch/>
</div>

<SectionTitle title="/當季熱門\" class="section"></SectionTitle>


<RecipeCards/>


<SectionTitle title="/最多收藏\" class="section"></SectionTitle>


<RecipeCards/>


<SectionTitle title="/最新投稿\" class="section"></SectionTitle>


<RecipeCards/>

</template>

<style lang="scss" scoped>

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin-top: 100px;
}

.search-container > * { 
  width: 100%; // 讓子元素的寬度都佔父容器的 60%
  max-width: 800px; // 避免在寬螢幕下過長
  box-sizing: border-box;
}
.section{
  margin: px(200) auto px(100); //暫時設定
}


</style>