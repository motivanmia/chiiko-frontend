<script setup>
  import ShareRecipeButton from '@/assets/image/ShareRecipeButton.png';

  const emit = defineEmits(['ShareRecipeButtonclick']);

  function handleClick() {
    emit('ShareRecipeButtonclick');
  }
</script>

<template>
  <div>
    <button @click="handleClick">
      <p><slot name="click-me"></slot></p>
      <div id="circle-wrapper">
        <img :src="ShareRecipeButton" />
      </div>
      <p><slot name="share"></slot></p>
    </button>
  </div>
</template>

<style lang="scss" scoped>
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    transform: scale(1.3);
    position: absolute;
    right: 30px;
    bottom: 20px;
    @include rwdmax(768) {
      transform: scale(1);
      right: 0;
      bottom: 0;
    }
  }
  #circle-wrapper{
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  animation: spin 10s linear infinite;
  }
  #circle-wrapper img {
    width: 100%;
    object-fit: cover;
    display: block;
    // animation: spin 10s linear infinite;
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
