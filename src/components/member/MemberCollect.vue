<script setup>
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import MemberCard from './MemberCard.vue';
  import { ref, onMounted } from 'vue';
  import PageEmpty from './PageEmpty.vue';

  const router = useRouter();
  const allRecipes = ref([]);
  const deleteApiUrl = `${import.meta.env.VITE_API_BASE}/member/delete_favorite_recipes.php`;
  //下面是抓取會員收藏的食譜
  const apiUrl = `${import.meta.env.VITE_API_BASE}/member/get_favorite_recipes.php`;

  //用axios串接favorite_recipes.php
  const fetchRecipe = async () => {
    try {
      const response = await axios.get(apiUrl);
      const apiResponse = response.data;

      if (apiResponse.success) {
        (allRecipes.value = apiResponse.data),
        console.log('成功取得收藏資料', allRecipes.value);
        
      } else {
        console.error('API錯誤:', apiResponse.error);
        allRecipes.value = [];
      }
    } catch (error) {
      console.error('取得收藏資料失敗', error);
      allRecipes.value = [];
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await axios.delete(deleteApiUrl, {
        data: { recipe_id: recipeId },
      });
      const apiResponse = response.data;

      if (apiResponse.success) {
        console.log('成功刪除收藏', apiResponse.message);
        allRecipes.value = allRecipes.value.filter((recipe) => recipe.recipe_id !== recipeId);
      } else {
        console.error('刪除收藏失敗:', apiResponse.error);
      }
    } catch (error) {
      console.error('刪除收藏失敗', error);
    }
  };

  const goToProduct = () => {
    router.push('/recipes');
  };

  onMounted(() => {
    fetchRecipe();
  });
</script>

<template>
  <div class="member-collect">
    <div
      v-if="allRecipes.length > 0"
      v-for="recipe in allRecipes"
      :key="recipe.recipe_id"
      class="member-card__box"
    >
    <MemberCard
      :imgSrc="recipe.image"
      :titleText="recipe.name"
      :recipeId="recipe.recipe_id"
      :iconDescription="recipe.favorite_count"
      @delete-click="handleDeleteRecipe(recipe.recipe_id)"
    />

    </div>
    <div v-else>
      <PageEmpty
        title-text="目前沒有任何食譜收藏"
        button-text="去好靈感×食譜逛逛"
        @confirm-click="goToProduct"
      ></PageEmpty>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .member-collect {
    background-color: color(backgroundColor, panel);
    padding: 40px 20px;
    border-radius: 15px;
    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    justify-content: center;
    @include rwdmax(1200) {
      max-width: 768px;
    }

    .member-card__box {
      & > a {
        text-decoration: none; 
        color: inherit; 
    }
  }
}
</style>
