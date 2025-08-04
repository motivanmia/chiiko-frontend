
<template>
  <div class="related-products-wrapper">
    <!-- 區塊主標題 -->
    <h2 class="section-title">相關好物</h2>

    <!-- 商品卡片列表 -->
    <div class="products-grid">
      <!-- 使用 v-for 迴圈來渲染每一個商品 -->
      <a 
        href="#" 
        v-for="product in relatedProducts" 
        :key="product.id" 
        class="product-card"
        @click.prevent="goToProductPage(product.id)"
      >
        <img :src="product.image" :alt="product.name" class="product-image" />
        <p class="product-name">{{ product.name }}</p>
      </a>
    </div>

    <!-- 查看更多按鈕 -->
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
import SeeMoreButton from '../components/button/SeeMoreButton.vue';

const relatedProducts = ref([
  { id: 1, name: '平底鍋', image: 'https://i.imgur.com/example1.jpg' },
  { id: 2, name: '木柄菜刀', image: 'https://i.imgur.com/example2.jpg' },
  { id: 3, name: '砧板', image: 'https://i.imgur.com/example3.jpg' },
  { id: 4, name: '不鏽鋼平底鍋', image: 'https://i.imgur.com/example4.jpg' },
]);

// 點擊事件的處理函式
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
  max-width: 1200px; /* 設定區塊的最大寬度 */
  margin: 400px auto; /* 上下外距 60px，左右自動置中 */
  padding: 40px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.section-title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 40px; /* 標題與商品列表之間的距離 */
}

/* ====================================================== */
/*                      商品卡片列表                       */
/* ====================================================== */

/* 包裹四個商品的網格容器 */
.products-grid {
  display: grid;
  /* 關鍵：創建一個有 4 個欄位的網格，每個欄位的寬度都平均分配 (1fr) */
  grid-template-columns: repeat(4, 1fr); 
  gap: 24px; /* 設定卡片之間的間距 */
}

/* 單一商品卡片 */
.product-card {
  text-decoration: none; /* 移除 a 標籤預設的底線 */
  color: inherit; /* 讓文字顏色繼承父層 */
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover {
  transform: translateY(-5px); /* 滑鼠懸停時，卡片稍微向上移動 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 250px; /* 設定一個固定的高度 */
  object-fit: cover; /* 讓圖片填滿容器，多餘部分會被裁切，不會變形 */
  border-radius: 20px; /* 圖片圓角 */
  margin-bottom: 16px; /* 圖片與下方文字的距離 */
}

.product-name {
  font-size: 20px;
  font-weight: 500;
  color: #555;
}

/* ====================================================== */
/*                    「查看更多」按鈕區塊                     */
/* ====================================================== */

.see-more-container {
  display: flex;
  justify-content: flex-end; /* 讓內容靠右對齊 */
  align-items: center;
  margin-top: 40px; /* 與上方商品列表的距離 */
}

/* 
  針對 SeeMoreButton 元件進行微調 
  使用 :deep() 偽選擇器，可以穿透 scoped 的限制，
  去影響到子元件的【根元素】。
*/
:deep(.see-more__button) {
  /* 這裡可以覆寫或微調 SeeMoreButton 元件的樣式 */
  font-size: 16px;
}

</style>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<style lang="scss" scoped></style>