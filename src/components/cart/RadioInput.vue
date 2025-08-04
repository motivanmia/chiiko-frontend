<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    modelValue: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  // 如果只有一個資料
  const isSingle = computed(() => props.options.length === 1);
  const singleStyle = computed(() => {
    return { 'is-single': isSingle.value };
  });

  function onChange(val) {
    emit('update:modelValue', val);
  }
</script>

<template>
  <div
    class="radio-input"
    :class="singleStyle"
  >
    <label
      v-for="option in options"
      :key="option.value"
      class="radio-input__option"
      :class="{ selected: modelValue === option.value }"
    >
      <input
        type="radio"
        class="radio-input__input"
        :name="name"
        :value="option.value"
        :checked="modelValue === option.value"
        @change="onChange(option.value)"
      />
      <div class="radio-input__custom">
        <slot
          name="icon"
          v-if="modelValue === option.value"
        ></slot>
      </div>
      <span class="radio-input__label">{{ option.label }}</span>
      <span
        v-if="option.price"
        class="radio-input__price"
      >
        NT$
        <span class="payment-option__price-number">{{ option.price }}</span>
      </span>
    </label>
  </div>
</template>

<style lang="scss" scoped>
  .radio-input {
    @include flex($wrap: wrap);
    gap: px(20) px(40);

    &.is-single {
      width: calc(50% - px(20));
    }

    &__option {
      @include flex($wrap: wrap);
      flex: 1;
      padding: px(20);
      background-color: white;
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.2s ease;
      @include cardBoxShadow;

      &:hover {
        border-color: #d1d5db;
      }

      &.selected {
        border: px(1) solid color(text, dark);
        color: color(text, base);
      }

      &.selected .radio-input__custom {
        background-color: color(text, base);
      }

      &.selected .radio-input__label,
      &.selected .radio-input__price {
        color: color(text, base);
      }
    }

    &__input {
      display: none;
    }

    &__custom {
      position: relative;
      @include flex();
      width: px(40);
      height: px(40);
      background-color: white;
      border: px(1) solid color(text, base);
      border-radius: 50%;
      margin-right: px(35);
      transition: all 0.2s ease;
    }

    &__icon {
      @include font-size(30);
      @include posCenter;
      color: white;
    }

    &__label {
      @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      flex: 1;
    }

    &__price {
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

      &-number {
        @include font-size(24);
      }
    }
  }

  @include rwdmax(768) {
    .radio-input {
      flex-direction: column;

      &.is-single {
        width: 100%;
      }

      &__option {
        width: 100%;
      }
    }
  }
</style>
