<script setup>
  import { onMounted, ref, watch, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Pagination from '@/components/Pagination.vue';
  import { useIngredientStore } from '@/stores/ingredient';

  const ingredient = useIngredientStore();
  const route = useRoute();
  const router = useRouter();

  onMounted(async () => {
    await ingredient.loadIngredients();
  });

  // 讀取類別 query，切換時同步
  const category = ref(route.query.category || '');
  watch(
    () => route.query.category,
    (val) => {
      category.value = val || '';
    },
    { immediate: true },
  );

  // --- 分頁狀態 ---
  const pageSize = 24; // 每頁幾筆
  const page = ref(Number(route.query.page ?? 1) || 1);

  // 類別切換時回到第 1 頁（並同步 URL）
  watch(category, (val) => {
    page.value = 1;
    router.push({ query: { ...route.query, category: val || undefined, page: '1' } });
  });

  // 篩選清單（只顯示 status = 0）
  const vegetableList = computed(() =>
    ingredient.list.filter((item) => item.ingredients_category_id === '1'),
  );
  const meatList = computed(() =>
    ingredient.list.filter((item) => item.ingredients_category_id === '2'),
  );

  const filteredList = computed(() => {
    const base =
      category.value === 'vegetable'
        ? vegetableList.value
        : category.value === 'meat'
          ? meatList.value
          : ingredient.list;
    return base.filter((item) => Number(item.status) === 0);
  });

  // 目前頁面的資料（父層 slice）
  const pagedItems = computed(() => {
    const total = filteredList.value.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    // 保護頁碼不越界（當篩選改變時可能發生）
    if (page.value > totalPages) page.value = totalPages;

    const start = (page.value - 1) * pageSize;
    return filteredList.value.slice(start, start + pageSize);
  });

  // 點擊分頁按鈕時作用
  function onclick(p) {
    setTimeout(() => {
      window.scrollTo({
        top: 780,
        behavior: 'smooth',
      });
    }, 0);
  }
</script>

<template>
  <div class="Ingredients">
    <div
      class="Ingredients__card"
      v-for="item in pagedItems"
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

  <Pagination
    v-model:page="page"
    :total="filteredList.length"
    :page-size="pageSize"
    :max-buttons="5"
    @click="onclick"
  />
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
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
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
          color: color(text, light);
          background-color: color(button, main);
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
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
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
        margin: 20px auto 0;
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
