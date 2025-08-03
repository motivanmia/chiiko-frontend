<template>
    <div class="wrappertatle">
  <div class="outer-wrapper">
    <div class="recipe-wrapper">
      <!-- 食物圖片 -->
      <img
        src="@/assets/image/recipe010-min.png"
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
            <span>🔖</span>
            105收藏
          </div>
          <div>
            <span>💬</span>
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
          <button class="btn btn-collect">
            <Icon
              icon-name="markL"
              class="icon"
            />
            收藏
          </button>
          <button class="btn btn-share">
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
        <p class="step-label">步驟 {{ index + 1 }}</p>
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
  <div class="comment-wrapper">
    <div
      v-for="(comment, index) in comments"
      :key="index"
      class="comment-item"
    >
      <!-- 🟠 使用者資訊＋按鈕 合併對齊 -->
      <div class="comment-header">
        <div class="comment-user">
          <img
            :src="comment.avatar"
            alt="使用者頭像"
            class="comment-avatar"
          />
          <p class="comment-author">{{ comment.name }}</p>
        </div>

        <button
          @click="toggleOptions(index)"
          class="comment-options-btn"
        >
          <Icon
            icon-name="option"
            class="comment-options-icon"
          />
        </button>
      </div>

      <!-- 折疊泡泡 -->
      <div
        v-if="comment.showOptions"
        class="comment-dropdown-bubble"
      >
        <div class="comment-dropdown-arrow"></div>
        <button
          @click="replyToComment(comment.name)"
          class="comment-reply-btn"
        >
          回覆留言
        </button>
        <button
          @click="reportComment(comment.name)"
          class="comment-report-btn"
        >
          檢舉留言
        </button>
      </div>

      <!-- 留言內容 -->
      <p class="comment-content">{{ comment.message }}</p>

      <!-- 分隔線 -->
      <div class="comment-divider"></div>
    </div>

    <!-- 新留言 -->
    <!-- 留言輸入區塊 -->
    <div class="comment-input-group">
      <!-- 使用者頭像 -->
      <img
        src="@/assets/image/Mask group.png"
        alt="使用者頭像"
        class="comment-user-avatar-large"
      />

      <!-- 右邊：留言框＋按鈕 -->
      <div class="comment-input-right">
        <textarea
          v-model="newComment"
          placeholder="請輸入留言..."
          class="comment-input"
        ></textarea>

        <div class="comment-actions-wrapper">
          <button
            @click="postComment"
            class="comment-menu"
          >
            暫存食譜
          </button>
          <button
            @click="postComment"
            class="comment-submit"
          >
            發布留言
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import Icon from '@/components/common/Icon.vue';
  import ShareRecipeButton from '@/assets/image/Mask group.png';
  // 模擬資料
  const steps = [
    '將板豆腐切成小塊（大小剛好能適合包肉片即可）',
    '將切好的板豆腐包進薄肉片裡',
    '將包好的肉片豆腐裹上一層起司粉與胡椒粉',
    '再裹上一層麵包粉',
    '平底鍋煎熟，即可完成',
  ];

  const ingredients = [
    '板豆腐／一盒',
    '起司粉／適量',
    '胡椒粉／適量',
    '薄片的豬肉片／一盒',
    '麵包粉／適量',
  ];

  const comments = ref([
    {
      name: '小胖子',
      message: '太好吃了！我還加了辣椒！',
      avatar: ShareRecipeButton,
      showOptions: false,
    },
    {
      name: '大胖子',
      message: '板豆腐硬一點比較好？',
      avatar: ShareRecipeButton,
      showOptions: false,
    },
  ]);

  const newComment = ref('');

  function postComment() {
    if (newComment.value.trim() !== '') {
      comments.value.push({ name: '你', message: newComment.value, showOptions: false });
      newComment.value = '';
    }
  }

  function toggleOptions(index) {
    comments.value[index].showOptions = !comments.value[index].showOptions;
  }

  function replyToComment(name) {
    alert(`你要回覆 ${name} 的留言`);
  }

  function reportComment(name) {
    alert(`你已檢舉 ${name} 的留言`);
  }

  function copyIngredients() {
    const text = ingredients.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('食材清單已複製！');
    });
  }
