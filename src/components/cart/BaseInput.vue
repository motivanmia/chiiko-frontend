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
  });

  const emit = defineEmits(['update:modelValue']);

  const handleInput = (event) => {
    emit('update:modelValue', event.target.value);
  };
</script>

<template>
  <input
    :type="type"
    class="base-input"
    :value="modelValue"
    :placeholder="placeholder"
    :readonly="readonly"
    @input="handleInput"
  />
</template>

<style lang="scss" scoped>
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
  }
</style>
