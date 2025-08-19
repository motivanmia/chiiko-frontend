<script setup>
  import BaseInput from './BaseInput.vue';
  const props = defineProps({
    label: {
      type: String,
      required: true,
    },
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

  function handleUpdate(val) {
    emit('update:modelValue', val);
  }
</script>

<template>
  <div class="form-group">
    <label class="form-group__label">{{ label }}</label>
    <p
      v-if="error"
      class="form-group__error"
    >
      {{ error }}
    </p>
    <BaseInput
      :type="type"
      :placeholder="placeholder"
      :readonly="readonly"
      :model-value="modelValue"
      @update:modelValue="handleUpdate"
      @blur="$emit('blur')"
    />
  </div>
</template>

<style lang="scss" scoped>
  .form-group {
    margin-bottom: px(30);
    width: 100%;
    position: relative;

    &__label {
      display: block;
      @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      margin-bottom: px(20);
    }

    &__error {
      position: absolute;
      color: color(text, error);
      transform: translateY(-100%);
      padding-bottom: px(5);
    }
  }
</style>
