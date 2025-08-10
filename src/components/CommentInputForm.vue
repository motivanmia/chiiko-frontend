<template>
  <div
    class="comment-input-group"
    :class="{ 'is-reply': isReply }"
  >
    <img
      :src="userAvatar"
      alt="使用者頭像"
      class="comment-avatar"
    />
    <div class="comment-input-right">
      <textarea
        v-model="content"
        :placeholder="placeholder"
        class="comment-input"
      ></textarea>
      <div
        class="comment-actions-wrapper"
        :class="{ 'space-between': !isReply }"
      >
        <button
          @click="$emit('uploadImage')"
          class="comment-upload-btn"
        >
          上傳圖片
        </button>
        <div class="reply-actions-right">
          <button
            v-if="isReply"
            @click="$emit('cancel')"
            class="comment-cancel-btn"
          >
            取消
          </button>
          <button
            @click="submit"
            class="comment-submit"
          >
            {{ submitText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    userAvatar: { type: String, required: true },
    placeholder: { type: String, default: '請輸入留言...' },
    submitText: { type: String, default: '發布留言' },
    isReply: { type: Boolean, default: false },
  });

  const emit = defineEmits(['submit', 'cancel', 'uploadImage']);
  const content = ref('');

  function submit() {
    if (content.value.trim()) {
      emit('submit', content.value);
      content.value = ''; // 提交後清空
    }
  }
</script>
<style lang="scss" scoped>
  /* --- Variables --- */
  // Colors
  $primary-color: #d97c48;
  $primary-hover-color: #c86a3a;
  $secondary-bg-color: #ffffff;
  $secondary-hover-bg-color: #f5f5f5;
  $text-color: #333333;
  $border-color-light: #e0e0e0;
  $border-color-medium: #cccccc;

  // Sizing & Spacing
  $base-gap: 16px;
  $base-padding: 12px;
  $avatar-size: 76px;
  $input-height: 120px;
  $input-reply-height: 100px;

  // Font
  $base-font-size: 16px;
  $button-font-size: 24px;

  // Border
  $border-radius-input: 12px;
  $border-radius-button: 20px;

  /* --- Base Styles & Placeholders --- */
  // 使用 Placeholder Selector 建立一個可供繼承的按鈕基礎樣式
  %btn-base {
    padding: 8px 24px;
    border-radius: $border-radius-button;
    font-size: $button-font-size;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;
  }

  /* --- Component Styles --- */
  /* (共用) 新留言/回覆的整體容器 */
  .comment-input-group {
    display: flex;
    gap: $base-gap;
    padding-top: $base-gap;
    align-items: flex-start;

    .comment-avatar,
    .comment-user-avatar-large {
      width: $avatar-size;
      height: $avatar-size;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .comment-avatar {
      /* 回覆框用的小頭像 */
      object-fit: cover;
    }

    .comment-input-right {
      width: 100%;
    }

    .comment-input {
      width: 100%;
      height: $input-height;
      padding: $base-padding;
      border: 1px solid $border-color-light;
      border-radius: $border-radius-input;
      resize: vertical;
      box-sizing: border-box;
      font-size: $base-font-size;
      font-size: 24px;
    }

    /* 修飾符：當為回覆狀態時 */
    &.is-reply {
      .comment-input {
        height: $input-reply-height;
      }
    }
  }

  /* 按鈕與按鈕容器的佈局 */
  .comment-actions-wrapper {
    display: flex;
    margin-top: $base-padding;
    justify-content: space-between;

    /* 當只有右側按鈕時，讓它靠右 */
    &:not(.space-between) {
      justify-content: flex-end;
    }
  }

  .reply-actions-right {
    display: flex;
    gap: $base-padding;
  }

  /* 按鈕樣式 */
  .comment-submit {
    @extend %btn-base;
    background-color: $primary-color;
    color: $secondary-bg-color;

    &:hover {
      background-color: color(orangeColor, base);
      transition: 0.2s ease;
    }
  }

  .comment-upload-btn,
  .comment-cancel-btn {
    @extend %btn-base;
    background-color: $secondary-bg-color;
    color: $text-color;
    border: 1px solid $border-color-medium;
    margin-right: auto;
  }

  .comment-upload-btn:hover,
  .comment-cancel-btn:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
  }
</style>
