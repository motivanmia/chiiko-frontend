<script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import Banner from '@/components/recipe/Banner.vue';
  import SearchBar from '@/components/common/SearchBar.vue';
  import SectionTitle from '@/components/SectionTitle.vue';
  import ProductCards from '@/components/product/ProductCards.vue';
  import Category from '@/components/product/Category.vue';
  import { getProduct } from '@/api/fetch';

  const props = defineProps({
    title: {
      type: String,
      default: '/好物推薦\\',
    },
  });
  const route = useRoute();

  const searchQuery = ref('');

  // 不同區塊的商品資料
  const under100Products = ref([]);
  const allProducts = ref([]);
  const categoryProducts = ref([]);

  const getCategoryTitle = (categoryId) => {
    const titles = {
      1: '鍋具/鍋鏟',
      2: '烤箱/氣炸鍋',
      3: '刀具/砧板',
      4: '廚房小物',
    };
    return titles[categoryId];
  };

  // 動態顯示標題
  const dynamicTitle = computed(() => {
    if (route.query.product_category_id) {
      return `/ ${getCategoryTitle(route.query.product_category_id)} \\`;
    }
    // 這裡可以選擇顯示預設標題
    // return '/ 嚴選廚具好評推薦 \\';
  });

  // 百元商品推薦
  const fetchUnder100Products = async () => {
    try {
      const response = await getProduct({ type: 'under100' });
      // 檢查api是否成功以及資料是否存在
      if (response.data.data && Array.isArray(response.data.data)) {
        under100Products.value = response.data.data;
        console.log('API 回傳的商品資料:', under100Products.value);
      }
    } catch (error) {
      console.error('獲取百元以下商品失敗', error);
    }
  };

  // 全部推薦商品
  const fetchAllProducts = async () => {
    try {
      const response = await getProduct({ type: 'all_random' });
      // 檢查api是否成功以及資料是否存在
      if (response.data.data && Array.isArray(response.data.data)) {
        allProducts.value = response.data.data;
      }
    } catch (error) {
      console.error('獲取全部推薦商品失敗:', error);
    }
  };

  // 分類商品
  const fetchCategoryProducts = async (categoryId) => {
    try {
      const params = categoryId ? { product_category_id: categoryId } : {};

      const response = await getProduct(params);
      // 檢查api是否成功以及資料是否存在
      if (response.data.data && Array.isArray(response.data.data)) {
        categoryProducts.value = response.data.data;
      }
    } catch (error) {
      console.error('獲取分類商品失敗:', error);
    }
  };

  // 組件載入時 先獲取推薦商品
  onMounted(() => {
    // 檢查是否有分類參數，如果沒有，才載入推薦商品
    if (!route.query.product_category_id) {
      fetchUnder100Products();
      fetchAllProducts();
    }
  });

  // 監聽路由變化 當分類id改變時 更新分類商品列表
  watch(
    () => route.query.product_category_id,
    (newCategoryId) => {
      if (newCategoryId) {
        // 路由有id時才呼叫api
        fetchCategoryProducts(newCategoryId);
        // 清除推薦商品列表 讓頁面只顯示分類商品
        under100Products.value = [];
        allProducts.value = [];
      } else {
        // 沒有參數 呼叫推薦商品api
        fetchUnder100Products();
        fetchAllProducts();
        // 同時，清除分類商品的列表
        categoryProducts.value = [];
      }
    },
    { immediate: true },
  );
</script>

<template>
  <Banner
    title="好物精選"
    img="/src/assets/image/Product/banner.png"
  />
  <Category />
  <div class="search-container">
    <SearchBar placeholder="搜尋好物 例：抹布" />
  </div>
  <template v-if="!route.query.product_category_id">
    <SectionTitle
      :title="`/ 高回購率百元好物 \\`"
      class="section"
    />
    <div class="product-card">
      <ProductCards
        v-for="product in under100Products"
        :key="product.product_id"
        :product="product"
      />
    </div>

    <SectionTitle
      :title="`/ 嚴選廚具好評推薦 \\`"
      class="section"
    />
    <div class="product-card">
      <ProductCards
        v-for="product in allProducts"
        :key="product.product_id"
        :product="product"
      />
    </div>
  </template>
  <template v-else>
    <SectionTitle
      :title="dynamicTitle"
      class="section"
    />
    <div class="product-card">
      <ProductCards
        v-for="product in categoryProducts"
        :key="product.product_id"
        :product="product"
      />
    </div>
  </template>
</template>

<style lang="scss" scoped>
  .search-container {
    width: 100%;
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

  .product-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0 auto;
    gap: 70px;
    max-width: 1200px;
    width: 100%;
    @include rwdmax(1200) {
      gap: 50px 30px;
    }
    @include rwdmax(1024) {
      gap: 40px 20px;
    }
    @include rwdmax(768) {
      gap: 30px 10px;
    }
  }
</style>
