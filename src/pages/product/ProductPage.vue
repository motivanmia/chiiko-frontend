<script setup>
  import Icon from '@/components/common/Icon.vue';
  const props = defineProps({
    title: {
      type: String,
      default: '/好物推薦\\',
    },
  });
</script>

<template>
  <icon
  icon-name="product"
  class="search-icon"/>

  <div class="card">
    <div class="card__title">
      <img src="/src/assets/image/Product/pot.png" />
      <div class="card__title-txt">鍋具/鍋鏟</div>
    </div>

    <div class="card__title">
      <img src="/src/assets/image/Product/oven.png" />
      <div class="card__title-txt">烤箱/氣炸鍋</div>
    </div>

    <div class="card__title">
      <img src="/src/assets/image/Product/knife.png" />
      <div class="card__title-txt">刀具/砧板</div>
    </div>

    <div class="card__title">
      <img src="/src/assets/image/Product/life.png" />
      <div class="card__title-txt">廚房小物</div>
    </div>
  </div>

  <div class="search-bar">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="搜尋好物 例：抹布"
      @keyup.enter="handleSearch"
    />
    <button @click="handleSearch"><img src="/src/assets/image/Product/magnifier.png" /></button>
  </div>

  <div class="section-title">
    <samp>/高回購率百元好物\</samp>
  </div>
</template>

<style scoped>
  .search-bar {
    display: flex;
    align-items: center;
    width: 40%;
    height: 40px;
    padding: 0 12px;
    border-radius: 18px;
    border: 1px solid #e5e5e5;
    box-shadow:
      inset 0 2px 4px rgba(0, 0, 0, 0.08),
      inset 0 -1px 2px rgba(0, 0, 0, 0.05);
    margin: 0 auto;
  }

  .search-bar input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #333;
    background: transparent;
  }

  .search-bar input::placeholder {
    color: #999;
    font-size: 14px;
  }

  .search-bar button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .search-bar button img {
    width: 200%;
    height: auto;
    position: relative;
    top: -40%;
    left: -30%;
    opacity: 0.6;
  }

  .card {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    padding: 0 20%;
  }

  .card__title {
    position: relative;
    width: 100%;
    border-radius: 15px;
    overflow: hidden;
    text-align: center;
  }

  .card__title-txt {
    position: relative;
    width: 100%;
    top: -35%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: 16px;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
    z-index: 1;
    cursor: pointer;
  }

  .card__title img {
    position: relative;
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    z-index: 0;
  }

  .section-title {
    display: flex;
    top: 100%;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    font-size: 40px;
    font-weight: bold;
    color: color(text, dark);
    letter-spacing: 0.3em;
    text-shadow: 0 4px 5px rgba(59, 55, 57, 0.4);
  }
</style>
