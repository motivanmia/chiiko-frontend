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
  .comment-image {
    max-width: 160px;
    max-height: 160px;
    border-radius: 8px;
    object-fit: cover;
  }

  .wrappertatle {
    margin-top: 230px;
    margin-bottom: 200px;
  }

  .recipe-image {
    width: 800px;
    height: 640px;
    object-fit: cover;
    border-radius: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .recipe-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 0px;
    margin: 0px auto;
  }

  .recipe-card {
    width: 393px;
    background-color: #ead7c4;
    padding: 15px;
    border-radius: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
  }

  /* =================================================================== */
  /*                         卡片內部各區塊樣式                           */
  /* =================================================================== */

  .header {
  }
  .recipe-card h1 {
    font-size: 32px;
    font-weight: 600;
    margin-top: 10px;
    letter-spacing: 2px;
  }
  .recipe-card h2 {
    text-align: right;
    color: #888;
    font-size: 16px;
    font-weight: normal;
    margin-top: 5px;
    margin-bottom: 50px;
  }

  /* 介紹文字 */
  .description {
    font-size: 24px;
    line-height: 1.2;
    letter-spacing: 2px;
    color: #333;
    margin-bottom: 25px;
  }

  .tags {
    color: #888;
    font-size: 16px;
    margin-bottom: 30px;
    letter-spacing: 2px;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 16px;
    color: #555;
    margin-bottom: 50px;
  }
  .meta > div {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .markL,
  .comment {
    font-size: 16px;
  }
  .comment {
    transform: scaleX(-1);
  }

  .time-serving {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 16px 0;
    font-size: 24px;
  }
  .info-block {
    text-align: center;
    margin-bottom: 40px;
  }
  .top {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .label {
    font-size: 24px;
  }
  .value {
    margin: 20px 0 0;
    font-size: 20px;
  }

  .divider {
    width: 1px;
    height: 48px;
    background-color: #000000;
  }

  /* =================================================================== */
  /*                          按鈕區塊 (收藏 & 分享)                      */
  /* =================================================================== */

  .button-group {
    display: flex;
    justify-content: center;
    gap: 14px;
    margin-bottom: 25px;
  }

  .btn-collect {
    background-color: white;
    color: #333;
    border-color: #ddd;
    width: 153px;
    height: 47px;
  }

  .btn-collect:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
  }

  .btn-share {
    background-color: #d97c48;
    color: white;
    border: none;
    width: 153px;
    height: 47px;
  }

  .btn-share:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 0;
    border-radius: 999px;
    font-size: 20px;
    border: 2px solid transparent;
    cursor: pointer;
  }

  /* =================================================================== */
  /*                      頁面主要區塊佈局 (圖片、步驟、食材)                */
  /* =================================================================== */

  .outer-wrapper {
    display: flex;
    justify-content: center;
  }
  .recipe-wrapper {
    display: flex;
    gap: 10px;
  }

  .step-ingredient-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 10px;
    margin-top: 10px;
  }

  .step-box,
  .ingredient-box {
    padding: 35px;
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
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }

  .section-ingredient-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section-ingredient-title {
    font-size: 32px;
  }
  .copy-icon {
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 15px;
  }

  .section-ingredient-title {
    margin-bottom: 40px;
  }

  .section-ingredient-item {
    margin-bottom: 25px;
    font-size: 24px;
    color: #333;
  }

  .step-label {
    font-size: 28px;
    margin-bottom: 15px;
  }

  .step-text {
    font-size: 24px;
    margin-bottom: 70px;
    margin-left: 70px;
  }

  /* RWD手機 */

  /* 電腦大螢幕維持原本排版 */
</style>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<style lang="scss" scoped></style>
