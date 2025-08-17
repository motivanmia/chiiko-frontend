<!-- 食譜內頁板 -->
<template>
  <div class="wrappertatle">
    <div class="outer-wrapper">
      <div class="recipe-wrapper">
        <!-- 食物圖片 -->
        <img
          src="@/assets/image/NewRecipes/Group_537.png"
          alt="香煎豆腐卷"
          class="recipe-image"
        />

        <!-- 標題 + 發布者 -->
        <div class="recipe-card">
          <!-- 標題 + 發布者 -->
          <div class="header">
            <h1>香煎豆腐卷</h1>
            <h2>由管理員 發佈</h2>
          </div>

          <!-- 介紹文字 -->
          <p class="description">
            酥酥脆脆的肉片外皮，
            <br />
            軟嫩的豆腐，
            <br />
            很適合當下酒菜的料理。
          </p>

          <!-- TAG 區塊 -->
          <div class="tags">
            <span># 快速</span>
            <span># 三明治</span>
            <span># 微波爐</span>
          </div>

          <!-- 收藏與回覆 -->
          <div class="meta">
            <div>
              <span>
                <Icon
                  icon-name="markL"
                  class="markL"
                />
              </span>
              105收藏
            </div>
            <div>
              <span>
                <Icon
                  icon-name="comment"
                  class="comment"
                />
              </span>
              50回覆
            </div>
          </div>

          <!-- 時間與份數 -->
          <div class="time-serving">
            <div class="info-block">
              <div class="top">
                <span>
                  <Icon
                    icon-name="time"
                    class="cookingtime"
                  />
                </span>
                <p class="label">烹煮時間</p>
              </div>
              <p class="value">10分鐘</p>
            </div>

            <div class="divider"></div>

            <div class="info-block">
              <div class="top">
                <span>
                  <Icon
                    icon-name="portion"
                    class="portion"
                  />
                </span>
                <p class="label">料理份數</p>
              </div>
              <p class="value">1-2人份</p>
            </div>
          </div>
          <!-- 按鈕區 -->
          <div class="button-group">
            <!-- 收藏按鈕 -->

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
      <div class="step-box">
        <h3 class="step-title"></h3>
        <div
          v-for="(step, index) in steps"
          :key="index"
        >
          <p class="step-label">步驟{{ numberToChinese(index + 1) }}</p>
          <p class="step-text">{{ step }}</p>
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
        <ul class="section-ingredient-list">
          <li
            class="section-ingredient-item"
            v-for="(item, index) in ingredients"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 留言區 -->
    <div>
      <div class="comment-section-container">
        <CommentSection
          :initial-comments="recipeComments"
          :current-user-avatar="currentUserAvatar"
        />
        <!-- 好物推薦 -->
        <ProductCard />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import Icon from '@/components/common/Icon.vue';
  import CommentSection from '@/components/CommentSection.vue';
  import ProductCard from '@/components/ProductCard.vue';
  import avatarImage from '@/assets/image/NewRecipes/Mask_group.png';
  import postImage from '@/assets/image/NewRecipes/Rectangle_5.png';

  const steps = [
    '將板豆腐切成小塊（大小剛好能卷進肉片即可）',
    '將切好的板豆腐包進薄肉片裡',
    '將包好的肉片豆腐裹上一層起司酥炸粉，放在盤子上靜置五分鐘',
    '靜置好的肉片豆腐再裹上一層麵包粉',
    '平底鍋熱油，放進裹好粉的肉片豆腐，煎至金黃酥脆即可。',
  ];

  const ingredients = [
    '板豆腐／一盒',
    '起司酥炸粉／適量',
    '椒鹽粉／適量',
    '薄片的豬肉片／一盒',
    '麵包粉／適量',
  ];

  const isCollected = ref(false);

  function toggleCollect() {
    isCollected.value = !isCollected.value;
    if (isCollected.value) {
      alert('【測試功能】已將食譜加入收藏！ (實際功能會將此狀態存入後端資料庫)');
    } else {
      alert('【測試功能】已將食譜移出收藏。');
    }
  }

  function shareRecipe() {
    const recipeUrl = 'https://www.your-website.com/recipes/yummy-tofu-roll';

    navigator.clipboard
      .writeText(recipeUrl)
      .then(() => {
        alert(`【測試功能】分享連結已複製！\n\n您可以到別處貼上看看：\n${recipeUrl}`);
      })
      .catch((err) => {
        console.error('複製失敗:', err);
        alert('【測試功能】複製失敗，請手動複製連結。');
      });
  }

  function numberToChinese(num) {
    if (typeof num !== 'number' || num < 1) {
      return '';
    }

    const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

    if (num <= 10) {
      return chineseNums[num];
    }

    if (num > 10 && num < 20) {
      return '十' + chineseNums[num % 10];
    }

    if (num >= 20 && num < 100) {
      const tens = Math.floor(num / 10);
      const ones = num % 10;

      if (ones === 0) {
        return chineseNums[tens] + '十';
      } else {
        return chineseNums[tens] + '十' + chineseNums[ones];
      }
    }

    return num.toString();
  }

  const recipeComments = ref([
    {
      id: 1,
      name: '小胖子',
      message: '太好吃了！我還加了辣椒！',
      avatar: avatarImage,
      showOptions: false,
      showReplyBox: false,
      reply: '',
      image: postImage,
    },
    {
      id: 2,
      name: '大胖子',
      message: '板豆腐硬一點比較好？',
      avatar: avatarImage,
      showOptions: false,
      showReplyBox: false,
      reply: '',
    },
  ]);

  const currentUserAvatar = ref(avatarImage);

  function copyIngredients() {
    const text = ingredients.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('食材清單已複製！');
    });
  }
</script>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<style lang="scss" scoped>
  /* =================================================================== */
  /*                                變數設定                             */
  /* =================================================================== */

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
