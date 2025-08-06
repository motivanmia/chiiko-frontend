<script setup>
import {ref} from 'vue';
import {useSearch} from '@/constants/search'


import Banner from '@/components/recipe/Banner.vue';
import Category from '@/components/recipe/Category.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import SearchBar from '@/components/common/SearchBar.vue';
import HotSearch from '@/components/common/HotSearch.vue';
import BreadCrumb from '@/components/recipe/BreadCrumb.vue';
import RecipeCardSolo from '@/components/recipe/RecipeCardSolo.vue';
import Pagination from '@/components/Pagination.vue';


const breadcrumbItems = ref([
  { text: '靈感 X 食譜', href: '#' },
  { text: '搜尋結果: 123', href: '#' } //修改預設
]);

const { searchTerm, handleSearch } = useSearch();


// import product from '@/pages/ProductContent.vue'

import Product from './Product.vue';

</script>

<template>

<product/>

  <!-- <Banner/>
  <Category/>
  
  <div class="search-container">
    <SearchBar
      v-model="searchTerm" 
      @search="handleSearch"
    />
    <HotSearch/>
  </div>
  
  <SectionTitle title="/搜索結果\" class="section"></SectionTitle>
  
  <div class="bread-crumb__box">
  <BreadCrumb :items="breadcrumbItems" class="bread-crumb"/>
</div>

  <span class="search-result">
    <p>
      找不到符合搜尋字詞「123 」的食譜。
    </p>
  </span> -->

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

.search-result{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30vw;
  
  & > p{
    font-size: 32px;
  }
}

.bread-crumb__box{
  display: flex;
  max-width: 1200px;
  margin: auto;
}
</style>
