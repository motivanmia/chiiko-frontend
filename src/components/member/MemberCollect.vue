<script setup>
  // import MemberSidebar from './MemberSidebar.vue';

  import Icon from '../common/Icon.vue';
</script>

<template>
  <div class="collect-recipe">
    <div class="collect-recipe__board">
      <div
        v-for="card in 9"
        class="collect-recipe__card"
      >
        <div class="collect-recipe__pic">
          <img
            src="/src/assets/image/Member/spring-onion-soba.jpg"
            alt="蔥花溫蕎麥麵"
          />
        </div>

        <div class="collect-recipe__title">
          <h3>蔥花溫蕎麥麵</h3>
        </div>

        <div class="collect-recipe__content">
          <Icon
            icon-name="mark"
            class="markL-icon"
          />
          <p>已收藏</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .collect-recipe {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    background-color: #b5c5a8;
    border-radius: 15px;

    &__board {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 16px;

      padding: 64px 0px;

      .collect-recipe__card {
        background-color: white;
        border-radius: 20px;
        padding: 10px;
        display: flex;
        flex-direction: column;

        .collect-recipe__pic {
          cursor: pointer;
          & > img {
            width: 100%;
            height: auto;
            border-radius: 20px;
          }
        }

        .collect-recipe__title {
          display: flex;
          flex-direction: column;
          // justify-content: center;
          align-self: center;
          margin-top: 10px;

          & > h3 {
            font-size: px(20);
            letter-spacing: 1.2px;
            color: color(text, dark);
          }
        }

        .collect-recipe__content {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;

          & > p {
            font-size: px(16);
            color: color(text, dark);
          }
          .markL-icon {
            font-size: px(20);
            color: color(text, dark);
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
