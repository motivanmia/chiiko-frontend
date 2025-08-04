<script setup>
  import home_hot from '@/assets/image/home/01.jpg';

  const props = defineProps({
    img: {
      type: String,
      default: home_hot,
    },
    text: {
      default: '香蒜彩蔬義大利麵',
    },
    objectPosition: {
      type: String,
      default: 'center center',
    },
    path: {
      type: String,
      default: '/',
    },
  });
</script>

<template>
  <div id="image-wrapper">
    <RouterLink :to="props.path" >
    <img
      :src="img"
      :style="{ objectPosition }"
    />
    <div class="overlay"></div>
    <h1>{{ text }}</h1>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
  #image-wrapper {
    width: 570px;
    // height: 300px;
    aspect-ratio: 570 / 300;
    position: relative;
    cursor: pointer;
    margin-bottom: 50px;
    @include rwdmax(1200) {
      width: 100%;
    }
    @include rwdmax(768) {
      width: 95%;
      margin-left: auto;
      margin-right: auto;
      height: calc(90% * 0.526);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
      box-shadow: 0 2px 5px #aaa;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 20px;
      background-color: rgba(0, 0, 0, 0.2); /* 黑色半透明遮罩 */
      // pointer-events: none; /* 讓滑鼠穿透遮罩，可選 */
      transition: background-color 0.5s ease;
    }
    h1 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      // font-size: 40px;
      font-size: clamp(20px, 5.5vw, 40px);
      font-weight: bold;
      color: color(text, light);
      width: 100%;
      text-align: center;
      letter-spacing: 0.5rem;
      // @include rwdmax(768){
      //   font-size: calc(20px,2vw,40px);
      // }
    }
    &:hover .overlay {
      background-color: rgba(0, 0, 0, 0.05); // hover 時變淺
      // transition: .3s;
    }
  }
</style>
