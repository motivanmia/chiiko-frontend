<script setup>
  import { Ingredients } from '@/constants/schoolIngredients';
  import { ref } from 'vue';

  const displayCount = ref(24);
</script>

<template>
  <div class="Ingredients">
    <div
      class="Ingredients__card"
      v-for="Ingredient in Ingredients.slice(0, displayCount)"
      :key="Ingredient.id"
    >
      <div class="Ingredients__card-imgbox">
        <img
          :src="Ingredient.img[0]"
          alt=""
        />
      </div>
      <h3>{{ Ingredient.name }}</h3>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .Ingredients {
    max-width: 1200px;
    width: 100%;
    margin: 100px auto;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    row-gap: 40px;

    &__card {
      width: 292px;
      height: 240px;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
      border-radius: 20px;
      position: relative;

      & > h3 {
        display: block;
        width: 200px;
        height: 50px;
        position: absolute;
        background-color: color(button, main);
        left: 50%;
        transform: translate(-50%, 30%);
        text-align: center;
        line-height: 48px;
        border-radius: 20px;
        position: absolute;
        z-index: 1;
        letter-spacing: 1.2px;
        font-size: 24px;
        font-weight: larger;
        white-space: nowrap;
        color: color(text, light);
      }

      &-imgbox {
        width: 180px;
        height: 180px;
        margin: auto;
        margin-top: 20px;

        & > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
</style>
