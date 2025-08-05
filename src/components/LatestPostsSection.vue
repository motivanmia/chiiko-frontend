<template>
  <div class="page-container">
    <header class="page-header">
      <h1>/最新投稿\</h1>
    </header>
    <Carousel />
  </div>
</template>

<script setup>
  import Carousel from '@/components/Carousel.vue';
</script>

<style scoped>
  .page-container {
    background-color: #f8f9fa;
    display: flex;
    flex-direction: column;
    gap: 50px;
  }

  .page-header {
    text-align: center;
    padding-top: 80px;
    padding-bottom: 100px;
    color: #333;
    font-weight: 600;
  }

  .page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .page-header p {
    font-size: 1.1rem;
    color: #6c757d;
  }

  .other-content {
    text-align: center;
    padding-bottom: 80px;
    color: #888;
  }
</style>
