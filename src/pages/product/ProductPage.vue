<script setup>
  import Icon from '@/components/common/Icon.vue';
  const props = defineProps({
    title: {
      type: String,
      default: '/好物推薦\\',
    },
  });
  import { ref } from 'vue';
  const searchQuery = ref('');
</script>

<template>
  <icon
    icon-name="product"
    class="search-icon"
  />

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
  <div class="product-list">
    <div class="product-item">
      <img src="/src/assets/image/Product/product-knife.png" />
      <div class="product-name">不鏽鋼奶油刀</div>
      <div class="product-desc">適用於抹醬、攪拌、刮取</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/product-fish.png" />
      <div class="product-name">魚鱗刮刀</div>
      <div class="product-desc">用於刮除魚鱗</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/product-chopsticks.png" />
      <div class="product-name">日式和風筷架</div>
      <div class="product-desc">好筷架 不用嗎</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/product-pot.png" />
      <div class="product-name">韓式雪平鍋 18cm</div>
      <div class="product-desc">可用電磁爐、熱牛奶、煮醬汁、煮粥</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/product-grind.png" />
      <div class="product-name">刨絲器 / 磨泥器</div>
      <div class="product-desc">用於刨削食材成絲或碎屑</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/product-spoon.png" />
      <div class="product-name">量匙</div>
      <div class="product-desc">用於精準測量少量食材容量</div>
      <div class="product-price">$29</div>
    </div>
  </div>

  <div class="section-title">
    <samp>/嚴選廚具好評推薦\</samp>
  </div>

  <div class="product-list">
    <div class="product-item">
      <img src="/src/assets/image/Product/product-spatula.png" />
      <div class="product-name">不鏽鋼鍋鏟</div>
      <div class="product-desc">用於翻炒食物、盛裝菜餚</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/products-beater.png" />
      <div class="product-name">不鏽鋼打蛋器</div>
      <div class="product-desc">用於攪拌雞蛋、麵糊、醬汁或打發奶油</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/product-spoon2.png" />
      <div class="product-name">湯勺</div>
      <div class="product-desc">用於盛裝湯品、粥類、醬汁或其他液體食物</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/products-stick.png" />
      <div class="product-name">擀麵棍</div>
      <div class="product-desc">用於將麵團、派皮等擀平</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/product-clip.png" />
      <div class="product-name">不鏽鋼夾子</div>
      <div class="product-desc">用於夾取、翻動或移動食物</div>
      <div class="product-price">$29</div>
    </div>

    <div class="product-item">
      <img src="/src/assets/image/Product/product-peel.png" />
      <div class="product-name">削皮器</div>
      <div class="product-desc">用於去除水果和蔬菜的表皮</div>
      <div class="product-price">$29</div>
    </div>
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

  .product-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    padding: 20px 15%;
    justify-content: center;
  }

  .product-item {
    text-align: left;
    font-family: Arial, sans-serif;
  }

  .product-item img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .product-name {
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
  }

  .product-desc {
    font-size: 14px;
    color: #666;
    margin-top: 4px;
  }

  .product-price {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-top: 8px;
  }

  @media (max-width: 768px) {
    .card {
      grid-template-columns: repeat(2, 1fr);
      padding: 0 8px;
      gap: 10px;
      margin-bottom: 20px;
    }

    .card__title {
      border-radius: 12px;
    }

    .card__title-txt {
      font-size: 150%;
      top: -40%;
      letter-spacing: 0.5em;
    }

    .card__title img {
      border-radius: 12px;
    }

    /* 搜尋欄 */
    .search-bar {
      width: 90%;
      margin: 16px auto;
      height: 36px;
      padding: 0 10px;
    }

    .search-bar input {
      font-size: 13px;
    }

    .search-bar input::placeholder {
      font-size: 13px;
    }

    .search-bar button img {
      width: 180%;
      top: -35%;
      left: -40%;
    }

    .section-title {
      font-size: 20px;
      letter-spacing: 0.2em;
      margin: 12px 0;
    }

    .product-list {
      grid-template-columns: repeat(2, 1fr);
      padding: 0 12px 24px;
      gap: 18px;
    }

    .product-item img {
      border-radius: 8px;
    }

    .product-name {
      font-size: 20px;
      margin-top: 6px;
    }

    .product-desc {
      font-size: 20px;
      margin-top: 2px;
    }

    .product-price {
      font-size: 20px;
      margin-top: 4px;
    }
  }
</style>
