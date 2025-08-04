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
  <div id="HomeSchool">
    <SectionTitle title="/食材學堂\" />
    <div class="subtitle"><p>不知道怎麼挑選和保存嗎? 看看小百科吧!</p></div>
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
  </div>
</template>

<style lang="scss" scoped>
#HomeSchool{
  margin-top: 150px;
  margin-bottom: 200px ;
}
  .subtitle {
    text-align: center;
    margin: 30px auto;

    & > p {
      color: color(text, dark);
      font-size: 20px;
      font-style: normal;
      line-height: normal;
      letter-spacing: 2px;
    }
  }
  .school {
    margin: 50px auto 120px;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    &__card {
      max-width: 900px;
      height: 200px;
      margin: 20px;
      border-radius: 20px;
      background: rgba(70, 110, 38, 0.6);
      display: flex;
      filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));

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
      margin: 0 30px;

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
