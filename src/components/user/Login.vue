<script setup>
  import InputField from '@/components/user/InputField.vue';
  import Icon from '../common/Icon.vue';
  import { ref } from 'vue';

  const account = ref('');
  const password = ref('');

  // const login = () => {
  //   console.log('登入帳號:', account.value);
  //   console.log('登入密碼:', password.value);
  // };
</script>

<template>
  <div class="background">
    <div class="login-box">
      <div id="close">
        <Icon icon-name="remove" id="icon-remove"/>
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
        <button
          type="submit"
          id="btn_login"
        >
          登入
        </button>
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
  </div>
</template>

<style lang="scss" scoped>
  .background {
    color: color(text, dark);
    letter-spacing: 0.1rem;
    background-color: rgba(76, 56, 35, 0.5);
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .login-box {
      // display: none;
      background-color: #fff;
      border-radius: 20px;
      padding: px(30);
      position: relative;
      #close{
        background-color: color(button, main);
        display: inline-block;
        border-radius: 50%;
        padding: px(10);
        color: color(text,light);
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
        font-size: px(30);
      }
      h1 {
        text-align: center;
        // margin-bottom: 10%;
        font-size: px(24);
      }
      form {
        display: inline-block;
        font-size: px(20);
        width: 470px;
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
          height: px(65);
          border-radius: 20px;
          border: none;
          background-color: color(button, main);
          color: color(text, light);
          margin-top: 10%;
          cursor: pointer;
        }
      }
      p {
        font-size: px(20);
        margin-top: px(20);
        margin-bottom: px(20);
      }
      #icon {
        display: flex;
        justify-content: center;
        gap: px(70);
        margin-bottom: 10%;
        #fb {
          color: #125dff;
          font-size: px(60);
        }
        #line {
          color: #0cad37;
          font-size: px(60);
        }
        #google {
          font-size: px(50);
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
</style>
