import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

import { Ingredients } from '@/constants/schoolIngredients';

export const useIngredientStore = defineStore('ingredient', () => {
  const list = ref(Ingredients);
  const active = ref(null);

  const updateActive = (target) => {
    active.value = target;
    // console.log(target);
  };

  watch(active, (val) => {
    console.log(val);
    if (val) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  });

  return { list, active, updateActive };
});
