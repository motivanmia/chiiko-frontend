<script setup>
  import MainFooter from './components/common/MainFooter.vue';
  import MainHeader from './components/common/MainHeader.vue';
</script>

<template>
  <MainHeader />
  <main>
    <RouterView />
  </main>
  <MainFooter />
</template>

<style scoped></style>
