<script setup>
  import Icon from '@/components/common/Icon.vue';
  import { ref, Transition } from 'vue';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore();

  // 儲存選中的檔案
  const avatarFile = ref(null);
  const fileInput = ref(null);

  const menuItem = ref([
    {
      id: 'user-info',
      icon: 'user',
      title: '會員資料',
      routeName: 'profile',
      children: [
        {
          id: 'change-pwd',
          title: '修改密碼',
          routeName: 'password',
        },
      ],
    },
    {
      id: 'inform',
      icon: 'bell',
      title: '消息通知',
      routeName: 'inform',
    },
    {
      id: 'my-recipe',
      icon: 'recipe',
      title: '我的食譜',
      routeName: 'my-recipe',
    },
    {
      id: 'recipe-collect',
      icon: 'markL',
      title: '食譜收藏',
      routeName: 'recipe-collect',
    },
    {
      id: 'wishlist',
      icon: 'heartL',
      title: '願望清單',
      routeName: 'wishlist',
    },
    {
      id: 'orders',
      icon: 'order',
      title: '訂單查詢',
      routeName: 'orders',
    },
  ]);

  const activeItemId = ref('user-info'); // 預設頁面為會員資料
  const subMenuOpen = ref(true); // 子選單預設打開(預設在會員資料)

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      avatarFile.value = file;
      // 選好檔案後 呼叫上傳action
      changeAvatar();
    }
  };

  // 新增觸發檔案選擇的函式
  const triggerFileUpload = () => {
    // 檢查 ref 是否存在，然後手動觸發 input 的 click 事件
    if (fileInput.value) {
      fileInput.value.click();
    }
  };

  const changeAvatar = async () => {
    if (!avatarFile.value) {
      console.log('請選擇檔案');
      return;
    }
    console.log('開始上傳檔案');
    // 呼叫pinia action處理上傳
    const success = await userStore.uploadAvatar(avatarFile.value);

    if (success) {
      console.log('上傳成功');
      // 清空檔案輸入欄位 方便下次上傳
      fileInput.value.value = null;
      avatarFile.value = null;
    } else {
      console.log('上傳失敗');
    }
  };
</script>

<template>
  <div class="sidebar">
    <!-- 會員頭像 -->
    <div class="profile__pic">
      <img
        :src="userStore.userAvatarUrl"
        alt="會員頭像"
      />
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        style="display: none"
      />
      <button
        class="upload__btn"
        @click="triggerFileUpload"
      >
        <Icon icon-name="upload" />
      </button>
    </div>
    <p class="username">{{ userStore.displayName }}</p>

    <!-- 導覽列 -->
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
            <router-link
              :to="{ name: item.routeName }"
              class="parent-link"
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
            </router-link>
            <Transition name="slide-fade">
              <ul
                v-show="subMenuOpen"
                class="sidebar__subMenu"
              >
                <li
                  v-for="subItem in item.children"
                  :key="subItem.id"
                >
                  <router-link
                    :to="{ name: subItem.routeName }"
                    @click.prevent.stop="itemClick(subItem)"
                  >
                    <span>{{ subItem.title }}</span>
                  </router-link>
                </li>
              </ul>
            </Transition>
            <hr
              v-if="subMenuOpen"
              class="divider"
            />
          </li>
          <li v-else>
            <router-link
              :to="{ name: item.routeName }"
              @click.prevent="itemClick(item)"
            >
              <Icon
                :icon-name="item.icon"
                class="sidebar__icon"
              />
              <span class="sidebar__title">{{ item.title }}</span>
            </router-link>
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
  .upload__btn:hover {
    background-color: color(orangeColor, base);
    transition: 0.2s ease;
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
    @include rwdmax(1200) {
      padding: 30px 20px;
      max-width: 250px;
    }
    @include rwdmax(1024) {
      max-width: 768px;
    }
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
    @include rwdmax(1200) {
      width: 100%;
    }
    @include rwdmax(1024) {
      padding-inline: 80px;
      width: 100%;
    }
    @include rwdmax(768) {
      padding-inline: 0;
    }
    ul {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    li a {
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
      @include fontSet(
        $font: $basic-font,
        $fw: normal,
        $size: px(24),
        $color: color(text, dark),
        $ls: 2.4px
      );
      @include rwdmax(1200) {
        width: 100%;
      }
    }
    li a:hover {
      color: color(button, main);
    }
    li a.router-link-active,
    li a.router-link-exact-active {
      // @include fontSet(...); // 樣式保持一致
      font-family: 'YourBasicFont', sans-serif;
      font-weight: normal;
      font-size: 24px; // px(24) 的 fallback
      color: color(text, light);
      letter-spacing: 2.4px;

      background-color: color(button, main);
    }
    li a.router-link-active:hover,
    li a.router-link-exact-active:hover {
      color: color(text, light); // 活躍狀態下 hover 保持白色
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
    // .active {
    //   @include fontSet(
    //     $font: $basic-font,
    //     $fw: normal,
    //     $size: px(24),
    //     $color: color(text, light),
    //     $ls: 2.4px
    //   );
    //   background-color: color(button, main);
    // }
    // .active:hover {
    //   color: color(text, light);
    // }
  }
  .sidebar__collapsible {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .sidebar__subMenu {
    align-items: end;
    padding-right: 30px;
    @include rwdmax(1200) {
      padding-right: 0;
      padding-left: 1rem;
      align-items: center;
    }
    li a {
      width: 160px;
      border-radius: 2rem;
      text-align: center;
      @include rwdmax(1024) {
        width: 300px;
      }
      @include rwdmax(768) {
        width: 200px;
      }
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
