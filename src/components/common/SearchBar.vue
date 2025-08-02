<script setup>
  import Icon from './Icon.vue';

  const search = () => {
    console.log('搜尋');
  };
</script>

<template>
  <div class="search__bar">
    <input
      type="text"
      placeholder="想找什麼食譜？"
      class="search__input"
    />
    <button
      @click="search"
      class="search__btn"
    >
      <Icon
        icon-name="search"
        class="search__icon"
      />
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .search__bar {
    position: relative;
    width: 490px;
    margin: 0 auto;
    .search__input {
      width: 100%;
      padding: 10px 25px;
      border-radius: 20px;
      border: 1px solid #ccc;
      box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21) inset;
      background: #fff;
      @include fontSet(
        $font: $basic-font,
        $fw: normal,
        $size: px(24),
        $lh: 1,
        $color: color(search, placeholder),
        $ls: 3px
      );
      &:focus {
        outline: none;
        border: 1px solid color(text, dark);
        color: color(text, dark);
      }
    }
    .search__btn {
      position: absolute;
      right: 2%;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
    .search__icon {
      color: color(search, placeholder);
      @include font-size(35);
    }
  }
</style>
