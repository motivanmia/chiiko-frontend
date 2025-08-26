import { defineStore } from 'pinia';
import { getUserProfile, uploadAvatar, logout } from '@/api/fetch';

const DEFAULT_AVATAR_URL = new URL('@/assets/image/ShareRecipeButton.png', import.meta.url).href;

export const useUserStore = defineStore('user', {
  state: () => ({
    // 儲存使用者資料的物件
    info: null,
    isLoggedIn: false,
  }),
  actions: {
    async fetchUserInfo() {
      try {
        const response = await getUserProfile();
        const result = response.data;

        // 檢查api回應是否成功
        if (result.status === 'success' && result.data) {
          const userData = result.data;

          // 將後端欄位對應到pinia state欄位
          this.info = {
            name: userData.name,
            nickname: userData.nickname,
            phone: userData.phone,
            account: userData.account,
            address: userData.address,
            avatar: userData.image,
            userId: userData.user_id,
          };
          this.isLoggedIn = true;
          return true;
        } else {
          // 獲取失敗就清空資料
          this.clearUserInfo(); // 呼叫 action 清空資料
          console.error('API回傳錯誤:', result.message);
          return false;
        }
      } catch (error) {
        // 網路請求失敗 (例如 401 未登入、500 伺服器錯誤)
        this.clearUserInfo();
        console.error('獲取使用者資料失敗', error);
        return false;
      }
    },
    // 更新頭像
    async uploadAvatar(newAvatarFile) {
      try {
        const formData = new FormData();
        formData.append('avatar', newAvatarFile);

        // 引入更新api
        const response = await uploadAvatar(formData);
        const result = response.data;

        // 檢查後端回傳的狀態
        if (result.status === 'success' && result.newAvatarUrl) {
          // 如果後端回傳了新頭像的 URL，就更新 Pinia 的狀態
          if (this.info) {
            this.info.avatar = result.newAvatarUrl;
          }
          console.log('頭像更新成功');
          return true;
        } else {
          console.error('後端回傳錯誤:', result.message);
          return false;
        }
      } catch (error) {
        console.error('更新頭像失敗', error);
        return false;
      }
    },
    clearUserInfo() {
      this.info = null;
      this.isLoggedIn = false;
    },

    async logout() {
      // 這裡可以加上呼叫後端登出 API 的邏輯
      await logout();

      // 然後清空前端的狀態
      this.clearUserInfo();
    },
    
  },
  getters: {
    // 判斷暱稱是否存在
    displayName: (state) => {
      if (state.info && state.info.nickname) {
        return state.info.nickname;
      }
      if (state.info && state.info.name) {
        return state.info.name;
      }
      return '會員';
    },
    userAvatarUrl: (state) => {
      if (state.info && state.info.avatar) {
        // 這裡可以加上處理，例如回傳預設頭像
        return state.info.avatar;
      }
      // 回傳一個預設頭像的路徑
      return DEFAULT_AVATAR_URL;
    },
  },
});
