// stores/productStore.js
import { defineStore } from '/node_modules/.vite/deps/pinia.js?v=629e644c';
import axios from '/node_modules/.vite/deps/axios.js?v=629e644c';

const API_BASE_URL = 'http://localhost:8888/front/product';
export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get(`${API_BASE_URL}/get_product.php`);
        if (response.data.status === 'success') {
          this.products = response.data.data;
        } else {
          this.error = response.data.message || '無法取得商品資料';
          console.error('API 錯誤:', this.error);
        }
      } catch (err) {
        this.error = err.message || '網路連線失敗';
        console.error('網路錯誤:', this.error);
      } finally {
        this.loading = false;
      }
    },
  },
});
