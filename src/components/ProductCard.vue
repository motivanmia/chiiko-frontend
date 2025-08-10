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
  import { useRouter } from 'vue-router';
  import SeeMoreButton from '@/components/button/SeeMoreButton.vue';

  import frying_pan from '@/assets/image/NewRecipes/frying_pan.png';
  import wooden_handle_knife from '@/assets/image/NewRecipes/wooden_handle_knife.png';
  import cutting_board from '@/assets/image/NewRecipes/cutting_board.png';
  import stainless_frying_pan from '@/assets/image/NewRecipes/stainless_frying_pan.png';

  const router = useRouter();

  const relatedProducts = ref([
    { id: 1, name: '平底鍋', image: frying_pan },
    { id: 2, name: '木柄菜刀', image: wooden_handle_knife },
    { id: 3, name: '砧板', image: cutting_board },
    { id: 4, name: '不鏽鋼平底鍋', image: stainless_frying_pan },
  ]);

  function goToProductPage() {
    router.push('/product-detail'); // ✅ 點商品卡 → 詳情（購買頁）
  }

  function goToMoreProducts() {
    router.push('/product'); // ✅ 點「看更多好物」→ 總覽（瀏覽頁）
  }
</script>

<!-- ──────────────────────────────────────────────────────────────────────── -->

<style scoped>
  /* ====================================================== */
  /*                      預設樣式 (大螢幕)                   */
  /* ====================================================== */
  .related-products-wrapper {
    max-width: 1210px;
    padding: 40px 100px 40px 100px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
  }
  .section-title {
    text-align: center;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 40px;
  }
  .products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  .product-card {
    text-decoration: none;
    color: inherit;
    text-align: center;
  }
  .product-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 20px;
    margin-bottom: 16px;
  }
  .product-name {
    font-size: 20px;
    font-weight: 500;
  }
  .see-more-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 40px;
  }

  /* =================================================================== */
  /*                      ✨ RWD 響應式設計 ✨                        */
  /* =================================================================== */
  @media (max-width: 768px) {
    /* 容器：移除所有左右邊距/內距，讓它完全貼合父層 */
    .related-products-wrapper {
      max-width: 500px;
      width: 100%;

      padding: 24px 0; /* ✨ 只保留上下內距 */
      border-radius: 16px;
      border-left: none;
      border-right: none;
    }

    /* 
    ✅ 核心修正：
    將網格容器的左右內距設定為 70px。
    這樣網格內部的卡片就會距離白色容器的邊緣 70px。
  */
    .products-grid {
      grid-template-columns: 1fr; /* 維持單欄佈局 */
      gap: 70px;
      padding: 0 70px;
    }

    /* 其他微調 */
    .section-title {
      font-size: 24px;
      margin-top: 22px;
      margin-bottom: 30px;
    }
    .product-image {
      height: auto; /* 讓圖片高度自適應寬度 */
    }
    .product-name {
      font-size: 18px;
    }
    .see-more-container {
      margin-top: 50px;
      display: flex;
      justify-content: center; /* ⬅️ 水平置中整個內容 */
      align-items: center; /* 可選：垂直置中 */
    }
  }
</style>
