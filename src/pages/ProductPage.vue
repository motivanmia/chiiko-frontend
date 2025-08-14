<script setup>
  // import Icon from '@/components/common/Icon.vue';
  import Banner from '@/components/recipe/Banner.vue';
  import SearchBar from '@/components/common/SearchBar.vue';

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
  <Banner
    title="好物精選"
    img="/src/assets/image/Product/banner.png"
  />
  <!-- <icon
    icon-name="product"
    class="search-icon"
  /> -->

  <div class="card">
    <div class="card">
      <div class="card__title">
        <img
          class="normal"
          src="/src/assets/image/Product/pot.png"
        />
        <img
          class="hover"
          src="/src/assets/image/Product/pot1.png"
        />
        <div class="card__title-txt">鍋具/鍋鏟</div>
      </div>

      <div class="card__title">
        <img
          class="normal"
          src="/src/assets/image/Product/oven.png"
        />
        <img
          class="hover"
          src="/src/assets/image/Product/oven1.png"
        />
        <div class="card__title-txt">烤箱/氣炸鍋</div>
      </div>

      <div class="card__title">
        <img
          class="normal"
          src="/src/assets/image/Product/knife.png"
        />
        <img
          class="hover"
          src="/src/assets/image/Product/knife1.png"
        />
        <div class="card__title-txt">刀具/砧板</div>
      </div>

      <div class="card__title">
        <img
          class="normal"
          src="/src/assets/image/Product/life.png"
        />
        <img
          class="hover"
          src="/src/assets/image/Product/life1.png"
        />
        <div class="card__title-txt">廚房小物</div>
      </div>
    </div>
  </div>
  <div class="SearchBar"><SearchBar placeholder="搜尋好物 例：抹布"></SearchBar></div>

  <div class="section-title">
    <samp>/高回購率百元好物\</samp>
  </div>
  <div class="product-list">
    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-knife.png" />
      <div class="product-name">不鏽鋼奶油刀</div>
      <div class="product-desc">適用於抹醬、攪拌、刮取</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-fish.png" />
      <div class="product-name">魚鱗刮刀</div>
      <div class="product-desc">用於刮除魚鱗</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-chopsticks.png" />
      <div class="product-name">日式和風筷架</div>
      <div class="product-desc">好筷架 不用嗎</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-pot.png" />
      <div class="product-name">韓式雪平鍋 18cm</div>
      <div class="product-desc">可用電磁爐、熱牛奶、煮醬汁、煮粥</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-grind.png" />
      <div class="product-name">刨絲器 / 磨泥器</div>
      <div class="product-desc">用於刨削食材成絲或碎屑</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-spoon.png" />
      <div class="product-name">量匙</div>
      <div class="product-desc">用於精準測量少量食材容量</div>
      <div class="product-price">$29</div>
    </RouterLink>
  </div>

  <div class="section-title">
    <samp>/嚴選廚具好評推薦\</samp>
  </div>

  <div class="product-list">
    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-spatula.png" />
      <div class="product-name">不鏽鋼鍋鏟</div>
      <div class="product-desc">用於翻炒食物、盛裝菜餚</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/products-beater.png" />
      <div class="product-name">不鏽鋼打蛋器</div>
      <div class="product-desc">用於攪拌雞蛋、麵糊、醬汁或打發奶油</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-spoon2.png" />
      <div class="product-name">湯勺</div>
      <div class="product-desc">用於盛裝湯品、粥類、醬汁或其他液體食物</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/products-stick.png" />
      <div class="product-name">擀麵棍</div>
      <div class="product-desc">用於將麵團、派皮等擀平</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-clip.png" />
      <div class="product-name">不鏽鋼夾子</div>
      <div class="product-desc">用於夾取、翻動或移動食物</div>
      <div class="product-price">$29</div>
    </RouterLink>

    <RouterLink
      to="/product-detail"
      class="product-item"
    >
      <img src="/src/assets/image/Product/product-peel.png" />
      <div class="product-name">削皮器</div>
      <div class="product-desc">用於去除水果和蔬菜的表皮</div>
      <div class="product-price">$29</div>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
  .product-item img {
    transition: transform 0.3s ease;
  }
  .product-item img:hover {
    transform: translateY(-10px);
  }
  .SearchBar {
    margin-top: 80px;
    margin-bottom: 80px;
  }
  .card {
    width: 1200px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 0 auto;
    cursor: pointer;
  }
  .card__title .hover {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.4s ease; // 加上過渡
  }
  .card__title {
    top: 30px;
    position: relative;
    width: 100%;
    border-radius: 15px;
    overflow: hidden;
    text-align: center;
    letter-spacing: 0.2em;
  }

  .card__title {
    position: relative;
    overflow: hidden;
    border-radius: 15px;
    text-align: center;

    img {
      width: 100%;
      display: block;
      transition: opacity 1s ease;
    }

    .hover {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }

    &:hover .hover {
      opacity: 1;
    }

    &:hover .normal {
      opacity: 0;
    }

    .card__title-txt {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
      font-size: 24px;
      text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
      z-index: 1;
      pointer-events: none;
    }
  }

  .card__title-txt {
    position: relative;
    width: 100%;
    top: -35%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: 24px;
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
    transition: opacity 0.4s ease;
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
    margin-bottom: 80px;
  }

  .product-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 70px 24px;
    width: 1200px;
    margin: 80px auto 80px;
    justify-content: center;
  }

  .product-item {
    text-align: left;
    font-family: Arial, sans-serif;
    text-decoration: none;
    color: inherit;
  }

  .product-item img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .product-name {
    margin-top: 28px;
    font-size: 30px;
    color: color(text, dark);
    font-weight: bold;
    letter-spacing: 0.2em;
  }

  .product-desc {
    font-size: 16px;
    color: color(text, base);
    margin-top: 4px;
    letter-spacing: 0.2em;
    margin-top: 10px;
  }

  .product-price {
    letter-spacing: 0.2em;
    margin-top: 10px;
    font-size: 30px;
    font-weight: bold;
    color: color(text, dark);
    margin-top: 8px;
  }

  @media (max-width: 880px) {
    .section-title {
      font-size: 24px;
    }
    .product-name {
      font-size: 18px;
    }
    .product-desc {
      font-size: 14px;
    }
    .product-price {
      font-size: 18px;
    }

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
