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
      <!-- 引入我們之前做好的輸入框元件 -->
      <CommentInputForm
        :userAvatar="currentUserAvatar"
        submitText="回覆"
        :isReply="true"
        @submit="(content) => $emit('sendReply', { targetId: comment.id, content: content })"
        @cancel="$emit('toggleReplyBox', comment.id)"
        @uploadImage="$emit('uploadImage')"
      />
    </div>

    <div class="comment-divider"></div>
  </div>
</template>

<script setup>
  import Icon from '@/components/common/Icon.vue';
  import CommentInputForm from './CommentInputForm.vue';

  // 接收來自父元件的資料
  defineProps({
    comment: {
      type: Object,
      required: true,
    },
    currentUserAvatar: {
      // 聲明會接收這個 Prop
      type: String,
      required: true,
    },
  });

  // 定義這個元件會觸發哪些事件
  defineEmits(['toggleOptions', 'toggleReplyBox', 'reportComment']);
</script>

<style scoped>
  /* 將您原本 CSS 中所有與 .comment-item 相關的樣式複製到這裡 */
  /* 例如 .comment-item, .comment-main, .comment-avatar, .comment-header 等等... */
  /* 分隔線 .comment-divider 的樣式也放在這裡 */

  .comment-item {
    position: relative;
    padding: 24px 0;
  }
  .comment-main {
    display: flex;
    gap: 16px;
  }
  .comment-avatar {
    width: 76px;
    height: 76px;
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
    position: relative;
    z-index: 10;
  }
  .comment-author {
    font-size: 20px;
    font-weight: 600;
  }
  .comment-body {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }
  .comment-text {
    font-size: 24px;
    line-height: 1.6;
    flex-grow: 1;
  }
  .comment-image {
    max-width: 230px;
    border-radius: 20px;
    object-fit: cover;
    flex-shrink: 0;
    margin-right: 30px;
  }
  .comment-divider {
    border-bottom: 1px dotted #cccccc;
    position: absolute;
    bottom: 0;
    left: 64px; /* 48px頭像 + 16px間距 */
    right: 0;
  }
  .comment-item:last-of-type .comment-divider {
    display: none;
  }

  /* 選項容器與泡泡 */
  .comment-options-container {
    position: relative;
  }
  .comment-options-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
  }
  .comment-options-icon {
    font-size: 20px;
    color: #888;
  }
  .comment-dropdown-bubble {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background-color: #fefaf2;
    border: 1px solid #db7c36;
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
    border-bottom: 10px solid #db7c36;
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
  }
  .comment-reply-btn:hover,
  .comment-report-btn:hover {
    background-color: #db7c36;
    color: white;
  }
</style>
