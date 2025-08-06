<script setup>
  import { ref, computed } from 'vue';
  import Icon from '../common/Icon.vue';

  const isDraftExpanded = ref(true);
  const activeTab = ref('published');

  const draftRecipe = {
    id: 1,
    title: '奶油雞肉義大利麵',
    lastEdit: '2025-07-01',
    image: new URL('@/assets/image/Member/creamy-chicken-pasta.jpg', import.meta.url).href,
  };

  const publishedRecipes = [
    {
      id: 1,
      title: '玫瑰蜜奶油蜂蜜布丁',
      publishDate: '2025-07-01',
      comments: 120,
      bookmarks: 60,
      image: new URL('@/assets/image/Member/honey-pudding.jpg', import.meta.url).href,
    },
    {
      id: 2,
      title: '青醬帕瑪火腿義大利麵',
      publishDate: '2025-07-01',
      comments: 120,
      bookmarks: 60,
      image: new URL('@/assets/image/Member/pesto-pasta.jpg', import.meta.url).href,
    },
    {
      id: 3,
      title: '黃金烏巢半熟蛋',
      publishDate: '2025-07-01',
      comments: 120,
      bookmarks: 60,
      image: new URL('@/assets/image/Member/golden-egg.jpg', import.meta.url).href,
    },
  ];

  const pendingRecipes = [
    {
      id: 4,
      title: '經典提拉米蘇',
      publishDate: '2025-07-01',
      comments: 85,
      bookmarks: 42,
      image: new URL('@/assets/image/Member/creamy-chicken-pasta.jpg', import.meta.url).href,
    },
  ];

  const currentRecipes = computed(() => {
    return activeTab.value === 'published' ? publishedRecipes : pendingRecipes;
  });
</script>

