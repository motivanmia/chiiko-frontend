<template>
  <!-- 步驟 5: 加入 v-if，只有在 recipeData 有值的時候才顯示內容 -->
  <div
    v-if="recipeData"
    class="wrappertatle"
  >
    <!-- ... (上半部分 template 維持不變) ... -->
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
                :icon-name="isCollected ? 'markF' : 'markL'"
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

    <!-- 步驟區塊 -->
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
      <div
        v-if="recipeData.ingredients && recipeData.ingredients.length > 0"
        class="ingredient-box"
      >
        <div class="section-ingredient-header">
          <h3 class="section-ingredient-title">所需食材</h3>
          <Icon
            icon-name="copy"
            class="copy-icon"
            @click="copyIngredients"
          />
        </div>
        <ul class="section-ingredient-list">
          <li
            class="section-ingredient-item"
            v-for="ingredient in recipeData.ingredients"
            :key="ingredient.ingredient_item_id"
          >
            <span>{{ ingredient.name }}</span>
            <span>{{ ingredient.amount }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 留言區 -->
    <div>
      <div class="comment-section-container">
        <!-- ⭐️ 核心修正 2: 將資料來源從扁平的陣列改為巢狀的陣列 ⭐️ -->
        <CommentSection
          :initial-comments="threadedComments"
          :current-user-avatar="currentUserAvatar"
        />
        <ProductCard />
      </div>
    </div>
  </div>

  <!-- 載入中提示 -->
  <div
    v-else
    class="loading-state"
  >
    <p>正在為您準備美味的食譜...</p>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';

  import Icon from '@/components/common/Icon.vue';
  import CommentSection from '@/components/CommentSection.vue';
  import ProductCard from '@/components/ProductCard.vue';
  import avatarImage from '@/assets/image/NewRecipes/Mask_group.png';

  const recipeData = ref(null);
  const route = useRoute();

  onMounted(async () => {
    const recipeId = route.params.id;
    if (!recipeId) return;

    try {
      const apiUrl = `http://localhost:8888/front/recipe/get_recipe.php?recipe_id=${recipeId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.status === 'success') {
        recipeData.value = result.data;
        console.log('食譜資料已成功載入 (包含所有關聯資料):', recipeData.value);
      } else {
        console.error('後端回傳錯誤:', result.message);
      }
    } catch (error) {
      console.error('獲取食譜資料失敗:', error);
    }
  });

  const formattedTags = computed(() => {
    if (!recipeData.value || !recipeData.value.tag) return [];
    return recipeData.value.tag
      .split('#')
      .filter(Boolean)
      .map((tag) => `#${tag}`);
  });

  // ⭐️ 核心修正 1: 在父層加入這個計算屬性來重組留言 ⭐️
  const threadedComments = computed(() => {
    if (!recipeData.value || !recipeData.value.comments) {
      return [];
    }

    const allComments = recipeData.value.comments;
    const commentMap = {};

    // 為了避免修改原始資料，我們先做一次淺拷貝，並預先建立 replies 陣列
    allComments.forEach((comment) => {
      commentMap[comment.comment_id] = { ...comment, replies: [] };
    });

    const nestedComments = [];
    Object.values(commentMap).forEach((comment) => {
      if (comment.parent_id && commentMap[comment.parent_id]) {
        // 如果這是一則回覆，找到它的父留言，並把自己塞進去
        commentMap[comment.parent_id].replies.push(comment);
      } else {
        // 如果這是一則主留言，直接放進最外層
        nestedComments.push(comment);
      }
    });

    return nestedComments;
  });

  const isCollected = ref(false);

  function toggleCollect() {
    isCollected.value = !isCollected.value;
  }

  function shareRecipe() {
    const recipeUrl = window.location.href;
    navigator.clipboard.writeText(recipeUrl);
  }

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

  function copyIngredients() {
    if (
      recipeData.value &&
      recipeData.value.ingredients &&
      recipeData.value.ingredients.length > 0
    ) {
      const text = recipeData.value.ingredients
        .map((item) => `${item.name} / ${item.amount}`)
        .join('\n');
      navigator.clipboard.writeText(text).then(() => {
        alert('食材清單已複製！');
      });
    } else {
      alert('目前沒有可複製的食材清單。');
    }
  }

  const currentUserAvatar = ref(avatarImage);
</script>

<!-- ──────────────────────────────────────────────────────────────────────── -->
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
</style>
