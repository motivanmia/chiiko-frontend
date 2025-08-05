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
<style scoped>
  /* =================================================================== */
  /*                       主要容器與通用樣式 (預設)                       */
  /* =================================================================== */

  .wrappertatle {
    margin-top: 130px; /* 在手機上可以減少一點上方留白 */
    margin-bottom: 100px;
  }
  .recipe-image {
    width: 800px;
    height: 640px;
    object-fit: cover;
    border-radius: 20px;
  }
  .recipe-wrapper,
  .step-ingredient-wrapper {
    display: flex;
    justify-content: center;
    gap: 20px; /* 增加一點預設間距 */
  }
  .step-ingredient-wrapper {
    margin-top: 20px;
    align-items: flex-start;
  }

  /* =================================================================== */
  /*                          資訊卡片樣式 (預設)                         */
  /* =================================================================== */

  .recipe-card {
    width: 393px;
    background-color: #ead7c4;
    padding: 24px;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
  }
  .recipe-card h1 {
    font-size: 32px;
    font-weight: 600;
    letter-spacing: 2px;
  }
  .recipe-card h2 {
    text-align: right;
    color: #888;
    font-size: 16px;
    font-weight: normal;
    margin-top: 5px;
    margin-bottom: 30px;
  }
  .description {
    font-size: 20px;
    line-height: 1.5;
    color: #333;
    margin-bottom: 20px;
  }
  .tags {
    color: #888;
    font-size: 16px;
    margin-bottom: 24px;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 16px;
    color: #555;
    margin-bottom: 24px;
  }
  .meta > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .comment {
    transform: scaleX(-1);
  }
  .time-serving {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 16px 0;
    border-top: 1px solid #d4c0ab;
    border-bottom: 1px solid #d4c0ab;
    margin-bottom: 24px;
  }
  .info-block {
    text-align: center;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .label {
    font-size: 18px;
    color: #555;
  }
  .value {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
  .divider {
    width: 1px;
    height: 48px;
    background-color: #d4c0ab;
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
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-grow: 1;
    gap: 8px;
    padding: 12px 0;
    border-radius: 999px;
    font-size: 18px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-collect {
    background-color: white;
    color: #333;
    border: 2px solid #ddd;
  }
  .btn-collect:hover {
    background-color: #f0f0f0;
  }
  .btn-collect.is-collected {
    background-color: #d97c48;
    color: #fff;
    border-color: #d97c48;
  }
  .btn-share {
    background-color: #d97c48;
    color: white;
  }
  .btn-share:hover {
    background-color: #c86b37;
  }

  /* =================================================================== */
  /*                        食材與步驟區塊樣式 (預設)                      */
  /* =================================================================== */

  .step-box,
  .ingredient-box {
    padding: 32px;
    border-radius: 20px;
  }
  .step-box {
    width: 800px;
    background-color: #ead7c4;
  }
  .ingredient-box {
    width: 393px;
    background-color: #fff;
    border: 1px solid #e5e7eb;
  }
  .section-ingredient-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .section-ingredient-title {
    font-size: 28px;
    margin: 0;
  }
  .copy-icon {
    font-size: 24px;
    cursor: pointer;
    color: #888;
  }
  .section-ingredient-item {
    margin-bottom: 16px;
    font-size: 18px;
  }
  .step-title {
    font-size: 28px;
    margin: 0 0 24px 0;
  }
  .step-label {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .step-text {
    font-size: 18px;
    margin-bottom: 32px;
    line-height: 1.6;
  }

  /* =================================================================== */
  /*                        留言與好物區塊 (預設)                        */
  /* =================================================================== */
  .comment-section-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }

  /* =================================================================== */
  /*                      ✨ RWD 響應式設計 ✨                        */
  /*     當螢幕寬度小於等於 1024px 時，以下樣式將會生效              */
  /* =================================================================== */
  @media (max-width: 1024px) {
    /* 調整整體佈局和間距 */
    .wrappertatle {
      padding: 0 10px; /* ✨ 所有東西左右間距都是 10px */
      margin-top: 80px;
    }
    .recipe-wrapper,
    .step-ingredient-wrapper {
      flex-direction: column; /* ✨ 改為垂直堆疊 */
      align-items: center; /* 讓內容水平置中 */
      gap: 16px; /* 調整垂直間距 */
    }

    /* 圖片：讓寬度 100% 填滿，高度自動調整 */
    .recipe-image {
      width: 100%;
      height: auto;
    }

    /*
    主要卡片、食材盒、步驟盒：
    移除固定寬度，讓它們能 100% 填滿父容器
  */
    .recipe-card,
    .ingredient-box,
    .step-box {
      width: 100%;
      box-sizing: border-box; /* 確保 padding 不會撐爆寬度 */
    }

    /* 介紹文字和步驟文字：在手機上可以縮小一點 */
    .description,
    .step-text {
      font-size: 16px;
    }

    /* 移除步驟文字的左側縮排 */
    .step-text {
      margin-left: 0;
    }

    /* 
    ✨ 讓 CommentSection 和 ProductCard 也符合 10px 的左右間距
    我們需要一個新的容器來包裹它們
  */
    .comment-section-container {
      width: 100%;
    }
  }
</style>
