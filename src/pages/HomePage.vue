<script setup>
  import ShareRecipeButton from '../components/button/ShareRecipeButton.vue';

  import delicious from '../components/Delicious.vue';

  import login from '../components/user/Login.vue';

  import hot from '@/components/home/HomeHot.vue';

  // function ShareRecipe() {
  //   console.log('前往分享食譜');
  // }

  // function SeeMore() {
  //   console.log('查看更多被點擊');
  // }
</script>

<template>
  <hot />

  <ShareRecipeButton
    id="ShareRecipeButton"
    @ShareRecipeButtonclick="ShareRecipe"
  >
    <template #click-me>點我</template>
    <template #share>分享食譜</template>
  </ShareRecipeButton>

  <delicious id="delicious" />
</template>

<style lang="scss" scoped>
  #ShareRecipeButton {
    position: fixed;
    right: 20px;
    bottom: 20px;
    // z-index: 1;
  }
</style>
