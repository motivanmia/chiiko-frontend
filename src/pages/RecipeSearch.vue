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

  const currentSearchQuery = ref(route.query.q || '');

const handleSearch = (query) => {
  const newQuery = query.trim();
  if (currentSearchQuery.value !== newQuery) {
    router.push({
      name: route.name,
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

      if (isMatch) {
        console.log(`  匹配: ${recipe.title} (${titleMatch ? '標題' : '標籤'})`);
      }

      return isMatch;
    });

    console.log('   過濾結果數量:', filtered.length);
    console.log(
      '   過濾結果:',
      filtered.map((r) => r.title),
    );

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

  watch(
    filteredRecipes,
    (newRecipes) => {

      nextTick(() => {
      });
    },
    { deep: true },
  );

  const breadcrumbItems = computed(() => {
    return [
      { text: '靈感食譜', href: '#' },
      { text: `搜尋結果: ${currentSearchQuery.value}`, href: '#' },
    ];
  });

  // 暴露給全域除錯
  window.debugSearch = {
    currentSearchQuery,
    filteredRecipes,
    allRecipes,
    handleSearch,
    testSearch: (keyword) => {
      handleSearch(keyword);
    },
    testAllKeywords: () => {
      testSearches.forEach((keyword) => {
        const results = allRecipes.value.filter((recipe) => {
          const titleMatch = recipe.title.toLowerCase().includes(keyword.toLowerCase());
          const tagMatch = recipe.tag.some((tag) =>
            tag.toLowerCase().replace('#', '').includes(keyword.toLowerCase()),
          );
          return titleMatch || tagMatch;
        });
      });
    },
  };

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
    :title="`/搜尋結果\\`"
    class="section"
  ></SectionTitle>

  <div class="content-wrapper">
    <BreadCrumb
      class="bread-crumb"
      :items="breadcrumbItems"
    />


    <RecipeCardSolo
      class="solo"
      :recipes="filteredRecipes"
      :key="currentSearchQuery"
    />

    <div
      v-if="currentSearchQuery && filteredRecipes.length === 0"
      class="no-results"
    >
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
