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
  import CancelButton from '@/components/button/CancelButton.vue';
  import ConfirmButton from '@/components/button/ConfirmButton.vue';
  import { getProduct } from '@/api/fetch';

  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/thumbs';

  const route = useRoute();
  const mainImages = ref([]); // 儲存主輪播圖的資料
  const contentImages = ref([]);

  const authStore = useAuthStore();
  const { isLoggedIn } = storeToRefs(authStore);
  const { openModal } = authStore;

  const cartStore = useCartStore();
  const { addCart } = cartStore;

  const mainSwiper = ref(null);
  const thumbsSwiper = ref(null);
  const setMainSwiper = (swiper) => {
    mainSwiper.value = swiper;
    // console.log('Main swiper set:', swiper);
  };

  const setThumbsSwiper = (swiper) => {
    thumbsSwiper.value = swiper;
    // console.log('Thumbs swiper set:', swiper);
  };

  // 當縮圖被點擊時同步主圖
  const onThumbClick = (swiper) => {
    if (mainSwiper.value && swiper.clickedIndex !== undefined) {
      mainSwiper.value.slideTo(swiper.clickedIndex);
    }
  };

  // 簡化版的縮圖導航控制 - 直接控制主圖
  const goToPrevThumb = () => {
    console.log('Prev thumb clicked');
    if (mainSwiper.value) {
      mainSwiper.value.slidePrev();
    }
  };

  const goToNextThumb = () => {
    // console.log('Next thumb clicked');
    if (mainSwiper.value) {
      mainSwiper.value.slideNext();
    }
  };

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

  // 該頁商品
  const product = ref(null);
  const fetchProductId = async (id) => {
    try {
      const response = await getProduct({ product_id: id });
      if (
        response.data.status === 'success' &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        product.value = response.data.data[0];
        mainImages.value = product.value.product_images;
        contentImages.value = product.value.content_images;
        console.log('單一商品資料:', product.value);
      } else {
        console.error('獲取商品資料失敗或資料不存在');
        product.value = null;
        mainImages.value = [];
        contentImages.value = [];
      }
    } catch (error) {
      console.error('獲取商品失敗:', error);
      product.value = null;
      mainImages.value = [];
      contentImages.value = [];
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
        fetchProductId(newId);
      }
    },
  );
</script>

