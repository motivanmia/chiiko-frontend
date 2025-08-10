<template>
  <div class="comment-wrapper">
    <!-- 
      ✅ 結構修正：
      我們不再需要插槽。CommentItem 自己就能處理回覆框的顯示。
      父元件的職責很單純：就是用 v-for 產生 CommentItem，
      並透過 props 傳遞資料，以及透過 @ 監聽事件。
    -->
    <CommentItem
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :currentUserAvatar="currentUserAvatar"
      @toggleOptions="handleToggleOptions"
      @toggleReplyBox="handleToggleReplyBox"
      @reportComment="handleReportComment"
      @sendReply="handleSendReply"
      @uploadImage="uploadImage"
    />

    <!-- 主留言輸入框 -->
    <CommentInputForm
      :userAvatar="currentUserAvatar"
      placeholder="請輸入留言..."
      submitText="發布留言"
      @submit="postComment"
      @uploadImage="uploadImage"
    />
    <ReportModal
      :show="isReportModalVisible"
      @close="closeReportModal"
      @submitReport="submitReport"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import CommentItem from './CommentItem.vue';
  import CommentInputForm from './CommentInputForm.vue';
  import ReportModal from './ReportModal.vue';

  // ✅ 用來控制燈箱的狀態
  const isReportModalVisible = ref(false);
  const commentToReport = ref(null);

  // ✅ 這是監聽到事件後要執行的函式
  function handleReportComment(name) {
    // 將舊的 alert 提示換成打開燈箱的邏輯
    commentToReport.value = name; // 記住我們要檢舉的是誰
    isReportModalVisible.value = true; // 將狀態設為 true，打開燈箱
  }

  // ✅ 這是燈箱發出 'close' 事件後要執行的函式
  function closeReportModal() {
    isReportModalVisible.value = false; // 關閉燈箱
    commentToReport.value = null; // 清空記錄
  }

  // ✅ 這是燈箱發出 'submitReport' 事件後要執行的函式
  function submitReport(reasonId) {
    const reasonText = {
      hate_speech: '仇恨言論',
      harassment: '謾罵和騷擾',
      violence: '暴力言論',
      privacy: '侵犯隱私',
      spam: '垃圾內容',
    }[reasonId];

    alert(`已收到您對「${commentToReport.value}」的檢舉！\n理由: ${reasonText}`);
    // 在這裡，您可以加入呼叫後端 API 的程式碼，
    // 將 commentToReport.value 和 reasonId/reasonText 送出

    closeReportModal(); // 提交後自動關閉燈箱
  }

  // 1. 接收來自頁面的 Props
  const props = defineProps({
    initialComments: {
      type: Array,
      required: true,
    },
    currentUserAvatar: {
      type: String,
      required: true,
    },
  });

  // 2. 使用 Props 初始化本地的留言列表
  const comments = ref(props.initialComments);

  // --- 3. 所有事件處理函式都集中在這裡 ---

  function handleToggleOptions(commentId) {
    const comment = comments.value.find((c) => c.id === commentId);
    if (comment) {
      comment.showOptions = !comment.showOptions;
    }
  }

  // ✅ 邏輯修正：這是處理「打開/關閉」回覆框的核心函式
  function handleToggleReplyBox(commentId) {
    const targetComment = comments.value.find((c) => c.id === commentId);
    if (!targetComment) return;

    // ✅ 變數修正：在這裡定義 isCurrentlyOpen
    const isCurrentlyOpen = targetComment.showReplyBox;

    // 先關閉所有回覆框和選項泡泡，確保 UI 乾淨
    comments.value.forEach((c) => {
      c.showReplyBox = false;
      c.showOptions = false;
    });

    // 如果目標回覆框原本是關著的，就把它打開
    targetComment.showReplyBox = !isCurrentlyOpen;
  }

  // ✅ 事件修正：sendReply 現在接收一個包含 id 和 content 的物件
  function handleSendReply(payload) {
    const { targetId, content } = payload;
    const parentIndex = comments.value.findIndex((c) => c.id === targetId);
    if (parentIndex === -1) return;

    const parentComment = comments.value[parentIndex];

    const newReply = {
      id: Date.now(),
      name: '你 (使用者名稱)',
      message: `@${parentComment.name} ${content}`,
      avatar: props.currentUserAvatar,
      isReply: true, // 可以用來做縮排樣式
      showOptions: false,
      showReplyBox: false,
      reply: '',
    };

    comments.value.splice(parentIndex + 1, 0, newReply);
    parentComment.showReplyBox = false; // 提交後關閉回覆框
  }

  function postComment(content) {
    comments.value.push({
      id: Date.now(),
      name: '你 (使用者名稱)',
      message: content,
      avatar: props.currentUserAvatar,
      showOptions: false,
      showReplyBox: false,
      reply: '',
    });
  }

  function uploadImage() {
    alert('（模擬功能）開啟檔案選擇視窗...');
  }
</script>

<style scoped>
  /* ✅ 樣式修正：只保留最外層容器和回覆區塊的定位樣式 */
  .comment-wrapper {
    width: 100%;
    max-width: 1210px;
    margin: 10px auto;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 35px 50px 35px;
  }

  /* 這些樣式現在應該在 CommentItem.vue 裡面 */
  /* .comment-reply-section { ... } */
  /* .reply-to-label { ... } */
</style>
```
