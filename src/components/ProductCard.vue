<template>
  <!-- 整個「相關好物」區塊的根容器 -->
  <div class="related-products-wrapper">
    <!-- 1. 區塊主標題 -->
    <h2 class="section-title">相關好物</h2>

    <!-- 2. 商品卡片列表 -->
    <div class="products-grid">
      <!-- 
        使用 v-for 直接在此元件內迴圈渲染每一個商品卡片。
        點擊事件直接呼叫此元件內定義的函式。
      -->
      <a
        href="#"
        v-for="product in relatedProducts"
        :key="product.id"
        class="product-card"
        @click.prevent="goToProductPage(product.id)"
      >
        <img
          :src="product.image"
          :alt="product.name"
          class="product-image"
        />
        <p class="product-name">{{ product.name }}</p>
      </a>
    </div>

    <!-- 3. 查看更多按鈕 -->
    <div class="see-more-container">
      <SeeMoreButton
        text="看更多好物"
        @click="goToMoreProducts"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import SeeMoreButton from '@/components/button/SeeMoreButton.vue';
  import frying_pan from '@/assets/image/NewRecipes/frying_pan.png';
  import wooden_handle_knife from '@/assets/image/NewRecipes/wooden_handle_knife.png';
  import cutting_board from '@/assets/image/NewRecipes/cutting_board.png';
  import stainless_frying_pan from '@/assets/image/NewRecipes/stainless_frying_pan.png';

  const relatedProducts = ref([
    { id: 1, name: '平底鍋', image: frying_pan },
    { id: 2, name: '木柄菜刀', image: wooden_handle_knife },
    { id: 3, name: '砧板', image: cutting_board },
    { id: 4, name: '不鏽鋼平底鍋', image: stainless_frying_pan },
  ]);

  function goToProductPage(productId) {
    alert(`（模擬跳轉）前往商品 ID: ${productId} 的頁面...`);
  }

  function goToMoreProducts() {
    alert('（模擬跳轉）前往「更多好物」的列表頁...');
  }
</script>

<!-- ──────────────────────────────────────────────────────────────────────── -->
<style scoped>
  /* ====================================================== */
  /*                      主要容器與標題                       */
  /* ====================================================== */
  .related-products-wrapper {
    max-width: 1210px;
    margin: 0px auto;
    padding: 40px 90px 40px 90px;
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }

  .section-title {
    text-align: center;
    font-size: 32px;
    font-weight: 600;
    color: #333;
    margin-bottom: 40px;
  }

  /* ====================================================== */
  /*                      商品卡片列表                       */
  /* ====================================================== */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .product-card {
    text-decoration: none;
    color: inherit;
    text-align: center;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }
  .product-card:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
    border-radius: 20px;
  }

  .product-image {
    width: 220px;
    height: 220px;
    object-fit: cover;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .product-name {
    font-size: 24px;
    font-weight: 500;
    color: #3b3739;
  }

  /* ====================================================== */
  /*                    「查看更多」按鈕區塊                     */
  /* ====================================================== */
  .see-more-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 40px;
  }

  :deep(.see-more__button) {
    font-size: 20px;
  }
</style>
