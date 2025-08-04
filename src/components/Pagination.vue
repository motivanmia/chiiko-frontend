<script setup>
  import Icon from './common/Icon.vue';
</script>

<template>
  <div class="pagination">
    <Icon
      icon-name="rightA"
      class="right"
    />
    <button
      v-for="buttons in 5"
      class="pagination-button"
    >
      {{ buttons }}
    </button>
    <!-- 暫時示意 -->

    <Icon
      icon-name="rightA"
      class="left"
    />
  </div>
</template>

<style lang="scss" scoped>
  .pagination {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 5px;
    justify-content: center;
    margin: 100px 0;

    & > button {
      background-color: white;
      width: 50px;
      height: 50px;
      border-radius: 25px;
      border: 1px solid color(button,main);
      cursor: pointer;
      font-size: 20px;
    }

    & > button:hover {
      background-color: color(button, main);
      color: color(text, light);
      transition:
        background-color 0.3s ease,
        color 0.3s ease;
    }

    .right {
      transform: rotate(180deg);
      font-size: 40px;
      color:color(button,main);
      cursor: pointer;
    }
    .left {
      font-size: 40px;
      color:color(button,main);
      cursor: pointer;
    }
  }
</style>
