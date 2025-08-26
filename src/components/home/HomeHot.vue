<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRecipeCollectStore } from '@/stores/recipeCollectStore'; // <-- 這裡修正了

import sectionTitle from '@/components/SectionTitle.vue';
import hot_img from '@/components/home/HomeHotImg.vue';
import DropdownMenu from '../button/DropdownMenu.vue';
import SeeMoreButton from '../button/SeeMoreButton.vue';

const recipeStore = useRecipeCollectStore(); // <-- 這裡修正了
const activeTab = ref('當季熱門'); // 管理當前顯示的分頁狀態

// 在元件掛載時，一次性載入所有需要的資料
onMounted(() => {
  recipeStore.fetchHotRecipes();
  recipeStore.fetchMostFavoritedRecipes();
});

// 根據 activeTab 的值，動態切換要顯示的食譜資料
const displayedRecipes = computed(() => {
  if (activeTab.value === '當季熱門') {
    // 這裡你需要確認你的 store 裡面的 hotRecipes 是正確的狀態屬性
    return recipeStore.hotRecipes; 
  } else if (activeTab.value === '最多收藏') {
    // 這裡你需要確認你的 store 裡面的 mostFavoritedRecipes 是正確的狀態屬性
    return recipeStore.mostFavoritedRecipes;
  }
  return []; // 預設回傳空陣列以避免錯誤
});

const dropdownOptions = ['當季熱門', '最多收藏'];

const onDropdownChange = (value) => {
  activeTab.value = value;
};
</script>

<template>
  <div id="HomeHot">
    <sectionTitle id="title" />
    <div id="hot_img_s">
      <span>
        <hot_img
          v-for="recipe in displayedRecipes.slice(0, 2)"
          :key="recipe.recipe_id"
          :path="`/recipe-detail/${recipe.recipe_id}`"
          class="hot_img"
          :img="recipe.image"
          :text="recipe.recipe_name"
        />
      </span>
      <span id="right">
        <DropdownMenu
          id="DropdownMenu"
          :options="dropdownOptions"
          :modelValue="activeTab"
          @update:modelValue="onDropdownChange"
        />
        <hot_img
          v-for="recipe in displayedRecipes.slice(2, 4)"
          :key="recipe.recipe_id"
          :path="`/recipe-detail/${recipe.recipe_id}`"
          class="hot_img"
          :img="recipe.image"
          :text="recipe.recipe_name"
        />
      </span>
    </div>
    <SeeMoreButton
      id="SeeMoreButton"
      path="/recipes"
    />
  </div>
</template>

<style lang="scss" scoped>
  #HomeHot {
    margin-top: 180px;
  }
  #title {
    margin-bottom: 100px;
    @include rwdmax(768) {
      margin-bottom: 50px;
    }
  }
  #right {
    margin-top: 50px;
    position: relative;
  }
  #DropdownMenu {
    position: absolute;
    top: -25%;
    right: 0;
    @include rwdmax(768) {
      display: none;
    }
  }
  #hot_img_s {
    display: flex;
    justify-content: center;
    gap: 50px;
    margin: auto;
    @include rwdmax(768) {
      display: block;
      gap: 10px;
    }
  }
  #SeeMoreButton {
    margin: 120px auto 40px;
    transform: scale(1.5);
    @include rwdmax(768) {
      transform: scale(1);
      margin: 50px auto 40px;
    }
  }
</style>
