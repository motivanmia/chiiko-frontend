<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { Navigation, Thumbs } from 'swiper/modules';
  import Icon from '@/components/common/Icon.vue';
  import { useRoute } from 'vue-router';
  import { useCartStore } from '@/stores/useCartStore';
  import { useAuthStore } from '@/stores/auth';
  import { storeToRefs } from 'pinia';
  import ProductCards from '@/components/product/ProductCards.vue';
  import { getProduct } from '@/api/fetch';

  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/thumbs';

  const route = useRoute();

  const authStore = useAuthStore();
  const { isLoggedIn } = storeToRefs(authStore);
  const { openModal } = authStore;

  const cartStore = useCartStore();
  const { addCart } = cartStore;

  const thumbsSwiper = ref(null);
  const setThumbsSwiper = (swiper) => (thumbsSwiper.value = swiper);

  const images = [
    {
      image: new URL('@/assets/image/Product/Product-buy/product-knife1.png', import.meta.url).href,
    },
    {
      image: new URL('@/assets/image/Product/Product-buy/product-knife2.png', import.meta.url).href,
    },
    {
      image: new URL('@/assets/image/Product/Product-buy/product-knife3.png', import.meta.url).href,
    },
  ];

  const qty = ref(1);
  const inWishlist = ref(false);

  const goBack = () => window.history.back();
  const dec = () => {
    if (qty.value > 1) qty.value--;
  };
  const inc = () => qty.value++;
  const addToCart = () => {
    if (!isLoggedIn.value) {
      return openModal('login');
    }
    addCart({
      id: route.params.id,
      quantity: qty.value,
    });
  };
  const toggleWishlist = () => (inWishlist.value = !inWishlist.value);

  // ==========

  const swiperRef = ref(null);

  // 該頁商品
  const product = ref(null);
  const fetchProductId = async (id) => {
    try {
      const response = await getProduct({ product_id: id });
      // 檢查api是否成功以及資料是否存在
      if (response.status === 'success' && response.data) {
        product.value = response.data;
        console.log('單一商品資料:', product.value);
      }
    } catch (error) {
      console.error('獲取商品失敗:', error);
    }
  };

  // 推薦商品
  const allProducts = ref([]);
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

  watch(
    product,
    (val) => {
      console.log('product', val);
    },
    {
      deep: true,
      immediate: true,
    },
  );

  onMounted(() => {
    fetchAllProducts();
    const productId = route.params.id;
    if (productId) {
      fetchProductId(productId);
    }
  });

  // 監聽路由參數的變化，當 id 改變時重新呼叫函式
  watch(
    () => route.params.id,
    (newId) => {
      if (newId) {
        fetchProductById(newId);
      }
    },
  );

  const onSwiper = (swiper) => {
    swiperRef.value = swiper;
  };

  const prevSlide = () => {
    swiperRef.value.slidePrev();
  };
  const nextSlide = () => {
    swiperRef.value.slideNext();
  };
</script>

