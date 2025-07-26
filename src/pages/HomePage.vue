<script setup>
import ShareRecipeButton from '../components/button/ShareRecipeButton.vue'

function ShareRecipe() {
  alert('前往分享食譜')
}</script>

<template>

  <div>
    <ShareRecipeButton @click="ShareRecipe" />
  </div>
</template>
