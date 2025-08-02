<script setup>
  import { categoryName } from '@/constants/recipeCategory';
  // tile是我們設的key 冒號後""內為key的值

  import SectionTitle from '../SectionTitle.vue';

  const card = categoryName;

  

</script>

<template>
<div class="recipe-all">
  <!-- 上面的名稱待修改 -->
  <div class="recipe-category">
    
    <div class="recipe-category__section">
      <SectionTitle title="/靈感 X 食譜\"></SectionTitle>
    </div>

    <div class="recipe-category__box">
      <div v-for="cards in card" class="recipe-category__card">
        <!-- cards是我們設立的變數 -->
        <img
          :src="cards.image"
          :alt="cards.title"
        />
        <button class="recipe-category__button">{{ cards.title }}</button>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
  .recipe-all{
    display: flex;
    justify-content: center;
  }
    // 上面暫時這樣設定

  .recipe-category{
    display: flex;
    flex-direction: column;
    margin: 0 auto 100px; //暫時設定

    &__section{
      margin-bottom: 50px;
    }

    & > h2 {
      text-align: center;
    }
    &__box {
      // background-color: red;
      max-width: 1200px;
      width: 100%;
      height: auto;
      display: flex;
      justify-content: space-between;
      row-gap: 50px;
      flex-wrap: wrap;
    }
    &__card {
      background-color: black;
      width: 290px;
      height: 267px;
      // height: auto;
      position: relative;
      border-radius: 20px;

      & > img{
        width: 100%;
        height: auto;
        border-radius: 20px;
      }
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
      background-color: color(button,main);
      border: none;
      color:color(text,light);
      cursor: pointer;
    }
  }
</style>
