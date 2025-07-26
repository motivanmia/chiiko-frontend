<script setup>
  const props = defineProps({
    title: {
      type: String,
      default: '/熱門推薦\\',
    },
  });
</script>

<template>
  <div class="section-title">
    {{ title }}
  </div>
</template>

<style lang="scss" scoped>
  .section-title {
    font-size: 40px;
    font-weight: bold;
    color: color(text, dark);
    letter-spacing: .3em;
    text-shadow:0 4px 5px rgba(59, 55, 57, 0.4);
  }
</style>
