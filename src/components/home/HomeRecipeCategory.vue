<script setup>
import {ref,onMounted} from 'vue';
import axios from 'axios';
// import { categoryName } from '@/constants/recipeCategory';
import SectionTitle from '../SectionTitle.vue';
import { RouterLink } from 'vue-router'; 

// const card = categoryName;


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
  <div class="recipe-all">
    <div class="recipe-category">
      <div class="recipe-category__section">
        <SectionTitle title="/靈感×食譜\"></SectionTitle>
      </div>

      <div class="recipe-category__box">
        <RouterLink 
          v-for="category in allCategory"
          :key="category.recipe_category_id"
          :to="{
            name: 'recipes',
    params: { category: category.name }
          }"
          class="recipe-category__card"
        >
          <img
            :src="category.image"
            :alt="category.title"
          />
          <button class="recipe-category__button">{{ category.name }}</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
  .recipe-category__section {
    margin-top: 50px;
  }
  .recipe-all {
    display: flex;
    justify-content: center;
  }
  // 上面暫時這樣設定

  .recipe-category {
    display: flex;
    flex-direction: column;
    margin: 0 auto; //暫時設定

    &__section {
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
      margin-top: 50px;

      @media screen and (max-width: 1200px) {
        gap: 150px;
        justify-content: center;
      }

      @media screen and (max-width: 768px) {
        gap: 50px;
        justify-content: center;
        margin-top: 0;
      }
    }
    &__card {
      background-color: black;
      width: 290px;
      height: 267px;
      position: relative;
      border-radius: 20px;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // 卡片預設陰影
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
      z-index: 0;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); // 卡片 hover 陰影

        .recipe-category__button {
          color: color(button, main);
          background-color: color(text, light);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
        }
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 20px;
        // background-color: rgba(0, 0, 0, 0.25);
        transition: background-color 0.3s ease;
        z-index: 1;
      }

      & > img {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        object-fit: cover;
        transition:
          transform 0.3s ease,
          filter 0.3s ease;
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
      background-color: color(button, main);
      border: none;
      color: color(text, light);
      cursor: pointer;
      z-index: 2;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transition:
        background-color 0.3s ease,
        color 0.3s ease,
        box-shadow 0.3s ease;
    }
  }
</style>
