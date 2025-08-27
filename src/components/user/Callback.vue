<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { postLineLogin } from '@/api/fetch';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(true);
const errorMessage = ref('');

const handleLineLoginCallback = async () => {
  const code = route.query.code;
  const state = route.query.state;

  // 安全比對
  const storedState = localStorage.getItem('line_login_state');
  if (!code || !state || state !== storedState) {
    errorMessage.value = '登入失敗：無效請求或 CSRF 攻擊。';
    loading.value = false;
    router.push('/');
    return;
  }
  localStorage.removeItem('line_login_state');

  try {
    // ⚠️ 關鍵：將授權碼傳給後端 API
    const response = await postLineLogin({
      code: code,
      redirect_uri: window.location.origin + '/callback',
    });

    // 從後端回傳的資料中取得使用者資訊
    const userData = response.data.user;

    // 將使用者資料存入 Pinia Store
    authStore.loginSuccess(userData);

    // 導向登入後頁面
    const redirectPath = authStore.redirectPath || '/';
    router.push(redirectPath);
  } catch (error) {
    console.error('LINE 登入流程出錯：', error);
    errorMessage.value = error.response?.data?.message || '登入失敗，請稍後再試。';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  handleLineLoginCallback();
});
</script>

<template>
  <div>
    <h2>處理 LINE 登入中...</h2>
    <p v-if="loading">請稍候，正在驗證您的身分...</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>