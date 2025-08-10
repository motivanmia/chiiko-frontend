<script setup>
  import { ref } from 'vue';
  import CommentItem from './CommentItem.vue';
  import CommentInputForm from './CommentInputForm.vue';
  import ReportModal from './ReportModal.vue';

  // ✅ 用來控制燈箱的狀態 (維持不變)
  const isReportModalVisible = ref(false);
  const commentToReport = ref(null);

  // ✅ 這是監聽到事件後要執行的函式 (維持不變)
  function handleReportComment(name) {
    commentToReport.value = name;
    isReportModalVisible.value = true;
  }

  // ✅ 這是燈箱發出 'close' 事件後要執行的函式 (維持不變)
  function closeReportModal() {
    isReportModalVisible.value = false;
    commentToReport.value = null;
  }

  // ✅ 這是燈箱發出 'submitReport' 事件後要執行的函式 (維持不變)
  function submitReport(reasonId) {
    const reasonText = {
      hate_speech: '仇恨言論',
      harassment: '謾罵和騷擾',
      violence: '暴力言論',
      privacy: '侵犯隱私',
      spam: '垃圾內容',
    }[reasonId];

    alert(`已收到您對「${commentToReport.value}」的檢舉！\n理由: ${reasonText}`);
    closeReportModal();
  }

  // 1. 接收來自頁面的 Props (維持不變)
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

  // 2. 使用 Props 初始化本地的留言列表 (維持不變)
  const comments = ref(props.initialComments);

  // --- 3. 所有事件處理函式都集中在這裡 ---

  function handleToggleOptions(commentId) {
    // (維持不變)
    const comment = comments.value.find((c) => c.id === commentId);
    if (comment) {
      comment.showOptions = !comment.showOptions;
    }
  }

  function handleToggleReplyBox(commentId) {
    // (維持不變)
    const targetComment = comments.value.find((c) => c.id === commentId);
    if (!targetComment) return;
    const isCurrentlyOpen = targetComment.showReplyBox;
    comments.value.forEach((c) => {
      c.showReplyBox = false;
      c.showOptions = false;
    });
    targetComment.showReplyBox = !isCurrentlyOpen;
  }

  // =================================================================== //
  //                ✨✨✨ 核心修正區域 ✨✨✨                     //
  // =================================================================== //

  /**
   * ✅ 修正(1)：處理「回覆」的函式
   */
  function handleSendReply(payload) {
    // payload 的格式是: { targetId: '...', content: { text: '...', image: File } }
    const { targetId, content } = payload;
    const parentComment = comments.value.find((c) => c.id === targetId);
    if (!parentComment) return;

    // 1. 處理圖片：如果有圖片檔案，建立可顯示的 URL
    let imageUrl = null;
    if (content.image) {
      imageUrl = URL.createObjectURL(content.image);
    }

    // 2. 建立新回覆物件，結構與您原有的完全相同
    const newReply = {
      id: Date.now(),
      name: '你 (使用者名稱)',
      // ✨ 關鍵：從 content 包裹中取出 .text
      message: `@${parentComment.name} ${content.text}`,
      // ✨ 關鍵：將處理好的圖片 URL 新增到物件中
      image: imageUrl,
      avatar: props.currentUserAvatar,
      isReply: true,
      showOptions: false,
      showReplyBox: false,
      reply: '',
    };

    // 3. ✨ 關鍵：維持您原有的 splice 插入邏輯，不破壞版面
    const parentIndex = comments.value.findIndex((c) => c.id === targetId);
    comments.value.splice(parentIndex + 1, 0, newReply);

    // 提交後關閉回覆框
    parentComment.showReplyBox = false;
  }

  /**
   * ✅ 修正(2)：處理「發布新留言」的函式
   */
  function postComment(content) {
    // content 的格式現在也是: { text: '...', image: File }

    // 1. 處理圖片
    let imageUrl = null;
    if (content.image) {
      imageUrl = URL.createObjectURL(content.image);
    }

    // 2. 建立新留言物件
    comments.value.push({
      id: Date.now(),
      name: '你 (使用者名稱)',
      // ✨ 關鍵：從 content 包裹中取出 .text
      message: content.text,
      // ✨ 關鍵：將處理好的圖片 URL 新增到物件中
      image: imageUrl,
      avatar: props.currentUserAvatar,
      showOptions: false,
      showReplyBox: false,
      reply: '',
    });
  }

  // ✅ 修正(3)：這個函式已不再需要，安全移除
  /*
function uploadImage() {
  alert('（模擬功能）開啟檔案選擇視窗...');
}
*/
</script>

<template>
  <div class="comment-wrapper">
    <CommentItem
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
      :currentUserAvatar="currentUserAvatar"
      @toggleOptions="handleToggleOptions"
      @toggleReplyBox="handleToggleReplyBox"
      @reportComment="handleReportComment"
      @sendReply="handleSendReply"
    />

    <!-- 主留言輸入框 -->
    <CommentInputForm
      :userAvatar="currentUserAvatar"
      placeholder="請輸入留言..."
      submitText="發布留言"
      @submit="postComment"
    />
    <ReportModal
      :show="isReportModalVisible"
      @close="closeReportModal"
      @submitReport="submitReport"
    />
  </div>
</template>

<style scoped>
  /* ✅ 樣式修正：只保留最外層容器和回覆區塊的定位樣式 */
  .comment-wrapper {
    width: 100%;
    max-width: 1210px;
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
