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
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

  const isOpen = ref(false);
  const highlightedIndex = ref(-1);

  const displayText = computed(() => {
    const selectedOption = props.options.find((option) => option.value === props.modelValue);
    return selectedOption ? selectedOption.label : props.placeholder;
  });

  const selectedOptionIndex = computed(() => {
    return props.options.findIndex((option) => option.value === props.modelValue);
  });

  const toggleDropdown = (event) => {
    if (props.disabled) return;
    event?.stopPropagation();
    isOpen.value = !isOpen.value;

    if (isOpen.value) {
      highlightedIndex.value = selectedOptionIndex.value;
    } else {
      highlightedIndex.value = -1;
    }
  };

  const selectOption = (option) => {
    emit('update:modelValue', option.value);
    emit('change', option.value, option);
    isOpen.value = false;
    highlightedIndex.value = -1;
  };

  const handleBlur = (event) => {
    setTimeout(() => {
      const currentTarget = event.currentTarget;
      const relatedTarget = event.relatedTarget;
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
          const opt = props.options[highlightedIndex.value];
          if (opt) selectOption(opt);
        } else {
          toggleDropdown(event);
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

  const handleGlobalClick = (event) => {
    const clickedInside = event.target.closest(`[data-select-id="${selectId}"]`);
    if (!clickedInside && isOpen.value) {
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
        background-color: color(backgroundColor, panel);
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
