<script setup>
  import MainFooter from './components/common/MainFooter.vue';
  import MainHeader from './components/common/MainHeader.vue';
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';

  const route = useRoute();
  const mainStyle = computed(() => {
    return { mainContent: route.fullPath !== '/' };
  });
</script>

<template>
  <MainHeader />
  <main
    :class="mainStyle"
    class="mainBottom"
  >
    <RouterView />
  </main>
  <MainFooter />
</template>

<style lang="scss" scoped>
  .mainContent {
    margin-top: px(215);
    @include rwdmax(1440) {
      margin-top: px(150);
    }
    @include rwdmax(1200) {
      margin-top: px(120);
    }
  }
  .mainBottom {
    margin-bottom: px(200);
    @include rwdmax(1440) {
      margin-bottom: px(150);
    }
    @include rwdmax(1200) {
      margin-bottom: px(120);
    }
  }
</style>
