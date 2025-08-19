<template>
  <div class="comment-wrapper">
    <!-- 
      ⭐️ 核心修正 1: v-for 遍歷的是本地的、可修改的 `comments` ref 
      同時，將所有事件處理函式都綁定好
    -->
    <CommentItem
      v-for="comment in comments"
      :key="comment.comment_id"
      :comment="comment"
      :currentUserAvatar="currentUserAvatar"
      @toggleOptions="handleToggleOptions"
      @toggleReplyBox="handleToggleReplyBox"
      @reportComment="handleReportComment"
      @sendReply="handleSendReply"
    />

    <!-- 主留言輸入框 (保持不變) -->
    <CommentInputForm
      :userAvatar="currentUserAvatar"
      placeholder="請輸入留言..."
      submitText="發布留言"
      @submit="postComment"
    />

    <!-- 檢舉燈箱 (保持不變) -->
    <ReportModal
      :show="isReportModalVisible"
      @close="closeReportModal"
      @submitReport="submitReport"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';
  import CommentItem from './CommentItem.vue';
  import CommentInputForm from './CommentInputForm.vue';
  import ReportModal from './ReportModal.vue';

  // --- Props and Local State ---
  const props = defineProps({
    initialComments: { type: Array, required: true },
    currentUserAvatar: { type: String, required: true },
  });
  const comments = ref([]);

  // --- Watcher to sync props and add UI state ---
  watch(
    () => props.initialComments,
    (newVal) => {
      const addStateToComments = (commentList) => {
        return commentList.map((comment) => ({
          ...comment,
          showOptions: false,
          showReplyBox: false,
          replies: comment.replies ? addStateToComments(comment.replies) : [],
        }));
      };
      comments.value = addStateToComments(newVal || []);
    },
    { immediate: true, deep: true },
  );

  // ⭐️ 核心修正 1: 恢復控制燈箱狀態的 ref ⭐️
  const isReportModalVisible = ref(false);
  const commentToReport = ref(null);

  // --- Event Handlers ---
  function findCommentById(targetId, list = comments.value) {
    for (const comment of list) {
      if (comment.comment_id === targetId) return comment;
      if (comment.replies && comment.replies.length > 0) {
        const found = findCommentById(targetId, comment.replies);
        if (found) return found;
      }
    }
    return null;
  }

  function handleToggleOptions(commentId) {
    const comment = findCommentById(commentId);
    if (comment) comment.showOptions = !comment.showOptions;
  }

  function handleToggleReplyBox(commentId) {
    const targetComment = findCommentById(commentId);
    if (!targetComment) return;
    const isCurrentlyOpen = targetComment.showReplyBox;
    const closeAll = (list) => {
      list.forEach((c) => {
        c.showReplyBox = false;
        c.showOptions = false;
        if (c.replies) closeAll(c.replies);
      });
    };
    closeAll(comments.value);
    targetComment.showReplyBox = !isCurrentlyOpen;
  }

  /**
   * ⭐️ 核心修正 2: 修改檢舉事件的處理函式 ⭐️
   * @param {string} authorName - 被檢舉的留言者姓名
   */
  function handleReportComment(authorName) {
    // 不再是 alert，而是設定狀態來打開燈箱
    commentToReport.value = authorName;
    isReportModalVisible.value = true;

    // 關閉所有已打開的選項泡泡，提升使用者體驗
    const closeAllOptions = (list) => {
      list.forEach((c) => {
        c.showOptions = false;
        if (c.replies) closeAllOptions(c.replies);
      });
    };
    closeAllOptions(comments.value);
  }

  function handleSendReply(payload) {
    console.log('收到回覆:', payload);
    alert(`【測試】成功回覆留言 (ID: ${payload.targetId})，內容: ${payload.content.text}`);
    handleToggleReplyBox(payload.targetId);
  }

  function postComment(payload) {
    console.log('收到新留言:', payload);
    alert(`【測試】成功發布新留言，內容: ${payload.text}`);
  }

  /**
   * ⭐️ 核心修正 3: 恢復處理燈箱回傳事件的函式 ⭐️
   */
  function closeReportModal() {
    isReportModalVisible.value = false;
    commentToReport.value = null;
  }

  function submitReport(reasonId) {
    const reasonText =
      {
        hate_speech: '仇恨言論',
        harassment: '謾罵和騷擾',
        violence: '暴力言論',
        privacy: '侵犯隱私',
        spam: '垃圾內容',
      }[reasonId] || '其他';

    // 在這裡，您未來可以執行實際的檢舉 API 呼叫
    console.log(`向後端發送檢舉：使用者 "${commentToReport.value}"，理由: "${reasonText}"`);
    alert(`已收到您對「${commentToReport.value}」的檢舉！\n理由: ${reasonText}`);

    // 處理完畢後，關閉燈箱
    closeReportModal();
  }
</script>

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
