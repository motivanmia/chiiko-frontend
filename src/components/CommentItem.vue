<template>
  <div class="comment-item">
    <div class="comment-main">
      <!-- 
        【修正】
        後端回傳的是 member_avatar，所以優先使用它。
        如果沒有，再嘗試使用 currentUserAvatar (主要用於輸入框)。
      -->
      <img
        :src="comment.member_avatar || currentUserAvatar"
        alt="使用者頭像"
        class="comment-avatar"
      />
      <div class="comment-content-wrapper">
        <div class="comment-header">
          <p class="comment-author">{{ comment.member_name }}</p>
          <div class="comment-options-container">
            <button
              @click="$emit('toggleOptions', comment.comment_id)"
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
                @click="$emit('toggleReplyBox', comment.comment_id)"
                class="comment-reply-btn"
              >
                回覆留言
              </button>
              <button
                @click="$emit('reportComment', comment.member_name)"
                class="comment-report-btn"
              >
                檢舉留言
              </button>
            </div>
          </div>
        </div>
        <div class="comment-body">
          <p class="comment-text">{{ comment.content }}</p>
          <img
            v-if="comment.image"
            :src="comment.image"
            alt="留言附圖"
            class="comment-image"
          />
        </div>
      </div>
    </div>

    <!-- 渲染回覆的區塊 -->
    <div
      v-if="comment.replies && comment.replies.length > 0"
      class="replies-wrapper"
    >
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.comment_id"
        :comment="reply"
        :current-user-avatar="currentUserAvatar"
        @toggleOptions="$emit('toggleOptions', $event)"
        @toggleReplyBox="$emit('toggleReplyBox', $event)"
        @reportComment="$emit('reportComment', $event)"
        @sendReply="$emit('sendReply', $event)"
        class="is-reply"
      />
    </div>

    <!-- 回覆框，只在需要時顯示 -->
    <div
      v-if="comment.showReplyBox"
      class="comment-reply-section"
    >
      <div
        class="reply-prompt"
        v-if="comment.member_name"
      >
        ... 正在回覆 {{ comment.member_name }} 的留言
      </div>
      <CommentInputForm
        :userAvatar="currentUserAvatar"
        submitText="回覆"
        :isReply="true"
        @submit="handleReplySubmit"
        @cancel="$emit('toggleReplyBox', comment.comment_id)"
      />
    </div>

    <div class="comment-divider"></div>
  </div>
</template>

<!-- ⭐️ 核心修正：確保只有一個 <script setup> 區塊 ⭐️ -->
<script setup>
  import Icon from '@/components/common/Icon.vue';
  import CommentInputForm from './CommentInputForm.vue';
  import CommentItem from './CommentItem.vue'; // 為了讓遞迴更穩定

  // 【✅ 唯一的核心修正 ✅】
  // 將 defineProps 的回傳值賦予給一個名為 props 的常數。
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

  const emit = defineEmits(['toggleOptions', 'toggleReplyBox', 'reportComment', 'sendReply']);

  function handleReplySubmit(payload) {
    // 現在 'props' 是一個已定義的變數，可以安全地存取 props.comment
    emit('sendReply', {
      targetId: props.comment.comment_id,
      content: payload,
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
  $mobile-breakpoint: 768px;

  /* --- Base Styles --- */
  .comment-item {
    position: relative;
    padding: 24px 0; // 這是主留言的 padding
    &:last-of-type .comment-divider {
      display: none;
    }
  }

  /* ⭐️ 核心修正 2: 使用一個獨立的 class 來定義回覆的樣式 ⭐️ */
  .comment-item.is-reply {
    padding: 16px 0 16px $gap-size; // 這是回覆的 padding
  }

  // ... (所有其他的 .comment-* 樣式都保持不變) ...
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
    position: relative;
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
    @media (max-width: $mobile-breakpoint) {
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
    @media (max-width: $mobile-breakpoint) {
      margin-right: 0;
      max-width: 400px;
      width: 100%;
    }
  }
  .comment-divider {
    border-bottom: 1px dotted $divider-color;
    position: absolute;
    bottom: 0;
    left: $avatar-size + $gap-size;
    right: 0;
  }
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
  .comment-reply-section {
    padding-left: $avatar-size + $gap-size;
    margin-top: $gap-size;
  }
  .reply-prompt {
    font-size: 14px;
    color: $text-color-options;
    margin-bottom: 8px;
  }

  /* ⭐️ 核心修正 3: 使用簡化的 SCSS 來實現巢狀效果 ⭐️ */
  .replies-wrapper {
    padding-left: $avatar-size + $gap-size;
    margin-top: $gap-size;
    border-left: 2px solid #eee;

    // 隱藏最底下的那條回覆的分隔線
    .comment-item:last-of-type .comment-divider {
      display: none;
    }
  }
</style>