<template>
  <div
    v-if="product"
    class="product-container"
  >
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
    <!-- <div class="product-info"></div> -->
    <div class="product-gallery">
      <!-- 主要輪播圖 -->
      <div class="main-swiper-container">
        <Swiper
          v-if="mainImages.length"
          class="main-swiper"
          :modules="[Navigation, Thumbs]"
          :navigation="{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }"
          :thumbs="{ swiper: thumbsSwiper }"
          :loop="true"
          :watch-slides-progress="true"
          @swiper="setMainSwiper"
        >
          <!-- 主圖導航按鈕 -->
          <div
            class="related-button-prev swiper-button-prev main-button-prev main-nav-button"
          ></div>
          <div
            class="related-button-next swiper-button-next main-button-next main-nav-button"
          ></div>
          <SwiperSlide
            v-for="(imgUrl, i) in mainImages"
            :key="i"
          >
            <img
              :src="imgUrl"
              class="main-image"
              :alt="`商品主圖 ${i + 1}`"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- 縮圖輪播 -->
      <div class="thumbs-swiper-container">
        <!-- 縮圖導航按鈕 - 移除 Swiper 內建導航，使用手動控制 -->
        <div
          class="related-button-prev swiper-button-prev thumbs-nav-button thumbs-button-prev"
          @click="goToPrevThumb"
        ></div>
        <div
          class="related-button-next swiper-button-next thumbs-nav-button thumbs-button-next"
          @click="goToNextThumb"
        ></div>
        <Swiper
          v-if="mainImages.length"
          class="thumbs-swiper"
          :modules="[Navigation, Thumbs]"
          :navigation="{
            nextEl: '.thumbs-swiper-container .swiper-button-next',
            prevEl: '.thumbs-swiper-container .swiper-button-prev',
          }"
          :slides-per-view="3"
          :space-between="10"
          :watch-slides-progress="true"
          @swiper="setThumbsSwiper"
          @click="onThumbClick"
        >
          <SwiperSlide
            v-for="(imgUrl, i) in mainImages"
            :key="i"
          >
            <img
              :src="imgUrl"
              class="thumb-image"
              :alt="`縮圖 ${i + 1}`"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <!-- 商品資訊卡 -->
    <aside class="product-infocard">
      <div class="product-infocard__content">
        <h2 class="product-infocard__title">{{ product.name }}</h2>
        <p class="product-infocard__features">
          {{ product.product_info }}
        </p>
        <div class="product-infocard__price">$ {{ product.unit_price }}</div>
      </div>
      <div class="product-infocard__qty">
        <span>數量</span>
        <div class="product-infocard__stepper">
          <button @click="dec">
            <Icon
              icon-name="minus"
              class="icon-qty"
            />
          </button>
          <input
            type="product-infocard__text"
            v-model.number="qty"
          />
          <button @click="inc">
            <Icon
              icon-name="plus"
              class="icon-qty"
            />
          </button>
        </div>
      </div>

      <ConfirmButton
        class="product-infocard__cart"
        type="submit"
        @click="addToCart"
      >
        <Icon
          icon-name="order"
          class="icon-cart"
        />
        加入購物車
      </ConfirmButton>
      <p class="note">
        若商品缺貨可以先加入「願望清單」
        <br />
        待恢復供貨就可以收到提醒！
      </p>

      <CancelButton
        type="submit"
        class="product-infocard__collect"
        @click="toggleWishlist"
      >
        <template v-if="inWishlist">
          <Icon
            icon-name="heart"
            class="icon-heart__collect"
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
      </CancelButton>
    </aside>

    <!-- 額外圖片（單張展示圖） -->
    <div class="product-content">
      <div class="product-content__pic">
        <div
          class="product-content__img"
          v-for="(image, index) in contentImages"
          :key="index"
        >
          <img
            :src="image"
            :alt="`商品展示圖 ${index + 1}`"
          />
        </div>
      </div>
      <!-- 商品須知區塊 -->
      <section class="product-content__info">
        <h3>商品使用須知</h3>
        <p>為確保使用安全及延長產品壽命，請詳閱以下說明：</p>
        <br />
        <br />
        <p>{{ product.product_notes }}</p>
      </section>

      <section class="product-content__notice">
        <h3>購買前請詳閱</h3>
        <p>
          為保障您的權益，請在下單前詳細閱讀以下資訊
          <br />
          <br />
          -商品規格、尺寸、顏色請務必確認無誤。
          <br />
          -本商品經拆封使用後恕不接受退換，請確認需求後購買。
          <br />
          -若對商品有任何疑問，歡迎下單前聯繫客服詢問。
          <br />
          -下單即表示您已詳閱並同意本店之購買條款與規定。
          <br />
          <br />
          感謝您的理解與支持，祝您購物愉快。
        </p>
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
  .product-container {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 145px;
    display: grid;
    grid-template-columns: 700px 1fr;
    grid-template-rows: 1fr;
    grid-template-areas:
      'a b '
      'c b '
      'c b ';
    gap: 0 10px;
    position: relative;
    @include rwdmax(1200) {
      padding-inline: 10px;
      grid-template-columns: 650px 1fr;
    }
    @include rwdmax(1024) {
      padding-inline: 10px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .back-col {
      position: absolute;
      left: 50%;
      transform: translateX(-700px);
      @include rwdmax(1440) {
        left: 0;
        transform: translateX(0);
      }
      @include rwdmax(1200) {
        padding-inline: 10px;
      }
      @include rwdmax(1024) {
        position: unset;
      }
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
      @include rwdmax(1200) {
        padding: 10px 15px;
      }
      .arrow-icon {
        @include font-size(40);
        @include rwdmax(1200) {
          @include font-size(32);
        }
        @include rwdmax(1024) {
          @include font-size(25);
        }
      }
    }
  }

  /* 左側圖片區域 */
  .product-gallery {
    max-width: 600px;
    margin: 0 auto 60px;
    @include rwdmax(1440) {
      margin-top: 80px;
    }
    @include rwdmax(1024) {
      margin: 0 auto;
    }
    @include rwdmax(768) {
      padding-inline: 35px;
      width: 100%;
    }
  }

  .main-swiper-container {
    margin: 0 auto 20px;
    max-width: 600px;
    @include rwdmax(1024) {
      margin: 0 auto 10px;
    }
  }

  .main-swiper {
    position: relative;
    width: 100%;
    aspect-ratio: 5 / 6;
    border-radius: 20px;
    overflow: hidden;
  }

  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* 主圖導航按鈕 */
  .main-nav-button {
    position: absolute;
    top: 0;
    transform: translateY(3%);
    width: 80px;
    height: 100%;
    background: rgba(255, 255, 255, 0.42);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
    @include rwdmax(768) {
      width: 60px;
      transform: translateY(3%);
      height: 102%;
    }
    @include rwdmax(500) {
      width: 40px;
      height: 104%;
    }
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: color(text, dark);
  }

  .main-button-prev {
    left: 0;
  }

  .main-button-next {
    right: 0;
  }

  .main-nav-button:hover {
    background: rgba(255, 255, 255, 0.7);
  }

  /* 縮圖容器 */
  .thumbs-swiper-container {
    position: relative;
    margin: 0 auto;
  }

  .thumbs-swiper {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 1;
    overflow: hidden;
    @include rwdmax(768) {
      // transform: translateY(45%);
    }
  }

  .thumb-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .thumb-image:hover {
    border-color: #d4a574;
  }

  /* 縮圖導航按鈕 */
  .thumbs-nav-button {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
  }

  .thumbs-button-prev {
    left: -40px;
    @include rwdmax(1200) {
      left: -30px;
    }
  }

  .thumbs-button-next {
    right: -40px;
    @include rwdmax(1200) {
      right: -30px;
    }
  }

  /* Swiper 活動狀態樣式 */
  .thumbs-swiper .swiper-slide-thumb-active .thumb-image {
    border-color: #d4a574;
  }

  /* 右側商品資訊卡 */
  .product-infocard {
    width: 100%;
    background: #ead7c4;
    padding: 50px 60px 25px;
    border-radius: 20px;
    position: sticky;
    top: 9rem;
    height: fit-content;
    @include rwdmax(1440) {
      margin-top: 80px;
    }
    @include rwdmax(1200) {
      padding: 40px 40px 25px;
    }
    @include rwdmax(1024) {
      position: unset;
      max-width: 600px;
      margin: 0 auto;
    }
    @include rwdmax(768) {
      padding: 35px;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 40px;
      @include rwdmax(1200) {
        gap: 35px;
      }
      @include rwdmax(768) {
        gap: 25px;
      }
    }

    &__title {
      letter-spacing: 0.2em;
      font-weight: 700;
      color: color(text, dark);
      line-height: 1.3;
      @include font-size(36);
      @include rwdmax(1200) {
        @include font-size(30);
      }
      @include rwdmax(768) {
        @include font-size(24);
      }
    }

    &__features {
      letter-spacing: 0.2em;
      white-space: pre-line;
      color: color(text, dark);
      font-weight: normal;
      line-height: 1.7;
      @include font-size(20);
      @include rwdmax(1200) {
        @include font-size(18);
      }
      @include rwdmax(768) {
        @include font-size(16);
      }
    }

    &__price {
      font-weight: normal;
      color: color(text, dark);
      margin-bottom: 36px;
      letter-spacing: 0.1em;
      @include font-size(36);
      @include rwdmax(1200) {
        margin-bottom: 30px;
        @include font-size(30);
      }
      @include rwdmax(768) {
        margin-bottom: 25px;
        @include font-size(24);
      }
    }

    /* 數量選擇器 */
    &__qty {
      display: flex;
      align-items: center;
      gap: 40px;
      margin-bottom: 46px;
      @include rwdmax(1200) {
        margin-bottom: 35px;
        gap: 30px;
      }
      @include rwdmax(768) {
        margin-bottom: 30px;
      }

      span {
        letter-spacing: 0.1em;
        color: color(text, dark);
        font-weight: normal;
        @include font-size(24);
        @include rwdmax(1200) {
          @include font-size(22);
        }
        @include rwdmax(768) {
          @include font-size(18);
        }
      }
    }

    &__stepper {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 20px;
      overflow: hidden;

      button {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-inline: 10px;
        border: none;
        background: white;
        color: color(text, dark);
        font-weight: normal;
        cursor: pointer;
        @include font-size(40);
      }

      .icon-qty {
        color: color(text, dark);
        font-weight: 400;
        @include font-size(30);
        transition: all 0.3s ease;
        @include rwdmax(1200) {
          @include font-size(24);
        }
        @include rwdmax(768) {
          @include font-size(20);
        }

        &:hover {
          color: color(button, main);
        }
      }

      input {
        width: 100px;
        padding: 12px 0;
        border: none;
        background: white;
        text-align: center;
        font-weight: normal;
        color: color(text, dark);
        outline: none;
        @include font-size(24);
        @include rwdmax(1200) {
          width: 90px;
          @include font-size(22);
        }
        @include rwdmax(768) {
          @include font-size(18);
        }
      }
    }

    /* 加入購物車按鈕 */
    &__cart {
      width: 100%;
      --btn-padding: 15px 0;
      margin-bottom: 63px;
      @include rwdmax(1200) {
        margin-bottom: 50px;
      }
      @include rwdmax(768) {
        margin-bottom: 30px;
      }
    }

    .icon-cart {
      padding-right: 10px;
      @include font-size(30);
      @include rwdmax(1200) {
        @include font-size(25);
      }
    }

    /* 提示文字 */
    .note {
      font-size: 13px;
      line-height: 1.5;
      letter-spacing: 0.1em;
      margin-bottom: 15px;
      text-align: start;
      color: color(text, base);
      @include font-size(16);
      @include rwdmax(768) {
        @include font-size(14);
      }
      @include rwdmax(768) {
        margin-bottom: 5px;
      }
    }

    /* 加入願望清單按鈕 */
    &__collect {
      width: 100%;
      --btn-padding: 16px 0;
    }

    .icon-heart {
      padding-right: 10px;
      @include font-size(25);
      @include rwdmax(1200) {
        @include font-size(20);
      }

      &__collect {
        padding-right: 10px;
        color: color(text, error);
      }
    }
  }

  /* 下方內容區域 */
  .product-content {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    @include rwdmax(1024) {
      max-width: 600px;
    }

    &__pic {
      text-align: center;
      overflow: hidden;
      border-radius: 20px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    /* 商品資訊區塊 */
    &__info,
    &__notice {
      background: #f3f3f3;
      padding: 30px 20px;
      border-radius: 20px;
      @include rwdmax(768) {
        padding: 15px 10px;
      }
    }

    &__info h3,
    &__notice h3 {
      font-weight: 700;
      color: color(text, dark);
      margin-bottom: 16px;
      padding-bottom: 12px;
      letter-spacing: 0.1em;
      display: inline-block;
      @include font-size(32);
      @include rwdmax(1200) {
        @include font-size(28);
      }
      @include rwdmax(768) {
        @include font-size(18);
      }
    }

    &__info p,
    &__notice p {
      color: color(text, dark);
      white-space: pre-line;
      line-height: 1.5;
      letter-spacing: 0.1em;
      @include font-size(20);
      @include rwdmax(1200) {
        @include font-size(18);
      }
      @include rwdmax(768) {
        @include font-size(14);
      }
    }
  }

  // 搭配好物
  .related-section {
    max-width: 1200px;
    position: relative;
    margin: 0 auto;
    @include rwdmax(1200) {
      padding-inline: 10px;
      width: 100%;
    }
    .swiper-button-next,
    .swiper-button-prev {
      color: color(button, main);
      top: 50%;
      transform: translateY(-48%);
      @include rwdmax(1400) {
        transform: translateY(-45%);
      }
      @include rwdmax(1200) {
        transform: translateY(-40%);
      }
      @include rwdmax(768) {
        transform: translateY(-10%);
      }
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
