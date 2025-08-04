<script setup>
  import RadioInput from './RadioInput.vue';
  import Icon from '../common/Icon.vue';

  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
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

  function handleUpdate(val) {
    emit('update:modelValue', val);
  }
</script>

<template>
  <div class="payment-option">
    <h3 class="payment-option__title">{{ title }}</h3>
    <RadioInput
      :model-value="modelValue"
      :name="name"
      :options="options"
      @update:model-value="handleUpdate"
    >
      <template #icon>
        <Icon
          icon-name="check"
          class="icon"
        />
      </template>
    </RadioInput>
  </div>
</template>

<style lang="scss" scoped>
  .payment-option {
    padding: px(20) 0 px(30) 0;

    & + & {
      border-top: px(1) solid color(text, dark);
    }

    &__title {
      @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      margin-bottom: px(20);
    }
  }

  .icon {
    @include font-size(30);
    @include posCenter;
    color: white;
  }
</style>
