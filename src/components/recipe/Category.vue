<script setup>
  import { categoryName } from '@/constants/recipeCategory';
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="category">
    <RouterLink
      v-for="buttons in categoryName"
      :key="buttons.id"
      :to="{ 
        name: 'solo', // 導向'solo' 
      }"
      class="category-box"
    >
      <button class="category-box__button">
        <img
          :src="buttons.image"
          :alt="buttons.title"
          class="category-box__image"
        />
        <span class="category-box__title">{{ buttons.title }}</span>
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
    margin: 30px auto 0 auto;
    flex-wrap: wrap;
    gap: 40px;
  }

  .category-box {
    display: flex;

    &__button {
      border-radius: 20px;
      width: 270px;
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

        @media (max-width: 768px) {
          width: 173px;
          height: 65px;
          
        }

      &:hover {
      }

      & > img {
        width: 100%;
        height: 100%; // 確保圖片填滿按鈕
        object-fit: cover; // 讓圖片填滿空間但不變形
      transition: filter 0.3s ease, transform 0.3s ease;
      // ✅ 預設狀態就是模糊的
      filter: blur(5px); 
      transform: scale(1); // 預設沒有縮放
      }

      &::after {
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
      font-weight: larger;
      white-space: nowrap;
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
