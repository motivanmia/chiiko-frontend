<script setup>
  import { category_name } from '@/constants/recipecategory';
  // tile是我們設的key 冒號後""內為key的值
</script>

<template>
  <div class="recipe-category">
    <h2>靈感X食譜</h2>
    <div class="recipe-category__box">
      <div
        v-for="cards in category_name"
        class="recipe-category__card"
      >
        <!-- cards是我們設立的變數 -->
        <img
          src=""
          alt=""
        />
        {{ cards }}
        <button class="recipe-category__button">{{ cards.title }}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .recipe-category {
    display: flex;
    flex-direction: column;

    & > h2 {
      text-align: center;
    }
    &__box {
      background-color: red;
      width: 1200px;
      height: 500px;
      display: flex;
      justify-content: space-between;
      row-gap: 50px;
      flex-wrap: wrap;
    }
    &__card {
      background-color: black;
      width: 290px;
      height: 267px;
      position: relative;
    }
    &__button {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%, 50%);
      border-radius: 20px;
      width: 235px;
      height: 55px;
      font-size: 24px;
      letter-spacing: 1.2px;
    }
  }
</style>
