<script setup>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Autoplay } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/pagination';

  import title_el from '@/components/SectionTitle.vue';
  import Product1 from '@/assets/image/Product/Product-home/Product-home1.jpg';
  import Product2 from '@/assets/image/Product/Product-home/Product-home2.jpg';
  import Product3 from '@/assets/image/Product/Product-home/Product-home3.jpg';
  import Product4 from '@/assets/image/Product/Product-home/Product-home4.jpg';
  import Product5 from '@/assets/image/Product/Product-home/Product-home5.jpg';
  import SeeMoreButton from '../button/SeeMoreButton.vue';

  const originalProducts = [
    { name: '手沖壺', image: Product1, path: '/product-detail' },
    { name: '輕量玻璃湯鍋', image: Product2, path: '/product-detail' },
    { name: '不鏽鋼打蛋盆', image: Product3, path: '/product-detail' },
    { name: '折疊式蒸籠架', image: Product4, path: '/product-detail' },
    { name: '輕巧蔬果小刀', image: Product5, path: '/product-detail' },
  ];

  // 複製商品陣列，保持原始順序的交錯效果
  const products = originalProducts.concat(originalProducts);
</script>

<template>
  <section class="high-repeat-section">
    <div class="section-title">
      <!-- <p class="title-main">/好物推薦\</p> -->
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
        :key="`${product.name}-${index}`"
        :class="{ 'slide-up': index % 2 === 0, 'slide-down': index % 2 === 1 }"
      >
        <RouterLink
          :to="product.path"
          class="product-card"
        >
          <img
            :src="product.image"
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
