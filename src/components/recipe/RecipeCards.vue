<script setup>
  import Icon from '../common/Icon.vue';
</script>

<template>
  <div class="recipe-card">
    <div
      v-for="card in 9"
      class="recipe-card__box"
    >
      <div class="recipe-card__pic">
        <img
          class="recipe-card__img"
          src="/src/assets/image/Recipes/misopotato.png"
          alt=""
        />
      </div>

      <div class="recipe-card__content">
        <img
          class="recipe-card__textColor"
          src="/src/assets/image/Recipes/graffiti.png"
          alt=""
        />
        <h2>味增馬鈴薯煎餅</h2>
      </div>
      <div class="icon-board">
        <div class="icon-board__left">
          <p>
            <Icon
              icon-name="time"
              class="time-icon"
            />
            約20分鐘
          </p>
        </div>
        <div class="icon-board__right">
          <p>
            <Icon
              icon-name="comment"
              class="comment-icon"
            />
            120
          </p>

          <p>
            <Icon
              icon-name="markL"
              class="markL-icon"
            />
            90
          </p>
        </div>
      </div>
      <div class="icon-board__tag">
        <p>#和風</p>
        <p>#馬鈴薯</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .recipe-card {
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
    margin: 30px auto;
    gap: 40px;
    max-width: 1200px;
    width: 100%;


    &__box {
      justify-content: center;
      position: relative;
    }
    &__pic {
      width: 100%;
      height: auto;
      cursor: pointer;
    }

    &__content {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateY(-110%) translateX(-50%);

      & > h2 {
        font-size: 28px;
        white-space: nowrap;
        letter-spacing: 1.2px;
        color: color(text, light);
        position: absolute;
        left:50%;
        transform: translateY(-150%) translateX(-50%);
      }
    }

    // &__textColor {
    //   position: absolute;
    //   bottom: 0;
    //   left: 50%;
    //   transform: translateY(-120%) translateX(-50%);
    // }

    .time-icon {
      font-size: 25px;
    }
    .comment-icon {
      font-size: 25px;
    }
    .markL-icon {
      font-size: 25px;
    }
  }

  .icon-board {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    &__left {
      display: flex;

      & > p {
        display: flex;
        align-items: center;
        letter-spacing: 1.2px;
        font-size: 16px;
      }
    }

    &__right {
      display: flex;

      & > p {
        display: flex;
        align-items: center;
        letter-spacing: 1.2px;
        font-size: 16px;
      }
    }

    &__tag {
      display: flex;
      margin-top: 5px;
      gap: 10px;

      & > p {
        color: color(text, base);
        letter-spacing: 1.2px;
        font-size: 16px;
      }
    }
  }
</style>
