<script setup>
  import { ref } from 'vue';
  import { useSearch } from '@/constants/search';


  import SearchBar from '@/components/common/SearchBar.vue';
  import ShareRecipeButton from '@/components/button/ShareRecipeButton.vue';
  import delicious from '@/components/Delicious.vue';
  import section_title from '@/components/SectionTitle.vue';
  import login from '@/components/user/Login.vue';
  import hot from '@/components/home/HomeHot.vue';
  import IndexRecipeOverview from '@/components/home/IndexRecipeOverview.vue';
  import { useRouter } from 'vue-router';
  import HomeSchool from '@/components/home/HomeSchool.vue';
  import HotSearch from '@/components/common/HotSearch.vue';

  const router = useRouter();
  function handleShareRecipe() {
    router.push('/recipe-edit');
  }
  // function ShareRecipe() {
  //   console.log('前往分享食譜');
  // }

  // function SeeMore() {
  //   console.log('查看更多被點擊');
  // }

  const { searchTerm, handleSearch } = useSearch();

</script>

<template>
  <div class="banner__container">
    <img
      src="../assets/image/Home/banner.jpg"
      alt="homebanner"
    />

    <div class="search__section">
      <SearchBar
        v-model="searchTerm"
        @search="handleSearch"
      />
      <div class="hot-search-wrapper">
        <HotSearch
        @search="handleSearch" />
      </div>
    </div>

    <div class="scoll-down">
      <p>向下捲動</p>
    </div>
  </div>
  <div>
    <hot />

    <delicious id="delicious" />

    <IndexRecipeOverview />

    <HomeSchool id="HomeSchool" />

    <ShareRecipeButton
      id="ShareRecipeButton"
      @ShareRecipeButtonclick="handleShareRecipe"
    >
      <template #click-me>點我</template>
      <template #share>分享食譜</template>
    </ShareRecipeButton>
  </div>
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
      height: 100%;
      object-fit: cover;
      z-index: -2;
      @include rwdmax(1200) {
        object-position: px(-220);
      }
    }
    @include rwdmax(1440) {
      height: 625px;
    }
    @include rwdmax(1200) {
      height: 600px;
    }
    @include rwdmax(768) {
      height: 600px;
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
    @include rwdmax(1440) {
      width: 350px;
      height: 160px;
      padding-top: 12px;
      @include font-size(16);
    }
    @include rwdmax(1200) {
      width: 300px;
      height: 150px;
      padding-top: 10px;
    }
    @include rwdmax(768) {
      width: 190px;
      height: 140px;
      padding-top: 10px;
      @include font-size(14);
    }
    p {
      animation: wave 1.5s infinite linear;
    }
  }
  .search__section {
    position: absolute;
    text-align: center;
    top: 50%;
    right: 15%;
    @include rwdmax(768) {
      right: 50%;
      transform: translateX(50%);
    }
  }
  .hot-search-wrapper {
    --hot-search-text-shadow: 0 4px 4px rgba(0, 0, 0, 0.59);
    --hot-search-color: #fff;
  }
  #ShareRecipeButton {
    position: sticky;
    right: 20px;
    bottom: 30px;
    z-index: 1;
    @include rwdmax(768) {
      right: 0;
      bottom: 10px;
    }
  }
</style>
