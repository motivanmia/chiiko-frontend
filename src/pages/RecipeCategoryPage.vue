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
    const API_BASE_URL = import.meta.env.VITE_API_BASE; //環境變數的儲存

    // 麵包屑
    const breadcrumbs = computed(() => {
      return [
        { text: '靈感食譜', to: { name: 'recipes' } },
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
        // 這裡會顯示 axios 請求失敗的錯誤
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
