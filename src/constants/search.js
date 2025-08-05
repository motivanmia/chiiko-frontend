import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useSearch(initialValue = '') {
  const router = useRouter()
  const searchTerm = ref(initialValue)
  
  const handleSearch = (query) => {
    searchTerm.value = query
    // 導航到搜尋頁面，並將搜尋關鍵字作為 query 參數
    router.push({
      name: 'search', // 或你的搜尋頁面路由名稱
      query: { q: query }
    })
  }
  
  return {
    searchTerm,
    handleSearch
  }
}
