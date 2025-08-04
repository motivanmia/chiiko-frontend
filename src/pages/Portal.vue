<script setup>
</script>

<template>
  <div id="background">
    <a href="/home">
      <img
        src="../assets/image/footer/01.png"
        alt=""
      />
      <span id="user">前台</span>
    </a>
    <a href="#">
      <img
        src="../assets/image/footer/03.png"
        alt=""
        id="tomato"
      />
      <span id="admin">後台</span>
    </a>
  </div>
</template>

<style lang="scss" scoped>
  #background {
    width: 100vw;
    height: 100vh;
    background-color: #d97c48;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30vw;
    padding: auto;
    z-index: 1;
    a {
      text-decoration: none;
      position: relative;
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
        bottom: 100px;
        right: -200px;
      }
      #admin {
        bottom: 150px;
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
    }
    #tomato {
      width: 250px;
      height: 350px;
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
</style>
