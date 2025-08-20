<script setup>
  import { ref,onMounted, } from 'vue';
  // import { categoryName } from '@/constants/recipeCategory';
  import { RouterLink } from 'vue-router';

  import axios from 'axios';




  //使用axios串接資料
  const apiUrl = 'http://localhost:8888/front/recipe/get_recipe_category.php';

  const allCategory = ref([]);

  //用axios串接category_get.api
  const fetchCategory = async () => {
    try {
      const response = await axios.get(apiUrl);
      const apiData = response.data;

      allCategory.value = apiData;

      console.log('成功取得後端分類資料', allCategory.value);
    } catch (error) {
      console.error('取得食譜資料失敗', error);
      if (error.response) {
        console.error('伺服器回傳錯誤:', error.response.status, error.response.data);
      }
    }
  };

  onMounted(() => {
    fetchCategory();
  });
</script>

<template>
  <div class="category">
    <RouterLink
      v-for="category in allCategory"
      :key="category.recipe_category_id"
      :to="{
        name: 'recipes',
        params: { category: category.name }, // 這裡從 `name` 欄位取得參數
      }"
      class="category-box"
    >
      <button class="category-box__button">
        <img
          :src="category.image"
          :alt="category.name"
          class="category-box__image"
        />
        <span class="category-box__title">{{ category.name }}</span>
      </button>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
  .category {
    max-width: 1200px;
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    flex-wrap: wrap;
    gap: 20px;
    @include rwdmax(768) {
      gap: 10px;
    }
  }

  .category-box {
    display: flex;

    &__button {
      border-radius: 20px;
      width: 285px;
      height: 80px; //暫時先寫
      font-size: 24px;
      letter-spacing: 1.2px;
      padding: 0;
      border: 0; //暫時先設定
      font-size: large;
      overflow: hidden;
      cursor: pointer;
      background: transparent;
      position: relative;

      @include rwdmax(768) {
        width: 173px;
        height: 65px;
      }

      &:hover {
      }

      & > img {
        width: 100%;
        height: 100%; // 確保圖片填滿按鈕
        object-fit: cover; // 讓圖片填滿空間但不變形
        transition:
          filter 0.3s ease,
          transform 0.3s ease;
        // ✅ 預設狀態就是模糊的
        filter: blur(5px);
        transform: scale(1); // 預設沒有縮放
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1); // 預設透明
        transition: background-color 0.3s ease; // 過渡效果
        z-index: 1;
      }
    }

    .category-box__title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 1;
      letter-spacing: 1.2px;
      color: color(text, light);
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
      font-size: 24px;
      font-weight: bold;
      white-space: nowrap;
      @include rwdmax(768) {
        font-size: 20px;
      }
    }

    &:hover {
      // 給圖片移除模糊效果
      img {
        filter: blur(0px); // 變清晰
        transform: scale(1.05);
      }

      &::after {
        background-color: rgba(0, 0, 0, 0); // 變成完全透明
      }
    }
  }
</style>