</script>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<style scoped>
  .wrappertatle{
    margin-top: 200px;
    margin-bottom: 200px;
  }

  /* 食譜圖片 */
  .recipe-image {
    width: 800px;
    height: 640px;
    object-fit: cover;
    border-radius: 12px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  /* 食譜 */
  .recipe-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 2px;
    margin: 2px auto;
  }

  /* 小卡排版 */

  .recipe-card {
    width: 350px;
    background-color: #ead7c4;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }

  /* 標題、發布者、內文 */

  .recipe-card h1 {
    font-size: 32px;
  }
  .recipe-card h2 {
    text-align: right;
    color: #6b6e4f;
    margin-top: 10px;
  }
  .recipe-card p {
    font-size: 24px;
    margin-top: 10px;
  }

  /* 標籤 */

  .tags {
    margin-top: 30px;
  }

  /* 收藏回覆 */

  .meta {
    display: flex;
    align-items: center;
    margin-top: 30px;
    gap: 20px;
  }

  /* 烹煮時間料理份數分割線 */

  .time-serving {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-top: 1rem;
  }

  .info-block {
    text-align: center;
  }

  .top {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
  }

  /* 烹煮時間料理份數分割線 */

  .divider {
    width: 1px;
    height: 36px;
    background-color: #888;
  }

  /* 收藏分享按鈕 */

  .button-group {
    display: flex;
    gap: 16px;
    padding-top: 16px;
  }

  .btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 40px;
    border-radius: 999px;
    font-size: 16px;
  }

  .btn-collect {
    background-color: white;
    color: #333;
    border: 1px solid #d1d5db;
  }

  .btn-collect:hover {
    background-color: #f3f4f6;
  }

  .btn-share {
    background-color: #d0844e;
    color: white;
    border: none;
  }

  .btn-share:hover {
    background-color: #c46e2e;
  }

  .icon {
    font-size: 20px;
    display: inline-flex;
    align-items: center;
  }
  /* 食譜圖片+右邊小卡 */
  .outer-wrapper {
    display: flex;
    justify-content: center;
  }
  .recipe-wrapper {
    display: flex;
    gap: 10px;
  }

  /* 食譜步驟+所需食材排版 */

  .step-ingredient-wrapper {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 2rem;
    align-items: flex-start;
  }

  .step-box,
  .ingredient-box {
    padding: 1.5rem;
    border-radius: 12px;
  }
  .step-box {
    width: 800px;
    background-color: #ead7c4;
  }
  .ingredient-box {
    width: 350px;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }

  .section-ingredient-header {
    display: flex;
    justify-content: space-between; /* ← 左右貼齊關鍵 */
    align-items: center; /* ← 垂直對齊文字中心 */
  }

  .section-ingredient-title {
    font-size: 32px;
    margin: 0; /* 確保不會有 h3 自帶的外距影響 */
  }

  .copy-icon {
    font-size: 20px;
    cursor: pointer;
  }

  .section-ingredient-title {
    margin-bottom: 15px;
  }

  .section-ingredient-item {
    margin-bottom: 6px;
    font-size: 24px;
    color: #333;
    line-height: 1.6;
  }

  .step-title {
    font-size: 40px;
    margin-top: 10px;
  }

  .step-label {
    font-size: 32px;
    margin-bottom: 40px;
  }
  .step-text {
    font-size: 24px;
    margin-bottom: 20px;
    margin-left: 70px;
  }

  /* 留言區 */

  /* 留言整體容器 */
  .comment-wrapper {
    width: 1160px;
    margin: 0 auto;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
    border-radius: 24px;
    margin-top: 20px;
  }

  /* 單一留言區塊 */
  .comment-item {
    align-items: flex-start;
    gap: 16px;
    padding: 8px 20px 8px 16px; /* 上下40px，左右24px */
    background-color: #fff;
    position: relative;
  }

  /* 新留言輸入欄位 */
  .comment-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  .comment-divider {
    border-bottom: 2px dotted #ccc;
    margin: 0 36px 0 36px; /* 若頭像寬為48 + 間距24 */
    padding-bottom: 15px;
  }

  .comment-author {
    font-size: 20px;
  }

  .comment-content {
    font-size: 24px;
    margin-left: 50px;
  }
  .comment-user {
    display: flex; /* ➤ 讓頭像與名稱並排 */
    align-items: center; /* ➤ 垂直置中對齊 */
    gap: 8px;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .comment-dropdown-toggle {
    text-align: right;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
  }
  .comment-dropdown-icon {
    text-align: right;
    color: #6b6e4f;
    margin-bottom: 10px;
    font-size: 20px;
  }

  /* 外框樣式（圓角、陰影、底色） */
  .comment-dropdown-bubble {
    position: absolute;
    top: 60px;
    right: 5px;
    background-color: #fefaf2;
    border: 2px solid #db7c36;
    border-radius: 16px;
    padding: 6px;
    width: 160px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: 20;
  }

  /* 小箭頭 */
  .comment-dropdown-arrow {
    position: absolute;
    top: -16px;
    right: 16px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 16px solid #db7c36;
  }

  /* 回覆按鈕（橘色） */
  .comment-reply-btn,
  .comment-report-btn {
    background-color: #fefaf2;
    color: rgb(0, 0, 0);
    padding: 6px 30px;
    border: none;
    font-size: 18px;
    font-weight: bold;
    display: inline-block;
  }

  .comment-reply-btn:hover,
  .comment-report-btn:hover {
    background-color: #db7c36;
    color: rgb(255, 255, 255);
    border-radius: 16px;
  }

  .comment-options-btn {
    font-size: 20px;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .comment-input {
    margin: 20px auto auto auto;
    width: 945px;
    height: 160px;
    padding: 12px;
    display: block;

    text-align: left;
    vertical-align: top;
    border: 1px solid #000;
    border-radius: 8px;
    resize: none;
  }

  /* 發布留言按鈕 */
  .comment-submit {
    background: #f97316;
    color: white;
    border: none;
  }

  .comment-menu {
    background: #ffffff;
    border: 2px solid #919191;
    color: rgb(0, 0, 0);
  }

  .comment-menu,
  .comment-submit {
    width: 180px;
    padding: 10px 16px;
    border-radius: 24px;
    font-size: 24px;
    cursor: pointer;
  }

  .comment-submit:hover {
    background: #ead7c4;
    color: #000000;
  }

  .comment-actions-wrapper {
    width: 945px;
    margin: 16px auto 0;
    display: flex;
    justify-content: space-between;
  }

  .comment-user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 6px;
  }

  /* RWD手機 */

  /* 電腦大螢幕維持原本排版 */
</style>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<style lang="scss" scoped></style>
