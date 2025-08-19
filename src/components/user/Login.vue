<script setup>
  import InputField from '@/components/user/InputField.vue';
  import Icon from '@/components/common/Icon.vue';
  import { ref } from 'vue';
  import axios from 'axios';

  const emit = defineEmits(['close', 'login-success']);

  // 假帳號密碼
  // const FAKE_ACCOUNT = ref('');
  // const FAKE_PASSWORD = ref('');
  // const noSuccess = ref(false);

  const account = ref('');
  const password = ref('');
  const formError = ref(''); 

  // 控制 toast 顯示
  // const showSuccess = ref(false);

  const login = async () => {
    formError.value = '';

    const userData = {
      account: account.value,
      password: password.value,
    };

    // 你的後端 login API 網址
    const API_URL = 'http://localhost:8888/front/users/login.php';

    try {
      const response = await axios.post(API_URL, userData);

      // 成功回應 (後端狀態碼 200)
      if (response.status === 200) {
        // alert(response.data.message); // 顯示成功訊息
        emit('login-success'); // 發出成功登入事件
        emit('close'); // 關閉登入視窗
      }
    } catch (error) {
      // 處理錯誤回應
      if (error.response && error.response.data && error.response.data.message) {
        // 顯示後端回傳的錯誤訊息
        formError.value = error.response.data.message;
      } else {
        // 顯示通用錯誤訊息
        formError.value = '登入失敗，請稍後再試。';
      }
    }
  };
</script>

<template>
  <div class="background">
    <div class="login-box">
      <div
        id="close"
        @click="$emit('close')"
      >
        <Icon
          icon-name="remove"
          id="icon-remove"
        />
      </div>
      <h1>會員登入</h1>
      <form @submit.prevent="login">
        <InputField
          v-model="account"
          label="電子信箱"
          placeholder="請輸入您的電子郵件地址"
          class="account"
        />
        <InputField
          v-model="password"
          label="密碼"
          type="password"
          placeholder="請輸入密碼"
        />
        <a
          id="forget-password"
          @click="$emit('switch-to-forgetpsw')"
        >
          忘記密碼
        </a>

        <button id="btn_login">登入</button>
      </form>

      <p>快速登入</p>
      <div id="icon">
        <a
          href="#"
          id="google"
        >
          <Icon icon-name="google" />
        </a>
        <a
          href="#"
          id="fb"
        >
          <Icon icon-name="fb" />
        </a>
        <a
          href="#"
          id="line"
        >
          <Icon icon-name="line" />
        </a>
      </div>
      <div id="signin">
        <span>還沒有帳號嗎?</span>
        <button
          id="go_signin"
          @click="$emit('switch-to-signin')"
        >
          點我註冊
        </button>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="formError"
        class="toast"
      >
      {{ formError }}
        <!-- 帳號或密碼錯誤！ -->
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
  .background {
    z-index: 50;
    color: color(text, dark);
    letter-spacing: 0.1rem;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    width: 100%;
    min-height: 100vh;
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: px(30);
    @include rwdmax(768) {
      padding: px(10);
    }
    .login-box {
      // display: none;
      background-color: #fff;
      border-radius: 20px;
      padding: px(30);
      position: relative;
      // min-width: 280px;
      width: 30%;
      @include rwdmax(1200) {
        width: 40%;
      }
      @include rwdmax(768) {
        width: 95%;
        padding: px(20);
      }
      #close {
        background-color: color(button, main);
        display: inline-block;
        border-radius: 50%;
        padding: px(10);
        color: color(text, light);
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
        font-size: clamp(18px, 1.56vw, 30px); //30px
        cursor: pointer;
        &:hover {
          background-color: #d6b59c;
        }
        @include rwdmax(768) {
          transform: translate(-10%, 10%);
        }
      }
      h1 {
        text-align: center;
        // margin-bottom: 10%;
        font-size: px(24);
        @include rwdmax(768) {
          font-size: px(20);
        }
      }
      form {
        display: inline-block;
        font-size: px(20);
        width: 100%;
        #forget-password {
          display: inline-block;
          border: none;
          background-color: transparent;
          padding: 0;
          color: color(text, dark);
          font-size: px(16);
          margin-top: px(10);
          text-decoration: none;
          position: relative;
          cursor: pointer;

          &::after {
            position: absolute;
            content: '';
            box-shadow: 0 0.5px 0 rgba(59, 55, 57);
            width: 100%;
            height: 1px;
            bottom: -2px;
            left: 0;
            transform: scaleX(1);
            transform-origin: right;
            transition: transform 0.5s ease;
          }
          &:hover::after {
            transform: scaleX(0);
          }
        }
        #btn_login {
          font-size: px(24);
          width: 100%;
          height: 50px;
          border-radius: 20px;
          border: none;
          background-color: color(button, main);
          color: color(text, light);
          margin-top: 10%;
          cursor: pointer;
          &:hover {
            background-color: #d6b59c;
          }
          @include rwdmax(768) {
            font-size: px(20);
          }
        }
      }
      p {
        font-size: clamp(16px, 2vw, 20px);
        margin-top: px(20);
        margin-bottom: px(20);
      }
      #icon {
        display: flex;
        justify-content: center;
        gap: clamp(20px, 10vw, 70px);
        margin-bottom: 10%;
        #fb {
          color: #125dff;
          font-size: clamp(40px, 5vw, 50px);
        }
        #line {
          color: #0cad37;
          font-size: clamp(40px, 5vw, 50px);
        }
        #google {
          font-size: clamp(30px, 4vw, 40px);
          display: flex;
          align-items: center;
        }
      }
      #signin {
        font-size: px(16);
        text-align: center;

        #go_signin {
          color: color(text, dark);
          margin-left: px(20);
          text-decoration: none;
          position: relative;
          display: inline-block;
          background-color: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          letter-spacing: 0.1rem;
          &::after {
            position: absolute;
            content: '';
            box-shadow: 0 0.5px 0 rgba(59, 55, 57);
            width: 100%;
            height: 1px;
            bottom: -2px;
            left: 0;
            transform: scaleX(1);
            transform-origin: right;
            transition: transform 0.5s ease;
          }
          &:hover::after {
            transform: scaleX(0);
          }
        }
      }
    }
  }
  /* 彈窗樣式 */
  .toast {
    position: fixed;
    top: 5vw;
    left: 50%;
    transform: translateX(-50%);
    background: color(text, light);
    color: color(button, main);
    padding: 0.6em 1.2em;
    border-radius: 20px;
    font-size: 20px;
    pointer-events: none;
    z-index: 100;
  }

  /* 淡入淡出動畫 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
</style>
