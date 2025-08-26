import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
const apiBase = import.meta.env.VITE_API_BASE;

export const useIngredientStore = defineStore('ingredient', () => {
  //食材學堂全部食材
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
        ? result.data.map((item) =>
            normalizeIngredient({
              ...item,
              content:
                typeof item.content === 'string'
                  ? safeJson(item.content, item.content)
                  : item.content,
            }),
          )
        : [];
    } catch (e) {
      error.value = e.message || '讀取失敗';
    } finally {
      loading.value = false;
    }
  }

  //食譜詳細頁食材
  const byRecipe = ref({}); // { recipeId: [ingredientItems] }
  const rLoading = ref(false);
  const rError = ref(null);

  async function fetchRecipeIngredients(recipeId) {
    if (!recipeId) return [];
    rLoading.value = true;
    rError.value = null;
    try {
      const url = `${apiBase}/recipe/get_recipe_ingredient.php?recipe_id=${encodeURIComponent(
        String(recipeId),
      )}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const arr = Array.isArray(json.data)
        ? json.data.map((it) => ({
            ingredient_item_id: Number(it.ingredient_item_id),
            ingredient_id: it.ingredient_id ?? null,
            name: it.name,
            amount: it.serving, // 對應 UI 的 amount
            ingredient: it.ingredient || null,
          }))
        : [];

      byRecipe.value[recipeId] = arr;
      return arr;
    } catch (e) {
      rError.value = e.message || '讀取失敗';
      byRecipe.value[recipeId] = [];
      return [];
    } finally {
      rLoading.value = false;
    }
  }

  function itemsForRecipe(recipeId) {
    return byRecipe.value[recipeId] || [];
  }

  //燈箱
  const active = ref(null);

  const updateActive = (target) => {
    active.value = target;
    // console.log('prett y:', JSON.stringify(active.value, null, 2));
  };

  function openLightboxFromItem(item) {
    const source =
      (item && item.ingredient) ||
      list.value.find((x) => Number(x.ingredient_id) === Number(item?.ingredient_id));

    if (source) {
      const hit = normalizeIngredient(source); //  統一轉成燈箱需要的結構
      console.log(hit);

      active.value = hit;
    }
  }

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
  function safeJson(val, fallback) {
    if (Array.isArray(val) || typeof val === 'object') return val;
    if (typeof val !== 'string') return fallback;
    const t = val.trim();
    if (t[0] !== '[' && t[0] !== '{' && t[0] !== '"') return fallback;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }

  function toImageArray(img) {
    if (Array.isArray(img)) {
      if (img.length >= 2) return [img[0], img[1]];
      if (img.length === 1) return [img[0], img[0]];
      return ['', ''];
    }
    const parsed = safeJson(img, null);
    if (Array.isArray(parsed)) return toImageArray(parsed);
    if (typeof img === 'string' && img) return [img, img];
    return ['', ''];
  }

  function normalizeIngredient(raw) {
    if (!raw || typeof raw !== 'object') return null;

    const name = raw.name || '';
    const image = toImageArray(raw.image);
    const content = safeJson(raw.content, raw.content) || [];
    const storage_method =
      typeof raw.storage_method === 'string' ? raw.storage_method : raw.storage_method || '';

    return {
      ...raw,
      name,
      image,
      content,
      storage_method,
    };
  }

  return {
    list,
    loading,
    error,
    loadIngredients,
    byRecipe,
    rLoading,
    rError,
    fetchRecipeIngredients,
    itemsForRecipe,
    active,
    updateActive,
    openLightboxFromItem,
  };
});
