<template>
  <div class="carousel-wrapper">
    <div class="carousel-container">
      <div
        class="carousel-viewport"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
      >
        <!-- 問題出在這裡，我們來修正它 -->
        <div
          ref="trackRef"
          class="carousel-track"
          :style="trackStyle"
        >
          <!-- 核心修正：將原本的 div v-for 整個替換成 RouterLink v-for -->
          <RouterLink
            v-for="(item, index) in displayItems"
            :key="item.recipe_id + '-' + index"
            :to="`/recipe-detail/${item.recipe_id}`"
            class="carousel-item"
            :class="getItemClass(index)"
          >
            <!-- 卡片內部內容不變 -->
            <img
              :src="item.image"
              :alt="item.name"
              class="carousel-image"
            />
            <div class="carousel-caption">
              <h3>{{ item.name }}</h3>
              <p class="description">{{ item.content }}</p>
              <span class="author">{{ item.author_name }}</span>
            </div>
          </RouterLink>
          <!-- 這裡沒有多餘的 </div>，結構是乾淨的 -->
        </div>
      </div>

      <!-- 桌面端控制項 -->
      <div class="carousel-controls">
        <div class="progress-bar">
          <div
            v-for="(_, index) in recipeItems"
            :key="index"
            class="progress-segment"
            :class="{ 'is-active': index === realCurrentIndex }"
          ></div>
        </div>
        <div class="button-group">
          <!-- 重要：為按鈕加上 .prevent，防止點擊時觸發頁面跳轉 -->
          <button
            @click.prevent="prevSlide"
            class="carousel-button"
            aria-label="上一張"
          >
            ❮
          </button>
          <button
            @click.prevent="nextSlide"
            class="carousel-button"
            aria-label="下一張"
          >
            ❯
          </button>
        </div>
      </div>

      <!-- 手機版按鈕容器 -->
      <div
        v-if="isMobile"
        class="mobile-button-container"
      >
        <SeeMoreButton
          text="我也想投稿"
          path="/"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  // 您的 script setup 邏輯是正確的，無需修改。
  // 我們將沿用最穩定的 handleResize 函式。
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
  import SeeMoreButton from '@/components/button/SeeMoreButton.vue';
  import { useRecipeStore } from '@/stores/recipeCollectStore';
  // import avatarImage1 from '@/assets/image/NewRecipes/braised_chicken_thigh.png';
  // import avatarImage2 from '@/assets/image/NewRecipes/creamy_white_sauce_shell_pasta.png';
  // import avatarImage3 from '@/assets/image/NewRecipes/yuzu_pepper_chicken_soba.png';
  // import avatarImage4 from '@/assets/image/NewRecipes/lemon_glazed_pound_cake.png';
  // import avatarImage5 from '@/assets/image/NewRecipes/braised_tofu.png';
  // import avatarImage6 from '@/assets/image/NewRecipes/recipe031-min.png';
  // import avatarImage7 from '@/assets/image/NewRecipes/recipe051-min.png';
  // import avatarImage8 from '@/assets/image/NewRecipes/recipe056-min.png';
  const VISIBLE_ITEMS = 5;
  const recipeStore = useRecipeStore();
  const CLONE_COUNT = VISIBLE_ITEMS;
  const TRANSITION_DURATION = 500;
  const MOBILE_BREAKPOINT = 768;
  const trackRef = ref(null);
  const currentIndex = ref(CLONE_COUNT);
  const isTransitioning = ref(false);
  const isMobile = ref(false);
  const itemWidth = ref(420);
  const isDragging = ref(false);
  const touchStartX = ref(0);
  const touchMoveX = ref(0);

  const recipeItems = computed(() => recipeStore.latestRecipes);

  // const recipeItems = ref([
  //   {
  //     id: 1,
  //     title: '紅燒雞腿',
  //     description: '奶油5g、貝殼麵......',
  //     author: '鹹魚',
  //     imageUrl: avatarImage1,
  //   },
  //   {
  //     id: 2,
  //     title: '奶油白醬小貝殼麵',
  //     description: '奶油5g、貝殼麵......',
  //     author: '鹹魚',
  //     imageUrl: avatarImage2,
  //   },
  //   {
  //     id: 3,
  //     title: '柚子胡椒雞肉蕎麥麵',
  //     description: '胡椒 些許、雞肉100g......',
  //     author: '小胖子',
  //     imageUrl: avatarImage3,
  //   },
  //   {
  //     id: 4,
  //     title: '檸檬糖霜磅蛋糕',
  //     description: '雞蛋 2顆，低筋麵粉100g......',
  //     author: '我只是愛吃',
  //     imageUrl: avatarImage4,
  //   },
  //   {
  //     id: 5,
  //     title: '紅燒豆腐',
  //     description: '雞蛋 2顆，低筋麵粉100g......',
  //     author: '我只是愛吃',
  //     imageUrl: avatarImage5,
  //   },
  //   {
  //     id: 6,
  //     title: '巧克力醬油炒泡麵',
  //     description: '濃郁滑順，香氣十足。',
  //     author: '黑暗料理人',
  //     imageUrl: avatarImage6,
  //   },
  //   {
  //     id: 7,
  //     title: '香煎蘿蔔糕',
  //     description: '台式好味道。',
  //     author: '隔壁王媽媽',
  //     imageUrl: avatarImage7,
  //   },
  //   {
  //     id: 8,
  //     title: '滷香筍絲肉片',
  //     description: '偷情家常菜。',
  //     author: '外遇的蔡媽媽',
  //     imageUrl: avatarImage8,
  //   },
  // ]);
  const displayItems = computed(() => {
    if (recipeItems.value.length === 0) return [];
    const headClones = recipeItems.value.slice(-CLONE_COUNT);
    const tailClones = recipeItems.value.slice(0, CLONE_COUNT);
    return [...headClones, ...recipeItems.value, ...tailClones];
  });
  const trackStyle = computed(() => {
    const dragOffset = isDragging.value ? touchMoveX.value - touchStartX.value : 0;
    let baseOffset = 0;
    if (isMobile.value) {
      baseOffset = currentIndex.value * itemWidth.value;
    } else {
      const centeringOffset = itemWidth.value * 2.5;
      baseOffset = centeringOffset + currentIndex.value * itemWidth.value;
    }
    return {
      transform: `translateX(calc(-${baseOffset}px + ${dragOffset}px))`,
      transition:
        isTransitioning.value && !isDragging.value
          ? `transform ${TRANSITION_DURATION}ms ease-in-out`
          : 'none',
    };
  });
  const realCurrentIndex = computed(
    () => (currentIndex.value - CLONE_COUNT + recipeItems.value.length) % recipeItems.value.length,
  );
  const moveTo = (newIndex) => {
    if (isTransitioning.value) return;
    isTransitioning.value = true;
    currentIndex.value = newIndex;
  };
  const nextSlide = () => moveTo(currentIndex.value + 1);
  const prevSlide = () => moveTo(currentIndex.value - 1);
  const handleTransitionEnd = () => {
    isTransitioning.value = false;
    const totalOriginalItems = recipeItems.value.length;
    if (currentIndex.value < CLONE_COUNT) {
      currentIndex.value += totalOriginalItems;
    } else if (currentIndex.value >= CLONE_COUNT + totalOriginalItems) {
      currentIndex.value -= totalOriginalItems;
    }
  };
  const onTouchStart = (event) => {
    if (!isMobile.value) return;
    isDragging.value = true;
    isTransitioning.value = false;
    touchStartX.value = event.touches[0].clientX;
    touchMoveX.value = event.touches[0].clientX;
  };
  const onTouchMove = (event) => {
    if (!isDragging.value || !isMobile.value) return;
    touchMoveX.value = event.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!isMobile.value) return;
    isDragging.value = false;
    const dragDistance = touchMoveX.value - touchStartX.value;
    if (Math.abs(dragDistance) > 50) {
      if (dragDistance < 0) nextSlide();
      else prevSlide();
    }
  };
  const handleResize = async () => {
    const screenWidth = window.innerWidth;
    isMobile.value = screenWidth <= MOBILE_BREAKPOINT;
    await nextTick();
    if (trackRef.value) {
      if (isMobile.value) {
        const itemEl = trackRef.value.children[CLONE_COUNT];
        if (itemEl) {
          const rect = itemEl.getBoundingClientRect();
          const style = window.getComputedStyle(itemEl);
          const marginRight = parseFloat(style.marginRight) || 0;
          if (rect.width > 0) {
            itemWidth.value = rect.width + marginRight;
          }
        }
      } else {
        itemWidth.value = 420;
      }
    }
  };
  onMounted(() => {
    trackRef.value.addEventListener('transitionend', handleTransitionEnd);
    window.addEventListener('resize', handleResize);
    handleResize();

    recipeStore.fetchLatestRecipes();
  });
  onUnmounted(() => {
    if (trackRef.value) {
      trackRef.value.removeEventListener('transitionend', handleTransitionEnd);
    }
    window.removeEventListener('resize', handleResize);
  });
  const getItemClass = (index) => {
    if (isMobile.value) return 'is-active';
    const centerPoint = currentIndex.value + 2;
    const distance = Math.abs(index - centerPoint);
    if (distance < 2) return 'is-active';
    if (distance === 2) return 'is-side';
    return 'is-hidden';
  };
