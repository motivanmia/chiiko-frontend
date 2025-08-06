<script setup>
  import { RouterLink } from 'vue-router';
</script>

<template>
  <div id="background">
    <div id="main">
      <RouterLink
        to="/home"
        class="link"
      >
        <img
          src="../assets/image/footer/01.png"
          alt=""
        />
        <span id="user">前台</span>
      </RouterLink>
      <RouterLink
        to="#"
        class="link"
      >
        <img
          src="../assets/image/footer/03.png"
          alt=""
          id="tomato"
        />
        <span id="admin">後台</span>
      </RouterLink>
    </div>
    <div class="main-footer__copyright">
      本網站為緯育TibaMe前端設計工程師班第 92 期學員專題成果作品，本平台僅供學習、展示之用。
      <br />
      若有抵觸有關著作權,或有第三人主張侵害智慧財產權等情事,均由學員負法律上責任,緯育公司概不負責。
      <br />
      若有侵權疑慮,您可以私訊
      <a
        href="https://www.facebook.com/TibaMe"
        class="tibame__link"
      >
        緯育TibaMe
      </a>
      , 後續會由專人協助處理。
      <br />
      © 2025 Chiiko. All rights reserved.
    </div>
  </div>
</template>

<style lang="scss" scoped>
  #background {
    width: 100%;
    min-height: 100vh;
    background-color: #d97c48;
    z-index: 1;
    display: flex;
    flex-direction: column;
    text-align: center;
    #main {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15vw;
      margin: auto;
      @include rwdmax(768) {
        flex-direction: column;
        gap: 0;
      }
    }
    .link {
      text-decoration: none;
      position: relative;
      display: flex;
      #user,
      #admin {
        width: 100px;
        height: 100px;
        background-color: color(text, light);
        border-radius: 60% 50% 55% 45% / 45% 55% 40% 60%;
        border: 1px solid color(text, light);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
        font-weight: bold;
        text-decoration: none;
        color: color(text, dark);
        position: relative;
        bottom: -150px;
        left: -60px;
        @include rwdmax(768) {
          bottom: -120px;
        }
      }
      #admin {
        bottom: -200px;
        left: -60px;
        @include rwdmax(768) {
          bottom: -150px;
        }
      }
    }
    @keyframes Up {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-30px);
        animation-timing-function: ease-in;
      }
      100% {
        transform: translateY(0);
      }
    }
    img {
      width: 250px;
      height: 250px;
      display: inline-block;
      transition: transform 0.8s;
      @include rwdmax(768) {
        width: 200px;
        height: 200px;
      }
    }
    #tomato {
      width: 250px;
      height: 350px;
      @include rwdmax(768) {
        width: 200px;
        height: 280px;
      }
    }
    a:hover {
      img {
        animation: Up 1s ease infinite;
      }
      #user,
      #admin {
        background-color: #d6b59c;
        color: color(text, light);
      }
    }
  }
  .main-footer__copyright {
    margin-bottom: 20px;
    text-align: center;
    color: color(text, dark);
    padding-inline: 10px;
    .tibame__link {
      color: color(text, dark);
    }
    @include rwdmax(768) {
      @include font-size(12);
    }
  }
</style>
