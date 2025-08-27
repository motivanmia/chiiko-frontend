import { defineStore } from 'pinia';
import { getRecipe } from '@/api/fetch';
import { getRecipeCategory } from '@/api/fetch';
import { getMyRecipe } from '@/api/fetch';
import { deleteRecipe } from '@/api/fetch';
import { getRecipeById } from '@/api/fetch';
import { postIngredients } from '@/api/fetch';
import Swal from 'sweetalert2';

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    allRecipes: {},
    allCategories: [],
    draftRecipes: [],
    publishedRecipes: [],
    pendingRecipes: [],
    currentRecipe: null,
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchRecipes() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.error = null;

      try {
        const response = await getRecipe();
        const apiResponse = response.data;

        if (apiResponse.success) {
          this.allRecipes = {
            mostFavorite: apiResponse.data.mostBookmarked || [],
            hot: apiResponse.data.seasonalHot || [],
            newest: apiResponse.data.latest || [],
          };
          console.log('Pinia Store: 成功取得後端食譜資料', this.allRecipes);
        } else {
          this.error = 'API 錯誤：' + (apiResponse.error || '未知錯誤');
          console.error('Pinia Store: API 錯誤', this.error);
          this.allRecipes = {};
        }
      } catch (error) {
        this.error = '取得食譜資料失敗：' + error.message;
        console.error('Pinia Store: 取得食譜資料失敗', this.error);
        this.allRecipes = {};
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await getRecipeCategory();
        const apiData = response.data;

        console.log('API 回應的完整資料:', apiData); // 步驟 1: 檢查完整回應

        if (apiData.success) {
          this.allCategories = apiData.data;
          console.log('Pinia Store: 成功取得後端分類資料', this.allCategories); // 步驟 2: 檢查設定後的狀態
        } else {
          console.error('API 錯誤：', apiData.error || '後端回傳了未定義的錯誤訊息');
        }
      } catch (error) {
        console.error('取得分類資料失敗', error);
        if (error.response) {
          console.error('伺服器回傳錯誤:', error.response.status, error.response.data);
        }
      }
    },

    async fetchMyRecipes() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await getMyRecipe();
        const apiData = response.data;
        console.log('API 回應資料:', apiData);

        if (apiData.status === 'success') {
          this.draftRecipes = apiData.data.filter((recipe) => recipe.status === 3);
          this.publishedRecipes = apiData.data.filter((recipe) => recipe.status === 1);
          this.pendingRecipes = apiData.data.filter((recipe) => recipe.status === 0);
          console.log(
            'Pinia: 成功取得會員食譜資料並分類',
            this.publishedRecipes,
            this.pendingRecipes,
            this.draftRecipes,
          );
        } else {
          this.error = apiData.message || '後端回傳未知錯誤';
          console.error('API 錯誤:', this.error);
        }
      } catch (error) {
        this.error = '取得會員食譜資料失敗：' + error.message;
        console.error('取得會員資料失敗', error);
        if (error.response) {
          console.error('伺服器回傳錯誤:', error.response.status, error.response.data);
        }
      } finally {
        this.isLoading = false;
      }
    },

    async deleteMyRecipe(recipeId) {
      // 1. 顯示確認提示，並等待使用者回應
      const result = await Swal.fire({
        title: '確定要刪除這份食譜嗎？',
        text: '此操作無法復原！',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
      });

      // 2. 如果使用者點擊「取消」，則停止執行
      if (!result.isConfirmed) {
        return; // 直接返回，不執行後續程式碼
      }

      // 3. 如果使用者點擊「確定」，開始執行刪除邏輯
      try {
        // 顯示一個處理中的提示
        Swal.fire({
          title: '刪除中...',
          text: '請稍後...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // 呼叫你的後端 API 進行刪除
        const response = await deleteRecipe(recipeId);
        Swal.close(); // 關閉處理中提示

        if (response.data.status === 'success') {
          // 成功後，從各個陣列中移除該食譜
          this.publishedRecipes = this.publishedRecipes.filter((r) => r.recipe_id !== recipeId);
          this.pendingRecipes = this.pendingRecipes.filter((r) => r.recipe_id !== recipeId);
          this.draftRecipes = this.draftRecipes.filter((r) => r.recipe_id !== recipeId);

          // 顯示成功訊息
          Swal.fire({
            title: '確定要刪除這份食譜嗎？',
            text: '此操作無法復原！',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '確定刪除',
            cancelButtonText: '取消',
          });
        } else {
          // 後端回傳失敗訊息
          Swal.fire({
            icon: 'error',
            title: '刪除失敗',
            text: response.data.message,
          });
        }
      } catch (error) {
        // 網路請求失敗
        console.error('刪除食譜失敗:', error);
        Swal.fire({
          icon: 'error',
          title: '連線失敗',
          text: '無法連線到伺服器，請稍後再試。',
        });
      }
    },
    async fetchRecipeById(recipeId) {
      this.isLoading = true;
      this.error = null;
      this.currentRecipe = null;

      try {
        const response = await getRecipeById(recipeId);
        const apiData = response.data;

        if (apiData.status === 'success') {
          // 將取得的食譜資料儲存到 currentRecipe 狀態中
          this.currentRecipe = apiData.data;
          console.log('Pinia: 成功取得單一食譜資料', this.currentRecipe);
        } else {
          this.error = apiData.message || '後端回傳未知錯誤';
          console.error('API 錯誤:', this.error);
        }
      } catch (error) {
        this.error = '取得食譜資料失敗：' + error.message;
        console.error('取得食譜資料失敗', error);
      } finally {
        this.isLoading = false;
      }
    },

    async postIngredientsToRecipe(payload) {
      try {
        const response = await postIngredients(payload);
        console.log('食材發布成功:', response.data.message);
        return response.data;
      } catch (error) {
        console.error('發布食材失敗:', error);
        throw error;
      }
    },

    loadUserId() {
      // 假設你在登入成功後，會將使用者 ID 儲存到 localStorage
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        // 將儲存的 ID 賦值給 state
        this.userId = parseInt(storedUserId, 10);
      }
    },
  },

  getters: {
    hotRecipes: (state) => state.allRecipes.hot?.slice(0, 9) || [],
    mostBookmarkedRecipes: (state) => state.allRecipes.mostFavorite?.slice(0, 9) || [],
    latestRecipes: (state) => state.allRecipes.newest?.slice(0, 9) || [],
    categories: (state) => state.allCategories,
  },
});
