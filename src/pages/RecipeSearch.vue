<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// 引入你需要的元件
import Banner from '@/components/recipe/Banner.vue';
import Category from '@/components/recipe/Category.vue';
import SectionTitle from '@/components/SectionTitle.vue';
import SearchBar from '@/components/common/SearchBar.vue';
import HotSearch from '@/components/common/HotSearch.vue';
import BreadCrumb from '@/components/recipe/BreadCrumb.vue';
import RecipeCardSolo from '@/components/recipe/RecipeCardSolo.vue';

const route = useRoute();
const router = useRouter();

const currentSearchQuery = ref('');
const searchResults = ref([]); // 儲存後端結果

const apiUrl = 'http://localhost:8888/front/recipe/search_recipe.php';

const performSearch = async (query) => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    searchResults.value = [];
    return;
  }
  
  try {
    const response = await axios.get(apiUrl, {
      params: { q: trimmedQuery },
    });
    
    if (response.data.success) {
      console.log(response);
      
      searchResults.value = response.data.data;
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error('搜尋失敗', error);
    searchResults.value = [];
  }
  // console.log("hhbhbi",searchResults.value);
  
};

// 導航
const handleSearch = (query) => {
  if (route.query.q !== query) {
    router.push({
      path: route.path,
      query: { q: query },
    });
  }
};

// 監聽路由,觸發performSearch
watch(
  () => route.query.q,
  (newQuery) => {
    currentSearchQuery.value = newQuery || '';
    performSearch(currentSearchQuery.value);
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

// ✅ 移除不必要的 computed 屬性
// const filteredRecipes = computed(() => { ... });

// ✅ 移除多餘的 watch 區塊
// watch(() => route.query.q, (newQuery) => { ... });

// 麵包屑導航項目 (無變動)
const breadcrumbItems = computed(() => {
  return [
    { text: '靈感食譜', to: '/recipes' }, // 假設 '靈感食譜' 頁面的路徑是 /recipes
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
      :recipes="searchResults"
      :key="currentSearchQuery"
    />
    
    <div
      v-if="currentSearchQuery && searchResults.length === 0"
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
