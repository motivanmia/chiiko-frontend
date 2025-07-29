<script setup></script>

<template>
  <nav aria-label="breadcrumb">
    <ol>
      <li class="breadcrumb">
        <a href="">靈感 X 食譜</a>
      </li>
      <li class="breadcrumb">
        <a href="">一人料理</a>
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" scoped>
  nav > ol {
    display: flex;
    list-style: none;
    align-items: center;
    justify-content: center; //暫時設定
  }

  .breadcrumb{
    display: flex;


    &::before{
      content: '\\'; //逸出本身所以兩個\\
      margin: 0 5px;
      color: color(text,dark);
    }

      & > a{
        color: color(text,dark);
        letter-spacing: 1.2px;
        padding: 0 5px;
    }
  }
</style>
