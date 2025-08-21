import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
const apiBase = import.meta.env.VITE_API_BASE;

export const useIngredientStore = defineStore('ingredient', () => {
  const list = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function loadIngredients() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${apiBase}/school/get_ingredients.php`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      list.value = Array.isArray(result.data)
        ? result.data.map((item) => ({
            ...item,
            // image: JSON.parse(item.image),
            content: JSON.parse(item.content),
          }))
        : [];
    } catch (e) {
      error.value = e.message || '讀取失敗';
    } finally {
      loading.value = false;
    }
  }

  const active = ref(null);

  const updateActive = (target) => {
    active.value = target;
    // console.log('prett y:', JSON.stringify(active.value, null, 2));
  };

  watch(active, (val) => {
    // console.log(val);
    if (val) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  });

  return { list, loading, error, active, loadIngredients, updateActive };
});
