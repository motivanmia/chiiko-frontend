<template>
  <div class="comment-wrapper">
    <!-- 狀態一：正在載入資料時顯示 -->
    <div
      v-if="isLoading"
      class="loading-state"
    >
      正在載入留言...
    </div>

    <!-- 狀態二：載入完成後顯示 -->
    <template v-else>
      <!-- 
        【版面核心修正】
        1. 我們把「留言列表」的區塊移到最上面。
        2. 我們把「留言輸入框」的區塊移到最下面。
      -->

      <!-- 留言列表 -->
      <div class="comments-list">
        <p
          v-if="comments.length === 0"
          class="no-comments"
        >
          還沒有任何留言，快來搶頭香！
        </p>
        <CommentItem
          v-else
          v-for="comment in comments"
          :key="comment.comment_id"
          :comment="comment"
          :current-user-avatar="currentUser ? currentUser.avatar : ''"
          @sendReply="handleSendReply"
          @toggleReplyBox="handleToggleReplyBox"
          @reportComment="handleReportComment"
          @toggleOptions="handleToggleOptions"
        />
      </div>

      <!-- 分隔線 (可選，根據您的 UI 設計) -->
      <hr
        v-if="currentUser"
        class="section-divider"
      />

      <!-- 主留言輸入框 -->
      <div
        v-if="currentUser"
        class="new-comment-input"
      >
        <CommentInputForm
          :user-avatar="currentUser.avatar"
          placeholder="請輸入留言..."
          submit-text="發布留言"
          @submit="handlePostNewComment"
        />
      </div>
      <!-- 如果未登入，顯示提示 -->
      <div
        v-else
        class="login-prompt"
      >
        <p>
          請先
          <a href="/login">登入</a>
          才能發表留言。
        </p>
      </div>
    </template>

    <!-- 檢舉燈箱 (保持不變) -->
    <ReportModal
      :show="isReportModalVisible"
      @close="closeReportModal"
      @submitReport="submitReport"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import CommentItem from './CommentItem.vue';
  import CommentInputForm from './CommentInputForm.vue';
  import ReportModal from './ReportModal.vue';

  // --- 1. Props (保持不變) ---
  const props = defineProps({
    recipeId: {
      type: [Number, String],
      required: true,
    },
  });

  // --- 2. 內部狀態管理 (保持不變) ---
  const comments = ref([]);
  const currentUser = ref(null);
  const isLoading = ref(true);
  const isReportModalVisible = ref(false);
  const commentToReport = ref(null);

  // --- 3. 自動獲取資料 (保持不變) ---
  onMounted(async () => {
    isLoading.value = true;
    try {
      const [userRes, commentsRes] = await Promise.all([
        axios.get('http://localhost:8888/front/member/get_current_user.php'),
        axios.get(
          `http://localhost:8888/front/recipe/get_recipe_comments.php?recipe_id=${props.recipeId}`,
        ),
      ]);

      if (userRes.data && userRes.data.isLoggedIn) {
        currentUser.value = userRes.data.data;
      }

      if (commentsRes.data && commentsRes.data.status === 'success') {
        const processedComments = addStateToComments(commentsRes.data.data || []);
        comments.value = processedComments;
      }
    } catch (error) {
      console.error('載入留言區失敗:', error);
    } finally {
      isLoading.value = false;
    }
  });

  // --- 輔助函式 (保持不變) ---
  const addStateToComments = (commentList) => {
    return commentList.map((comment) => ({
      ...comment,
      showOptions: false,
      showReplyBox: false,
      replies: comment.replies ? addStateToComments(comment.replies) : [],
    }));
  };

  // --- 4. API 事件處理 (保持不變) ---
  async function handlePostNewComment(payload) {
    if (!currentUser.value) return alert('請先登入');
    const { text, image } = payload;
    if (!text || text.trim() === '') return alert('留言內容不能為空');

    const formData = new FormData();
    formData.append('recipe_id', props.recipeId);
    formData.append('content', text);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post(
        'http://localhost:8888/front/recipe/post_recipe_comment.php',
        formData,
      );
      if (response.data.status === 'success' && response.data.data) {
        comments.value.unshift(addStateToComments([response.data.data])[0]);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('發布留言失敗:', error);
      alert('發布留言失敗');
    }
  }

  async function handleSendReply(payload) {
    if (!currentUser.value) return alert('請先登入');
    const { targetId, content } = payload;
    const { text, image } = content;
    if (!text || text.trim() === '') return alert('回覆內容不能為空');

    const formData = new FormData();
    formData.append('recipe_id', props.recipeId);
    formData.append('parent_id', targetId);
    formData.append('content', text);
    if (image) formData.append('image', image);

    try {
      const response = await axios.post(
        'http://localhost:8888/front/recipe/post_recipe_comment.php',
        formData,
      );
      if (response.data.status === 'success' && response.data.data) {
        const parentComment = findCommentById(targetId);
        if (parentComment) {
          if (!parentComment.replies) parentComment.replies = [];
          parentComment.replies.push(addStateToComments([response.data.data])[0]);
          parentComment.showReplyBox = false;
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('回覆失敗:', error);
      alert('回覆失敗');
    }
  }

  // ==========================================================
  //  【✅ 核心修正 ✅】
  //  恢復完整的 UI 互動函式
  // ==========================================================

  // 輔助函式：遞迴地在留言陣列中尋找特定 ID 的留言
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

  // 處理「...」選項按鈕的點擊
  function handleToggleOptions(commentId) {
    const comment = findCommentById(commentId);
    if (comment) {
      comment.showOptions = !comment.showOptions;
    }
  }

  // 處理「回覆留言」按鈕的點擊
  function handleToggleReplyBox(commentId) {
    const targetComment = findCommentById(commentId);
    if (!targetComment) return;

    // 為了確保一次只打開一個回覆框，我們先記錄下目標回覆框原本是否是打開的
    const isCurrentlyOpen = targetComment.showReplyBox;

    // 遞迴函式：關閉所有留言的選項和回覆框
    const closeAll = (list) => {
      list.forEach((c) => {
        c.showReplyBox = false;
        c.showOptions = false; // 順便關掉選項泡泡
        if (c.replies) closeAll(c.replies);
      });
    };

    // 執行關閉所有
    closeAll(comments.value);

    // 如果目標回覆框原本是關閉的，就把它打開
    if (!isCurrentlyOpen) {
      targetComment.showReplyBox = true;
    }
  }

  // 處理「檢舉留言」按鈕的點擊
  function handleReportComment(authorName) {
    commentToReport.value = authorName;
    isReportModalVisible.value = true;
  }

  // 關閉檢舉燈箱
  function closeReportModal() {
    isReportModalVisible.value = false;
    commentToReport.value = null;
  }

  // 提交檢舉
  function submitReport(reasonId) {
    console.log(`向後端發送檢舉：使用者 "${commentToReport.value}"，理由 ID: "${reasonId}"`);
    alert(`已收到您對「${commentToReport.value}」的檢舉！`);
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
