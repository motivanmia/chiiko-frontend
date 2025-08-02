<script setup>
  import { ref } from 'vue';
  import SearchBar from '@/components/common/SearchBar.vue';

  import ShareRecipeButton from '../components/button/ShareRecipeButton.vue';

  import delicious from '../components/Delicious.vue';

  // import section_title from '../components/SectionTitle.vue';

  const hotSearch = ref([
    { keyitem: '芒果冰沙', path: '#' },
    { keyitem: '鳳梨', path: '#' },
    { keyitem: '小黃瓜', path: '#' },
    { keyitem: '甜甜圈', path: '#' },
  ]);

  // import login from '../components/user/Login.vue';

  import hot from '@/components/home/HomeHot.vue';

  // function ShareRecipe() {
  //   console.log('前往分享食譜');
  // }

  // function SeeMore() {
  //   console.log('查看更多被點擊');
  // }
</script>

<template>
  <div class="banner__container">
    <img
      src="../assets/image/Home/banner.jpg"
      alt="homebanner"
    />

    <div class="search__section">
      <SearchBar />
      <div class="search__hot">
        熱搜：
        <span>
          <a
            v-for="item in hotSearch"
            :key="hotSearch.keyitem"
            :href="item.path"
          >
            {{ item.keyitem }}
          </a>
        </span>
      </div>
    </div>

    <div class="scoll-down">向下捲動</div>
  </div>
  <hot />

  <ShareRecipeButton
    id="ShareRecipeButton"
    @ShareRecipeButtonclick="ShareRecipe"
  >
    <template #click-me>點我</template>
    <template #share>分享食譜</template>
  </ShareRecipeButton>

  <delicious id="delicious" />
</template>

<style lang="scss" scoped>
  .banner__container {
    height: 950px;
    overflow: hidden;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      object-fit: cover;
      z-index: -2;
    }
  }
  .scoll-down {
    position: absolute;
    bottom: -110px;
    left: 50%;
    transform: translateX(-50%);
    width: 420px;
    height: 160px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: start;
    padding-top: 18px;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(20),
      $color: color(text, base),
      $ls: 1.5px
    );
  }
  .search__section {
    position: absolute;
    text-align: center;
    top: 50%;
    right: 15%;
  }
  .search__hot {
    margin-top: 25px;
    text-shadow: 0 4px 4px rgba(0, 0, 0, 0.59);
    display: flex;
    @include fontSet($font: $basic-font, $fw: normal, $size: px(24), $color: #fff, $ls: 2px);
    span {
      display: flex;
      gap: 15px;
    }
    a {
      color: #fff;
    }
    #ShareRecipeButton {
      position: fixed;
      right: 20px;
      bottom: 20px;
      // z-index: 1;
    }
  }
</style>