</script>

<style lang="scss" scoped>
  /* FIX：為 wrapper 新增樣式 */
  .carousel-wrapper {
    width: 100%;
    /* 在手機版，overflow-x: hidden 非常重要，它會裁切掉跑出螢幕外的卡片 */
    overflow-x: hidden;
  }

  /* --- 桌面樣式和按鈕樣式保持不變 --- */
  .carousel-container {
    width: 100%;
    position: relative;
    font-family: sans-serif;
  }
  .carousel-viewport {
    width: 100%;
    height: 500px; /* 在手機版，這個 overflow 會被移除 */
    overflow: hidden;
    position: relative;
  }

  .carousel-track {
    display: flex;
    position: absolute;
    top: 0;
    left: 50%;
    align-items: center;
    height: 100%;
  }

  .carousel-item {
    width: 400px;
    height: 480px;
    margin: 0 10px;
    flex-shrink: 0;
    background-color: #d6b59c;
    border-radius: 16px;
    // @include cardBoxShadow; // 假設您有這個 mixin
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); // 給一個預設的陰影
    overflow: hidden;
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;

    // --- 1. 設定基礎狀態 (加入 transition) ---
    // 讓 transform 和 box-shadow 的變化都有 0.3 秒的平滑過渡動畫
    transition:
      transform 0.5s ease,
      box-shadow 0.5s ease;
    cursor: pointer; // 讓滑鼠移上去時顯示為「手形」指標
  }

  // --- 2. 新增通用 Hover 效果 ---
  // 無論卡片是什麼狀態，只要滑鼠移上去，就改變陰影
  .carousel-item:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  // --- 3. 處理不同狀態的 Hover (最關鍵的修正) ---
  // 這樣可以確保在保留原有 scale 效果的基礎上，再向上移動
  .carousel-item.is-active:hover {
    transform: scale(1) translateY(-5px);
  }
  .carousel-item.is-side:hover {
    transform: scale(0.9) translateY(-5px);
  }
  .carousel-item.is-hidden:hover {
    // 隱藏的卡片在 hover 時不做任何位移
    transform: scale(0.8);
  }

  // --- 原有的狀態樣式保持不變 ---
  .carousel-item.is-active {
    opacity: 1;
    transform: scale(1);
  }
  .carousel-item.is-side {
    opacity: 0.5;
    transform: scale(0.9);
  }
  .carousel-item.is-hidden {
    opacity: 0;
    transform: scale(0.8);
  }
  .carousel-image {
    width: 100%;
    height: 260px;
    object-fit: cover;
  }
  .carousel-caption {
    padding: 18px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .carousel-caption h3 {
    margin: 17px 12px auto 12px;
    font-size: 24px;
    font-weight: 600;
  }
  .description {
    margin: auto 12px auto 12px;
    font-size: 20px;
    color: #3b3739;
  }
  .author {
    font-size: 20px;
    color: #6b6e4f;
    text-align: right;
  }
  .carousel-controls {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 120px auto 50px auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;
  }
  .progress-bar {
    display: flex;
    flex-grow: 1;
  }
  .progress-segment {
    flex-grow: 1;
    height: 4px;
    background-color: #e0e0e0;
    transition: background-color 0.5s ease;
  }
  .progress-segment.is-active {
    background-color: #d97c48;
  }
  .button-group {
    display: flex;
    gap: 150px;
    margin-left: 80px;
  }
  .carousel-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    background-color: #d97c48;
    color: #ffffff;
    cursor: pointer;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s;
  }
  .carousel-button:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
  }
  .mobile-button-container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 40px;
  }

  /* --- 手機版樣式最終修正 --- */
  @media (max-width: 768px) {
    .carousel-controls {
      display: none;
    }

    /* 1. 移除 viewport 的 overflow: hidden，改由 wrapper 控制 */
    .carousel-viewport {
      height: 320px;
      overflow: visible; /* 關鍵！允許卡片「溢出」到可視區域外 */
      padding-left: 24px;
      box-sizing: border-box;
    }

    .carousel-track {
      left: 0;
      top: 0;
      transform: none;
      align-items: center;
      height: 100%;
    }

    /* 2. 設定您想要的視覺佈局 */
    .carousel-item {
      width: 11%; /* 讓一張卡片佔據 80% 寬度 */
      height: 292px;
      margin-right: 30px; /* 卡片之間的間距 */
      flex-shrink: 0;
      border-radius: 16px;
      box-shadow: none;
    }

    .carousel-item.is-side,
    .carousel-item.is-hidden {
      opacity: 1;
      transform: scale(1);
    }

    .carousel-image {
      height: 160px;
    }
    .carousel-caption {
      padding: 12px;
    }
    .carousel-caption h3 {
      font-size: 16px;
      margin: 10px 0;
    }
    .description,
    .author {
      font-size: 14px;
    }
  }

  .carousel-item {
    /* ...其他樣式... */
    text-decoration: none; /* 清除底線 */
    color: inherit; /* 讓文字顏色和原本一樣 */
  }
</style>
