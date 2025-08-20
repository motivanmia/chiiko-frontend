<script setup>
  import { defineProps } from 'vue';
  import { RouterLink } from 'vue-router';

  defineProps({
    items: {
      type: Array,
      required: false, // 修正：如果設定 default，required 應為 false
      default: () => [],
    },
  });
</script>

<template>
  <nav aria-label="breadcrumb">
    <ol>
      <li
        v-for="(item, index) in items"
        :key="index"
        class="breadcrumb"
      >
        <RouterLink :to="item.to">{{ item.text }}</RouterLink>
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" scoped>
  nav {
    width: 100%;
    // height: auto;
    // display: flex;
    // margin: auto;
    // flex-direction: column;

    margin-bottom: 30px;
  }

  nav > ol {
    display: flex;
    list-style: none;
    align-items: center;
    justify-content: flex-start; //暫時設定
    // padding-left: 22px;
    padding: 0;
    margin: 0;
  }

  .breadcrumb {
    display: flex;
    align-items: center;

    &::before {
      content: '\\'; //逸出本身所以兩個\\
      margin: 0 10px;
      color: color(text, dark);
    }

    & > a {
      color: color(text, dark);
      letter-spacing: 1.2px;
      padding: 0 5px;

      &:hover {
        text-decoration: none;
      }
    }
    // .breadcrumb:last-child > a {
    //   cursor: default;
    //   text-decoration: none;
    // }
  }
</style>
