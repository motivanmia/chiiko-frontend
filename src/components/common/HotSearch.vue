<script setup>
  import { ref } from 'vue';

  const hotSearch = ref([
    { keyItem: '芒果冰沙', path: '#' },
    { keyItem: '鳳梨', path: '#' },
    { keyItem: '小黃瓜', path: '#' },
    { keyItem: '甜甜圈', path: '#' },
  ]);
</script>

<template>
  <div class="hot-search">
    <h3>
      熱搜:
      <span>
        <a
          v-for="item in hotSearch"
          :key="item.keyItem"
          :href="item.path"
        >
          {{ item.keyItem }}
        </a>
      </span>
    </h3>
  </div>
</template>

<style lang="scss" scoped>
  .hot-search {
    display: flex;
    padding: 10px;
    font-size: 24px;
    letter-spacing: 1.2px;
    // flex-wrap: nowrap;

    @media screen and (max-width: 768px) {
      font-size: 14px;
    }

    & > h3 {
      color: color(text, dark);

      & > span {
        & > a {
          padding: 0 5px;
          color: color(text, dark);
          text-decoration: underline;
        }
      }
    }
  }
</style>
