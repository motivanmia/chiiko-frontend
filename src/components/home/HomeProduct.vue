<script setup>
import { onMounted, computed } from 'vue';
import { useProductStore } from '@/stores/productStore'; // 匯入你的新 store
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import title_el from '@/components/SectionTitle.vue';
import SeeMoreButton from '../button/SeeMoreButton.vue';


const productStore = useProductStore();

// 在元件掛載時，呼叫 Pinia action 載入資料
onMounted(() => {
  productStore.fetchProducts();
});

// 使用 computed 屬性來處理產品資料，包括複製陣列以實現無限輪播
const products = computed(() => {
  if (productStore.products.length === 0) {
    return [];
  }
  // 為了達到無限輪播效果，我們複製原始陣列
  return productStore.products.concat(productStore.products);
});
</script>

<template>
  <section class="high-repeat-section">
    <div class="section-title">
      <title_el title="/好物推薦\" />
      <p class="title-sub">用順手的器具，料理起來更輕鬆。</p>
    </div>

    <Swiper
      :modules="[Autoplay]"
      :slides-per-view="2"
      :space-between="16"
      :breakpoints="{
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }"
      :autoplay="{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }"
      :speed="5000"
      :loop="true"
      class="product-swiper"
    >
      <SwiperSlide
        v-for="(product, index) in products"
        :key="`${product.product_id}-${index}`"
        :class="{ 'slide-up': index % 2 === 0, 'slide-down': index % 2 === 1 }"
      >
        <RouterLink
          :to="`/product-detail/${product.product_id}`"
          class="product-card"
        >
          <img
            :src="product.preview_image"
            :alt="product.name"
          />
          <p class="product-name">{{ product.name }}</p>
        </RouterLink>
      </SwiperSlide>
    </Swiper>
    <SeeMoreButton
      id="SeeMoreButton"
      path="/products"
    />
  </section>
</template>


<style lang="scss" scoped>
  .high-repeat-section {
    padding: 0 16px 40px 16px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .section-title {
    text-align: center;
    margin-bottom: 32px;
  }
  .title-main {
    font-size: 40px;
    font-weight: bold;
    text-align: center;
    color: #3b3739;
    letter-spacing: 0.3em;
    text-shadow: 0 4px 5px rgba(59, 55, 57, 0.4);
  }
  .title-sub {
    @include font-size(20);
    color: #666;
    margin-top: 3%;
    @include rwdmax(768) {
      @include font-size(18);
    }
  }

  .product-swiper {
    padding-bottom: 24px;
  }

  .product-card {
    background-color: transparent;
    border-radius: 0;
    box-shadow: none;
    overflow: visible;
    text-align: start;
    transition: transform 0.2s ease;
    cursor: pointer;
    text-decoration: none;
  }
  .product-card:hover {
    transform: translateY(-4px);
  }

  .product-card img {
    width: 100%;
    margin-top: 30px;
    object-fit: cover;
    display: block;
    border-radius: 12px;
  }

  .product-name {
    font-size: 24px;
    font-weight: 500;
    padding: 10px 8px;
    color: #333;
  }

  /* 控制一輪結束後的交錯效果 */
  .slide-up {
    transform: translateY(-20px);
  }

  .slide-down {
    transform: translateY(20px);
  }

  /* hover 效果 */
  .slide-up:hover .product-card {
    transform: translateY(-4px);
  }

  .slide-down:hover .product-card {
    transform: translateY(-4px);
  }

  #SeeMoreButton {
    margin: 120px auto 40px;
    transform: scale(1.5);
    @include rwdmax(768) {
      transform: scale(1);
      margin: 50px auto 40px;
    }
  }
</style>
