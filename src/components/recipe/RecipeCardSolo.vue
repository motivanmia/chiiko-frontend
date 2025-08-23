<script setup>
  import { useRouter } from 'vue-router';
  import Icon from '../common/Icon.vue';
  import axios from 'axios';

  const props = defineProps({
    recipes: {
      type: Array,
      required: true,
    },
  });

  const router = useRouter();

  const handleRecipeClick = async (recipe_id) => {
    try {
      await axios.post('http://localhost:8888/front/recipe/update_recipe_views.php', {
        recipe_id: recipe_id,
      });
      console.log(`Recipe${recipe_id} view count updated.`);
    } catch (error) {
      console.error('Failed to update recipe view count.', error);
    }
    router.push({
      name: 'recipe-detail',
      params: {
        id: recipe_id,
      },
    });
  };
</script>
<template>
  <div class="recipe-card">
    <div
      v-for="recipe in props.recipes"
      :key="recipe.recipe_id"
      @click="handleRecipeClick(recipe.recipe_id)"  
      class="recipe-card__box"
    >
      <div class="recipe-card__pic">
        <img
          class="recipe-card__img"
          :src="recipe.image"
          :alt="recipe.name"
        />
      </div>

      <div class="recipe-card__content">
        <img
          class="recipe-card__textColor"
          src="/src/assets/image/Recipes/graffiti.png"
          alt=""
        />
        <h2>{{ recipe.name }}</h2>
      </div>

      <div class="icon-board">
        <div class="icon-board__left">
          <p>
            <Icon
              icon-name="time"
              class="time-icon"
            />
            約{{ recipe.cooked_time }}分鐘
          </p>
        </div>
        <div class="icon-board__right">
          <p>
            <Icon
              icon-name="comment"
              class="comment-icon"
            />
            {{ recipe.comments || 0 }}
          </p>
          <p>
            <Icon
              icon-name="markL"
              class="markL-icon"
            />
            {{ recipe.favorite_count || 0 }}
          </p>
        </div>
      </div>

      <div class="icon-board__tag">
        <p
          v-for="tag in recipe.tag && typeof recipe.tag === 'string' ? recipe.tag.split(',') : []"
          :key="tag"
        >
          #{{ tag }}
        </p>
      </div>
    </div>

    <div
      v-if="props.recipes.length === 0"
      class="no-recipes"
    >
      <p>目前沒有符合條件的食譜</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .recipe-card {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0 auto;
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

        // 修正文字溢出問題
        width: 100%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;

        @media (max-width: 640px) {
          font-size: 24px;
        }

        @media (max-width: 480px) {
          font-size: 20px;
        }
      }
    }

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

  .no-recipes {
    width: 100%;
    text-align: center;
    padding: 40px 20px;
    color: #666;
    font-size: 18px;
  }
</style>
