<script setup>
import { defineEmits, ref } from 'vue';

// 宣告一個 'search' 事件，用於向父組件發送搜尋文字
const emits = defineEmits(['search']);

// 熱搜關鍵字陣列
const hotSearches = ref([
  { keyItem: '芒果冰沙', path: '#' },
  { keyItem: '鳳梨', path: '#' },
  { keyItem: '小黃瓜', path: '#' },
  { keyItem: '甜甜圈', path: '#' },
]);

// 處理點擊事件的函式
const handleHotSearchClick = (keyword) => {
  // 發出 'search' 事件，並傳遞點擊的關鍵字
  emits('search', keyword);
};
</script>

<template>
  <div class="hot-search">
    <h3>
      熱搜:
      <span>
        <a
          v-for="item in hotSearches"
          :key="item.keyItem"
          :href="item.path"
          @click.prevent="handleHotSearchClick(item.keyItem)"
          class="hot-search__item"
        >
          {{ item.keyItem }}
        </a>
      </span>
    </h3>
  </div>
</template>

<style lang="scss" scoped>
.hot-search {
  display: flex;
  padding: 10px;
  font-size: 24px;
  letter-spacing: 1.2px;
  // flex-wrap: nowrap;

<<<<<<< HEAD
    text-shadow: var(--hot-search-text-shadow, none);
    @media screen and (max-width: 1440px) {
      font-size: 18px;
    }
    @media screen and (max-width: 768px) {
      font-size: 14px;
    }
=======
  text-shadow: var(--hot-search-text-shadow, none);

  @media screen and (max-width: 768px) {
    font-size: 14px;
  }
>>>>>>> Daivd

  & > h3 {
    color: var(--hot-search-color, color(text, dark));

    & > span {
      & > a {
        padding: 0 5px;
        color: var(--hot-search-color, color(text, dark));
        text-decoration: underline;
      }
    }
  }
}
</style>
