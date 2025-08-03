<script setup>
  import { useIngredientStore } from '@/stores/ingredient';
  import Icon from '@/components/common/Icon.vue';
  import SeeMore from '@/components/button/SeeMoreButton.vue';
  const ingredient = useIngredientStore();
</script>

<template>
  <div
    class="lightbox"
    v-if="ingredient.active"
  >
    <div class="lightbox__name">
      <h1>{{ ingredient.active.name }}</h1>
    </div>
    <div class="lightbox__content">
      <div class="lightbox__imgbox">
        <img-comparison-slider
          style="
            --divider-width: 3px;
            --divider-color: #6b6e4f;
            --default-handle-width: clamp(20px, 50px, 200px);
            --default-handle-color: #6b6e4f;
          "
        >
          <img
            class="lightbox__img"
            slot="first"
            data-before
            :src="ingredient.active.img[0]"
            alt=""
          />
          <img
            class="lightbox__img"
            slot="second"
            data-after
            :src="ingredient.active.img[1]"
            alt=""
          />
        </img-comparison-slider>
      </div>

      <!-- 好的描述 -->
      <div class="lightbox__text">
        <div
          class="lightbox__text--box"
          v-for="(item, index) in ingredient.active.lightbox"
          :key="'good-' + index"
        >
          <Icon
            icon-name="check"
            class="lightbox__text--checkicon"
          />
          <div class="lightbox__text--item">
            <h1>{{ item.goodtitle }}</h1>
            <span>{{ item.goodcontent }}</span>
          </div>
        </div>
      </div>

      <!-- 壞的描述 -->
      <div class="lightbox__text">
        <div
          class="lightbox__text--box"
          v-for="(item, index) in ingredient.active.lightbox"
          :key="'bad-' + index"
        >
          <Icon
            icon-name="ng"
            class="lightbox__text--ngicon"
          />
          <div class="lightbox__text--item">
            <h1>{{ item.badtitle }}</h1>
            <span>{{ item.badcontent }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="lightbox__foot">
      <h2>保存方法</h2>
      <p>{{ ingredient.active.preservation }}</p>
    </div>
    <div
      class="lightbox__close"
      @click="ingredient.updateActive(null)"
    >
      <Icon
        icon-name="close"
        class="lightbox__close--icon"
      />
    </div>
    <SeeMore class="lightbox__seemore" />
  </div>
  <div
    class="overlay"
    @click="ingredient.updateActive(null)"
  ></div>
</template>

<style lang="scss" scoped>
  .lightbox {
    z-index: 999;
    position: fixed;
    width: 55vw;
    height: 80vh;
    background-color: color(backgroundColor, beige);
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;

    &__name {
      margin: 30px auto;
      width: 80%;
      height: 8%;
      border-bottom: 2px solid black;
      & > h1 {
        font-size: 2vw;
        font-weight: bold;
        text-align: center;
        color: color(text, dark);
        letter-spacing: 0.3em;
      }
    }

    &__content {
      position: relative;
      margin-left: auto;
      margin-right: auto;
      padding-bottom: 30px;
      width: 80%;
      height: 47%;
      border-bottom: 2px solid black;
      display: flex;
      justify-content: space-between;
    }

    &__imgbox {
      width: 18vw;
      aspect-ratio: 1 / 1;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      img-comparison-slider {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        box-shadow: none;
        background: transparent;
      }

      img-comparison-slider::part(container),
      img-comparison-slider::part(before),
      img-comparison-slider::part(after),
      img-comparison-slider::part(handle) {
        border: none;
        outline: none;
        box-shadow: none;
        background: transparent;
      }
    }
    &__img {
      object-fit: contain;
      width: 100%;
      aspect-ratio: 1 / 1;
    }
    &__foot {
      width: 80%;
      height: 25%;
      margin: 1vw auto;
      & > h2 {
        font-size: 1.25vw;
        font-weight: bold;
        text-align: center;
        color: color(text, dark);
        letter-spacing: 0.3em;
      }
      & > p {
        display: block;
        width: 80%;
        margin: 1vw auto 0 auto;
        font-size: 0.9375vw;
        color: color(text, dark);
      }
    }
    &__text {
      width: 30%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: space-around;

      &--box {
        width: 100%;
        height: 25%;
        display: flex;
      }
      &--item {
        & > h1 {
          padding-top: 3px;
          margin-bottom: 10px;
          color: color(text, dark);
          font-size: 1vw;
          font-weight: 700;
        }
        & > span {
          color: color(text, dark);
          font-size: 0.9375vw;
          line-height: normal;
        }
      }
      &--checkicon {
        color: green;
        font-size: 1.66vw;
        margin: 0 5px;
      }
      &--ngicon {
        color: red;
        font-size: 1.66vw;
        margin: 0 10px;
      }
    }

    &__close {
      background-color: color(button, main);
      border-radius: 50%;
      height: 3.125vw;
      width: 3.125vw;
      position: absolute;
      right: -1.3vw;
      top: -1.3vw;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &--icon {
        font-size: 3.125vw;
      }
    }
    &__seemore {
      position: absolute;
      right: 10%;
      bottom: 4%;
    }
  }
  .overlay {
    position: fixed;
    z-index: 998;
    height: 100vw;
    width: 100%;
    opacity: 0.6;
    background-color: black;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
