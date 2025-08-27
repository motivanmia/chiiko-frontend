<script setup>
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue', 'blur']);

  const handleInput = (event) => {
    emit('update:modelValue', event.target.value);
  };

  const handleBlur = () => {
    emit('blur');
  };
</script>

<template>
  <div class="base-input__container">
    <input
      :type="type"
      class="base-input"
      :value="modelValue"
      :placeholder="placeholder"
      :readonly="readonly"
      @input="handleInput"
      @blur="handleBlur"
    />

    <p
      v-if="error"
      class="base-input__error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
  .base-input__container {
    position: relative;
    width: 100%;
  }

  .base-input {
    width: 100%;
    padding: px(20);
    border-radius: px(20);
    border: unset;
    @include cardBoxShadow;
    @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

    @include rwdmax(768) {
      width: 100%;
    }

    &:focus {
      outline: none;
    }

    &::placeholder {
      @include fontSet($size: px(24), $lh: 1.2, $color: color(search, placeholder), $ls: 0.1em);
    }

    &__error {
      position: absolute;
      top: 0;
      transform: translateY(-100%);
      padding-bottom: px(5);
      color: color(text, error);
    }
  }
</style>
