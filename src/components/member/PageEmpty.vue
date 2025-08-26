<script setup>
  import { defineProps, defineEmits } from 'vue';
  import ConfirmButton from '@/components/button/ConfirmButton.vue';

  const props = defineProps({
    titleText: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'button',
    },
  });
  // 定義一個名為 'confirmClick' 的事件
  const emit = defineEmits(['confirmClick']);

  // 點擊事件處理函式
  const handleButtonClick = () => {
    // 當按鈕被點擊時，發射 'confirmClick' 事件
    emit('confirmClick');
  };
</script>

<template>
  <div class="page-empty">
    <h2 class="page-empty__title">{{ titleText }}</h2>
    <ConfirmButton
      v-if="buttonText"
      :type="props.type"
      class="confirm__btn"
      @click="handleButtonClick"
    >
      {{ buttonText }}
    </ConfirmButton>
  </div>
</template>

<style lang="scss" scoped>
  .page-empty {
    @include flex;
    gap: px(40);
    flex-direction: column;
    text-align: center;
    padding: 50px 0;
    &__title {
      @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
    }
  }
</style>
