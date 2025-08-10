<!-- CommentItem.vue -->
<template>
  <div class="comment-item">
    <div class="comment-main">
      <img
        :src="comment.avatar"
        alt="使用者頭像"
        class="comment-avatar"
      />
      <div class="comment-content-wrapper">
        <div class="comment-header">
          <p class="comment-author">{{ comment.name }}</p>
          <div class="comment-options-container">
            <button
              @click="$emit('toggleOptions', comment.id)"
              class="comment-options-btn"
            >
              <Icon icon-name="option" />
            </button>
            <div
              v-if="comment.showOptions"
              class="comment-dropdown-bubble"
            >
              <div class="comment-dropdown-arrow"></div>
              <button
                @click="$emit('toggleReplyBox', comment.id)"
                class="comment-reply-btn"
              >
                回覆留言
              </button>
              <button
                @click="$emit('reportComment', comment.name)"
                class="comment-report-btn"
              >
                檢舉留言
              </button>
            </div>
          </div>
        </div>
        <div class="comment-body">
          <p class="comment-text">{{ comment.message }}</p>
          <img
            v-if="comment.image"
            :src="comment.image"
            alt="留言附圖"
            class="comment-image"
          />
        </div>
      </div>
    </div>

    <!-- 回覆框，只在需要時顯示 -->
    <div
      v-if="comment.showReplyBox"
      class="comment-reply-section"
    >
      <!-- ✨ 主要修改：更新事件處理以適應新的 payload 格式 -->
      <CommentInputForm
        :userAvatar="currentUserAvatar"
        submitText="回覆"
        :isReply="true"
        @submit="handleReplySubmit"
        @cancel="$emit('toggleReplyBox', comment.id)"
      />
    </div>

    <div class="comment-divider"></div>
  </div>
</template>

<script setup>
  import Icon from '@/components/common/Icon.vue';
  import CommentInputForm from './CommentInputForm.vue';

  // 接收來自父元件的資料
  const props = defineProps({
    comment: {
      type: Object,
      required: true,
    },
    currentUserAvatar: {
      type: String,
      required: true,
    },
  });

  // ✨ 主要修改：更新 emits 定義，並建立一個 emitter
  const emit = defineEmits(['toggleOptions', 'toggleReplyBox', 'reportComment', 'sendReply']);

  // ✨ 主要修改：新增一個方法來處理來自輸入框的 submit 事件
  function handleReplySubmit(payload) {
    // payload 的格式是 { text: '...', image: File }
    // 將 targetId 和收到的 payload 一起向上傳遞
    emit('sendReply', {
      targetId: props.comment.id,
      content: payload, // 將完整的 { text, image } 物件傳上去
    });
  }
</script>

<style lang="scss" scoped>
  /* --- Variables --- */
  $avatar-size: 76px;
  $gap-size: 16px;
  $primary-color: #db7c36;
  $dropdown-bg: #fefaf2;
  $divider-color: #cccccc;
  $text-color-author: #333;
  $text-color-options: #888;
  $text-color-body: #000;
  $hover-color-text: white;
  $mobile-breakpoint: 768px; // ✨ 新增：定義一個 RWD 斷點變數

  /* --- Component Styles --- */
  .comment-item {
    position: relative;
    padding: 24px 0;

    &:last-of-type .comment-divider {
      display: none;
    }
  }

  .comment-main {
    display: flex;
    gap: $gap-size;
  }

  .comment-avatar {
    width: $avatar-size;
    height: $avatar-size;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .comment-content-wrapper {
    width: 100%;
    position: relative;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    position: relative; // 確保選項按鈕在內容之上
    z-index: 10;
  }

  .comment-author {
    font-size: 20px;
    font-weight: 600;
    color: $text-color-author;
  }

  .comment-body {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $gap-size;

    // ✨ RWD 樣式 ✨
    // 當螢幕寬度小於等於 768px 時，套用以下樣式
    @media (max-width: $mobile-breakpoint) {
      // 1. 將排列方向改為垂直堆疊
      flex-direction: column;
    }
  }

  .comment-text {
    font-size: 24px;
    line-height: 1.6;
    color: $text-color-body;
    flex-grow: 1;
  }

  .comment-image {
    max-width: 230px;
    border-radius: 20px;
    object-fit: cover;
    flex-shrink: 0;
    margin-right: 30px;

    // ✨ RWD 樣式 ✨
    @media (max-width: $mobile-breakpoint) {
      // 2. 移除右邊距
      margin-right: 0;
      // 3. (可選) 讓圖片寬度更大，視覺效果更好
      max-width: 400px;
      width: 100%; // 可以設定一個適合手機的寬度
    }
  }

  .comment-divider {
    border-bottom: 1px dotted $divider-color;
    position: absolute;
    bottom: 0;
    left: $avatar-size + $gap-size;
    right: 0;
  }

  /* 選項容器與泡泡 (維持不變) */
  .comment-options-container {
    position: relative;
  }

  .comment-options-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;

    .icon-option {
      font-size: 20px;
      color: $text-color-options;
    }
  }

  .comment-dropdown-bubble {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background-color: $dropdown-bg;
    border: 1px solid $primary-color;
    border-radius: 16px;
    padding: 6px;
    width: 140px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: 20;
  }

  .comment-dropdown-arrow {
    position: absolute;
    top: -10px;
    right: 12px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid $primary-color;
  }

  .comment-reply-btn,
  .comment-report-btn {
    background: transparent;
    width: 100%;
    padding: 8px;
    border: none;
    font-size: 15px;
    cursor: pointer;
    border-radius: 12px;
    transition:
      background-color 0.2s,
      color 0.2s;

    &:hover {
      background-color: $primary-color;
      color: $hover-color-text;
    }
  }

  // 回覆區塊的樣式 (維持不變)
  .comment-reply-section {
    // padding-left: $avatar-size + $gap-size;
    margin-top: $gap-size;
  }
</style>
