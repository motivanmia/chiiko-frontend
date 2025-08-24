<script setup>
  import Icon from './Icon.vue';
  import { defineProps, defineEmits, ref, watch } from 'vue';

  // 使用 defineProps 接收來自父元件的屬性
  const props = defineProps({
    placeholder: {
      type: String,
      default: '想找什麼食譜？',
    },
    modelValue: {
      type: String,
      default: '',
    },
  });

  const emits = defineEmits(['update:modelValue', 'search']);

  const inputValue = ref(props.modelValue);

  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== inputValue.value) {
        inputValue.value = newValue;
      }
    },
    { immediate: true },
  );

  watch(inputValue, (newValue) => {
    emits('update:modelValue', newValue);
  });
  
  const search = () => {
    console.log('Searching for:', inputValue.value);
    emits('search', inputValue.value);
  };

  //  Enter鍵事件
  const handleKeyup = (event) => {
    if (event.key === 'Enter') {
      search();
    }
  };
</script>

<template>
  <div class="search__bar">
    <input
      type="text"
      v-model="inputValue"
      :placeholder="props.placeholder"
      @keyup="handleKeyup"
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
    padding: 10px;
    @include rwdmax(1440) {
      width: 400px;
    }
    @include rwdmax(768) {
      width: 330px;
    }
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
      @include rwdmax(1440) {
        @include font-size(18);
        padding: 8px 20px;
      }
      @include rwdmax(768) {
        @include font-size(16);
      }
    }
    .search__btn {
      position: absolute;
      right: 2%;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
    }
    .search__icon {
      color: color(search, placeholder);
      @include font-size(35);
      @include rwdmax(1440) {
        @include font-size(30);
      }
      @include rwdmax(768) {
        @include font-size(28);
      }
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
</style>
