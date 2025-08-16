<script setup>
  import { onMounted } from 'vue';
  import { useIngredientStore } from '@/stores/ingredient';
  const ingredient = useIngredientStore();
  onMounted(async () => {
    await ingredient.loadIngredients();
    // console.log('pretty:', JSON.stringify(ingredient.list, null, 2));
  });

  import { ref, watch, computed } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const category = ref(route.query.category || '');
  watch(
    () => route.query.category,
    (newVal, oldVal) => {
      category.value = newVal;
    },
  );

  const displayCount = ref(50);

  const vegetableList = computed(() =>
    ingredient.list.filter((item) => item.category === 'vegetables'),
  );
  const meatList = computed(() => ingredient.list.filter((item) => item.category === 'meat'));

  const filteredList = computed(() => {
    if (category.value === 'vegetable') return vegetableList.value;
    if (category.value === 'meat') return meatList.value;
    return ingredient.list;
  });
</script>

<template>
  <div class="Ingredients">
    <div
      class="Ingredients__card"
      v-for="item in filteredList.slice(0, displayCount)"
      :key="item.id"
      @click="ingredient.updateActive(item)"
    >
      <div class="Ingredients__card-imgbox">
        <img
          :src="item.image[0]"
          alt=""
        />
      </div>
      <h3 class="Ingredients__card--name">{{ item.name }}</h3>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .Ingredients {
    max-width: 1200px;
    width: 100%;
    margin: 150px auto 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    row-gap: 100px;
    justify-content: center;
    @include rwdmax(1200) {
      row-gap: 80px;
    }
    @include rwdmax(768) {
      margin-top: 80px;
      row-gap: 50px;
    }

    &__card {
      width: 292px;
      height: 240px;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
      border-radius: 20px;
      position: relative;
      cursor: pointer;
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;
      @include rwdmax(768) {
        width: 173px;
        height: 142px;
      }
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

        .Ingredients__card--name {
          color: color(button, main);
          background-color: color(text, light);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
        }
      }

      & > h3 {
        display: block;
        width: 150px;
        height: 50px;
        position: absolute;
        background-color: color(button, main);
        left: 50%;
        transform: translate(-50%, 30%);
        text-align: center;
        line-height: 48px;
        border-radius: 20px;
        z-index: 1;
        letter-spacing: 1.2px;
        font-size: 24px;
        font-weight: larger;
        white-space: nowrap;
        color: color(text, light);
        box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
        transition: background-color 0.3s ease;
        @include rwdmax(768) {
          width: 130px;
          height: 30px;
          font-size: 16px;
          line-height: 30px;
          bottom: -5%;
        }
      }

      &-imgbox {
        width: 180px;
        height: 180px;
        margin: auto;
        margin-top: 20px;
        @include rwdmax(768) {
          width: 120px;
          height: 120px;
          margin-top: 10px;
        }

        & > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
</style>
