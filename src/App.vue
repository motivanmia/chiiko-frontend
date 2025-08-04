<script setup>
  import MainFooter from './components/common/MainFooter.vue';
  import MainHeader from './components/common/MainHeader.vue';
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';

  const route = useRoute();
  const mainStyle = computed(() => {
    return { mainContent: route.fullPath !== '/home' };
  });
</script>

<template>
  <template v-if="$route.meta.requiresLayout !== false">
    <MainHeader />
    <main :class="mainStyle">
      <RouterView />
    </main>
    <MainFooter />
  </template>
  <template v-else>
    <router-view />
  </template>

  <!-- <MainHeader />
  <main :class="mainStyle">
    <RouterView />
  </main>
  <MainFooter /> -->
</template>

<style lang="scss" scoped>
  .mainContent {
    margin-top: px(215);
  }
</style>