<template>
  <!-- 返回按鈕 -->
  <div class="back-col">
    <button
      class="back-button"
      @click="goBack"
    >
      <Icon
        icon-name="leftA"
        class="arrow-icon"
      />
      回前頁
    </button>
  </div>

  <div class="product-container">
    <div class="product-info">
      <div class="product-info__gallery">
        <Swiper
          class="main-swiper"
          :modules="[Navigation, Thumbs]"
          :navigation="true"
          :thumbs="{ swiper: thumbsSwiper }"
          :loop="true"
        >
          <SwiperSlide
            v-for="(img, i) in images"
            :key="i"
          >
            <img
              :src="img.image"
              class="main-image"
              :alt="`商品主圖 ${i + 1}`"
            />
          </SwiperSlide>
        </Swiper>

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
              :src="img.image"
              class="thumb-image"
              :alt="`縮圖 ${i + 1}`"
            />
          </SwiperSlide>

          <!-- 縮圖箭頭 -->
          <div class="thumbs-button-prev">
            <span class="thumbs-arrow">&lt;</span>
          </div>
          <div class="thumbs-button-next">
            <span class="thumbs-arrow">&gt;</span>
          </div>
        </Swiper>
      </div>

      <!-- 商品資訊卡 -->
      <aside class="product-info__card">
        <h2 class="product-info__title">不鏽鋼奶油刀</h2>
        <ul class="product-info__features">
          <li>-表面光滑，容易清洗。</li>
          <li>-握感舒適，輕鬆抹塗。</li>
          <li>-適用於抹醬、攪拌、刮取等！</li>
        </ul>
        <div class="product-info__price">$29</div>
        <div class="product-info__qty">
          <span>數量</span>
          <div class="product-info__stepper">
            <button @click="dec">-</button>
            <input
              type="product-info__text"
              v-model.number="qty"
            />
            <button @click="inc">+</button>
          </div>
        </div>
        <button
          class="product-info__cart"
          @click="addToCart"
        >
          <Icon
            icon-name="order"
            class="icon-cart"
          />
          加入購物車
        </button>
        <p class="note">
          若商品缺貨可以先加入「願望清單」。
          <br />
          待恢復供貨就可以收到提醒！
        </p>
        <button
          class="product-info__collect"
          @click="toggleWishlist"
        >
          <template v-if="inWishlist">
            <Icon
              icon-name="heart"
              class="icon-heart"
            />
            已加入願望清單
          </template>
          <template v-else>
            <Icon
              icon-name="heartL"
              class="icon-heart"
            />
            加入願望清單
          </template>
        </button>
      </aside>
    </div>
    <!-- 額外圖片（單張展示圖） -->
    <div class="product-content">
      <div class="product-content__pic">
        <img
          src="/src/assets/image/Product/Product-buy/product-image.png"
          alt="商品展示圖"
        />
      </div>
      <!-- 商品須知區塊 -->
      <section class="product-content__info">
        <h3>商品使用須知</h3>
        <p>為確保使用安全及延長產品壽命，請詳閱以下說明：</p>

        <h4>使用方式</h4>
        <ul>
          <li>-本產品適用於塗抹奶油、果醬、起司等軟性食品。</li>
          <li>-請勿用於切割堅硬食材或作為其他工具使用， 以免損壞產品或造成危險。</li>
        </ul>

        <h4>清潔與保養</h4>
        <ul>
          <li>-初次使用前，請以中性清潔劑清洗乾淨後擦乾。</li>
          <li>-使用後請立即清洗並徹底擦乾，避免水漬殘留導致鏽蝕。</li>
          <li>-建議以手洗為主，避免長期使用洗碗機清洗，以延長產品壽命。</li>
        </ul>

        <h4>注意事項</h4>
        <ul>
          <li>-請勿長時間浸泡於水中，亦避免放置於高溫或潮濕環境。</li>
          <li>-請妥善存放，避免兒童誤用。</li>
          <li>-若發現產品變形、破損或鏽蝕，請停止使用。</li>
        </ul>

        <h4>材質說明</h4>
        <ul>
          <li>-材質：304食品級不鏽鋼</li>
          <li>-表面處理：鏡面拋光或霧面處理（依實際商品為準）</li>
        </ul>
      </section>

      <section class="product-content__notice">
        <h3>購買前請詳閱</h3>
        <p>為保障您的權益，請在下單前詳細閱讀以下資訊：</p>
        <ul>
          <li>-商品規格、尺寸、顏色請務必確認無誤。</li>
          <li>-本商品經拆封使用後恕不接受退換，請確認需求後購買。</li>
          <li>-若對商品有任何疑問，歡迎下單前聯繫客服詢問。</li>
          <li>-下單即表示您已詳閱並同意本店之購買條款與規定。</li>
        </ul>
        <p>感謝您的理解與支持，祝您購物愉快。</p>
      </section>
    </div>
  </div>

  <!-- 搭配好物 swiper -->
  <section class="related-section">
    <p class="related-title">搭配好物</p>

    <!-- 左箭頭 -->
    <div class="related-button-prev swiper-button-prev"></div>
    <Swiper
      :modules="[Navigation]"
      :navigation="{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }"
      :space-between="30"
      :loop="true"
      :breakpoints="{
        0: { slidesPerView: 2 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }"
      class="related-swiper"
    >
      <SwiperSlide
        v-for="product in allProducts"
        :key="product.product_id"
      >
        <ProductCards
          :product="product"
          class="product-card"
        />
      </SwiperSlide>
    </Swiper>
    <!-- 右箭頭 -->
    <div class="related-button-next swiper-button-next"></div>
  </section>
