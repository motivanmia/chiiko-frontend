import axios from 'axios';
import { defineStore } from 'pinia';
import { logout } from '@/api/fetch';

const apiBase = import.meta.env.VITE_API_BASE;

const authHttp = axios.create({
  baseURL: apiBase,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    activeModalName: null,
    isLoggedIn: false,
    user: null,
    redirectPath: null,
    loginSuccessSignal: 0,
    ready: false,
    _initPromise: null,
  }),
  actions: {
    openModal(modalName) {
      this.activeModalName = modalName;
    },
    closeModal() {
      this.activeModalName = null;
    },
    async init() {
      if (this.ready) return;
      if (this._initPromise) return this._initPromise;

      this._initPromise = (async () => {
        try {
          const { data } = await authHttp.get('/users/check_session.php');

          if (data?.is_logged_in) {
            this.isLoggedIn = true;
            this.user = {
              id: data.user_id != null ? Number(data.user_id) : null,
              name: data.user_name ?? '',
            };
          } else {
            this.isLoggedIn = false;
            this.user = null;
          }
        } catch (e) {
          this.isLoggedIn = false;
          this.user = null;
        } finally {
          this.ready = true;
          this._initPromise = null;
        }
      })();

      return this._initPromise;
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
