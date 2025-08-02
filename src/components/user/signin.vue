<script setup>
  import InputField from '@/components/user/InputField.vue';
  import Icon from '@/components/common/Icon.vue';
  import { ref } from 'vue';
  import tomato from '@/assets/image/footer/03.png';

  const emit = defineEmits(['close']);
  const name = ref('');
  const account = ref(''); // 這是 email，作為登入帳號
  const password = ref('');
  const phone = ref('');
  const passwordConfirm = ref('');
  const agree = ref(false); // 新增同意條款狀態
  const formError = ref('');
  const errorKey = ref(0);

  /////

  const validators = {
    isChinese: (str) => /^[\u4e00-\u9fa5]+$/.test(str),
    isEmail: (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
    isPassword: (str) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(str),
    isPhone: (str) => /^09\d{8}$/.test(str),
  };
  const validations = [
    {
      valid: () => name.value.trim() !== '',
      message: '請輸入姓名',
    },
    {
      valid: () => validators.isChinese(name.value),
      message: '姓名只能是中文',
    },
    {
      valid: () => phone.value.trim() === '' || validators.isPhone(phone.value),
      message: '請輸入正確的手機號碼',
    },
    {
      valid: () => account.value.trim() !== '',
      message: '請輸入電子信箱（Email）',
    },
    {
      valid: () => validators.isEmail(account.value),
      message: '電子信箱格式不正確，請輸入有效的 Email',
    },
    {
      valid: () => password.value.trim() !== '',
      message: '請輸入密碼',
    },
    {
      valid: () => validators.isPassword(password.value),
      message: '密碼需至少6碼，包含英文字母與數字，不能含特殊符號',
    },
    {
      valid: () => passwordConfirm.value.trim() !== '',
      message: '請再次輸入確認密碼',
    },
    {
      valid: () => password.value === passwordConfirm.value,
      message: '兩次密碼輸入不一致',
    },
    {
      valid: () => agree.value,
      message: '請勾選服務條款',
    },
  ];

  function handleSubmit() {
    for (const rule of validations) {
      if (!rule.valid()) {
        formError.value = rule.message;
        errorKey.value++;
        return;
      }
    }

    formError.value = '';

    alert('✅ 註冊成功！');
  }
</script>

<template>
  <div class="background">
    <div class="signin-box">
      <div
        id="close"
        @click="$emit('close')"
      >
        <Icon
          icon-name="remove"
          id="icon-remove"
        />
      </div>
      <div id="app-signin__box">
        <h1>快速註冊</h1>
        <a
          href="#"
          id="google"
          class="app-signin"
        >
          <Icon icon-name="google" />
          <span>Google</span>
        </a>
        <a
          href="#"
          id="fb"
          class="app-signin"
        >
          <Icon icon-name="fb" />
          <span>Facebook</span>
        </a>
        <a
          href="#"
          id="line"
          class="app-signin"
        >
          <Icon icon-name="line" />
          <span>Line</span>
        </a>
        <img
          :src="tomato"
          alt=""
        />
      </div>
      <div>
        <form @submit.prevent="handleSubmit">
          <h1>會員註冊</h1>
          <InputField
            v-model="name"
            label="姓名"
            placeholder="請輸入您的姓名"
            type="text"
            class="account"
          >
            <template #must>
              <span class="must">(必填)</span>
            </template>
          </InputField>
          <InputField
            v-model="phone"
            type="phone"
            label="手機"
            placeholder="請輸入您的手機號碼"
            autocomplete="tel"
          />
          <InputField
            v-model="account"
            label="電子信箱"
            placeholder="請輸入您的電子郵件地址"
          >
            <template #must>
              <span class="must">(必填)</span>
            </template>
          </InputField>

          <InputField
            v-model="password"
            label="密碼"
            type="password"
            placeholder="請輸入您的密碼"
          >
            <template #must>
              <span class="must">(必填)</span>
            </template>
            <template
              #tip
              class="must"
            >
              請輸入6個字元以上的英文字母及數字，不可使用特殊符號
            </template>
          </InputField>

          <InputField
            v-model="passwordConfirm"
            label="確認密碼"
            type="password"
            placeholder="請再次輸入密碼"
          >
            <template #must>
              <span class="must">(必填)</span>
            </template>
          </InputField>
          <div class="checkbox-wrapper">
            <label class="custom-checkbox">
              <input
                type="checkbox"
                v-model="agree"
              />
              <span class="checkbox-style">
                <i>
                  <Icon
                    icon-name="check"
                    class="check-icon"
                  />
                </i>
              </span>
              我同意網站
              <a
                href="#"
                target="_blank"
              >
                服務條款
              </a>
              及
              <a href="#">隱私權政策</a>
            </label>
            <p
              v-if="formError"
              class="error-msg"
              :key="errorKey"
            >
              <Icon
                icon-name="ng"
                class="icon-warning"
              />
              {{ formError }}
            </p>
          </div>
          <button
            type="submit"
            id="btn_signin"
          >
            註冊
          </button>
        </form>
        <div id="login">
          <span>已經有帳號了?</span>
          <a
            href="#"
            class="login"
          >
            點我登入
          </a>
        </div>
      </div>
    </div>
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
    height: 100vh;
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.15em;
    padding: px(50);
    @include rwdmax(768) {
      padding: px(10);
    }
    .signin-box {
      display: flex;
      width: auto;
      background-color: #fff;
      border-radius: 20px;
      padding: 30px;
      position: relative;
      @include rwdmax(768) {
        flex-direction: column;
        margin: 0;
        padding: clamp(18px, 1.56vw, 30px);
        overflow-y: scroll;
        max-height: 95vh;
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
          right: 5px;
          top: 5px;
          transform: none;
          position: absolute;
        }
      }
      h1 {
        text-align: center;
        font-size: clamp(20px, 1.25vw, 24px); //24px
      }
      #app-signin__box {
        border-right: 1px solid #ccc;
        padding-right: px(30);
        margin-right: px(30);
        display: flex;
        flex-direction: column;
        align-items: center;

        @include rwdmax(768) {
          border: none;
          padding: 0;
          margin-bottom: 10%;
          margin-right: 0;
        }
        img {
          width: 300px;
          transform: rotate(-30deg);
          display: block;
          margin: 0 auto;
          @include rwdmax(768) {
            display: none;
          }
        }
      }
      .app-signin:nth-child(2) {
        margin-top: 65px;
        @include rwdmax(768) {
          margin-top: 20px;
        }
      }
      .app-signin {
        display: flex;
        border-radius: px(20);
        box-shadow: 0 2px 5px #aaa;
        padding: px(40);
        height: px(78);
        width: 305px; //305px
        margin-top: px(40);
        text-decoration: none;
        border: 1px solid transparent;

        @include rwdmax(768) {
          width: 70%;
          padding: 10px 20px;
          margin-top: 20px;
          height: 50px;
        }

        span {
          color: color(text, dark);
          font-style: normal;
          font-size: clamp(16px, 2vw, 24px);
          margin-left: px(20);
          letter-spacing: 0.1em;
          @include rwdmax(768) {
            margin-left: px(5);
          }
        }
      }
      .app-signin:hover {
        box-shadow: 0 2px 5px transparent;
        border: 1px solid #ccc;
      }
      #google {
        display: flex;
        align-items: center;
        font-size: px(40);
        @include rwdmax(768) {
          font-size: 30px;
        }
      }
      #fb {
        color: #125dff;
        display: flex;
        align-items: center;
        font-size: px(50);
        @include rwdmax(768) {
          font-size: 40px;
        }
      }
      #line {
        color: #0cad37;
        display: flex;
        align-items: center;
        font-size: px(50);
        @include rwdmax(768) {
          font-size: 40px;
        }
      }
      form {
        font-size: clamp(18px, 1.04vw, 20px);
        #btn_signin {
          font-size: clamp(16px, 1.25vw, 24px);
          width: 100%;
          height: px(65);
          border-radius: 20px;
          border: none;
          background-color: color(button, main);
          color: color(text, light);
          margin-top: px(20);
          cursor: pointer;
        }
      }
      #login {
        margin-top: px(26);
        text-align: center;
      }
      .login {
        color: color(text, dark);
      }
      .login:hover {
        text-decoration: none;
      }
    }
    .custom-checkbox {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      margin-top: px(50);
      font-size: clamp(11px, 1.55vw, 16px);
      @include rwdmax(768) {
        // font-size: clamp(11px,1.8vw,16px);
      }
      a {
        color: color(text, dark);
      }
    }
    .custom-checkbox input[type='checkbox'] {
      display: none;
    }
    .checkbox-style {
      width: clamp(18px, 1.56vw, 30px);
      // height: clamp(18px, 1.56vw, 30px);
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      border: 1px solid #888;
      margin-right: 10px;
      position: relative;
      transition: all 0.2s ease;

      i {
        @include flex;
        // display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: color(text, light);
        display: none;
      }
    }
    /* 勾選後改背景，顯示勾勾 */
    .custom-checkbox input:checked + .checkbox-style {
      background-color: color(button, main);
      border-color: color(button, main);
      i {
        display: flex;
      }
    }
    .icon-warning {
      color: red;
    }
    .error-msg {
      animation: shake 0.4s ease;
      font-size: clamp(11px, 1.55vw, 16px);
    }
    @keyframes shake {
      0% {
        transform: translateX(0);
      }
      20% {
        transform: translateX(-4px);
      }
      40% {
        transform: translateX(4px);
      }
      60% {
        transform: translateX(-4px);
      }
      80% {
        transform: translateX(4px);
      }
      100% {
        transform: translateX(0);
      }
    }
  }
</style>
