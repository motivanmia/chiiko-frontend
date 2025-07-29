<script setup>
  import ShareRecipeButton from '../components/button/ShareRecipeButton.vue';

  import SeeMoreButton from '../components/button/SeeMoreButton.vue';

  import delicious from '../components/Delicious.vue';
  
  import section_title from '../components/SectionTitle.vue';


  

  function ShareRecipe() {
    console.log('前往分享食譜');
  }

  function SeeMore() {
    console.log('查看更多被點擊');
  }
</script>

<template>
  <div>
    <ShareRecipeButton @ShareRecipeButtonclick="ShareRecipe" >
      <template #click-me>點我</template>
      <template #share>分享食譜</template>
      
    </ShareRecipeButton>
  </div>

  <div>
    <SeeMoreButton @seeMoreButtonclick="SeeMore" />
  </div>

  <div>
    <delicious />
  </div>

  <div>
    <section_title />
  </div>
</template>
