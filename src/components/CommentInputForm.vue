<template>
<div class="comment-input-group" :class="{ 'is-reply': isReply }">
<img :src="userAvatar" alt="使用者頭像" class="comment-avatar" />
<div class="comment-input-right">
<textarea v-model="content" :placeholder="placeholder" class="comment-input"></textarea>
<div class="comment-actions-wrapper" :class="{ 'space-between': !isReply }">
<button @click="$emit('uploadImage')" class="comment-upload-btn">上傳圖片</button>
<div class="reply-actions-right">
<button v-if="isReply" @click="$emit('cancel')" class="comment-cancel-btn">取消</button>
<button @click="submit" class="comment-submit">{{ submitText }}</button>
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
<style scoped>
/* 將您原本 CSS 中所有與輸入框相關的樣式複製到這裡 */
/* 例如 .comment-input-group, .comment-input, .comment-actions-wrapper, 所有按鈕樣式... */

/* src/components/CommentInputForm.vue */

/* (共用) 新留言/回覆的整體容器 */
.comment-input-group {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  align-items: flex-start;
}
.comment-avatar { /* 回覆框用的小頭像 */
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.comment-user-avatar-large { /* 主留言框用的大頭像 */
    width: 48px;
    height: 48px;
    border-radius: 50%;
}
.comment-input-right { width: 100%; }
.comment-input {
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  resize: vertical;
  box-sizing: border-box;
  font-size: 16px;
}
.comment-input-group.is-reply .comment-input { height: 100px; }


/* 按鈕與按鈕容器的佈局 */
.comment-actions-wrapper {
  display: flex;
  margin-top: 12px;
  justify-content: space-between;
}
.reply-actions-right {
  display: flex;
  gap: 12px;
}
/* 當只有右側按鈕時，讓它靠右 */
.comment-actions-wrapper:not(.space-between) {
    justify-content: flex-end;
}

/* 按鈕共用樣式 */
.comment-submit, .comment-upload-btn, .comment-cancel-btn {
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
}
.comment-submit { background-color: #D97C48; color: white; }
.comment-submit:hover { background-color: #c86a3a; }
.comment-upload-btn, .comment-cancel-btn {
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #cccccc;
}
.comment-upload-btn:hover, .comment-cancel-btn:hover { background-color: #f5f5f5; }
</style>