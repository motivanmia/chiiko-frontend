<script setup>
  import { useIngredientStore } from '@/stores/ingredient';
  const ingredient = useIngredientStore();

  import Icon from '@/components/common/Icon.vue';
  import SeeMore from '@/components/button/SeeMoreButton.vue';
</script>

<template>
  <div
    v-if="ingredient.active"
    :class="['lightbox', { 'lightbox-active': ingredient.active }]"
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
    <pre class="lightbox__foot">
      <h2>保存方法</h2>
      <p>{{ ingredient.active.preservation }}</p>
    </pre>
    <div
      class="lightbox__close"
      @click="ingredient.updateActive(null)"
    >
      <Icon
        icon-name="remove"
        class="lightbox__close--icon"
      />
    </div>
    <SeeMore
      text="查看相關食譜"
      class="lightbox__seemore"
      @click="ingredient.updateActive(null)"
    />
  </div>
  <div
    v-if="ingredient.active"
    class="overlay"
    @click="ingredient.updateActive(null)"
  ></div>
</template>

<style lang="scss" scoped>
  .lightbox {
    z-index: 999;
    position: fixed;
    width: 55vw;
    height: 90vh;
    background-color: white;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    transition: all 0.3s ease;
    opacity: 0;
    &-active {
      opacity: 1;
    }
    @include rwdmax(1200) {
      width: 80%;
      height: 80%;
      top: 50%;
      left: 50%;
    }
    @include rwdmax(768) {
      height: 95%;
      overflow-y: scroll;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
    }

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
        @include rwdmax(1200) {
          font-size: 32px;
        }
      }
    }

    &__content {
      position: relative;
      margin-left: auto;
      margin-right: auto;
      padding-bottom: 30px;
      width: 80%;
      height: 50%;
      border-bottom: 2px solid black;
      display: flex;
      justify-content: space-between;
      @include rwdmax(1440) {
        height: 45%;
      }

      @include rwdmax(768) {
        flex-wrap: wrap;
        height: unset;
      }
    }

    &__imgbox {
      width: 18vw;
      aspect-ratio: 1 / 1;
      top: 45%;
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
      @include rwdmax(768) {
        display: block;
        position: static;
        transform: unset;
        width: 100%;
        aspect-ratio: 1 / 1;
        margin-bottom: 30px;
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
      @include rwdmax(1440) {
        margin: 0.5vw auto;
      }
      @include rwdmax(768) {
        width: 95%;
        height: unset;
      }
      & > h2 {
        font-size: 1.25vw;
        font-weight: bold;
        text-align: center;
        color: color(text, dark);
        letter-spacing: 0.3em;
        @include rwdmax(1200) {
          font-size: 24px;
        }
      }
      & > p {
        display: block;
        width: 80%;
        margin: 0 auto 0 auto;
        font-size: 0.9375vw;
        color: color(text, dark);
        white-space: pre-wrap;
        word-break: break-word;
        line-height: normal;
        @include rwdmax(1200) {
          font-size: 16px;
        }
      }
    }
    &__text {
      width: 30%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: space-around;
      @include rwdmax(768) {
        display: inline-flex;
        width: 50%;
        height: unset;
        row-gap: 10px;
      }

      &--box {
        width: 100%;
        height: 33%;
        display: flex;
      }
      &--item {
        & > h1 {
          padding-top: 3px;
          margin-bottom: 10px;
          color: color(text, dark);
          font-size: 1vw;
          font-weight: 700;
          @include rwdmax(1200) {
            font-size: 18px;
          }
        }
        & > span {
          color: color(text, dark);
          font-size: 0.9375vw;
          line-height: normal;
          @include rwdmax(1200) {
            font-size: 16px;
          }
        }
      }
      &--checkicon {
        color: green;
        font-size: 1.66vw;
        margin: 0 5px;
        @include rwdmax(1200) {
          font-size: 18px;
        }
      }
      &--ngicon {
        color: red;
        font-size: 1.66vw;
        margin: 0 10px;
        @include rwdmax(1200) {
          font-size: 18px;
        }
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
      color: color(text, light);
      &:hover {
        background-color: #d6b59c;
      }
      @include rwdmax(1200) {
        height: 4vw;
        width: 4vw;
      }
      &--icon {
        font-size: 2vw;
        @include rwdmax(768) {
          font-size: 5vw;
        }
      }
      @include rwdmax(1200) {
        font-size: 4vw;
      }
      @include rwdmax(768) {
        right: 2.5vw;
        top: 2.5vw;
        background-color: unset;
        color: unset;
      }
    }
    &__seemore {
      position: absolute;
      right: 10%;
      bottom: 5%;
      transform: scale(1.5);
      @include rwdmax(1440) {
        transform: scale(1);
        right: 5%;
        bottom: 5%;
      }
      @include rwdmax(1200) {
        transform: scale(1.2);
      }
      @include rwdmax(768) {
        position: static;
        transform: unset;
        margin: 10px auto;
      }
    }
  }
  .overlay {
    position: fixed;
    z-index: 998;
    height: 100vh;
    width: 100%;
    opacity: 0.6;
    background-color: black;
    top: 0;
    left: 0;
  }
</style>
