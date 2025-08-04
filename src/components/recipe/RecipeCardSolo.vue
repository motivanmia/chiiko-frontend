<script setup>
  import Icon from '../common/Icon.vue';

  import { popularRecipe } from '@/constants/recipes';
</script>

<template>
  <div class="recipe-card">
    <div
      v-for="card in popularRecipe"
      :key="card.id"
      class="recipe-card__box"
    >
      <div class="recipe-card__pic">
        <img
          class="recipe-card__img"
          :src="card.image"
          :alt="card.title"
        />
      </div>

      <div class="recipe-card__content">
        <img
          class="recipe-card__textColor"
          src="/src/assets/image/Recipes/graffiti.png"
          alt=""
        />
        <h2>{{ card.title }}</h2>
      </div>

      <div class="icon-board">
        <div class="icon-board__left">
          <p>
            <Icon
              icon-name="time"
              class="time-icon"
            />
            約{{ card.time }}分鐘
          </p>
        </div>
        <div class="icon-board__right">
          <p>
            <Icon
              icon-name="comment"
              class="comment-icon"
            />
            {{ card.comments }}
          </p>

          <p>
            <Icon
              icon-name="markL"
              class="markL-icon"
            />
            {{ card.bookmarks }}
          </p>
        </div>
      </div>

      <div class="icon-board__tag">
        <p
          v-for="tag in card.tag"
          :key="tag"
        >
          {{ tag }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .recipe-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 30px auto;
    gap: 40px;
    max-width: 1200px;
    width: 100%;

    &__box {
      justify-content: center;
      position: relative;
      flex: 0 1 calc(33.333% - 27px); // 三欄布局，扣除 gap
      min-width: 300px; // 最小寬度

      @media (max-width: 1024px) {
        flex: 0 1 calc(50% - 20px); // 平板：兩欄
      }

      @media (max-width: 640px) {
        flex: 0 1 100%; // 手機：單欄
      }
    }
    &__pic {
      width: 100%;
      height: auto;
      cursor: pointer;
      overflow: hidden;
      border-radius: 20px;
    }

    &__img {
      width: 100%;
      height: auto;
      transition: 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    &__content {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateY(-110%) translateX(-50%);
      width: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;

      & > h2 {
        font-size: 28px;
        white-space: nowrap;
        letter-spacing: 1.2px;
        color: color(text, light);
        position: absolute;
        left: 50%;
        transform: translateY(50%) translateX(-50%);
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
