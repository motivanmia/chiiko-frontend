<template>
  <!-- <div class="input-wrapper"> -->
  <label
    :for="id"
    class="input-label"
  >
    {{ label }}
  </label>
  <input
    :id="id"
    :type="type"
    :placeholder="placeholder"
    v-model="inputValue"
    class="input-box"
    autocomplete=""
  />
  <!-- </div> -->
</template>

<script setup>
  import { defineProps, defineEmits, watch, ref } from 'vue';

  const props = defineProps({
    modelValue: String,
    label: String,
    placeholder: String,
    type: {
      type: String,
      default: 'email',
    },
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substring(2, 8)}`,
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const inputValue = ref(props.modelValue);

  watch(inputValue, (val) => {
    emit('update:modelValue', val);
  });

  watch(
    () => props.modelValue,
    (val) => {
      inputValue.value = val;
    },
  );
</script>

<style scoped>
  .input-wrapper {
    margin-bottom: 1rem;
  }
  .input-label {
    display: block;
    margin-bottom: 0.5em;
  }
  .input-box {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
  }
</style>
