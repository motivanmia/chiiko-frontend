<script setup>
  import InputField from '@/components/user/InputField.vue';
  import Icon from '@/components/common/Icon.vue';
  import { ref } from 'vue';

  const emit = defineEmits(['close', 'login-success']);

  // 假帳號密碼
  const FAKE_ACCOUNT = 'test123@1.1';
  const FAKE_PASSWORD = 'test123';

  const account = ref('');
  const password = ref('');

  // 控制 toast 顯示
  // const showSuccess = ref(false);

  const noSuccess = ref(false);

  // 範例 login 函式：驗證是否與假帳密吻合
  const login = () => {
    if (account.value === FAKE_ACCOUNT && password.value === FAKE_PASSWORD) {
      emit('login-success');
      emit('close');
    } else {
      noSuccess.value = true;
      setTimeout(() => {
        noSuccess.value = false;
      }, 1000);
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
          href="#"
          id="forget-password"
        >
          忘記密碼?
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
        <a href="#">點我註冊</a>
      </div>
    </div>
    <transition name="fade">
      <div
        v-if="noSuccess"
        class="toast"
      >
        帳號或密碼錯誤！
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
          display: block;
          border: none;
          background-color: transparent;
          padding: 0;
          color: color(text, dark);
          font-size: px(16);
          margin-top: px(10);
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
        a {
          color: color(text, dark);
          margin-left: px(20);
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
