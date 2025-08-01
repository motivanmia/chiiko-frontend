<script setup>
  import Icon from '../common/Icon.vue';
  import { ref } from 'vue';

  const stats = ref([
    { label: '發布食譜', count: 3 },
    { label: '食譜收藏', count: 3 },
    { label: '願望清單', count: 3 },
  ]);

  const addRecipe = () => {
    console.log('新增食譜');
  };
</script>

<template>
  <div class="dashboard">
    <div class="stats">
      <div
        v-for="item in stats"
        :key="stats.label"
        class="stats__item"
      >
        <p class="stats__label">{{ item.label }}</p>
        <p class="stats__count">{{ item.count }}</p>
      </div>
    </div>

    <button
      class="add__recipe"
      @click="addRecipe"
    >
      <Icon
        icon-name="plus"
        class="add__icon"
      />
      新增食譜
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .dashboard {
    background: #fff;
    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
    border-radius: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 887px;
    padding: 20px 30px;
    @include fontSet($font: $basic-font, $fw: normal, $color: color(text, dark), $ls: 1.8px);
  }
  .stats {
    display: flex;
    gap: 65px;
    margin: auto 150px;
    .stats__item {
      display: flex;
      flex-direction: column;
      gap: 15px;
      text-align: center;
    }
    .stats__label {
      @include font-size(18);
    }
    .stats__count {
      @include font-size(24);
    }
  }
  .add__recipe {
    padding: 7px 20px;
    background-color: color(button, main);
    border: none;
    border-radius: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(20),
      $color: color(text, light),
      $ls: 1.8px
    );
    .add__icon {
      @include font-size(25);
    }
  }
  .add__recipe:hover {
    background-color: color(orangeColor, base);
    transition: 0.2s ease;
  }
</style>
