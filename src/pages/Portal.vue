<script setup></script>

<template>
  <div id="background">
    <a href="#">
      <div id="user">前台</div>
    </a>
    <a href="#">
      <div id="admin">後台</div>
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
    gap: 500px;
    a {
      text-decoration: none;
      #user,
      #admin {
        width: 300px;
        height: 300px;
        background-color: color(text, light);
        border-radius: 50%;
        border: 1px solid color(text, light);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
        text-decoration: none;
        color: color(text, dark);
      }
    }
  }
</style>
