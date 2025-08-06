<template>
  <div class="form-section tag-input-component">
    <div class="form-section">
      <div class="title-group">
        <label class="form-label">食譜標籤</label>
        <span class="helper-text">最多可新增3個標籤</span>
      </div>
      <div class="input-wrapper">
        <div class="tag-container">
          <span
            v-for="(tag, index) in tags"
            :key="index"
            class="tag-item"
          >
            #{{ tag }}
          </span>
          <input
            v-model="newTag"
            @keydown.enter.prevent="addTag"
            @keydown.backspace="handleBackspace"
            placeholder="按下 Enter 新增標籤，每個標籤限6字"
            class="tag-input"
            maxlength="6"
          />
        </div>
        <span class="char-counter">{{ newTag.length }} / 6</span>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, watch } from 'vue';
  const props = defineProps({ modelValue: Array });
  const emit = defineEmits(['update:modelValue']);
  const newTag = ref('');
  const tags = ref(props.modelValue);
  watch(
    () => props.modelValue,
    (newValue) => {
      tags.value = newValue;
    },
  );
  const addTag = () => {
    const tag = newTag.value.trim();
    if (tags.value.length >= 3) {
      alert('最多只能輸入 3 個標籤喔～');
      return;
    }
    if (tag && !tags.value.includes(tag)) {
      const newTags = [...tags.value, tag];
      emit('update:modelValue', newTags);
      newTag.value = '';
    }
  };
  const handleBackspace = () => {
    if (newTag.value === '' && tags.value.length > 0) {
      const newTags = tags.value.slice(0, -1);
      emit('update:modelValue', newTags);
    }
  };
</script>
<style lang="scss" scoped>
  .form-section {
    width: 800px;
    margin: 0 auto 45px;
  }
  .title-group {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 10px;
  }
  .form-label {
    font-size: 28px;
  }
  .helper-text {
    font-size: 20px;
    color: #828282;
  }
  .input-wrapper {
    position: relative;
  }
  .tag-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-height: 60px;
    padding: 0.75rem 1.5rem;
    border-radius: 20px;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  }
  .tag-item {
    background-color: #eee;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .tag-input {
    flex-grow: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 20px;
  }
  .char-counter {
    position: absolute;
    bottom: 12px;
    right: 20px;
    color: #888;
  }
</style>
