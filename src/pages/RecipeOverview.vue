<script setup>
  import { ref, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  import Banner from '@/components/recipe/Banner.vue';
  import Category from '@/components/recipe/Category.vue';
  import SectionTitle from '@/components/SectionTitle.vue';
  import RecipeCards from '@/components/recipe/RecipeCards.vue';
  import SearchBar from '@/components/common/SearchBar.vue';
  import HotSearch from '@/components/common/HotSearch.vue';

  import { soloMeal, popularRecipe } from '@/constants/recipes';

  // 初始化路由
  const route = useRoute();
  const router = useRouter();

  // 搜尋邏輯的狀態管理
  const currentSearchQuery = ref(route.query.q || '');

  // 合併模擬資料
  const allRecipes = ref([...soloMeal, ...popularRecipe]);

  // 搜尋功能
  const handleSearch = (query) => {
    const newQuery = query.trim();
    if (newQuery) {
      // 如果有搜尋關鍵字，就導航到搜尋頁面
      router.push({
        name: 'search',
        query: { q: newQuery },
      });
    }
  };

  // 監聽路由變化，如果使用者從搜尋頁面回來，更新搜尋框狀態
  watch(
    () => route.query.q,
    (newQuery) => {
      currentSearchQuery.value = newQuery || '';
    },
    { immediate: true },
  );

  // 模擬資料 每個區塊9張
  const hotRecipes = allRecipes.value.slice(0, 9);
  const mostBookmarkedRecipes = allRecipes.value.slice(9, 18);
  const latestRecipes = allRecipes.value.slice(18, 27);

  // =======================================================

  const goToPage = () => {
    router.push('/recipe-detail');
  };
  // =======================================================
</script>

<template>
  <MainHeader />

  <Banner />

  <Category />

  <div class="search-container">
    <SearchBar @search="handleSearch" />
    <HotSearch @search="handleSearch" />
  </div>

  <SectionTitle
    title="/當季熱門\"
    class="section"
  ></SectionTitle>
  <RecipeCards
    :recipes="hotRecipes"
    @click="goToPage"
  />

  <SectionTitle
    title="/最多收藏\"
    class="section"
  ></SectionTitle>
  <RecipeCards
    :recipes="mostBookmarkedRecipes"
    @click="goToPage"
  />

  <SectionTitle
    title="/最新投稿\"
    class="section"
  ></SectionTitle>
  <RecipeCards
    :recipes="latestRecipes"
    @click="goToPage"
  />

  <!-- goToPage後續要做刪除的動作 -->
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
    width: 100%; // 讓子元素的寬度都佔父容器的 60%
    max-width: 800px; // 避免在寬螢幕下過長
    box-sizing: border-box;
  }
  .section {
    margin: px(150) auto px(100);
    @include rwdmax(768) {
      margin: px(80) auto px(50);
    }
  }
</style>