<template>
  <div class="recipe-management">
    <!-- Draft Section -->
    <div class="recipe-management__section">
      <button
        class="recipe-management__toggle"
        @click="isDraftExpanded = !isDraftExpanded"
      >
        <span class="recipe-management__toggle-text">草稿</span>
        <!-- <Icon
          icon-name="upA"
          :class="[
            'recipe-management__toggle-icon',
            { 'recipe-management__toggle-icon--expanded': isDraftExpanded},
          ]"
        /> -->
        <Icon
          icon-name="upA"
          :style="{
            transform: isDraftExpanded ? 'rotate(90deg)' : 'rotate(270deg)', //暫時先把style寫在裡面
            transition: 'transform 0.3s ease',
          }"
          class="recipe-management__toggle-icon"
        />
      </button>

      <div
        v-if="isDraftExpanded"
        class="recipe-management__draft-card"
      >
        <div class="recipe-management__image">
          <img
            class="recipe-management__image-pic"
            :src="draftRecipe.image"
            :alt="draftRecipe.title"
          />
        </div>
        <div class="recipe-management__content-draft">
          <h3 class="recipe-management__title">{{ draftRecipe.title }}</h3>
          <p class="recipe-management__date">上次編輯日期 {{ draftRecipe.lastEdit }}</p>
        </div>
        <div class="recipe-management__actions">
          <Icon
            icon-name="revise"
            class="recipe-management__action-btn recipe-management__action-btn--edit"
          />
          <Icon
            icon-name="del"
            class="recipe-management__action-btn recipe-management__action-btn--delete"
          />
        </div>
      </div>
    </div>

    <!-- Published/Pending Section -->
    <div class="recipe-management__section">
      <div class="recipe-management__tabs">
        <button
          :class="[
            'recipe-management__tab',
            { 'recipe-management__tab--active': activeTab === 'published' },
          ]"
          @click="activeTab = 'published'"
        >
          <span class="recipe-management__tab-text">已發布</span>
        </button>
        <button
          :class="[
            'recipe-management__tab',
            { 'recipe-management__tab--active': activeTab === 'pending' },
          ]"
          @click="activeTab = 'pending'"
        >
          <span class="recipe-management__tab-text">待審核</span>
        </button>
      </div>

      <div class="recipe-management__list">
        <div
          v-for="recipe in currentRecipes"
          :key="recipe.id"
          class="recipe-management__card"
        >
          <div class="recipe-management__image">
            <img
              class="recipe-management__image-pic"
              :src="recipe.image"
              :alt="recipe.title"
            />
          </div>
          <div class="recipe-management__content">
            <div class="recipe-management__info">
              <div class="recipe-management__title-box">
                <h3 class="recipe-management__title">{{ recipe.title }}</h3>
              </div>
              <div class="recipe-management__stat">
                <Icon
                  icon-name="comment"
                  class="recipe-management__stat-icon"
                />
                <span class="recipe-management__stat-text">{{ recipe.comments }}</span>

                <Icon
                  icon-name="markL"
                  class="recipe-management__stat-icon"
                />
                <span class="recipe-management__stat-text">{{ recipe.bookmarks }}</span>
              </div>
            </div>

            <div class="recipe-management__date-box">
              <p class="recipe-management__date">發佈日期 {{ recipe.publishDate }}</p>
            </div>
          </div>

          <Icon
            icon-name="del"
            class="recipe-management__delete-btn"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  // Block: recipe-management
  .recipe-management {
    background-color: #b5c5a8;
    border-radius: 15px;
    width: 100%;
    padding: 50px;
    min-height: 600px;

    // Element: section
    &__section {
      margin-bottom: 50px;
    }

    // Element: toggle (草稿切換按鈕)
    &__toggle {
      background-color: color(button, main);
      color: color(text, light);
      border: none;
      border-radius: 20px;
      padding: 8px 20px;
      font-size: px(18);
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 30px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #cd661d;
        transform: translateY(-1px);
      }
    }

    &__toggle-text {
      white-space: nowrap;
      letter-spacing: 1.2px;
    }

    &__toggle-icon {
      font-size: px(26);
      transition: transform 0.3s ease;

      // Modifier: expanded
      &--expanded {
        transform: rotate(180deg);
      }
    }

    // Element: draft-card
    &__draft-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    // Element: image
    &__image {
      // width: ;
      // height: a;
      margin-right: 30px;
      flex-shrink: 0;
    }

    &__image-pic {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 15px;
    }

    // Element: content
    &__content-draft {
      // flex: 1;
      display: flex;
      flex-direction: column;
    }

    &__content {
      display: flex;
    }

    // Element: title
    &__title {
      font-size: px(20);
      font-weight: 600;
      color: color(text, dark);
    }

    // Element: date
    &__date-box {
      // align-self: center;
    }

    &__date {
      font-size: px(14);
      color: color(search, placeholder);
      margin-top: 25px;
    }

    // Element: actions
    &__actions {
      position: absolute;
      top: 15px;
      right: 15px;
      display: flex;
      gap: 15px;
    }

    &__action-btn {
      font-size: px(30);
      color: color(text, base);
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: color(button, main);
      }

      // Modifier: edit
      &--edit {
        // 可以加入編輯按鈕特定樣式
      }

      // Modifier: delete
      &--delete {
        &:hover {
          color: #e74c3c;
        }
      }
    }

    // Element: tabs
    &__tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
    }

    &__tab {
      background-color: color(button, main);
      color: color(text, light);
      border: none;
      border-radius: 20px;
      padding: 8px 20px;
      font-size: px(18);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      opacity: 0.7;

      &:hover {
        opacity: 1;
        transform: translateY(-1px);
      }

      // Modifier: active
      &--active {
        opacity: 1;
        background-color: #cd661d;
      }
    }

    &__tab-text {
      white-space: nowrap;
      letter-spacing: 1.2px;
    }

    // Element: list
    &__list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    // Element: card
    &__card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      position: relative;
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }
    }

    // Element: info
    &__info {
      flex: 1;
      width: 200px;
    }

    // Element: stats
    &__stats {
      display: flex;
      gap: 20px;
      margin-top: 15px;
    }

    &__stat {
      display: flex;
      align-items: center;
      gap: 5px;
      color: color(text, base);
      font-size: px(16);
      margin-top: 20px;
    }

    &__stat-icon {
      font-size: px(20);
    }

    &__stat-text {
      // 統計文字樣式
    }

    // Element: delete-btn
    &__delete-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: px(30);
      color: color(text, base);
      cursor: pointer;
      transition: color 0.3s ease;

      &:hover {
        color: #e74c3c;
      }
    }
  }

  // Mobile Responsive
  @media (max-width: 768px) {
    .recipe-management {
      margin: 0 auto;
      padding: 15px;
      border-radius: 20px;

      &__draft-card,
      &__card {
        padding: 20px;
        display: flex;
        align-items: flex-start;
      }

      &__image {
        width: 80px;
        height: 60px;
        margin-right: 15px;
        flex-shrink: 0;
      }

      &__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 60px;
      }

      &__info {
        flex: 1;
      }

      &__title {
        font-size: px(16);
        margin-bottom: 5px;
        line-height: 1.3;
      }

      &__stats {
        margin-top: 5px;
        gap: 15px;
      }

      &__stat {
        font-size: px(14);
        margin-top: 5px;
        margin-bottom: 5px;
      }

      &__stat-icon {
        font-size: px(16);
      }

      &__date {
        font-size: px(12);
        margin-top: auto;
      }

      &__actions {
        gap: 10px;
        margin-left: 10px;
      }

      &__action-btn {
        font-size: px(18);
      }

      &__delete-btn {
        // position: static;
        margin-left: 10px;
        font-size: px(18);
      }

      &__tabs {
        justify-content: flex-start;
      }

      &__tab {
        padding: 6px 16px;
        font-size: px(16);
      }

      &__toggle {
        font-size: px(16);
        padding: 6px 16px;
      }
    }
  }

  // 超小螢幕優化
  @media (max-width: 480px) {
    .recipe-management {
      // margin: 10px;
      padding: 15px;

      &__image {
        width: 70px;
        height: 50px;
        margin-right: 12px;
      }

      &__title {
        font-size: px(14);
      }

      &__date {
        font-size: px(11);
      }

      &__stats {
        gap: 12px;
      }

      &__stat {
        font-size: px(12);
      }

      &__stat-icon {
        font-size: px(14);
      }
    }
  }
</style>
