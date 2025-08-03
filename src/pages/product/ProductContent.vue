<script setup>
  import { ref } from 'vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Navigation, Thumbs } from 'swiper/modules';

  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/thumbs';

  const thumbsSwiper = ref(null);
  const setThumbsSwiper = (swiper) => (thumbsSwiper.value = swiper);

  const images = [
    '/src/assets/image/Product/Product-buy/product-knife1.png',
    '/src/assets/image/Product/Product-buy/product-knife2.png',
    '/src/assets/image/Product/Product-buy/product-knife3.png',
  ];

  const qty = ref(1);
  const inWishlist = ref(false);

  const goBack = () => window.history.back();
  const dec = () => {
    if (qty.value > 1) qty.value--;
  };
  const inc = () => qty.value++;
  const addToCart = () => alert(`已加入購物車，數量：${qty.value}`);
  const toggleWishlist = () => (inWishlist.value = !inWishlist.value);
</script>

<template>
  <div class="product-container">
    <div class="back-col">
      <button
        class="back-button"
        @click="goBack"
      >
        <span class="arrow"><img src="/src/assets/image/Product/recall.png" /></span>
        回前頁
      </button>
    </div>

    <div class="product-gallery">
      <!-- 主圖 Swiper -->
      <Swiper
        class="main-swiper"
        :modules="[Navigation, Thumbs]"
        :navigation="true"
        :thumbs="{ swiper: thumbsSwiper }"
      >
        <SwiperSlide
          v-for="(img, i) in images"
          :key="i"
        >
          <img
            :src="img"
            class="main-image"
            :alt="`商品主圖 ${i + 1}`"
          />
        </SwiperSlide>
      </Swiper>

      <!-- 縮圖箭頭 -->
      <Swiper
        class="thumbs-swiper"
        :modules="[Navigation, Thumbs]"
        :slides-per-view="3"
        :space-between="10"
        :navigation="{ nextEl: '.thumbs-button-next', prevEl: '.thumbs-button-prev' }"
        @swiper="setThumbsSwiper"
      >
        <SwiperSlide
          v-for="(img, i) in images"
          :key="i"
        >
          <img
            :src="img"
            class="thumb-image"
            :alt="`縮圖 ${i + 1}`"
          />
        </SwiperSlide>
        <div>
          <img
            class="responsive-img"
            src="/src/assets/image/Product/Product-buy/product-image.png"
          />
        </div>

        <!-- 自訂箭頭：自己放內容 -->
        <div class="thumbs-button-prev">
          <span class="thumbs-arrow">&lt;</span>
        </div>
        <div class="thumbs-button-next">
          <span class="thumbs-arrow">&gt;</span>
        </div>
      </Swiper>
    </div>

    <aside class="card">
      <h2 class="title">不鏽鋼奶油刀</h2>
      <ul class="features">
        <li>-表面光滑，容易清洗。</li>
        <li>-握感舒適，輕鬆抹塗。</li>
        <li>-適用於抹醬、攪拌、刮取等！</li>
      </ul>
      <div class="price">$29</div>
      <div class="qty">
        <span>數量</span>
        <div class="stepper">
          <button @click="dec">-</button>
          <input
            type="text"
            v-model.number="qty"
          />
          <button @click="inc">+</button>
        </div>
      </div>
      <button
        class="btn primary"
        @click="addToCart"
      >
        <img
          class="icon-cart"
          src="/src/assets/image/Product/Product-buy/car.png"
        />
        加入購物車
      </button>
      <p class="note">
        若商品缺貨可以先加入「願望清單」。
        <br />
        待恢復供貨就可以收到提醒！
      </p>
      <button
        class="btn ghost"
        @click="toggleWishlist"
      >
        <template v-if="inWishlist">♥ 已加入願望清單</template>
        <template v-else>
          <img
            class="icon-heart"
            src="/src/assets/image/Product/Product-buy/heart.png"
          />
          加入願望清單
        </template>
      </button>
    </aside>
  </div>

  <section class="related-section">
    <h3 class="related-title">搭配好物</h3>
    <Swiper
      class="related-swiper"
      :modules="[Navigation]"
      :slides-per-view="3"
      :space-between="20"
      navigation
    >
      <SwiperSlide>
        <div class="related-card">
          <img
            src="/src/assets/image/Product/product-pot.png"
            class="related-img"
          />
          <div class="related-text">
            <p class="related-name">韓式雪平鍋 18cm</p>
            <p class="related-sub">可用於煮湯、熱牛奶、煮醬汁、煮粥</p>
            <p class="related-price">$329</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="related-card">
          <img
            src="/src/assets/image/Product/product-fish.png"
            class="related-img"
          />
          <div class="related-text">
            <p class="related-name">魚鱗刨刀</p>
            <p class="related-sub">用於括魚鱗</p>
            <p class="related-price">$29</p>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div class="related-card">
          <img
            src="/src/assets/image/Product/product-chopsticks.png"
            class="related-img"
          />
          <div class="related-text">
            <p class="related-name">日式和風筷架</p>
            <p class="related-sub">好筷架 不用嗎</p>
            <p class="related-price">$29</p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style scoped>
  .product-container {
    max-width: 1024px;
    margin: 0 auto;
    padding: 8px 16px 24px;
    display: grid;
    grid-template-columns: 100px minmax(0, 1fr) 340px;
    gap: 16px 24px;
    align-items: start;
  }

  .back-col {
    position: sticky;
    top: 24px;
    align-self: start;
    z-index: 5;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    height: 32px;
    width: 100px;
    font-size: 14px;
    color: #fff;
    background-color: #d6b59c;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .back-button .arrow img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  .product-gallery {
    min-width: 0;
  }

  .main-swiper {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
  }

  .main-image {
    width: 100%;
    display: block;
  }

  .main-swiper::before,
  .main-swiper::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 15%;
    background: rgba(255, 255, 255, 0.35);
    pointer-events: none;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .main-swiper::before {
    left: 0;
  }

  .main-swiper::after {
    right: 0;
  }

  .main-swiper:hover::before,
  .main-swiper:hover::after {
    opacity: 1;
  }

  :deep(.main-swiper .swiper-button-prev),
  :deep(.main-swiper .swiper-button-next) {
    z-index: 3;
    color: #333;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .main-swiper:hover :deep(.swiper-button-prev),
  .main-swiper:hover :deep(.swiper-button-next) {
    opacity: 1;
  }

  .thumbs-swiper {
    margin-top: 10px;
    position: relative;
    overflow: visible;
  }

  .thumb-image {
    width: 100%;
    height: auto;
    border-radius: 6px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border 0.2s ease;
  }

  /* :deep(.swiper-slide-thumb-active) .thumb-image {
    border-color: #d6b59c;
  } */

  :deep(.thumbs-button-prev),
  :deep(.thumbs-button-next) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #333;
    background: #ffffffaa;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    z-index: 5;
    cursor: pointer;
  }

  :deep(.thumbs-button-prev) {
    left: -20px;
  }

  :deep(.thumbs-button-next) {
    right: -20px;
  }

  .card {
    background: #ead7c4;
    border-radius: 12px;
    padding: 20px;
    color: #2b2b2b;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    font-family: 'Noto Sans TC', sans-serif;
    min-width: 280px;
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .features {
    padding-left: 0;
    list-style: none;
    font-size: 14px;
    margin-bottom: 10px;
    line-height: 1.8;
    color: #5b4b40;
    margin-top: 10%;
  }

  .price {
    font-size: 22px;
    font-weight: 700;
    margin: 15px 0 14px;
  }

  .qty {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0 16px;
  }

  .stepper {
    display: flex;
    gap: 6px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 2px;
  }

  .stepper button {
    width: 34px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 16px;
    font-size: 18px;
    cursor: pointer;
  }

  .stepper input {
    width: 44px;
    height: 32px;
    text-align: center;
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;
  }

  .btn {
    width: 100%;
    height: 44px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    margin-top: 8px;
    cursor: pointer;
  }

  .primary {
    background: #e28d62;
    color: #fff;
  }

  .ghost {
    background: #fff;
    border: 1px solid #ccc;
  }

  .note {
    font-size: 12px;
    color: #6a5a51;
    margin: 10% 0 5%;
  }

  .icon-cart,
  .icon-heart {
    width: 16px;
    height: 16px;
    object-fit: contain;
    margin-right: 8px;
  }

  .thumbs-arrow {
    font-size: 20px;
    font-weight: bold;
    user-select: none;
  }

  .related-section {
    margin-top: 40px;
    margin-bottom: 40px;
    max-width: 70%;
    margin-inline: auto;
    padding: 0 16px;
  }

  .related-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #222;
  }

  .related-swiper {
    position: relative;
  }

  .related-card {
    width: 100%;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s ease;
  }

  .related-card:hover {
    transform: translateY(-2px);
  }

  .related-img {
    width: 100%;
    aspect-ratio: 1 / 1; /* ✅ 正方形圖片 */
    object-fit: cover;
    display: block;
  }

  .related-text {
    padding: 12px 10px 16px;
    font-size: 14px;
    line-height: 1.5;
    color: #444;
    text-align: left;
  }

  .related-name {
    font-weight: 600;
    font-size: 15px;
    margin-bottom: 4px;
    color: #222;
  }

  .related-sub {
    font-size: 12px;
    color: #888;
    margin-bottom: 6px;
  }

  .related-price {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  :deep(.related-swiper .swiper-button-prev),
  :deep(.related-swiper .swiper-button-next) {
    color: #b06c2c;
    top: 40%;
    width: 24px;
    height: 24px;
    font-size: 16px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .responsive-img {
    width: 100%;
    height: auto;
    display: block;
    max-width: 100%;
  }

  @media (max-width: 880px) {
    .product-container {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .back-col {
      position: static;
    }
  }
</style>
