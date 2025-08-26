<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecipeCollectStore } from '@/stores/recipeCollectStore'; // 匯入你的 Store

import Banner from '@/components/recipe/Banner.vue';
import Category from '@/components/recipe/Category.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import SearchBar from '@/components/common/SearchBar.vue';
import HotSearch from '@/components/common/HotSearch.vue';
import BreadCrumb from '@/components/recipe/BreadCrumb.vue';
import RecipeCardSolo from '@/components/recipe/RecipeCardSolo.vue';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeCollectStore(); 

const currentSearchQuery = ref('');



// 導航
const handleSearch = (query) => {
  if (route.query.q !== query) {
    router.push({
      path: route.path,
      query: { q: query },
    });
  }
};

// 監聽路由，觸發 Store 的搜尋動作
watch(
  () => route.query.q,
  (newQuery) => {
    currentSearchQuery.value = newQuery || '';
    recipeStore.fetchSearchResults(currentSearchQuery.value);
  },
  { immediate: true }
);

// 動態標題
const pageTitle = computed(() => {
  if (currentSearchQuery.value) {
    return `/搜尋結果\\`;
  }
  return '/所有食譜\\';
});

// 麵包屑導航項目 
const breadcrumbItems = computed(() => {
  return [
    { text: '靈感食譜', to: '/recipe-overview' },
    { text: `搜尋結果: ${currentSearchQuery.value}`, to: `/recipes/search?q=${currentSearchQuery.value}` },
  ];
});



</script>


<template>
  <Banner />
  <Category />

  <div class="search-container">
    <SearchBar
      :model-value="currentSearchQuery"
      @search="handleSearch"
    />
    <HotSearch @search="handleSearch" />
  </div>

  <SectionTitle
    :title="pageTitle"
    class="section"
  ></SectionTitle>

  <div class="content-wrapper">
    <BreadCrumb
      class="bread-crumb"
      :items="breadcrumbItems"
    />

  <RecipeCardSolo
    class="solo"
    :recipes="recipeStore.searchResults"
    :key="currentSearchQuery"
  />
    
    <div
      v-if="currentSearchQuery && recipeStore.searchResults.length === 0"
      class="no-results"
    >
      <p>沒有找到符合「{{ currentSearchQuery }}」的食譜</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .search-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 80px;
    @include rwdmax(768) {
      margin-top: 30px;
    }
  }

  .search-container > * {
    width: 100%;
    max-width: 800px;
    box-sizing: border-box;
  }

  .section {
    margin: px(150) auto px(100);
    @include rwdmax(768) {
      margin: px(80) auto px(50);
    }
  }

  .content-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .debug-info {
    background: #f0f0f0;
    padding: 15px;
    margin: 20px 0;
    border-radius: 8px;
    font-size: 14px;
    border-left: 4px solid #007bff;

    p {
      margin: 5px 0;
    }
  }

  .no-results {
    text-align: center;
    padding: 40px 20px;
    color: #666;

    p:first-child {
      font-size: 18px;
      margin-bottom: 10px;
    }

    p:last-child {
      font-size: 14px;
      color: #999;
    }
  }

  @media (max-width: 768px) {
    .content-wrapper {
      padding: 0 15px;
    }
  }
</style>