<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// 引入你的元件
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

// ✅ 修正 1: 只宣告一次 computed 屬性
const categoryName = computed(() => route.params.category);
const pageTitle = computed(() => categoryName.value || '找不到此分類');

// 麵包屑也使用 computed 屬性來動態更新
const breadcrumbs = computed(() => {
  return [
    { text: '靈感食譜', to: { name: 'recipe-overview' } },
    { text: categoryName.value, to: { name: 'recipes', params: { category: categoryName.value } } }
  ];
});

// 獲取食譜資料的函式
const fetchRecipesByCategory = async (categoryKey) => {
  if (!categoryKey) {
    recipes.value = [];
    return;
  }
  try {
    const response = await axios.get(
      `http://localhost:8888/front/recipe/get_recipe_scenario.php?category=${categoryKey}`
    );
    if (response.data.success) {
      recipes.value = response.data.data;
    } else {
      recipes.value = [];
      console.error(response.data.message);
    }
  } catch (error) {
    console.error('取得食譜資料失敗', error);
    recipes.value = [];
  }
};

// ✅ 修正 2: 使用 watch 並帶上 { immediate: true }，取代 onMounted
watch(
  () => route.params.category,
  (newCategory) => {
    fetchRecipesByCategory(newCategory);
  },
  { immediate: true }
);

//搜尋功能
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
     //使用資料庫中有的欄位進行過濾
    // 假設你的 recipe 表格有 name 和 content
    const nameMatch = recipe.name && recipe.name.toLowerCase().includes(queryLower);
    const contentMatch = recipe.content && recipe.content.toLowerCase().includes(queryLower);
    return nameMatch || contentMatch;
  });
});
</script> 

<template>
  <Banner />
  <Category />

  <div class="search-container">
    <SearchBar v-model="searchTerm" @search="handleSearch" />
    <HotSearch @search="handleSearch" />
  </div>

  <SectionTitle :title="`/ ${pageTitle} \\`" class="section"></SectionTitle>

  <div class="content-wrapper">
    <BreadCrumb :items="breadcrumbs" class="bread-crumb" />

    <div v-if="filteredRecipes && filteredRecipes.length > 0">
      <RecipeCardSolo
        :recipes="filteredRecipes"
        class="solo"
      />
    </div>
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
