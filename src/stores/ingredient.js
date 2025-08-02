import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import { Ingredients } from '@/constants/schoolIngredients';

export const useIngredientStore = defineStore('ingredient', () => {
  const list = ref(Ingredients);
  const active = ref(null);

  const updateActive = (target) => {
    active.value = target;
    // console.log(target);
  };
  return { list, active, updateActive };
});
