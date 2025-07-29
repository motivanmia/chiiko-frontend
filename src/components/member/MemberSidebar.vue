<script setup>
  import Icon from '../common/Icon.vue';
  import { ref, Transition } from 'vue';

  const profile = ref({
    name: '花媽媽烹飪教室',
    avatar: '/src/assets/image/ShareRecipeButton.png',
  });

  const menuItem = ref([
    {
      id: 'user-info',
      icon: 'user',
      title: '會員資料',
      href: '#',
      children: [
        {
          id: 'change-pwd',
          title: '修改密碼',
          href: '#',
        },
      ],
    },
    {
      id: 'inform',
      icon: 'bell',
      title: '消息通知',
      href: '#',
    },
    {
      id: 'my-recipe',
      icon: 'recipe',
      title: '我的食譜',
      href: '#',
    },
    {
      id: 'saved-recipe',
      icon: 'markL',
      title: '食譜收藏',
      href: '#',
    },
    {
      id: 'wishlist',
      icon: 'heartL',
      title: '願望清單',
      href: '#',
    },
    {
      id: 'orders',
      icon: 'order',
      title: '訂單查詢',
      href: '#',
    },
  ]);

  const activeItemId = ref('user-info'); // 預設頁面為會員資料
  const subMenuOpen = ref(false); // 子選單預設不打開

  const itemClick = (clickitem) => {
    activeItemId.value = clickitem.id;

    if (clickitem.children) {
      // 點擊的項目有子選單
      subMenuOpen.value = !subMenuOpen.value;
    } else {
      // 沒有子選單

      // 檢查點擊的項目是不是子選單
      const isSubItem = menuItem.value.some(
        (parentItem) =>
          parentItem.children && parentItem.children.some((child) => child.id === clickitem.id),
      );
      if (!isSubItem) {
        // 點擊非子項目時強制關閉
        subMenuOpen.value = false;
      }
    }
  };
</script>

<template>
  <div class="sidebar">
    <div class="profile__pic">
      <img
        :src="profile.avatar"
        alt="會員頭像"
      />
      <button class="upload__btn">
        <Icon icon-name="upload" />
      </button>
    </div>
    <p class="username">{{ profile.name }}</p>
    <nav class="sidebar__list">
      <ul>
        <template
          v-for="(item, index) in menuItem"
          :key="item.id"
        >
          <li
            v-if="item.children"
            class="sidebar__collapsible"
          >
            <a
              :href="item.href"
              :class="{ active: activeItemId === item.id }"
              @click.prevent="itemClick(item)"
            >
              <Icon
                :icon-name="item.icon"
                class="sidebar__icon"
              />
              <span>
                {{ item.title }}
                <Icon
                  v-if="subMenuOpen"
                  icon-name="upA"
                  class="sidebar__arrow"
                />
                <Icon
                  v-else
                  icon-name="downA"
                  class="sidebar__arrow"
                />
              </span>
            </a>
            <Transition name="slide-fade">
              <ul
                v-show="subMenuOpen"
                class="sidebar__subMenu"
              >
                <li
                  v-for="subItem in item.children"
                  :key="subItem.id"
                >
                  <a
                    :href="subItem.href"
                    :class="{ active: activeItemId === subItem.id }"
                    @click.prevent.stop="itemClick(subItem)"
                  >
                    <span>{{ subItem.title }}</span>
                  </a>
                </li>
              </ul>
            </Transition>
            <hr
              v-if="subMenuOpen"
              class="divider"
            />
          </li>
          <li v-else>
            <a
              :href="item.href"
              :class="{ active: activeItemId === item.id }"
              @click.prevent="itemClick(item)"
            >
              <Icon
                :icon-name="item.icon"
                class="sidebar__icon"
              />
              <span class="sidebar__title">{{ item.title }}</span>
            </a>
          </li>
        </template>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
  .profile__pic {
    position: relative;
    margin-bottom: 20px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      background-color: #ccc;
    }
  }
  .upload__btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: color(button, main);
    cursor: pointer;
    @include font-size(20);
    color: color(text, light);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 30px;
    max-width: 300px;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
    p {
      margin-bottom: 40px;
      @include fontSet(
        $font: $basic-font,
        $fw: normal,
        $size: px(24),
        $color: color(text, dark),
        $ls: 2.4px
      );
    }
  }
  .sidebar__list {
    ul {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    li a {
      @include fontSet(
        $font: $basic-font,
        $fw: normal,
        $size: px(24),
        $color: color(text, dark),
        $ls: 2.4px
      );
      width: 240px;
      height: 47px;
      border: none;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20px;
      text-decoration: none;
      transition:
        background-color 0.2s ease,
        color 0.2s ease;
    }
    span {
      padding-left: 10px;
      position: relative;
    }
    .sidebar__arrow {
      position: absolute;
      top: center;
      right: -20px;
    }
    .active {
      @include fontSet(
        $font: $basic-font,
        $fw: normal,
        $size: px(24),
        $color: color(text, light),
        $ls: 2.4px
      );
      background-color: color(button, main);
    }
  }
  .sidebar__collapsible {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sidebar__subMenu {
    align-items: end;
    padding-right: 30px;
    li a {
      width: 160px;
      border-radius: 2rem;
      text-align: center;
    }
  }
  .sidebar__icon {
    @include font-size(20);
  }
  .divider {
    border: none;
    height: 1px;
    width: 100%;
    background-color: color(backgroundColor, panel);
    margin: 0;
  }
  .slide-fade-enter-active {
    transition: all 0.3s ease-in-out;
  }
  .slide-fade-leave-active {
    transition: all 0.3s ease-in-out;
  }
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    opacity: 0;
  }
</style>
