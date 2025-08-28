<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';

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
  const recipes = ref([]);
  const searchTerm = ref(route.query.q || '');
  const categoryName = computed(() => route.params.category);
  const pageTitle = computed(() => categoryName.value || '找不到此分類');
  const API_BASE_URL = import.meta.env.VITE_API_BASE;

  // 麵包屑
  const breadcrumbs = computed(() => {
    return [
      { text: '靈感食譜', to: { name: 'recipe-overview' } },
      {
        text: categoryName.value,
        to: { name: 'recipes', params: { category: categoryName.value } },
      },
    ];
  });

  // 修正後的 fetchRecipesByCategory 函式
  const fetchRecipesByCategory = async (categoryKey) => {
    if (!categoryKey) {
      recipes.value = [];
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/recipe/get_recipe_scenario.php?category=${categoryKey}`,
      );
      if (response.data.success) {
        recipes.value = response.data.data;
      } else {
        recipes.value = [];
        console.error('後端回傳錯誤:', response.data.message);
      }
    } catch (error) {
      console.error('取得食譜資料失敗:', error);
      recipes.value = [];
    }
  };
  watch(
    () => route.params.category,
    (newCategory) => {
      fetchRecipesByCategory(newCategory);
    },
    { immediate: true },
  );

  // 搜尋功能
  const handleSearch = (query) => {
    const newQuery = query.trim();
    if (newQuery) {
      router.push({
        name: 'search',
        query: { q: newQuery },
      });
    }
  };

  const filteredRecipes = computed(() => {
    const query = searchTerm.value;
    if (!query) {
      return recipes.value;
    }
    const queryLower = query.toLowerCase().trim();
    return recipes.value.filter((recipe) => {
      const nameMatch = recipe.name && recipe.name.toLowerCase().includes(queryLower);
      const contentMatch = recipe.content && recipe.content.toLowerCase().includes(queryLower);
      return nameMatch || contentMatch;
    });
  });

  // 分頁狀態
  const pageSize = 21; // 每頁筆數

  // 將 page 初始化為 1，並使用 watch 監聽路由變化
  const page = ref(1);

  // 監聽路由的 page 參數，確保 page 變數與 URL 同步
  watch(
    () => route.query.page,
    (newPage) => {
      // 將新值轉換為數字，如果無效則預設為 1
      const newPageNumber = Number(newPage) || 1;
      page.value = newPageNumber;
    },
    { immediate: true }, // 立即執行一次，確保首次加載時同步
  );

  // 根據當前頁碼和每頁筆數，計算要顯示的食譜
  const paginatedRecipes = computed(() => {
    // 在進行計算前，確保 page.value 是一個有效的數字
    const currentPage = Math.max(1, page.value);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    // 檢查 filteredRecipes.value 是否為陣列，以避免錯誤
    if (!Array.isArray(filteredRecipes.value)) {
      return [];
    }

    return filteredRecipes.value.slice(start, end);
  });

  // 點擊事件綁定
  function onclik() {
    setTimeout(() => {
      window.scrollTo({
        top: 780,
        behavior: 'smooth',
      });
    }, 0);
  }
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
      :items="breadcrumbs"
      class="bread-crumb"
    />

    <div v-if="paginatedRecipes && paginatedRecipes.length > 0">
      <RecipeCardSolo
        :recipes="paginatedRecipes"
        class="solo"
      />
    </div>
  </div>

  <Pagination
    v-model:page="page"
    :page-size="pageSize"
    :total="filteredRecipes.length"
    :max-buttons="5"
    @click="onclik"
  />
</template>

<style lang="scss" scoped>
  /* 樣式保持不變 */
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
    padding: 0 20px;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .content-wrapper {
      padding: 0 15px;
    }
  }
</style>
