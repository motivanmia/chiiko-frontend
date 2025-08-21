import { defineStore } from 'pinia';
import { getUserProfile } from '@/api/fetch';

export const useUserStore = defineStore('user', {
  state: () => ({
    // 儲存使用者資料的物件
    info: {
      name: '',
      nickname: '',
      phone: '',
      account: '',
      address: '',
      avatar: null,
    },
    isLoggedIn: false,
  }),
  actions: {
    async fetchUserInfo() {
      try {
        const response = await getUserProfile();
        if (response.data.status === 'success' && response.data.data) {
          this.info = response.data.data;
          this.isLoggedIn = true;
        } else {
          // 獲取失敗就清空資料
          this.info = null;
          this.isLoggedIn = false;
          console.error('API回傳錯誤:', response.data.message);
        }
      } catch (error) {
        this.info = null;
        this.isLoggedIn = false;
        console.error('獲取使用者資料失敗', error);
      }
    },
  },
  // 更新頭像
  async updateAvatar(newAvatarFile) {
    try {
      const formData = new FormData();
      formData.append('avatar', newAvatarFile);

      // 引入更新api

      // 檢查後端回傳的狀態
      if (response.data.status === 'success') {
        // 如果後端回傳了新頭像的 URL，就更新 Pinia 的狀態
        // 假設後端會回傳一個 'newAvatarUrl' 欄位
        if (this.info) {
          this.info.avatar = response.data.newAvatarUrl;
        }
        console.log('頭像更新成功');
        return true;
      } else {
        console.error('後端回傳錯誤:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('更新頭像失敗', error);
      return false;
    }
  },
  logout() {
    this.info = {
      // ✨ 重置為初始狀態
      name: '',
      nickname: '',
      phone: '',
      account: '',
      address: '',
      avatar: null,
    };
    this.isLoggedIn = false;
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
  },
});
