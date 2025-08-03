<script setup>
  // import Icon from '@/components/common/Icon.vue';

  const images = [
    '/src/assets/image/Product/Member-drsire/Member-drsire (1).png',
    '/src/assets/image/Product/Member-drsire/Member-drsire (2).png',
    '/src/assets/image/Product/Member-drsire/Member-drsire (3).png',
    '/src/assets/image/Product/Member-drsire/Member-drsire (4).png',
    '/src/assets/image/Product/Member-drsire/Member-drsire (5).png',
    '/src/assets/image/Product/Member-drsire/Member-drsire (6).png',
    '/src/assets/image/Product/Member-drsire/Member-drsire (7).png',
    '/src/assets/image/Product/Member-drsire/Member-drsire (8).png',
    '/src/assets/image/Product/Member-drsire/Member-drsire (9).png',
  ];

  const titles = [
    '不鏽鋼剁骨刀',
    '雙面刨絲器',
    '橡木砧板',
    '奶油抹刀',
    '雙耳湯鍋 20cm',
    '不鏽鋼調理盆 18cm',
    '主廚小刀 12cm',
    '細口手沖壺 600ml',
    '不鏽鋼瀝水盆',
  ];

  const cards = images.map((src, i) => {
    const safe = new URL(src, import.meta.url).href;
    return {
      id: i + 1,
      img: safe,
      title: titles[i] || `商品 ${i + 1}`,
    };
  });
</script>

<template>
  <section class="wrap">

    <!-- 綠色圓角底框 -->
    <div class="board">
      <div class="card-grid">
        <article
          v-for="p in cards"
          :key="p.id"
          class="card"
        >
          <div class="thumb">
            <img
              :src="p.img"
              :alt="p.title"
              loading="lazy"
            />
          </div>

          <h3
            class="title"
            :title="p.title"
          >
            {{ p.title }}
          </h3>

          <p class="meta">
            <span
              class="heart"
              aria-hidden="true"
            >
              <img src="/src/assets/image/Product/Product-buy/heart.png"></img>
            </span>
            已加入願望清單
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>

  /* 外層容器 */
  .wrap {
    max-width: 1040px;
    margin: 0 auto;
    padding: 24px var(--page-padding-x);
  }
  .page-title {
    font-size: 20px;
    margin-bottom: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
  }

  /*綠色圓角底框 */
  .board {
    transform: scale(0.92);
    transform-origin: top center;
    border: 2px solid var(--board-br);
    padding: 14px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.35),
      0 2px 6px rgba(0, 0, 0, 0.05);
    background-color: #b5c5a8;
    border-radius: 3%;
  }

 
  .card-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .card {
    background: #fff;
    border-radius: 3%;
    padding: 12px;
    border: 1px solid var(--card-br);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
    margin: 10px;
  }

  /*  縮圖容器 */
  .thumb {
    --ratio: 3 / 2;
    aspect-ratio: var(--ratio);
    border-radius: 10px;
    overflow: hidden;
    background: var(--thumb-bg);
  }

  .thumb > img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  @supports not (aspect-ratio: 1 / 1) {
    .thumb {
      position: relative;
      width: 100%;
    }
    .thumb::before {
      content: '';
      display: block;
      padding-top: calc(100% / (3 / 2));
    }
    .thumb > img {
      position: absolute;
      inset: 0;
    }
  }

  .title {
    text-align: center;
    margin: 10px 0 6px;
    font-size: 20px;
    line-height: 1.4;
    white-space: nowrap;
  }

  .meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 18px;
  }
  .heart img{
    width: 20px;
    line-height: 1;
  }

  @media (max-width: 1024px) {
    .card-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (max-width: 840px) {
    .card-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 520px) {
    .card-grid {
      grid-template-columns: 1fr;
    }
    .board {
      padding: 12px;
    }
  }
</style>
