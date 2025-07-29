<script setup>
import { category_name } from '@/constants/recipeCategory';

</script>

<template>
  <div class="category">
    <div
      v-for="buttons in category_name"
      class="category-box"
    >
      <button class="category-box__button">
        <img
          src="/src/assets/image/Recipes/solo-meal.jpg"
          alt="solo-meal"
        />
        <span class="category-box__title">{{ buttons.title }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .category {
    max-width: 1200px;
    width: 100%;
    display: flex;
    justify-content: center;
    margin:30px auto 0 auto;
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

      // &:hover{
        
      // }

      & > img{
        width: 100%;
      }

    }

    .category-box__title{
      position: absolute;
      top:50%;
      left:50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 1;
      letter-spacing: 1.2px;
      color: color(text,light);
      text-shadow: 0px 4px 4px rgba(0,0,0,0.25);
      font-size: 24px;
      font-weight: larger;
      white-space: nowrap;
    }


  }

</style>
