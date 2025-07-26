<script setup>
  import ShareRecipeButton from '../components/button/ShareRecipeButton.vue';

  import SeeMoreButton from '../components/button/SeeMoreButton.vue';

  function ShareRecipe() {
    console.log('前往分享食譜');
  }

  function SeeMore() {
    console.log('查看更多被點擊');
  }
</script>

<template>
  <div>
    <ShareRecipeButton @ShareRecipeButtonclick="ShareRecipe" />
  </div>

  <div>
    <SeeMoreButton @seeMoreButtonclick="SeeMore" />
  </div>
</template>
