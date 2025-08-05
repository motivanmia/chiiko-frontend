<template>
  <div class="carousel-container">
    <div class="carousel-viewport">
      <div
        ref="trackRef"
        class="carousel-track"
        :style="trackStyle"
      >
        <div
          v-for="(item, index) in displayItems"
          :key="item.id + '-' + index"
          class="carousel-item"
          :class="getItemClass(index)"
        >
          <img
            :src="item.imageUrl"
            :alt="item.title"
            class="carousel-image"
          />
          <div class="carousel-caption">
            <h3>{{ item.title }}</h3>
            <p class="description">{{ item.description }}</p>
            <span class="author">{{ item.author }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-controls">
      <!-- 進度條容器 -->
      <div class="progress-bar">
        <div
          v-for="(_, index) in recipeItems"
          :key="index"
          class="progress-segment"
          :class="{ 'is-active': index === realCurrentIndex }"
        ></div>
      </div>

      <!-- 按鈕組 -->
      <div class="button-group">
        <button
          @click="prevSlide"
          class="carousel-button"
          aria-label="上一張"
        >
          ❮
        </button>
        <button
          @click="nextSlide"
          class="carousel-button"
          aria-label="下一張"
        >
          ❯
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import avatarImage1 from '@/assets/image/NewRecipes/braised_chicken_thigh.png';
  import avatarImage2 from '@/assets/image/NewRecipes/creamy_white_sauce_shell_pasta.png';
  import avatarImage3 from '@/assets/image/NewRecipes/yuzu_pepper_chicken_soba.png';
  import avatarImage4 from '@/assets/image/NewRecipes/lemon_glazed_pound_cake.png';
  import avatarImage5 from '@/assets/image/NewRecipes/braised_tofu.png';
  import avatarImage6 from '@/assets/image/NewRecipes/recipe031-min.png';
  import avatarImage7 from '@/assets/image/NewRecipes/recipe051-min.png';
  import avatarImage8 from '@/assets/image/NewRecipes/recipe056-min.png';

  // --- 常數與設定 (保持不變) ---
  const VISIBLE_ITEMS = 5;
  const CLONE_COUNT = VISIBLE_ITEMS;
  const TRANSITION_DURATION = 500;

  // --- 狀態管理 (保持不變) ---
  const trackRef = ref(null);
  const currentIndex = ref(CLONE_COUNT);
  const isTransitioning = ref(false);

  const recipeItems = ref([
    {
      id: 1,
      title: '紅燒雞腿',
      description: '奶油5g、貝殼麵......',
      author: '鹹魚',
      imageUrl: avatarImage1,
    },
    {
      id: 2,
      title: '奶油白醬小貝殼麵',
      description: '奶油5g、貝殼麵......',
      author: '鹹魚',
      imageUrl: avatarImage2,
    },
    {
      id: 3,
      title: '柚子胡椒雞肉蕎麥麵',
      description: '胡椒 些許、雞肉100g......',
      author: '小胖子',
      imageUrl: avatarImage3,
    },
    {
      id: 4,
      title: '檸檬糖霜磅蛋糕',
      description: '雞蛋 2顆，低筋麵粉100g......',
      author: '我只是愛吃',
      imageUrl: avatarImage4,
    },
    {
      id: 5,
      title: '紅燒豆腐',
      description: '雞蛋 2顆，低筋麵粉100g......',
      author: '我只是愛吃',
      imageUrl: avatarImage5,
    },
    {
      id: 6,
      title: '巧克力醬油炒泡麵',
      description: '濃郁滑順，香氣十足。',
      author: '黑暗料理人',
      imageUrl: avatarImage6,
    },
    {
      id: 7,
      title: '香煎蘿蔔糕',
      description: '台式好味道。',
      author: '隔壁王媽媽',
      imageUrl: avatarImage7,
    },
    {
      id: 8,
      title: '滷香筍絲肉片',
      description: '偷情家常菜。',
      author: '外遇的蔡媽媽',
      imageUrl: avatarImage8,
    },
  ]);

  // --- 計算屬性 ---
  const displayItems = computed(() => {
    if (recipeItems.value.length === 0) return [];
    const headClones = recipeItems.value.slice(-CLONE_COUNT);
    const tailClones = recipeItems.value.slice(0, CLONE_COUNT);
    return [...headClones, ...recipeItems.value, ...tailClones];
  });

  const trackStyle = computed(() => {
    const itemWidth = 420;
    const centeringOffset = itemWidth * 2.5;
    const scrollOffset = currentIndex.value * itemWidth;
    const totalOffset = centeringOffset + scrollOffset;
    return {
      transform: `translateX(-${totalOffset}px)`,
      transition: isTransitioning.value ? `transform ${TRANSITION_DURATION}ms ease-in-out` : 'none',
    };
  });

  const realCurrentIndex = computed(() => {
    return (currentIndex.value - CLONE_COUNT + recipeItems.value.length) % recipeItems.value.length;
  });

  const moveTo = (newIndex) => {
    if (isTransitioning.value) return;
    isTransitioning.value = true;
    currentIndex.value = newIndex;
  };
  const nextSlide = () => moveTo(currentIndex.value + 1);
  const prevSlide = () => moveTo(currentIndex.value - 1);

  const handleTransitionEnd = () => {
    const totalOriginalItems = recipeItems.value.length;
    if (currentIndex.value < CLONE_COUNT) {
      isTransitioning.value = false;
      currentIndex.value += totalOriginalItems;
      return;
    }
    if (currentIndex.value >= CLONE_COUNT + totalOriginalItems) {
      isTransitioning.value = false;
      currentIndex.value -= totalOriginalItems;
      return;
    }
    isTransitioning.value = false;
  };

  // --- 生命週期鉤子 (保持不變) ---
  onMounted(() => {
    trackRef.value.addEventListener('transitionend', handleTransitionEnd);
  });
  onUnmounted(() => {
    if (trackRef.value) {
      trackRef.value.removeEventListener('transitionend', handleTransitionEnd);
    }
  });

  // --- 輔助函式 (保持不變) ---
  const getItemClass = (index) => {
    const centerPoint = currentIndex.value + 2;
    const distance = Math.abs(index - centerPoint);
    if (distance < 2) return 'is-active';
    if (distance === 2) return 'is-side';
    return 'is-hidden';
  };
</script>

<style scoped>
  .carousel-container {
    width: 100%;
    position: relative;
    font-family: sans-serif;
  }
  .carousel-viewport {
    width: 100%;
    height: 500px;
    overflow: hidden;
    position: relative;
  }
  .carousel-track {
    display: flex;
    position: absolute;
    top: 0;
    left: 50%;
  }
  .carousel-item {
    width: 400px;
    height: 480px;
    margin: 0 10px;
    flex-shrink: 0;
    background-color: #d6b59c;
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition:
      opacity 0.5s ease-in-out,
      transform 0.5s ease-in-out;
    display: flex;
    flex-direction: column;
  }
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
    margin: 120px auto 210px auto;
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
</style>
