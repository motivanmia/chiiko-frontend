<template>
  <!-- 
    一個簡單的頁面容器，用來提供背景色和一些基本的版面留白。
  -->
  <div class="page-container">
    <!-- 頁面標題區 -->
    <header class="page-header">
      <h1>/最新投稿\</h1>
    </header>

    <!-- 
      ✨ 核心：直接使用您建立的輪播元件！ ✨
      就這麼簡單，因為所有的資料和邏輯都已經封裝在元件內部了，
      所以我們不需要傳遞任何 props (例如 :items="...") 給它。
    -->
    <Carousel />

    <!-- 您也可以在輪播下方加入其他內容，測試它與其他元素的互動 -->
  </div>
</template>

<script setup>
  // ✨ 核心：從您的 components 資料夾中，引入剛剛建立的 RecipeCarousel.vue 元件。
  // 請確保路徑是正確的！
  import Carousel from '@/components/Carousel.vue';

  // 因為 RecipeCarousel 已經自己管理資料，
  // 所以這個測試頁面的 <script> 區塊非常乾淨，
  // 除了引入元件之外，不需要做任何其他事情。
</script>

<style scoped>
  /* 
  這些樣式只會作用於這個 TestComponentPage.vue 頁面，
  用來美化版面，不會影響到您的輪播元件本身。
*/
  .page-container {
    /* 設定一個淺灰色背景，讓輪播元件的邊界更清晰 */
    background-color: #f8f9fa;
    /* 使用 Flexbox 讓內容垂直排列，並在垂直方向上給予一些間距 */
    display: flex;
    flex-direction: column;
    gap: 50px; /* 區塊之間的間距 */
  }

  .page-header {
    text-align: center;
    padding-top: 80px; /* 讓標題離頁面頂部遠一點 */
    padding-bottom: 100px;
    color: #333;
    font-weight: 600;
  }

  .page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .page-header p {
    font-size: 1.1rem;
    color: #6c757d;
  }

  .other-content {
    text-align: center;
    padding-bottom: 80px; /* 讓底部內容離頁面底部遠一點 */
    color: #888;
  }
</style>
