import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE}/recipe`;

// 定義一個輔助函式，用於在陣列中更新食譜的收藏數
// 將此函式放在 defineStore 的 actions 區塊之外，以便在 actions 中呼叫
function updateRecipeCountInArray(array, recipeId, action) {
  if (!array) return;
  const recipeToUpdate = array.find((recipe) => Number(recipe.recipe_id) === Number(recipeId));
  if (recipeToUpdate) {
    if (action === 'add') {
      recipeToUpdate.favorite_count = (Number(recipeToUpdate.favorite_count) || 0) + 1;
    } else {
      recipeToUpdate.favorite_count = (Number(recipeToUpdate.favorite_count) || 0) - 1;
    }
  }
}

export const useRecipeCollectStore = defineStore('collect-recipe', {
  state: () => ({
    favoriteRecipesStatus: {},
    hotRecipes: [],
    mostFavoritedRecipes: [],
    latestRecipes: [],
    searchResults: [],
  }),
  actions: {
    async checkRecipeStatus(recipeId) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/check_favorite_recipes.php?recipe_id=${recipeId}`,
        );
        if (response.data.success) {
          this.favoriteRecipesStatus[recipeId] = response.data.is_collected;
        } else {
          this.favoriteRecipesStatus[recipeId] = false;
          console.error('檢查收藏狀態失敗:', response.data.message);
        }
      } catch (error) {
        this.favoriteRecipesStatus[recipeId] = false;
        console.error('API request failed:', error);
      }
    },

    async toggleCollect(recipeId, currentRecipe) {
      const isCollected = this.favoriteRecipesStatus[recipeId];
      const action = isCollected ? 'remove' : 'add';

      try {
        const response = await axios.post(`${API_BASE_URL}/toggle_favorite_recipe.php`, {
          recipe_id: recipeId,
          action: action,
        });

        if (response.data.success) {
          this.favoriteRecipesStatus[recipeId] = !isCollected;
          console.log(response.data.message);

          // 更新 Pinia Store 裡的陣列，保持不變
          updateRecipeCountInArray(this.hotRecipes, recipeId, action);
          updateRecipeCountInArray(this.mostFavoritedRecipes, recipeId, action);
          updateRecipeCountInArray(this.latestRecipes, recipeId, action);
          updateRecipeCountInArray(this.searchResults, recipeId, action);

          // 直接更新傳入的食譜物件的收藏數
          if (currentRecipe) {
            if (action === 'add') {
              Swal.fire({
                icon: 'success',
                title: '收藏成功！',
                showConfirmButton: false,
                timer: 1500,
              });
              currentRecipe.favorites_count =
                (parseInt(currentRecipe.favorites_count, 10) || 0) + 1;
            } else {
              Swal.fire({
                icon: 'warning',
                title: '取消收藏成功！',
                showConfirmButton: false,
                timer: 1500,
              });

              currentRecipe.favorites_count =
                (parseInt(currentRecipe.favorites_count, 10) || 0) - 1;
            }
          }
        } else {
          if (response.data.message === '食譜已被您收藏囉!') {
            this.favoriteRecipesStatus[recipeId] = true;
          }
          alert(response.data.message || '操作失敗');
        }
      } catch (error) {
        console.error('API request failed:', error);
        alert('網路連線失敗，請檢查網路');
      }
    },

    async fetchHotRecipes() {
      try {
        const res = await axios.get(`${API_BASE_URL}/get_homehot_recipes.php`);
        if (res.data.status === 'success') {
          this.hotRecipes = res.data.data;
        } else {
          console.error('獲取熱門失敗', res.data.message);
        }
      } catch (error) {
        console.error('API請求失敗', error);
      }
    },

    async fetchMostFavoritedRecipes() {
      try {
        const res = await axios.get(`${API_BASE_URL}/get_most_favorite_recipes.php`);
        if (res.data.status === 'success') {
          this.mostFavoritedRecipes = res.data.data;
        } else {
          console.error('獲取最多收藏失敗', res.data.message);
        }
      } catch (error) {
        console.error('API請求失敗', error);
      }
    },

    async fetchLatestRecipes() {
      try {
        const res = await axios.get(`${API_BASE_URL}/get_latest_recipes.php`);
        if (res.data.status === 'success') {
          this.latestRecipes = res.data.data;
        } else {
          console.error('獲取最新食譜失敗', res.data.message);
        }
      } catch (error) {
        console.error('API請求失敗', error);
      }
    },

    // 新增：用於執行搜尋的 action
    async fetchSearchResults(query) {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        this.searchResults = [];
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/search_recipe.php`, {
          params: { q: trimmedQuery },
        });

        if (response.data.success) {
          this.searchResults = response.data.data;
        } else {
          this.searchResults = [];
        }
      } catch (error) {
        console.error('搜尋失敗', error);
        this.searchResults = [];
      }
    },
  },

  persist: {
    key: 'recipe-store',
    paths: ['favoriteRecipesStatus'],
  },
});
