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
      <div class="close">

      </div>
      <h1>會員登入</h1>
      <form @submit.prevent="login">
        <InputField
          v-model="account"
          label="帳號"
          placeholder="請輸入帳號"
        />
        <InputField
          v-model="password"
          label="密碼"
          type="password"
          placeholder="請輸入密碼"
        />
        <p>忘記密碼?</p>
        <button type="submit">登入</button>
        <p>快速登入</p>
        <div id="icon">
          <Icon 
            icon-name="google" class="google"/>
          <Icon 
          icon-name="fb" class="fb"/>
          <Icon 
          icon-name="line"class="line"/>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .background {
    // display: none;
    background-color: rgba(76, 56, 35, 0.5);
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-box {
    // display: none;
    background-color: #fff;
    border-radius: 20px;
    padding: 10px;
  }
  h1 {
    text-align: center;
    margin-bottom: 15%;
  }
  form {
    display: inline-block;
  }
  button{
    width: 100%;
    border-radius: 20px;
    border: none;
    background-color: color(button,main);
    color:color(text,light)
  }
  .fb{
    color: #125DFF;
    font-size: 23px;
  }
  .line{
    color:#0CAD37;
    font-size: 23px;
  }
  .google{
    font-size: 20px;
  }
</style>
