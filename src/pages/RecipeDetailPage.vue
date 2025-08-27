<template>
  <!-- 狀態一：當食譜資料存在 (recipeData 不為 null) 且 status 為 1 時，顯示完整的食譜內容 -->
  <div
    v-if="recipeData"
    class="wrappertatle"
  >
    <!-- 食譜主視覺與資訊卡 -->
    <div class="outer-wrapper">
      <div class="recipe-wrapper">
        <img
          :src="recipeData.image"
          :alt="recipeData.name"
          class="recipe-image"
        />
        <div class="recipe-card">
          <div class="header">
            <h1>{{ recipeData.name }}</h1>
            <h2>由 {{ recipeData.author_name }} 發佈</h2>
          </div>
          <p class="description">
            {{ recipeData.content }}
          </p>
          <div class="tags">
            <span
              v-for="tag in formattedTags"
              :key="tag"
            >
              {{ tag }}
            </span>
          </div>
          <div class="meta">
            <div>
              <Icon
                icon-name="markL"
                class="markL"
              />
              {{ recipeData.favorites_count || 0 }} 收藏
            </div>
            <div>
              <Icon
                icon-name="comment"
                class="comment"
              />
              {{ (recipeData.comments && recipeData.comments.length) || 0 }} 回覆
            </div>
          </div>
          <div class="time-serving">
            <div class="info-block">
              <div class="top">
                <Icon
                  icon-name="time"
                  class="cookingtime"
                />
                <p class="label">烹煮時間</p>
              </div>
              <p class="value">{{ recipeData.cooked_time }} 分鐘</p>
            </div>
            <div class="divider"></div>
            <div class="info-block">
              <div class="top">
                <Icon
                  icon-name="portion"
                  class="portion"
                />
                <p class="label">料理份數</p>
              </div>
              <p class="value">{{ recipeData.serving }} 人份</p>
            </div>
          </div>
          <div class="button-group">
            <button
              class="btn btn-collect"
              :class="{ 'is-collected': isCollected }"
              @click="toggleCollect"
            >
              <Icon
                :icon-name="isCollected ? 'mark' : 'markL'"
                class="icon"
              />
              {{ isCollected ? '已收藏' : '收藏' }}
            </button>
            <button
              class="btn btn-share"
              @click="shareRecipe"
            >
              <Icon
                icon-name="share"
                class="icon"
              />
              分享
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 步驟與食材區塊 -->
    <div class="step-ingredient-wrapper">
      <!-- 左邊：料理步驟 -->
      <div
        v-if="recipeData.steps && recipeData.steps.length > 0"
        class="step-box"
      >
        <div
          v-for="step in recipeData.steps"
          :key="step.step_id"
          class="step-item"
        >
          <p class="step-label">步驟{{ numberToChinese(parseInt(step.order)) }}</p>
          <p class="step-text">{{ step.content }}</p>
        </div>
      </div>

      <!-- 右邊：所需食材 -->
      <div class="ingredient-box">
        <div class="section-ingredient-header">
          <h3 class="section-ingredient-title">所需食材</h3>
          <Icon
            icon-name="copy"
            class="copy-icon"
            @click="copyIngredients"
          />
        </div>

        <div
          v-if="ingLoading"
          class="section-ingredient-list"
        >
          食材載入中...
        </div>
        <div
          v-else-if="ingError"
          class="section-ingredient-list"
        >
          讀取失敗：{{ ingError }}
        </div>

        <ul
          v-else
          class="section-ingredient-list"
        >
          <li
            class="section-ingredient-item"
            v-for="ingredient in ingredients"
            :key="ingredient.ingredient_item_id"
          >
            <span
              @click="
                ingredient.ingredient_id ? ingredientStore.openLightboxFromItem(ingredient) : null
              "
              :class="{
                'underline-dashed': ingredient.ingredient_id,
                'clickable': ingredient.ingredient_id,
              }"
            >
              {{ ingredient.name }}
            </span>
            <span>/</span>
            <span>{{ ingredient.amount }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 留言與相關商品區塊 -->
    <div>
      <div class="comment-section-container">
        <CommentSection
          v-if="recipeData"
          :recipe-id="recipeData.recipe_id"
        />
        <ProductCard />
      </div>
    </div>
  </div>

  <!-- 狀態二：當 isLoading 為 true 時，顯示「載入中」的提示 -->
  <div
    v-else-if="isLoading"
    class="loading-state"
  >
    <p>正在為您準備美味的食譜...</p>
  </div>

  <!-- 狀態三：當載入結束但 recipeData 仍為 null 時，顯示找不到的訊息 -->
  <div
    v-else
    class="loading-state"
  >
    <p>很抱歉，找不到該食譜，或該食譜尚未發佈。</p>
  </div>

  <Transition name="fade">
    <IngredientLightBox v-if="ingredientStore.active" />
  </Transition>
  <!-- <Transition name="fade"> -->
  <div
    v-if="ingredientStore.active"
    class="overlay"
    @click="ingredientStore.updateActive(null)"
  ></div>
</template>

<script setup>
  import { ref, watch, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useRecipeCollectStore } from '@/stores/recipeCollectStore';
  import Swal from 'sweetalert2';
  import Icon from '@/components/common/Icon.vue';
  import CommentSection from '@/components/CommentSection.vue';
  import ProductCard from '@/components/ProductCard.vue';
  import { useIngredientStore } from '@/stores/ingredient';
  import IngredientLightBox from '@/components/school/IngredientLightBox.vue';

  const ingredientStore = useIngredientStore();

  // ----------------------------------------------------
  // 響應式狀態與 Store 初始化
  // ----------------------------------------------------
  const route = useRoute();
  const memberStore = useAuthStore();
  const recipeStore = useRecipeCollectStore();

  const recipeData = ref(null);
  // 新增一個 isLoading 狀態，預設為 true，用於控制載入中提示的顯示
  const isLoading = ref(true);

  const recipeId = computed(() => route.params.id);
  const isCollected = computed(() => recipeStore.favoriteRecipesStatus[recipeId.value] || false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE; //環境變數的儲存

  // ----------------------------------------------------
  // 主要資料獲取邏輯
  // ----------------------------------------------------

  /**
   * 根據 ID 獲取食譜詳細資料，並檢查其發佈狀態
   * @param {string | number} id - 食譜的 ID
   */
  const fetchRecipeData = async (id) => {
    if (!id) {
      recipeData.value = null;
      isLoading.value = false; // 確保沒有 ID 時也停止載入狀態
      return;
    }

    // 開始獲取資料，設定 isLoading 為 true 並清空舊資料
    isLoading.value = true;
    recipeData.value = null;

    try {
      const apiUrl = `${API_BASE_URL}/recipe/get_recipe_detail.php?recipe_id=${id}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        if (result.data.status == 1) {
          recipeData.value = result.data;
          console.log('食譜已發佈，成功載入:', recipeData.value);
        } else {
          console.warn(
            `食譜 (ID: ${id}) 存在但未發佈，狀態為: ${result.data.status}，不會在前台顯示。`,
          );
          recipeData.value = null;
        }
      } else {
        console.error('後端回傳錯誤或無資料:', result.message);
        recipeData.value = null;
      }
    } catch (error) {
      console.error('獲取食譜資料失敗:', error);
      recipeData.value = null;
    } finally {
      // 無論成功或失敗，最後都要將 isLoading 設為 false，以隱藏載入提示
      isLoading.value = false;
    }
  };

  /**
   * 整合資料獲取和收藏狀態檢查的函式
   * @param {string | number} newId - 新的食譜 ID
   */
  const fetchDataAndStatus = async (newId) => {
    if (!newId) return;

    // 先獲取食譜資料 (內部已包含 status 檢查)
    await fetchRecipeData(newId);

    // 檢查登入狀態，如果已登入才檢查收藏狀態
    if (memberStore.isLoggedIn) {
      recipeStore.checkRecipeStatus(newId);
    } else {
      // 如果未登入，確保收藏狀態為 false
      recipeStore.favoriteRecipesStatus[newId] = false;
    }
  };

  // 使用 watch 監聽路由參數 id 的變化，並在變化時重新獲取資料
  watch(
    recipeId,
    (newId) => {
      fetchDataAndStatus(newId);
    },
    { immediate: true }, // 立即執行一次以載入初始頁面
  );

  // 食材資料
  const ingredients = ref([]);

  // 可選：loading 狀態（沿用 store 的 rLoading）
  const ingLoading = computed(() => ingredientStore.rLoading);
  const ingError = computed(() => ingredientStore.rError);

  watch(
    recipeId,
    async (newId) => {
      if (!newId) {
        ingredients.value = [];
        return;
      }
      const arr = await ingredientStore.fetchRecipeIngredients(newId);
      ingredients.value = arr;
    },
    { immediate: true },
  );

  function copyIngredients() {
    if (ingredients.value && ingredients.value.length > 0) {
      const text = ingredients.value.map((it) => `${it.name} / ${it.amount || ''}`).join('\n');
      navigator.clipboard.writeText(text).then(() => {
        alert('食材清單已複製！');
      });
    } else {
      alert('目前沒有可複製的食材清單。');
    }
  }
  // ----------------------------------------------------
  // 使用者互動函式 (收藏、分享、複製)
  // ----------------------------------------------------

  async function toggleCollect() {
    if (!memberStore.isLoggedIn) {
      alert('請先登入才能收藏!');
      return;
    }

    //傳入 recipeData 這個變數
    await recipeStore.toggleCollect(recipeId.value, recipeData.value);
  }

  function shareRecipe() {
    const recipeUrl = window.location.href;
    navigator.clipboard
      .writeText(recipeUrl)
      .then(() => {
        Swal.fire({
                icon: 'success',
                title: '分享鏈結複製成功！',
                showConfirmButton: false,
                timer: 1500,
              });
      })
      .catch((err) => {
        console.error('複製失敗:', err);
        alert('複製失敗，請手動複製網址。');
      });
  }

  // ----------------------------------------------------
  // Computed 屬性與輔助函式
  // ----------------------------------------------------

  const formattedTags = computed(() => {
    if (!recipeData.value || !recipeData.value.tag) return [];
    return recipeData.value.tag
      .split('#')
      .filter(Boolean)
      .map((tag) => `#${tag}`);
  });

  function numberToChinese(num) {
    const parsedNum = typeof num === 'string' ? parseInt(num, 10) : num;
    if (isNaN(parsedNum) || parsedNum < 1) return '';
    const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if (parsedNum <= 10) return chineseNums[parsedNum];
    if (parsedNum > 10 && parsedNum < 20) return '十' + chineseNums[parsedNum % 10];
    if (parsedNum >= 20 && parsedNum < 100) {
      const tens = Math.floor(parsedNum / 10);
      const ones = parsedNum % 10;
      if (ones === 0) return chineseNums[tens] + '十';
      return chineseNums[tens] + '十' + chineseNums[ones];
    }
    return parsedNum.toString();
  }
</script>

<style lang="scss" scoped>
  /* =================================================================== */
  /*                                變數設定                             */
  /* =================================================================== */

  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    font-size: 1.5rem;
    color: #888;
  }

  /* 讓 API 回傳的 description 換行生效 */
  .description {
    white-space: pre-wrap;
  }

  // --- Colors ---
  $color-primary: #d97c48;
  $color-primary-darker: #c86a3a; // 用於 hover
  $color-card-bg: #ead7c4;
  $color-divider: #d4c0ab;
  $color-text-dark: #333;
  $color-text-light: #888;
  $color-white: #fff;
  $color-border: #ddd;
  $color-border-hover: #e7e7e7;
  $color-border-box: #e5e7eb;

  // --- Sizing & Spacing ---
  $border-radius-main: 20px;
  $border-radius-pill: 999px;
  $content-width-large: 800px;
  $content-width-small: 393px;

  // --- Typography ---
  $font-size-base: 16px;
  $font-size-lg: 24px;
  $font-size-xl: 28px;
  $font-size-xxl: 32px;
  $letter-spacing-base: 1.2px;
  $letter-spacing-title: 2px;

  // --- Transitions ---
  $transition-base: all 0.2s;
  $transition-ease: 0.2s ease;

  /* =================================================================== */
  /*                         可繼承的 Placeholder                         */
  /* =================================================================== */

  // 內容區塊的通用樣式
  %content-box {
    padding: 32px;
    border-radius: $border-radius-main;
  }

  // 按鈕的通用樣式
  %btn-base {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-grow: 1;
    gap: 8px;
    padding: 12px 0;
    border-radius: $border-radius-pill;
    font-size: 18px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: $transition-base;
  }

  /* =================================================================== */
  /*                       主要容器與通用樣式 (預設)                       */
  /* =================================================================== */

  .wrappertatle {
    margin-top: 130px;
    margin-bottom: 100px;
    letter-spacing: $letter-spacing-base;
    // ✨ RWD: 將響應式樣式直接寫在元件內部
    @media (max-width: 1024px) {
      margin-top: 80px;
    }
  }

  .recipe-image {
    width: $content-width-large;
    height: 640px;
    object-fit: cover;
    border-radius: $border-radius-main;

    @media (max-width: 1024px) {
      width: 100%;
      height: auto;
    }
  }

  .recipe-wrapper,
  .step-ingredient-wrapper {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;

    @media (max-width: 1024px) {
      flex-direction: column;
      align-items: center;
    }
  }

  .recipe-wrapper {
    align-items: flex-start;
  }

  .step-ingredient-wrapper {
    align-items: flex-start;
  }

  /* =================================================================== */
  /*                          資訊卡片樣式 (預設)                         */
  /* =================================================================== */

  .recipe-card {
    width: $content-width-small;
    background-color: $color-card-bg;
    padding: 24px;
    border-radius: $border-radius-main;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;

    h1 {
      font-size: $font-size-xxl;
      font-weight: 600;
      letter-spacing: $letter-spacing-title;
    }

    h2 {
      text-align: right;
      color: $color-text-light;
      font-size: $font-size-base;
      font-weight: normal;
      margin-top: 5px;
      margin-bottom: 30px;
    }

    @media (max-width: 1024px) {
      width: 100%; // 注意：原 CSS 寫 0%，應為 100%
      box-sizing: border-box;
    }
  }

  .description {
    font-size: $font-size-lg;
    line-height: 1.5;
    color: $color-text-dark;
    margin-bottom: 20px;

    @media (max-width: 1024px) {
      font-size: $font-size-base;
    }
  }

  .tags {
    color: $color-text-light;
    font-size: $font-size-base;
    margin-bottom: 24px;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: $font-size-base;
    margin-bottom: 24px;

    > div {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .comment {
    transform: scaleX(-1);
  }

  .time-serving {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 16px 0;
    margin-bottom: 24px;
  }

  .info-block {
    text-align: center;
    .top {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .label {
      font-size: $font-size-lg;
    }
    .value {
      font-size: 20px;
      margin-top: 20px;
    }
  }

  .divider {
    width: 1px;
    height: 48px;
    background-color: $color-divider;
  }

  /* =================================================================== */
  /*                            按鈕樣式 (預設)                           */
  /* =================================================================== */

  .button-group {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .btn {
    // 繼承基礎按鈕樣式
    @extend %btn-base;
  }

  .btn-collect {
    background-color: $color-white;
    color: $color-text-dark;
    border: 2px solid $color-border;

    &:hover {
      background-color: #e7e7e7;
      border: 1px solid #e7e7e7;
      transition: 0.2s ease;
    }

    // 收藏後的狀態
    &.is-collected {
      background-color: $color-primary;
      color: $color-white;
      border-color: $color-primary;
    }
  }

  .btn-share {
    background-color: $color-primary;
    color: $color-white;

    &:hover {
      background-color: color(orangeColor, base);
      transition: 0.2s ease;
    }
  }

  /* =================================================================== */
  /*                        食材與步驟區塊樣式 (預設)                      */
  /* =================================================================== */

  .step-box {
    @extend %content-box;
    width: $content-width-large;
    background-color: $color-card-bg;

    @media (max-width: 1024px) {
      width: 100%; // 注意：原 CSS 寫 0%，應為 100%
      box-sizing: border-box;
    }
  }

  .ingredient-box {
    @extend %content-box;
    width: $content-width-small;
    background-color: $color-white;
    border: 1px solid $color-border-box;
    position: sticky;
    top: 110px;

    @media (max-width: 1024px) {
      width: 100%; // 注意：原 CSS 寫 0%，應為 100%
      box-sizing: border-box;
      position: static;
    }
  }

  .section-ingredient-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .section-ingredient-title {
    font-size: $font-size-xxl;
    margin: 0;
  }

  .copy-icon {
    font-size: $font-size-lg;
    cursor: pointer;
    color: $color-text-light;
  }

  .section-ingredient-list {
    margin-top: 40px;
  }

  .section-ingredient-item {
    margin-bottom: 25px;
    font-size: $font-size-lg;
  }

  .step-label,
  .step-title {
    font-size: $font-size-xl;
  }

  title {
  }

  .step-text {
    font-size: $font-size-lg;
    margin-bottom: 70px;
    margin-left: 100px;
    margin-top: 15px;

    @media (max-width: 1024px) {
      font-size: $font-size-base;
      margin-left: 0;
    }
  }

  /* =================================================================== */
  /*                        留言與好物區塊 (預設)                        */
  /* =================================================================== */
  .comment-section-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 1024px) {
      width: 100%;
    }
  }

  .overlay {
    position: fixed;
    z-index: 998;
    height: 150vh;
    width: 150%;
    opacity: 0.6;
    background-color: black;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  .clickable {
    cursor: pointer;
    // color: color(text, base);
  }

  .underline-dashed {
    text-decoration: underline;
  }
</style>
