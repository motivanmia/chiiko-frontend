<script setup>
  import InputField from '@/components/user/InputField.vue';
  import Icon from '@/components/common/Icon.vue';
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
      <h1>忘記密碼</h1>
      <p id="forget__massage">請輸入您的註冊電子郵件或手機號碼，<br>我們將會寄送『重新設定密碼』連結給您進行密碼設定。</p>
      <form>
        <InputField
          v-model="account"
          label="註冊信箱"
          placeholder="請輸入您註冊的電子郵件地址"
          class="account"
        />
        <button id="btn_login">確認送出</button>
      </form>

      <div id="signin">
        <span>返回</span>
        <button
          id="go_signin"
          @click="$emit('switch-to-login')"
        >
          會員登入
        </button>
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
      width: 40%;
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
      #forget__massage {
        font-size: 14px;
        line-height: 1.5em;
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
          margin-top: 50px;
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
        margin-top: 30px;

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
