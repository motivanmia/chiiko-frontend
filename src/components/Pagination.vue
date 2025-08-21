<script setup>
  import { computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Icon from './common/Icon.vue';

  const props = defineProps({
    total: { type: Number, required: true },
    pageSize: { type: Number, default: 10 },
    maxButtons: { type: Number, default: 5 },
    /** 讓父層可用 v-model:page 雙向綁定 */
    page: { type: Number, default: 1 },
  });

  const emit = defineEmits(['update:page', 'change']);

  const router = useRouter();
  const route = useRoute();

  const totalPages = computed(() =>
    Math.max(1, Math.ceil((props.total || 0) / (props.pageSize || 1))),
  );

  function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  }

  const currentPage = computed({
    get() {
      // 以路由優先，沒有就用 props.page
      const fromQuery = Number(route.query.page ?? props.page ?? 1);
      const n = Number.isNaN(fromQuery) ? 1 : fromQuery;
      return clamp(n, 1, totalPages.value);
    },
    set(val) {
      goToPage(val);
    },
  });

  watch(
    () => route.query.page,
    (val) => {
      // URL 被手改時，糾正並同步回 emit
      const n = clamp(Number(val ?? 1), 1, totalPages.value);
      if (String(n) !== String(val ?? '')) goToPage(n);
      else {
        emit('update:page', n);
        emit('change', n);
      }
    },
    { immediate: true },
  );

  const visiblePages = computed(() => {
    const maxBtns = Math.max(1, props.maxButtons || 1);
    const half = Math.floor(maxBtns / 2);
    let start = currentPage.value - (maxBtns % 2 === 0 ? half - 1 : half);
    let end = currentPage.value + half;

    if (start < 1) {
      end += 1 - start;
      start = 1;
    }
    if (end > totalPages.value) {
      start -= end - totalPages.value;
      end = totalPages.value;
    }
    start = Math.max(1, start);

    const pages = [];
    for (let p = start; p <= end && pages.length < maxBtns; p++) pages.push(p);
    return pages;
  });

  function goToPage(p) {
    const page = clamp(p, 1, totalPages.value);
    // 同步到網址
    router.push({ query: { ...route.query, page: String(page) } });
    // 同步到父層
    emit('update:page', page);
    emit('change', page);
  }

  function prev() {
    if (currentPage.value > 1) goToPage(currentPage.value - 1);
  }
  function next() {
    if (currentPage.value < totalPages.value) goToPage(currentPage.value + 1);
  }
</script>

<template>
  <div
    v-if="total > 0"
    class="pagination"
    role="navigation"
    aria-label="Pagination"
  >
    <button
      class="icon-btn"
      :class="{ disabled: currentPage === 1 }"
      :aria-disabled="currentPage === 1"
      @click="prev"
    >
      <Icon
        icon-name="rightA"
        class="right"
      />
    </button>

    <button
      v-for="p in visiblePages"
      :key="p"
      class="pagination-button"
      :class="{ '-on': p === currentPage }"
      @click="goToPage(p)"
      :aria-current="p === currentPage ? 'page' : undefined"
    >
      {{ p }}
    </button>

    <button
      class="icon-btn"
      :class="{ disabled: currentPage === totalPages }"
      :aria-disabled="currentPage === totalPages"
      @click="next"
    >
      <Icon
        icon-name="rightA"
        class="left"
      />
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .pagination {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 8px;
    justify-content: center;
    margin: 100px auto 0;

    .icon-btn {
      background: transparent;
      border: none;
      padding: 0 6px;
      display: grid;
      place-items: center;
      cursor: pointer;
      &.disabled {
        pointer-events: none;
        opacity: 0.4;
      }
    }

    .pagination-button {
      background-color: white;
      width: 50px;
      height: 50px;
      border-radius: 25px;
      border: 1px solid color(button, main);
      cursor: pointer;
      font-size: 20px;
      display: grid;
      place-items: center;
      transition:
        background-color 0.3s ease,
        color 0.3s ease;
      &:hover {
        background-color: color(button, main);
        color: color(text, light);
      }
      &.-on {
        background-color: color(button, main);
        color: color(text, light);
        cursor: default;
      }
    }

    .right {
      transform: rotate(180deg);
      font-size: 40px;
      color: color(button, main);
    }
    .left {
      font-size: 40px;
      color: color(button, main);
    }
  }
</style>
