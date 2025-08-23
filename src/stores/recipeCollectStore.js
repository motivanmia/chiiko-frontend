// stores/recipeCollectStore.js

import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8888/front/recipe';

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    favoriteRecipesStatus: {},
    hotRecipes: [],
    mostFavoritedRecipes: [],
    // 移除 activeRecipes，改由元件管理
    latestRecipes: [],
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

    async toggleCollect(recipeId) {
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
    
    // 這個 action 應該被刪除，因為元件可以自己處理
    // async setActiveRecipes(type) {
    //   if (type === '當季熱門') {
    //     await this.fetchHotRecipes();
    //   } else if (type === '最多收藏') {
    //     await this.fetchMostFavoritedRecipes();
    //   }
    // },

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
  },

  persist: {
    key: 'recipe-store',
    paths: ['favoriteRecipesStatus'],
  },
});