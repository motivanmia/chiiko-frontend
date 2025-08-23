<script setup>
  import { defineEmits, ref, onMounted } from 'vue';
  import axios from 'axios';

  const emits = defineEmits(['search']);

  const hotSearches = ref([]);

  const handleHotSearchClick = (keyword) => {
    console.log('HotSearch: 點擊熱搜關鍵字', keyword);
    emits('search', keyword);
  };

  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:8888/front/recipe/get_hot_searches.php');
      if (response.data.success) {
        hotSearches.value = response.data.data;
      } else {
        console.error('Failed to fetch hot search:', response.data.message);
      }
    } catch (error) {
      console.error('Failed to fetch hot search:', error);
    }
  });
</script>

<template>
  <div class="hot-search">
    <h3>
      熱搜:
      <span>
        <a
          v-for="item in hotSearches"
          :key="item.recipe_id"
          @click.prevent="handleHotSearchClick(item.name)"
          class="hot-search__item"
        >
          {{ item.name }}
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

    text-shadow: var(--hot-search-text-shadow, none);
    @media screen and (max-width: 1440px) {
      font-size: 18px;
    }
    @media screen and (max-width: 768px) {
      font-size: 14px;
    }

    & > h3 {
      color: var(--hot-search-color, color(text, dark));

      & > span {
        & > a {
          padding: 0 5px;
          color: var(--hot-search-color, color(text, dark));
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
</style>
