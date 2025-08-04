<script setup>
  import ShareRecipeButton from '@/assets/image/ShareRecipeButton.png'
  // 傳入的 props

  const emit = defineEmits(['ShareRecipeButtonclick']);

  function handleClick() {
    emit('ShareRecipeButtonclick');
  }
</script>

<template>
  <div>
  <button @click="handleClick">
    <p><slot name="click-me"></slot></p>
    <img :src="ShareRecipeButton" />
    <p><slot name="share"></slot></p>
  </button>
  </div>
</template>

<style lang="scss" scoped>
// div{
//   position: relative;
//   margin-top: 100vh;
//   display: block;
// }
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    transform: scale(1.3);
    position: absolute;
    right: 30px;
    bottom: 0;
  }
  img {
    width: 80px;
    animation: spin 10s linear infinite;
  }
  p {
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    letter-spacing: 0.1em;
    color: color(text, dark);
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
