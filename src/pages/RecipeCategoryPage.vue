<script setup>
  import { ref, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  // 匯入你需要的通用資料庫
  import { allRecipeCategories } from '@/constants/recipes';
  // 匯入你原有的搜尋功能 hook
  import { useSearch } from '@/constants/search';

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

  // 宣告響應式變數來存放動態資料
  const recipes = ref([]);
  const pageTitle = ref('');
  const breadcrumbs = ref([]);

  // 搜尋邏輯的狀態管理
  const currentSearchQuery = ref(route.query.q || '');
  const { searchTerm } = useSearch(currentSearchQuery.value);

  // 搜尋功能函式，可以保留
  const handleSearch = (query) => {
    const newQuery = query.trim();
    if (newQuery) {
      router.push({
        name: 'search',
        query: { q: newQuery },
      });
    }
  };

  // 監聽路由參數的變化 (已修改的部分)
  watch(
    () => route.params.category,
    (newCategoryKey) => {
      const categoryData = allRecipeCategories[newCategoryKey];
      if (categoryData) {
        recipes.value = categoryData.recipes;
        pageTitle.value = categoryData.title;
        breadcrumbs.value = [
          { text: '首頁', to: '/' },
          { text: pageTitle.value, to: `/recipes/${newCategoryKey}` },
        ];
      } else {
        recipes.value = [];
        // pageTitle.value = '找不到此食譜分類';
        breadcrumbs.value = [
          { text: '首頁', to: '/' },
          { text: '找不到此分類', to: '/none' },
        ];
      }
    },
    { immediate: true },
  );

  // 監聽路由查詢參數的變化 
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

  // 搜尋功能可以保留並應用到動態載入的 recipes.value 上 
  const filteredRecipes = computed(() => {
    const query = searchTerm.value; // <-- 使用 searchTerm 變數
    if (!query) {
      return recipes.value;
    }
    const queryLower = query.toLowerCase().trim();
    return recipes.value.filter((recipe) => {
      const titleMatch = recipe.title.toLowerCase().includes(queryLower);
      const tagMatch = recipe.tag.some((tag) =>
        tag.toLowerCase().replace('#', '').includes(queryLower),
      );
      return titleMatch || tagMatch;
    });
  });
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
    :title="`/ ${pageTitle} \\`"
    class="section"
  ></SectionTitle>

  <div class="content-wrapper">
    <BreadCrumb
      :breadcrumbs="breadcrumbs"
      class="bread-crumb"
    />

    <RecipeCardSolo
      :recipes="filteredRecipes"
      class="solo"
    />
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
