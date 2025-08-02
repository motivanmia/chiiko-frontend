<script setup>
  import sectionTitle from '@/components/SectionTitle.vue';
  import hot_img from '@/components/home/HomeHotImg.vue';
  import img02 from '@/assets/image/home/02.jpg';
  import img03 from '@/assets/image/home/03.jpg';
  import img04 from '@/assets/image/home/04.jpg';
  import DropdownMenu from '../button/DropdownMenu.vue';
  import SeeMoreButton from '../button/SeeMoreButton.vue';
</script>

<template>
  <sectionTitle id="title" />

  <div>
    <span>
      <hot_img class="hot_img" />
      <hot_img
        class="hot_img"
        :img="img03"
        text="牛番茄燉牛腩剛剛好"
      />
    </span>
    <span id="right">
      <DropdownMenu id="DropdownMenu" />
      <hot_img
        class="hot_img"
        :img="img02"
        text="烤箱裡的紙包鮭魚"
        objectPosition="0% 70%"
      />
      <hot_img
        class="hot_img"
        :img="img04"
        text="剛好一口的奶酪布丁"
        objectPosition="0% 70%"
      />
    </span>
  </div>
  <SeeMoreButton id="SeeMoreButton" />
</template>

<style lang="scss" scoped>
  #title {
    margin-bottom: 100px;
    @include rwdmax(768) {
      margin-bottom: 50px;
    }
  }

  #right {
    margin-top: 50px;
    position: relative;
  }
  #DropdownMenu {
    position: absolute;
    top: -25%;
    right: 0;
    @include rwdmax(768) {
      display: none;
    }
  }
  div {
    display: flex;
    justify-content: center;
    gap: 50px;
    margin: auto;
    @include rwdmax(768) {
      display: block;
      gap: 10px;
    }
  }
  #SeeMoreButton {
    margin: 120px auto 40px;
    transform: scale(1.5);
  }
</style>
