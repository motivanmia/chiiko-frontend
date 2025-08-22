<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import CancelButton from '@/components/button/CancelButton.vue';
  import ConfirmButton from '@/components/button/ConfirmButton.vue';
  import { useRouter } from 'vue-router';
  import Swal from 'sweetalert2';
  import { patchPassword } from '@/api/fetch';

  // 找第一個輸入框
  const firstInput = ref(null);
  onMounted(() => {
    firstInput.value.focus();
  });

  const oldPassword = ref('');
  const newPassword = ref('');
  const checkNewPassword = ref('');

  // 按鈕禁用狀態防止重複提交
  const isSubmit = ref(false);

  // 初始化router
  const router = useRouter();

  // 驗證訊息
  const errors = reactive({
    oldPassword: '',
    newPassword: '',
    checkNewPassword: '',
  });

  const cleanErrors = () => {
    errors.oldPassword = '';
    errors.newPassword = '';
    errors.checkNewPassword = '';
  };

  /**
   * 驗證新密碼的強度與格式
   * @param {string} password - 要驗證的密碼
   * @returns {boolean} - 是否通過驗證
   */

  // 密碼規則
  const validatePassword = (password) => {
    if (password.length < 6) return false;

    if (!/^[a-zA-Z0-9]+$/.test(password)) return false;

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasLetter || !hasNumber) return false;

    return true;
  };

  const savePassword = async () => {
    cleanErrors();
    let isValid = true;

    // 確認必填欄位
    if (!oldPassword.value) {
      errors.oldPassword = '！請輸入目前的密碼';
      isValid = false;
    }
    if (!newPassword.value) {
      errors.newPassword = '！請輸入新密碼';
      isValid = false;
    }
    if (!checkNewPassword.value) {
      errors.checkNewPassword = '！請再次輸入新密碼';
      isValid = false;
    }

    // 驗證格式
    if (!validatePassword(newPassword.value)) {
      errors.newPassword = '！請輸入6個字元以上的英數字組合，且不可使用特殊符號';
      isValid = false;
    }
    if (
      newPassword.value &&
      checkNewPassword.value &&
      newPassword.value !== checkNewPassword.value
    ) {
      errors.checkNewPassword = '！與新密碼不符';
      isValid = false;
    }

    // 有任何驗證失敗則終止函式
    if (!isValid) {
      return;
    }

    isSubmit.value = true;

    // 將資料格式化以符合api需求
    const updateData = {
      current_pwd: oldPassword.value,
      new_pwd: newPassword.value,
    };

    try {
      const response = await patchPassword(updateData);

      if (response.data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: '密碼更新成功',
          text: response.data.message,
        });

        // 成功後清空表單
        oldPassword.value = '';
        newPassword.value = '';
        checkNewPassword.value = '';

        // 返回上一頁
        router.go(-1);
      } else {
        // 從api回傳的錯誤訊息來判斷
        Swal.fire({
          icon: 'error',
          title: '密碼更新失敗',
          text: response.data.message,
        });
      }
    } catch (error) {
      // 檢查是否有伺服器回應
      if (error.response) {
        // 伺服器有回應 根據狀態碼進行處理
        if (error.response.status === 401) {
          // 401 狀態碼：表示認證失敗，即舊密碼錯誤
          Swal.fire({
            icon: 'error',
            title: '輸入資料有誤',
            text: error.response.data.message,
          });
          error.oldPassword = '！密碼錯誤';
        } else if (error.response.status === 400) {
          // 400 狀態碼：表示請求資料格式不正確
          Swal.fire({
            icon: 'error',
            title: '輸入資料有誤',
            text: error.response.data.message,
          });
        } else {
          // 其他伺服器錯誤 (例如 500)
          Swal.fire({
            icon: 'error',
            title: '密碼更新失敗',
            text: '伺服器錯誤，請稍後再試。',
          });
          console.error('未預期的伺服器錯誤:', error);
        }
      } else {
        // 沒有伺服器回應，通常是網路問題
        Swal.fire({
          icon: 'error',
          title: '網路錯誤',
          text: '無法連線到伺服器，請檢查您的網路。',
        });
        console.error('網路錯誤:', error);
      }
    } finally {
      isSubmit.value = false;
    }
  };

  const cancelBtnClick = () => {
    if (isSubmit.value) return;
    router.go(-1);
  };
