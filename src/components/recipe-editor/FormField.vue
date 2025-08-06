<template>
  <div class="form-field">
    <label class="form-label">{{ label }}</label>
    <div class="input-wrapper">
      <slot></slot>
      <span
        v-if="maxLength"
        class="char-counter"
      >
        {{ modelValue.length }} / {{ maxLength }}
      </span>
    </div>
    <p
      v-if="warning"
      class="warning-text"
    >
      {{ warning }}
    </p>
  </div>
</template>
<script setup>
  defineProps({
    label: String,
    modelValue: String,
    maxLength: Number,
    warning: String,
  });
</script>
<style lang="scss" scoped>
  /* 主容器的 bottom margin 將由父層控制 */
  .form-field {
    width: 800px;
    max-width: 100%;
  }
  .form-label {
    display: block;
    /* FIX: 標籤與輸入框的間距為 15px */
    margin-bottom: 15px;
    font-size: 28px;
  }
  .input-wrapper {
    position: relative;
    width: 100%;
  }
  .char-counter {
    position: absolute;
    bottom: 12px;
    right: 20px;
    font-size: 16px;
    color: #888;
    pointer-events: none;
  }
  .warning-text {
    color: #dc2626;
    font-size: 14px;
    margin-top: 4px;
  }
  ::v-deep(input),
  ::v-deep(textarea) {
    width: 100%;
    height: 60px;
    padding: 0.75rem 2.5rem 0.75rem 1.5rem;
    border: none;
    border-radius: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    background-color: white;
    box-sizing: border-box;
  }
  ::v-deep(textarea) {
    height: 135px;
    resize: vertical;
  }
</style>
