<script setup>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useSearch } from '@/constants/search';

  import Banner from '@/components/recipe/Banner.vue';
  import Category from '@/components/recipe/Category.vue';
  import SectionTitle from '@/components/SectionTitle.vue';
  import SearchBar from '@/components/common/SearchBar.vue';
  import HotSearch from '@/components/common/HotSearch.vue';
  import BreadCrumb from '@/components/recipe/BreadCrumb.vue';
  import RecipeCardSolo from '@/components/recipe/RecipeCardSolo.vue';
  import Pagination from '@/components/Pagination.vue';

  // const breadcrumbItems = ref([
  //   { text: '靈感 X 食譜', href: '#' },
  //   { text: '搜尋結果: 飯', href: '#' } //修改預設
  // ]);

  const route = useRoute();

  // 從 URL 查詢參數中搜尋文字
  const searchQuery = computed(() => route.query.q || '');

  // 根據搜尋文字動態生成麵包屑資料
  const breadcrumbItems = computed(() => {
    return [
      { text: '靈感食譜', href: '#' },
      { text: `搜尋結果: ${searchQuery.value}`, href: '#' },
    ];
  });

  const { searchTerm, handleSearch } = useSearch();
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
    title="/搜索結果\"
    class="section"
  ></SectionTitle>

  <div class="content-wrapper">
    <BreadCrumb
      class="bread-crumb"
      :items="breadcrumbItems"
    />
    <RecipeCardSolo class="solo" />
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
