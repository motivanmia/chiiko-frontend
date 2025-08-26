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

      <!-- ✨ 核心修改 1：圖片預覽區塊 -->
      <div
        v-if="imagePreviewUrl"
        class="image-preview-wrapper"
      >
        <img
          :src="imagePreviewUrl"
          alt="圖片預覽"
          class="preview-image"
        />
        <button
          @click="removeImage"
          class="remove-image-btn"
        >
          &times;
          <!-- 這是一個叉叉符號 -->
        </button>
      </div>

      <!-- ✨ 核心修改 2：隱藏的檔案選擇輸入框 -->
      <input
        type="file"
        ref="fileInput"
        @change="handleFileSelect"
        accept="image/*"
        style="display: none"
      />

      <div class="comment-actions-wrapper">
        <!-- ✨ 核心修改 3：「上傳圖片」按鈕現在觸發檔案選擇 -->
        <button
          @click="triggerFileUpload"
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

  const emit = defineEmits(['submit', 'cancel']);

  const content = ref('');
  const imageFile = ref(null); // ✨ 追蹤實際的圖片檔案
  const imagePreviewUrl = ref(null); // ✨ 追蹤預覽用的 URL
  const fileInput = ref(null); // ✨ 追蹤 <input> 元素

  // ✨ 觸發隱藏的 input 點擊事件
  function triggerFileUpload() {
    fileInput.value.click();
  }

  // ✨ 當使用者選擇檔案後觸發
  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      imageFile.value = file; // 儲存檔案物件

      // 使用 FileReader 產生預覽 URL
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewUrl.value = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      // 如果選擇的不是圖片，或取消選擇，就清空
      imageFile.value = null;
      imagePreviewUrl.value = null;
    }
  }

  // ✨ 移除已選擇的圖片
  function removeImage() {
    imageFile.value = null;
    imagePreviewUrl.value = null;
    if (fileInput.value) {
      fileInput.value.value = ''; // 重設 input 的值，才能再次選擇同一個檔案
    }
  }

  // ✨ 修改後的提交函式
  function submit() {
    // 必須要有文字或圖片才能提交 (根據您的業務邏輯，這裡可以調整)
    if (!content.value.trim() && !imageFile.value) {
      alert('請輸入留言或上傳圖片');
      return;
    }
    // 後端要求 content 必填，所以我們也加上這個判斷
    if (!content.value.trim()) {
      alert('留言內容不能為空');
      return;
    }

    emit('submit', {
      text: content.value.trim(),
      image: imageFile.value, // 將檔案物件本身發送出去
    });

    // 提交後清空所有內容
    content.value = '';
    removeImage();
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
  $secondary-hover-border-color: #e7e7e7;

  // Sizing & Spacing
  $base-gap: 16px;
  $base-padding: 12px;
  $avatar-size: 76px;
  $input-height: 120px;
  $input-reply-height: 100px;
  $rwd-gap: 12px; // RWD 用的間距

  // Font
  $base-font-size: 16px;
  $button-font-size-desktop: 24px; // 桌機版按鈕字體
  $button-font-size-mobile: 16px; // 手機版按鈕字體
  $input-font-size: 24px;

  // Border
  $border-radius-input: 12px;
  $border-radius-button: 20px;

  /* --- Base Styles & Placeholders --- */
  %btn-base {
    padding: 8px 24px;
    border-radius: $border-radius-button;
    font-size: $button-font-size-desktop; // 預設使用桌機版字體
    cursor: pointer;
    border: none;
    transition:
      background-color 0.2s,
      border-color 0.2s;
  }

  /* --- Component Styles --- */
  .comment-input-group {
    display: flex;
    gap: $base-gap;
    padding-top: $base-gap;
    align-items: flex-start;

    .comment-avatar {
      width: $avatar-size;
      height: $avatar-size;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .comment-input-right {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .comment-input {
      width: 100%;
      height: $input-height;
      padding: $base-padding;
      border: 1px solid $border-color-light;
      border-radius: $border-radius-input;
      resize: vertical;
      box-sizing: border-box;
      font-size: $input-font-size;
    }

    &.is-reply .comment-input {
      height: $input-reply-height;
    }
  }

  /* 圖片預覽樣式 */
  .image-preview-wrapper {
    position: relative;
    margin-top: $base-padding;
    max-width: 150px;

    .preview-image {
      width: 100%;
      height: auto;
      border-radius: 20px;
      display: block;
      border: 1px solid $border-color-light;
    }

    .remove-image-btn {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 24px;
      height: 24px;
      background-color: rgba(0, 0, 0, 0.6);
      color: white;
      border: 2px solid white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      line-height: 1;
      padding: 0;

      &:hover {
        background-color: rgba(0, 0, 0, 0.8);
      }
    }
  }

  /* 按鈕容器佈局 (桌機版) */
  .comment-actions-wrapper {
    display: flex;
    margin-top: $base-padding;
    align-items: center;
  }

  .reply-actions-right {
    display: flex;
    gap: $base-padding;
  }

  /* 按鈕樣式 (桌機版) */
  .comment-submit {
    @extend %btn-base;
    background-color: $primary-color;
    color: $secondary-bg-color;

    &:hover {
      background-color: color(orangeColor, base);
      transition: 0.2s ease;
    }
  }

  .comment-upload-btn {
    @extend %btn-base;
    background-color: $secondary-bg-color;
    color: $text-color;
    border: 1px solid $border-color-medium;
    margin-right: auto; // 將上傳按鈕推到最左邊

    &:hover {
      background-color: $secondary-hover-border-color;
      border-color: $secondary-hover-border-color;
    }
  }

  .comment-cancel-btn {
    @extend %btn-base;
    background-color: $secondary-bg-color;
    color: $text-color;
    border: 1px solid $border-color-medium;

    &:hover {
      background-color: $secondary-hover-border-color;
      border-color: $secondary-hover-border-color;
    }
  }

  /* ====================================================== */
  /*          ✨✨✨ RWD 響應式修正 (最終版) ✨✨✨         */
  /*  當螢幕寬度 <= 768px 時，套用以下統一排版            */
  /* ====================================================== */
  @media (max-width: 768px) {
    // 1. 統一所有按鈕的字體大小
    .comment-submit,
    .comment-upload-btn,
    .comment-cancel-btn {
      font-size: $button-font-size-mobile;
    }

    // 2. 讓最外層容器垂直堆疊
    .comment-actions-wrapper {
      flex-direction: column;
      align-items: stretch;
      gap: $rwd-gap;
    }

    // 3. 重設「上傳圖片」按鈕的邊距，讓它能正常填滿寬度
    .comment-upload-btn {
      margin-right: 0;
    }

    // 4. ✨ 關鍵修正：確保包裹「取消」和「回覆」的容器也垂直堆疊
    .reply-actions-right {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: $rwd-gap;
    }
  }
</style>