</template>

<style lang="scss" scoped>
  .back-col {
    position: absolute;
    top: 12.5rem;
    left: 50%;
    transform: translateX(-750px);
  }
  .back-button {
    background-color: color(backgroundColor, recipe);
    color: color(text, light);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 7px 20px;
    border-radius: 20px;
    letter-spacing: 0.1em;
    transition: opacity 0.3s ease;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
    @include font-size(20);
    .arrow-icon {
      @include font-size(40);
    }
  }
  .product-container {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 145px;
  }
  // .product-gallery {
  //   position: relative; /* 新增 */
  // }

  // .notice-wrap {
  //   max-width: 820px;
  //   margin: 24px auto;
  //   padding: 0 20px;
  //   font-family: 'Noto Sans TC', sans-serif;
  //   line-height: 1.75;
  //   color: #333;
  // }

  // .product-notice {
  //   position: relative;
  //   background: #f3f3f3;
  //   border-radius: 12px;
  //   padding: 18px 20px;
  //   border: 1px solid #e3e6f3;
  //   outline-offset: -6px;
  //   box-shadow: 0 2px 10px rgba(18, 24, 40, 0.06);
  //   margin-bottom: 18px;
  // }

  // .product-notice::before {
  //   content: '';
  //   position: absolute;
  //   top: -10px;
  //   left: 0;
  //   width: 100%;
  // }

  // .product-notice h3,
  // .purchase-info h3 {
  //   font-size: 32px;
  //   font-weight: 700;
  //   margin: 0 0 10px;
  // }

  // .product-notice h4 {
  //   font-size: 20px;
  //   font-weight: 700;
  //   margin: 18px 0 6px;
  // }

  // .product-notice ul,
  // .purchase-info ul {
  //   margin: 6px 0 0 1.25em;
  //   padding: 0;
  // }

  // .product-notice li,
  // .purchase-info li {
  //   margin: 6px 0;
  // }

  // .purchase-info {
  //   background: #f3f3f3;
  //   border-radius: 12px;
  //   padding: 18px 20px;
  // }

  // .purchase-info p {
  //   margin: 6px 0 8px;
  //   color: #6b7280;
  // }

  // @media (max-width: 480px) {
  //   .product-notice h3,
  //   .purchase-info h3 {
  //     font-size: 18px;
  //   }
  //   .product-notice h4 {
  //     font-size: 15px;
  //   }
  // }

  // .product-container {
  //   max-width: 1200px;
  //   display: flex;
  //   flex-direction: column;
  // }
  // .product-info {
  //   flex-direction: row;
  // }

  // .back-col {
  //   position: sticky;
  //   top: 170px;
  //   align-self: start;
  //   z-index: 5;
  // }

  // .back-button {
  //   display: inline-flex;
  //   align-items: center;
  //   gap: 6px;
  //   padding: 6px 14px;
  //   height: 32px;
  //   width: 100px;
  //   font-size: 14px;
  //   color: #fff;
  //   background-color: #d6b59c;
  //   border: none;
  //   border-radius: 16px;
  //   cursor: pointer;
  //   box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  // }

  // .back-button .arrow img {
  //   width: 16px;
  //   height: 16px;
  //   object-fit: contain;
  // }

  // .product-gallery {
  //   min-width: 690px;
  // }

  // .main-swiper {
  //   position: relative;
  //   border-radius: 12px;
  //   overflow: hidden;
  // }

  // .main-image {
  //   width: 100%;
  //   display: block;
  // }

  // .main-swiper::before,
  // .main-swiper::after {
  //   content: '';
  //   position: absolute;
  //   top: 0;
  //   bottom: 0;
  //   width: 15%;
  //   background: rgba(255, 255, 255, 0.35);
  //   pointer-events: none;
  //   z-index: 2;
  //   opacity: 0;
  //   transition: opacity 0.3s ease;
  // }

  // .main-swiper::before {
  //   left: 0;
  // }

  // .main-swiper::after {
  //   right: 0;
  // }

  // .main-swiper:hover::before,
  // .main-swiper:hover::after {
  //   opacity: 1;
  // }

  // :deep(.main-swiper .swiper-button-prev),
  // :deep(.main-swiper .swiper-button-next) {
  //   z-index: 3;
  //   color: #333;
  //   opacity: 0;
  //   transition: opacity 0.3s ease;
  // }

  // .main-swiper:hover :deep(.swiper-button-prev),
  // .main-swiper:hover :deep(.swiper-button-next) {
  //   opacity: 1;
  // }

  // .thumbs-swiper {
  //   margin-top: 10px;
  //   position: relative;
  //   overflow: visible;
  // }

  // .thumb-image {
  //   width: 100%;
  //   height: auto;
  //   border-radius: 6px;
  //   border: 2px solid transparent;
  //   cursor: pointer;
  //   transition: border 0.2s ease;
  // }

  // :deep(.swiper-slide-thumb-active) .thumb-image {
  //   border-color: #d6b59c;
  // }

  // .card {
  //   background: #ead7c4;
  //   border-radius: 12px;
  //   padding: 20px;
  //   color: #2b2b2b;
  //   box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  //   font-family: 'Noto Sans TC', sans-serif;
  //   min-width: 280px;
  //   position: sticky;
  //   top: 170px;
  //   align-self: start;
  //   max-height: calc(100vh - 48px);
  //   overflow-y: auto;
  // }

  // .title {
  //   font-size: 36px;
  //   font-weight: 700;
  //   margin-bottom: 8px;
  //   letter-spacing: 0.1em;
  // }

  // .features {
  //   padding-left: 0;
  //   list-style: none;
  //   font-size: 20px;
  //   margin-bottom: 10px;
  //   line-height: 1.8;
  //   color: #5b4b40;
  //   margin-top: 10%;
  // }

  // .price {
  //   font-size: 36px;
  //   font-weight: 700;
  //   margin: 15px 0 14px;
  // }

  // .qty {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   margin: 10px 0 16px;
  //   font-size: 24px;
  // }

  // .stepper {
  //   display: flex;
  //   gap: 6px;
  //   background: #fff;
  //   border: 1px solid rgba(0, 0, 0, 0.1);
  //   border-radius: 10px;
  //   padding: 2px;
  // }

  // .stepper button {
  //   width: 34px;
  //   height: 32px;
  //   border: none;
  //   background: transparent;
  //   border-radius: 16px;
  //   font-size: 18px;
  //   cursor: pointer;
  // }

  // .stepper input {
  //   width: 44px;
  //   height: 32px;
  //   text-align: center;
  //   border: none;
  //   outline: none;
  //   font-size: 16px;
  //   background: transparent;
  // }

  // .btn {
  //   width: 100%;
  //   height: 60px;
  //   border: none;
  //   border-radius: 10px;
  //   font-size: 32px;
  //   margin-top: 8px;
  //   cursor: pointer;
  // }

  // .primary {
  //   background: #e28d62;
  //   color: #fff;
  // }

  // .ghost {
  //   background: #fff;
  //   border: 1px solid #ccc;
  // }

  // .note {
  //   font-size: 16px;
  //   color: #6a5a51;
  //   margin: 10% 0 5%;
  //   line-height: 1.5;
  // }

  // .icon-cart,
  // .icon-heart {
  //   width: 45px;
  //   height: 45px;
  //   object-fit: contain;
  //   margin-right: 8px;
  //   vertical-align: middle;
  // }

  // .thumbs-arrow {
  //   font-size: 20px;
  //   font-weight: bold;
  //   user-select: none;
  // }

  // .responsive-img {
  //   width: 100%;
  //   height: auto;
  //   display: block;
  //   max-width: 100%;
  // }

  // .btn.primary {
  //   background: #d97c48;
  //   color: #fef9ec;
  //   transition:
  //     background-color 0.3s ease,
  //     box-shadow 0.3s ease;
  // }

  // .btn.primary:hover {
  //   background-color: #fef9ec;
  //   color: #d97c48;
  // }
  // @media (min-width: 881px) {
  //   .responsive-img {
  //     grid-column: 2 / 3;
  //   }

  //   .notice-wrap {
  //     grid-column: 2 / 3;
  //   }
  // }
  // @media (max-width: 880px) {
  //   .product-container {
  //     display: grid;
  //     grid-template-columns: 1fr;
  //     grid-template-areas:
  //       'back'
  //       'gallery'
  //       'card'
  //       'responsive-img'
  //       'notice-wrap';
  //     gap: 12px;
  //     width: 90%;
  //     margin: 0 auto;
  //   }

  //   .back-col {
  //     grid-area: back;
  //     position: static;
  //   }

  //   .product-gallery {
  //     grid-area: gallery;
  //   }

  //   .card {
  //     grid-area: card;
  //     position: static;
  //     width: 100%;
  //     max-width: 420px;
  //     margin: 0 auto;
  //     max-height: 100%;
  //   }

  //   .responsive-img {
  //     grid-area: responsive-img;
  //     width: 100%;
  //     display: block;
  //     max-width: 100%;
  //     height: auto;
  //   }

  //   .notice-wrap {
  //     grid-area: notice-wrap;
  //     display: block;
  //   }
  // }

  // 搭配好物
  .related-section {
    max-width: 1200px;
    position: relative;
    margin: 0 auto;
    @include rwdmax(1200) {
      padding-inline: 10px;
      width: 100%;
    }
  }
  .swiper-button-next,
  .swiper-button-prev {
    color: color(button, main);
    top: 50%;
    @include rwdmax(768) {
      transform: translateY(45%);
    }
  }
  .product-card {
    padding-inline: 30px;
    @include rwdmax(1400) {
      padding-inline: 15px;
    }
    @include rwdmax(1200) {
      padding-inline: 10px;
    }
    @include rwdmax(1024) {
      padding-inline: 30px;
    }
    @include rwdmax(768) {
      padding-inline: 0;
    }
  }
  .related-swiper {
    padding-top: 60px;
    padding-inline: 30px;
    @include rwdmax(1200) {
      padding-top: 40px;
      padding-inline: 25px;
    }
    @include rwdmax(1024) {
      padding-top: 30px;
      padding-inline: 30px;
    }
  }
  .swiper-button-next:after,
  .swiper-button-prev:after {
    @include rwdmax(1400) {
      @include font-size(40);
    }
    @include rwdmax(1200) {
      @include font-size(35);
    }
    @include rwdmax(768) {
      @include font-size(30);
    }
  }
  .related-title {
    @include font-size(32);
    font-weight: bold;
    letter-spacing: 0.2em;
    color: #222;
    @include rwdmax(1200) {
      @include font-size(26);
    }
    @include rwdmax(768) {
      @include font-size(20);
    }
  }
</style>
