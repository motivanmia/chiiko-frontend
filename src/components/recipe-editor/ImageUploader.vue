<template>
  <div
    class="upload-zone"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <!-- 為了更好的使用者體驗，我們將點擊事件加在整個預覽圖上 -->
    <label
      for="file-input"
      class="image-preview-label"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        class="image-preview"
      />
      <!-- 新增一個預設的 placeholder 狀態 -->
      <div
        v-else
        class="placeholder-content"
      ></div>
    </label>

    <!-- 將按鈕放在外部，或者您可以將它完全移除，讓使用者直接點擊預覽區 -->
    <div class="upload-button-container">
      <BaseButton
        @click="triggerFile"
        class="upload-button-override"
      >
        {{ previewUrl ? '更換圖片' : '選擇食譜圖片' }}
      </BaseButton>
    </div>

    <!-- 真正用來選擇檔案的 input 元素，保持隱藏 -->
    <input
      type="file"
      ref="fileInput"
      id="file-input"
      accept="image/*"
      class="file-input"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';

const props = defineProps({
  initialImage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:file']);

// 新增一個變數來儲存新上傳的檔案
const newFile = ref(null);
const fileInput = ref(null);

// ✅ 核心修正：使用 computed 屬性來決定要顯示哪個 URL
const previewUrl = computed(() => {
  // 優先顯示使用者新上傳的圖片預覽
  if (newFile.value) {
    return URL.createObjectURL(newFile.value);
  }
  // 如果沒有新上傳的，就顯示從父層傳入的圖片路徑
  return props.initialImage;
});

const triggerFile = () => fileInput.value?.click();

// 統一處理檔案更新的函式
const processFile = (file) => {
  if (file && file.type.startsWith('image/')) {
    // 儲存新檔案物件
    newFile.value = file;
    emit('update:file', file);
  } else {
    // 如果取消選擇，清空新檔案
    newFile.value = null;
    emit('update:file', null);
    if (file === null) {
      console.log('User Cancelled');
    } else {
      alert('請選擇有效的圖片檔案 (jpg, png, gif)。');
    }
  }
};

const handleFileChange = (e) => processFile(e.target.files[0]);
const handleDrop = (e) => processFile(e.dataTransfer.files[0]);
</script>

<style lang="scss" scoped>
  /* 桌面版樣式 */
  .upload-zone {
    position: relative;
    height: 400px;
    width: 480px;
    background-color: #fff7ed;
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin 由父層的 gap 控制，這裡不需要 */
    border-radius: 20px;
  }

  .image-preview {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
    opacity: 0.4;
  }

  .upload-content {
    z-index: 1;
  }

  .file-input {
    display: none;
  }

  .upload-button-override {
    width: 225px;
    
  }

  /* 
    FIX: 這是完整的 RWD 樣式修正
  */
  @media (max-width: 768px) {
    .upload-zone {
      /* 1. 將固定寬度改為 100%，讓它自動填滿父層容器 */
      width: 100%;
      /* 2. 縮小高度以適應手機螢幕 */
      height: 300px;
    }

    .upload-button-override {
      /* 3. 也可以稍微縮小按鈕，讓視覺更協調 */
      width: 200px;
      height: 50px;
      font-size: 20px;
    }
  }
</style>
