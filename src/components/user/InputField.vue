<script setup>
  import { defineProps, defineEmits } from 'vue';

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
    autocomplete: {
      type: String,
      default: 'off',
    },
    variant: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:modelValue']);

  function onInput(e) {
    emit('update:modelValue', e.target.value);
  }
</script>

<template>
  <!-- <div class="input-wrapper" :class="[variant === 'signin' ? 'input-signin-style' : '']"> -->
  <div
    class="input-wrapper"
    :class="variant"
  >
    <label
      :for="id"
      class="input-label"
    >
      {{ label }}
    </label>
    <p class="must"><slot name="must"></slot></p>
    <p><slot name="tip"></slot></p>
    <input
      :id="id"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :value="modelValue"
      @input="onInput"
      class="input-box"
    />
  </div>
</template>

<style lang="scss" scoped>
  .input-wrapper {
    letter-spacing: 0.1rem;
    &.signin {
      width: 300px;
      .input-label{
        font-size: 14px;
      }
      .input-box{
        height:35px;
        font-size: 14px;
        @include rwdmax(768){
          height: 50px;
          font-size: 16px;
        }
      }
      p{
        font-size: 12px;
      }
    }
  }
  .input-label {
    display: inline-block;
    margin-bottom: clamp(0em, 0.3vw, 0.5em);
    margin-top: clamp(20px, 0.5vw, 25px);
    font-size: clamp(18px, 1vw, 20px);
  }
  .input-box {
    width: 100%;
    padding-left: clamp(1rem, 1vw, 1.5rem); //1.5rem;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: clamp(16px, 1.04vw, 20px);
    letter-spacing: 0.05rem;
    height: 50px;
    color: color(search, placeholder);
  }
  .must {
    display: inline-block;
    font-size: px(16);
    color: color(search, placeholder);
  }
  p {
    font-size: px(16);
    color: color(search, placeholder);
    margin-bottom: 5px;
  }
</style>
