import axios from 'axios';
import { defineStore } from 'pinia';
import { logout } from '@/api/fetch';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    activeModalName: null,
    isLoggedIn: false,
    user: null,
    redirectPath: null,
    loginSuccessSignal: 0,
  }),
  actions: {
    openModal(modalName) {
      this.activeModalName = modalName;
    },
    closeModal() {
      this.activeModalName = null;
    },
    // 登入成功時更新狀態
    loginSuccess(userData) {
      this.isLoggedIn = true;
      this.user = userData;
      this.loginSuccessSignal++;
    },
    // 設定重定向路徑
    setRedirectPath(path) {
      this.redirectPath = path;
    },
    // 登出
    async logout() {
      try {
        // 呼叫logout api
        await logout();
      } catch (error) {
        console.error('Logout API call failed:', error);
      } finally {
        this.isLoggedIn = false;
        this.user = null;
      }
    },

    
  },
});
