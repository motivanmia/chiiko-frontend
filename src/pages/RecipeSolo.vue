<script setup>
  import { ref, computed, watch, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useSearch } from '@/constants/search';
  import { soloMeal, popularRecipe } from '@/constants/recipes';

  import Banner from '@/components/recipe/Banner.vue';
  import Category from '@/components/recipe/Category.vue';
  import SectionTitle from '@/components/SectionTitle.vue';
  import SearchBar from '@/components/common/SearchBar.vue';
  import HotSearch from '@/components/common/HotSearch.vue';
  import BreadCrumb from '@/components/recipe/BreadCrumb.vue';
  import RecipeCardSolo from '@/components/recipe/RecipeCardSolo.vue';
  import Pagination from '@/components/Pagination.vue';

  const route = useRoute();
  const router = useRouter();

// 根據查詢參數動態獲取分類標題
const categoryTitle = computed(() => route.query.category || '一人料理');

// 搜尋邏輯的狀態管理
const currentSearchQuery = ref(route.query.q || '');


  //搜尋功能
const handleSearch = (query) => {
  const newQuery = query.trim();
  if (newQuery) { // 如果有搜尋關鍵字，就導航到搜尋頁面
    router.push({
      name: 'search', // 指定導航到名為 'search' 的路由
      query: { q: newQuery }
    });
  }
};

  const { searchTerm } = useSearch(currentSearchQuery.value);

  // 合併兩個模擬資料
  const allRecipes = ref([...soloMeal, ...popularRecipe]);

  const filteredRecipes = computed(() => {
    const query = currentSearchQuery.value;

    if (!query || query.trim() === '') {
      return allRecipes.value;
    }

    const queryLower = query.toLowerCase().trim();

    const filtered = allRecipes.value.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(queryLower);
      const tagMatch = recipe.tag.some((tag) =>
        tag.toLowerCase().replace('#', '').includes(queryLower),
      );

      const isMatch = titleMatch || tagMatch;

      return isMatch;
    });

    return filtered;
  });

  watch(
    () => route.query.q,
    (newQuery) => {
      const query = newQuery || '';

      if (currentSearchQuery.value !== query) {
        currentSearchQuery.value = query;
        searchTerm.value = query;
      }
    },
    { immediate: true },
  );




// =======================================================

  const goToPage = () => {

  router.push('/recipe-detail');
};
// =======================================================

</script>

<template>
  <Banner />
  <Category />

  <div class="search-container">
    <SearchBar
      v-model="searchTerm"
      @search="handleSearch"
    />
    <HotSearch @search="handleSearch" />
  </div>

  <SectionTitle
    title="/一人料理\"
    class="section"
  ></SectionTitle>

  <div class="content-wrapper">
    <BreadCrumb class="bread-crumb" />
    <RecipeCardSolo
      @click="goToPage" 

      :recipes="filteredRecipes"
      class="solo"
    />
    <!-- Card的goToPage後面要刪掉暫時先示意 -->
  </div>

  <Pagination />
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
