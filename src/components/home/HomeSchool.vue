<script setup>
  import { useIngredientStore } from '@/stores/ingredient';
  import { ref, computed } from 'vue';
  import SeeMoreButton from '../button/SeeMoreButton.vue';
  import SectionTitle from '../SectionTitle.vue';
  const ingredient = useIngredientStore();
  console.log(ingredient.list[0]);

  const namesToFind = ['胡蘿蔔', '蛤蜊', '南瓜'];
  const result = computed(() => ingredient.list.filter((item) => namesToFind.includes(item.name)));
  console.log(result);
</script>

<template>
  <SectionTitle title="/食材學堂\" />
  <div class="school">
    <div
      class="school__card"
      v-for="item in result"
      :key="item.id"
    >
      <div class="school__imgbox">
        <img
          :src="item.img[0]"
          alt=""
        />
        <p>{{ item.name }}</p>
      </div>
      <div class="school__text">
        <h1>{{ item.lightbox[0].goodtitle }}</h1>
        <p>{{ item.lightbox[0].goodcontent }}</p>
      </div>
    </div>
  </div>
  <SeeMoreButton class="SeeMoreButton" />
</template>

<style lang="scss" scoped>
  .school {
    margin: 50px auto;
    width: 1200px;
    display: flex;
    flex-direction: column;
    &__card {
      width: 900px;
      height: 200px;
      margin: 20px;
      border-radius: 20px;
      background: rgba(70, 110, 38, 0.6);
      display: flex;
      &:nth-of-type(2) {
        align-self: flex-end;
        .school__imgbox {
          order: 1;
        }
      }
    }

    &__imgbox {
      height: 100%;
      aspect-ratio: 1 / 1;
      position: relative;

      & > img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
      & > p {
        text-align: center;
        position: relative;
        top: -60px;
        color: var(--font-color-light, #fef9ec);
        font-family: 'Noto Sans TC';
        font-size: 40px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        letter-spacing: 8px;
      }
    }

    &__text {
      flex-grow: 1;
      margin: auto 100px;
      * {
        color: var(--font-color-light, #fef9ec);
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        letter-spacing: 2px;
      }
    }
  }
  .SeeMoreButton {
    margin: auto;
    transform: scale(1.5);
  }
</style>
