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
    error: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue', 'change', 'blur']);

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

  // 處理 focusout 事件，當焦點移出組件外才關閉
  const handleFocusOut = (event) => {
    const currentTarget = event.currentTarget;
    const relatedTarget = event.relatedTarget;
    if (!currentTarget.contains(relatedTarget)) {
      isOpen.value = false;
      highlightedIndex.value = -1;
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
    :class="[
      'base-select',
      {
        'base-select--open': isOpen,
        'base-select--disabled': disabled,
      },
    ]"
    :data-select-id="selectId"
    @click="toggleDropdown"
    @focusout="handleFocusOut"
    tabindex="0"
    @keydown="handleKeydown"
    @blur="$emit('blur')"
  >
    <p
      v-if="error"
      class="base-select__error"
    >
      {{ error }}
    </p>
    <!-- 選中顯示區域 -->
    <div class="base-select__display">
      <span class="base-select__text">
        {{ displayText }}
      </span>
      <div class="base-select__arrow">
        <Icon
          icon-name="downA"
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
            :class="[
              'base-select__option',
              {
                'base-select__option--selected': option.value === modelValue,
                'base-select__option--highlighted': index === highlightedIndex,
              },
            ]"
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

    &__error {
      position: absolute;
      transform: translateY(-100%);
      color: color(text, error);
      padding-bottom: px(5);
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
      max-height: 300px;
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