</script>

<template>
  <div class="member__info">
    <form @submit.prevent="savePassword">
      <div class="form__oldpwd">
        <div class="form__group">
          <label for="nowPwd">
            目前的密碼
            <p
              v-if="errors.oldPassword"
              class="error-text"
            >
              {{ errors.oldPassword }}
            </p>
          </label>
          <input
            type="password"
            id="oldPwd"
            ref="firstInput"
            placeholder="請輸入舊密碼"
            :class="{ 'input-error': errors.oldPassword }"
            v-model="oldPassword"
          />
        </div>
      </div>
      <div class="form__newpwd">
        <div class="form__group">
          <label for="newPwd">
            新密碼
            <!-- <p class="form__hint">請輸入6個字元以上的英文字母及數字，不可使用特殊符號</p> -->
            <p
              v-if="errors.newPassword"
              class="error-text"
            >
              {{ errors.newPassword }}
            </p>
          </label>
          <input
            type="password"
            id="newPwd"
            placeholder="請輸入新密碼"
            :class="{ 'input-error': errors.newPassword }"
            v-model="newPassword"
          />
        </div>
        <div class="form__group">
          <label for="checkPwd">
            確認新密碼
            <p
              v-if="errors.checkNewPassword"
              class="error-text"
            >
              {{ errors.checkNewPassword }}
            </p>
          </label>
          <input
            type="password"
            id="checkPwd"
            placeholder="請再次輸入新密碼"
            :class="{ 'input-error': errors.checkNewPassword }"
            v-model="checkNewPassword"
          />
        </div>
      </div>

      <!-- 編輯操作按鈕 -->
      <div class="form__action">
        <CancelButton
          type="button"
          @click="cancelBtnClick"
          :disabled="isSubmit"
        >
          取消修改
        </CancelButton>
        <ConfirmButton
          type="submit"
          :disabled="isSubmit"
        >
          儲存變更
        </ConfirmButton>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .member__info {
    width: 100%;
    background: color(backgroundColor, panel);
    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
    border-radius: 15px;
    padding: 65px 45px;
    position: relative;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(24),
      $color: color(text, dark),
      $ls: 1.8px
    );
    @include rwdmax(1200) {
      @include font-size(20);
    }
    @include rwdmax(768) {
      padding: 30px 25px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 60px;
      .form__hint {
        @include rwdmax(768) {
          @include font-size(14);
        }
      }
      .form__wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 90px;
      }
      @include rwdmax(768) {
        gap: 30px;
      }
    }
    .form__action {
      display: flex;
      justify-content: space-around;
      @include rwdmax(1200) {
        justify-content: space-between;
        gap: 50px;
        --btn-padding: 12px 90px;
      }
      @include rwdmax(768) {
        flex-direction: column;
        gap: 25px;
        --btn-padding: 12px 99px;
      }
    }
  }
  .form__newpwd {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .form__group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    label {
      display: flex;
      align-items: center;
    }
    input {
      background: #fff;
      width: 100%;
      padding: 8px 20px;
      outline: none;
      box-sizing: border-box;
      border-radius: 20px;
      border: 1px solid transparent;
      @include fontSet(
        $font: $basic-font,
        $fw: normal,
        $size: px(24),
        $color: color(text, dark),
        $ls: 1.8px
      );
      @include rwdmax(1200) {
        @include font-size(20);
      }
      &:focus {
        outline: none;
        border-color: color(button, main);
      }
    }
  }
  .error-text {
    color: red;
    @include font-size(18);
    margin-left: px(20);
    height: 1rem;
    @include rwdmax(768) {
      @include font-size(14);
      margin-left: px(15);
    }
    @include rwdmax(560) {
      max-width: px(210);
    }
  }
</style>
