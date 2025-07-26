<template>
  <button @click="handleClick">
    <p>點我</p>
    <img :src="label">
    <p>分享料理</p>
  </button>
</template>

<script setup>
import { defineProps } from 'vue'

// 傳入的 props
const props = defineProps({
  label: {
    default: '/src/assets/image/ShareRecipeButton.png'
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<style scoped>
button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
img {
  width: 80px;
  animation: spin 10s linear infinite;
}
p{
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  letter-spacing:.1em;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>