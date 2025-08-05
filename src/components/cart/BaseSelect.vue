<script setup>
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
  import Icon from '../common/Icon.vue';

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '請選擇',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: null,
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  // 生成唯一 ID
  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

  // 響應式狀態
  const isOpen = ref(false);
  const highlightedIndex = ref(-1);

  // 計算屬性
  const displayText = computed(() => {
    const selectedOption = props.options.find((option) => option.value === props.modelValue);
    return selectedOption ? selectedOption.label : props.placeholder;
  });

  const selectedOptionIndex = computed(() => {
    return props.options.findIndex((option) => option.value === props.modelValue);
  });

  // 方法
  const toggleDropdown = () => {
    if (props.disabled) return;

    if (!isOpen.value) {
      // 關閉其他已打開的選單
      document.querySelectorAll('.base-select--open').forEach((element) => {
        if (element.dataset.selectId !== selectId) {
          element.click(); // 觸發其他選單的關閉
        }
      });
    }

    isOpen.value = !isOpen.value;

    if (isOpen.value) {
      // 打開時高亮當前選中項
      highlightedIndex.value = selectedOptionIndex.value;
    }
  };

  const selectOption = (option) => {
    emit('update:modelValue', option.value);
    emit('change', option.value, option);
    isOpen.value = false;
    highlightedIndex.value = -1;
  };

  const handleBlur = (event) => {
    // 延遲關閉，讓點擊選項有時間執行
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;

    setTimeout(() => {
      if (!currentTarget || !relatedTarget || !currentTarget.contains(relatedTarget)) {
        isOpen.value = false;
        highlightedIndex.value = -1;
      }
    }, 150);
  };

  const handleKeydown = (event) => {
    if (props.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen.value && highlightedIndex.value >= 0) {
          selectOption(props.options[highlightedIndex.value]);
        } else {
          toggleDropdown();
        }
        break;

      case 'Escape':
        event.preventDefault();
        isOpen.value = false;
        highlightedIndex.value = -1;
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen.value) {
          isOpen.value = true;
          highlightedIndex.value = selectedOptionIndex.value >= 0 ? selectedOptionIndex.value : 0;
        } else {
          highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen.value) {
          isOpen.value = true;
          highlightedIndex.value =
            selectedOptionIndex.value >= 0 ? selectedOptionIndex.value : props.options.length - 1;
        } else {
          highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0);
        }
        break;
    }
  };

  // 全域點擊事件處理
  const handleGlobalClick = (event) => {
    const clickedSelect = event.target.closest('.base-select');
    const currentSelect = event.target.closest(`[data-select-id="${selectId}"]`);

    // 如果點擊的不是當前選單且當前選單是打開的，則關閉它
    if (!currentSelect && isOpen.value) {
      isOpen.value = false;
      highlightedIndex.value = -1;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleGlobalClick, true);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleGlobalClick, true);
  });

  // 監聽選項變化，重置高亮
  watch(
    () => props.options,
    () => {
      highlightedIndex.value = -1;
    },
  );
</script>

<template>
  <div
    class="base-select"
    :class="{
      'base-select--open': isOpen,
      'base-select--disabled': disabled,
    }"
    :data-select-id="selectId"
    @click="toggleDropdown"
    @blur="handleBlur"
    tabindex="0"
    @keydown="handleKeydown"
  >
    <!-- 選中顯示區域 -->
    <div class="base-select__display">
      <span class="base-select__text">
        {{ displayText }}
      </span>
      <div class="base-select__arrow">
        <Icon
          icon-name="upA"
          class="base-select__icon"
        />
      </div>
    </div>

    <!-- 下拉選項列表 -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="base-select__dropdown"
        @click.stop
      >
        <div class="base-select__options">
          <div
            v-for="(option, index) in options"
            :key="option.value"
            class="base-select__option"
            :class="{
              'base-select__option--selected': option.value === modelValue,
              'base-select__option--highlighted': index === highlightedIndex,
            }"
            @click="selectOption(option)"
            @mouseenter="highlightedIndex = index"
            @mouseleave="highlightedIndex = -1"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
  .base-select {
    width: 100%;
    position: relative;
    cursor: pointer;
    user-select: none;

    &:focus {
      outline: none;
    }

    &--disabled {
      cursor: not-allowed;
      opacity: 0.6;

      .base-select__display {
        background-color: #f5f5f5;
      }
    }

    &__display {
      @include flex($jc: space-between);
      background-color: white;
      padding: px(20) px(20);
      @include cardBoxShadow;
      border-radius: px(20);
    }

    &__text {
      flex: 1;
      @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

      .base-select--disabled & {
        color: color(search, placeholder);
      }
    }

    &__arrow {
      transition: transform 0.2s ease;

      .base-select--open & {
        transform: rotate(180deg);
      }

      .base-select--disabled & {
        color: color(search, placeholder);
      }
    }

    &__icon {
      @include font-size(30);
    }

    &__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1;
      background-color: white;
      padding: px(20);
      border-radius: px(20) px(20);
      @include cardBoxShadow;
      overflow: hidden;
    }

    &__options {
      max-height: 100px;
      overflow-y: auto;
    }

    &__option {
      padding: px(12) px(20);
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      cursor: pointer;
      border-radius: px(20);

      & + & {
        margin-top: px(10);
      }

      &:hover,
      &--highlighted {
        background-color: color(backgroundColor, panel);
      }

      &--selected {
        background: color(backgroundColor, panel);
        font-weight: 500;

        &:hover,
        &.base-select__option--highlighted {
          opacity: 1;
        }
      }
    }
  }

  // 下拉動畫
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
    transform-origin: top;
  }

  .dropdown-enter-from {
    opacity: 0;
    transform: scaleY(0.8) translateY(-8px);
  }

  .dropdown-leave-to {
    opacity: 0;
    transform: scaleY(0.8) translateY(-8px);
  }

  // 滾動條樣式
  .base-select__options {
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: color(backgroundColor, panel);
      border-radius: 3px;

      &:hover {
        background: color(text, base);
      }
    }
  }
</style>
