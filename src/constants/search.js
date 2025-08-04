import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useSearch() {
  const router = useRouter(); // 取得路由器實例
  const searchTerm = ref(''); // 用來儲存搜尋文字
  // 處理搜尋事件的函式
  const handleSearch = (query) => {
    if (query) {
      // 導航到名為 'search' 的路由，並傳入查詢參數

      router.push({
        name: 'search',
        query: { q: query },
      });
    }
  };

  // 導出 searchTerm 和 handleSearch
  return {
    searchTerm,
    handleSearch,
  };
}
