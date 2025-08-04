<!-- Carousel.vue (最終修正版) -->
<template>
  <div class="center-focus-carousel">
    <!-- 輪播軌道 -->
    <div class="carousel-track" :style="trackStyle">
      <div
        class="carousel-item"
        v-for="(item, index) in items"
        :key="item.id"
        :class="getItemClass(index)"
      >
        <img :src="getImageUrl(item.imageUrl)" :alt="item.title" class="carousel-image">
        <div class="carousel-caption">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <span>{{ item.author }}</span>
        </div>
      </div>
    </div>

    <!-- 控制項容器 -->
    <div class="carousel-controls">
      <!-- 進度條 -->
      <div class="progress-bar-container">
        <div class="progress-bar-thumb" :style="progressBarThumbStyle"></div>
      </div>

      <!-- 按鈕組 -->
      <div class="button-group">
        <button @click="prevSlide" class="carousel-button">❮</button>
        <button @click="nextSlide" class="carousel-button">❯</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

// --- 狀態管理 ---
const currentIndex = ref(0);
// 項目總佔寬 = 項目寬度(220px) + 左右 margin(10px * 2)
const itemWidth = ref(240); 
const visibleItemsCount = 5;

// --- 計算屬性 ---

// 計算輪播軌道的位移
const trackStyle = computed(() => {
  return {
    transform: `translateX(-${currentIndex.value * itemWidth.value}px)`,
  };
});

// 計算進度條的樣式
const progressBarThumbStyle = computed(() => {
  const totalItems = props.items.length;
  if (totalItems <= visibleItemsCount) return { width: '100%' };

  const scrollableItems = totalItems - visibleItemsCount;
  const thumbWidth = (visibleItemsCount / totalItems) * 100;
  const thumbPosition = (currentIndex.value / scrollableItems) * (100 - thumbWidth);

  return {
    width: `${thumbWidth}%`,
    transform: `translateX(${thumbPosition}%)`,
  };
});

// --- 方法 ---

const nextSlide = () => {
  const maxIndex = props.items.length - visibleItemsCount;
  if (currentIndex.value >= maxIndex) {
    currentIndex.value = 0;
  } else {
    currentIndex.value++;
  }
};

const prevSlide = () => {
  const maxIndex = props.items.length - visibleItemsCount;
  if (currentIndex.value <= 0) {
    currentIndex.value = maxIndex;
  } else {
    currentIndex.value--;
  }
};

// 核心邏輯：根據項目索引，決定它應該是哪種狀態
const getItemClass = (index) => {
  // 焦點區域的開始和結束索引 (第2、3、4個位置)
  const focusStartIndex = currentIndex.value + 1;
  const focusEndIndex = currentIndex.value + 3;

  if (index >= focusStartIndex && index <= focusEndIndex) {
    return 'is-active'; // 中間三張
  }
  
  // 預覽區域的索引 (第1和第5個位置)
  const sideStartIndex = currentIndex.value;
  const sideEndIndex = currentIndex.value + 4;
  
  if(index === sideStartIndex || index === sideEndIndex) {
    return 'is-side'; // 左右兩側
  }
  
  // 其他完全在視窗外的卡片，可以給一個 'is-hidden' class
  return 'is-hidden';
};

const getImageUrl = (path) => {
  // 這裡使用更穩健的相對路徑解析方式
  return new URL(path, import.meta.url).href;
};
</script>

<style scoped>
.center-focus-carousel {
  /* 容器寬度 = 項目總佔寬 * 顯示數量 */
  /* 240px * 5 = 1200px */
  width: 100%;
  max-width: 1200px;
  margin: auto;
  position: relative;
  
  /* --- 這是最關鍵的修改 --- */
  /* 將容器變成一個「畫框」，隱藏所有超出範圍的內容 */
  overflow: hidden;
  
  padding: 20px 0;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.carousel-item {
  width: 220px;
  margin: 0 10px;
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  
  /* 過渡動畫，讓狀態變化更平滑 */
  transition: opacity 0.5s, transform 0.5s;
}

/* 狀態：在兩側的預覽項目 */
.carousel-item.is-side {
  opacity: 0.4;
  transform: scale(0.9);
}

/* 狀態：在中間的焦點項目 */
.carousel-item.is-active {
  opacity: 1;
  transform: scale(1);
}

/* 狀態：完全在視窗外的項目 (雖然被 overflow 隱藏了，但以防萬一) */
.carousel-item.is-hidden {
  opacity: 0;
}


/* --- 以下的圖片和控制項樣式保持不變 --- */

.carousel-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.carousel-caption {
  width: 100%;
  padding: 15px;
  text-align: center;
  background-color: #f5eadd;
}

.carousel-caption h3, .carousel-caption p, .carousel-caption span {
  margin: 0;
  white-space: nowrap; /* 防止文字換行 */
  overflow: hidden;    /* 隱藏超出的文字 */
  text-overflow: ellipsis; /* 超出部分顯示省略號 */
}

.carousel-caption h3 {
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 600;
}

.carousel-caption p, .carousel-caption span {
  font-size: 0.8rem;
  color: #666;
}

.carousel-caption span {
  display: block;
  margin-top: 10px;
  font-style: italic;
}

.carousel-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding: 0 10px;
}

.progress-bar-container {
  flex-grow: 1;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  margin-right: 20px;
  position: relative;
}

.progress-bar-thumb {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #E58A59;
  border-radius: 2px;
  transition: transform 0.5s, width 0.5s;
}

.button-group {
  display: flex;
  gap: 10px;
}

.carousel-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  font-size: 1.2rem;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s, box-shadow 0.2s;
}

.carousel-button:hover {
  background-color: #f7f7f7;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
</style>