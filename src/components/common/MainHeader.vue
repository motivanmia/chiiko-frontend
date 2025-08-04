<script setup>
  import { ref, computed, defineAsyncComponent } from 'vue';
  import Icon from '@/components/common/Icon.vue';
  import LoginModal from '@/components/user/Login.vue';
  import SigninModal from '@/components/user/Signin.vue';

  // nav選單項目
  const navLinks = ref([
    { key: 'recipes', title: '靈感×食譜', isOpen: true },
    { key: 'school', title: '學材食堂', isOpen: true },
    { key: 'prodouts', title: '好物精選', isOpen: false, path: '#' },
  ]);

  const navItemRecipes = [
    { title: '一人料理', path: '#' },
    { title: '家庭聚餐', path: '#' },
    { title: '浪漫晚餐', path: '#' },
    { title: '戶外料理', path: '#' },
    { title: '懶人快煮', path: '#' },
    { title: '健身/減糖餐', path: '#' },
    { title: '低預算料理', path: '#' },
    { title: '慶生/節慶料理', path: '#' },
  ];

  const navItemSchool = [
    { title: '植物性食材', path: '/school?category=vegetable' },
    { title: '動物性食材', path: '/school?category=meat' },
  ];

  // 登入狀態
  const isLogin = ref(false);

  const memberMenuItem = computed(() => (isLogin.value ? menuItemLonin : menuItemLogout));

  // 登出
  const logout = () => {
    isLogin.value = false;
  };

  // 登入前的會員選單
  const menuItemLogout = [
    { title: '登入', icon: 'login', action: 'login' },
    { title: '註冊', action: 'signin' },
  ];

  // 登入後的會員選單
  const menuItemLonin = [
    { title: '登出', icon: 'logout', action: 'logout' },
    { title: '會員資料', paht: '/account' },
    { title: '消息通知', paht: '/account' },
    { title: '我的食譜', paht: '/account' },
    { title: '食譜收藏', paht: '/account' },
    { title: '願望清單', paht: '/account' },
    { title: '訂單查詢', paht: '/account' },
  ];

  // 子選單hover覆蓋背景
  const overlayVisible = ref(false);
  const showOverlay = () => {
    overlayVisible.value = true;
  };
  const hideOverlay = () => {
    overlayVisible.value = false;
  };

  // 登入/註冊彈窗
  const activeModal = ref(null);
  const ModalComponents = {
    login: LoginModal,
    signin: SigninModal,
  };
  const currentModalComponent = computed(() => {
    return activeModal.value ? ModalComponents[activeModal.value] : null;
  });

  const handleAction = (action) => {
    if (action === 'logout') {
      logout();
    } else {
      openModal(action);
    }
  };

  const openModal = (modalKey) => {
    // console.log(modalKey);
    activeModal.value = modalKey;
  };
  const closeModal = () => {
    activeModal.value = null;
  };
  const loginSuccess = () => {
    isLogin.value = true;
    closeModal();
  };
</script>

<template>
  <div
    class="overlay"
    :class="{ active: overlayVisible }"
  ></div>

  <header class="header">
    <a
      href="/"
      class="logo__link"
    >
      <img
        src="@/assets/image/logo.svg"
        alt="logo"
      />
    </a>

    <div class="menulist">
      <!-- 主導覽 -->
      <nav class="nav">
        <ul class="nav__list">
          <li
            v-for="item in navLinks"
            :key="item.key"
            class="nav__item"
            @mouseover="item.isOpen && showOverlay()"
            @mouseleave="item.isOpen && hideOverlay()"
          >
            <div
              v-if="item.isOpen"
              class="nav__link"
            >
              {{ item.title }}
              <Icon
                icon-name="downA"
                class="nav__arrow"
              />
            </div>
            <a
              v-else
              :href="item.path"
              class="nav__link"
            >
              {{ item.title }}
            </a>

            <!-- 子選單 -->
            <div
              v-if="item.key === 'recipes'"
              class="nav__submenu"
            >
              <div class="submenu__title">
                <a href="/school">靈感×食譜</a>
              </div>
              <div class="submenu__content recipes__grid">
                <a
                  v-for="recipe in navItemRecipes"
                  :key="recipe.title"
                  :href="recipe.path"
                  class="recipes__item"
                >
                  {{ recipe.title }}
                </a>
              </div>
            </div>

            <div
              v-if="item.key === 'school'"
              class="nav__submenu"
            >
              <div class="submenu__title">
                <a href="/school">食材學堂</a>
              </div>
              <div class="submenu__content school__grid">
                <a
                  v-for="school in navItemSchool"
                  :key="school.title"
                  :href="school.path"
                  class="school__item"
                >
                  {{ school.title }}
                </a>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <!-- 右側icon -->
      <div class="actions">
        <div
          class="actions__member"
          @mouseover="showOverlay()"
          @mouseleave="hideOverlay()"
        >
          <span class="actions__item">
            <Icon
              icon-name="member"
              class="actions__icon"
            />
          </span>
          <!-- 會員子選單 -->
          <div class="member__menu">
            <template
              v-for="item in memberMenuItem"
              :key="item.title"
            >
              <button
                v-if="item.action"
                type="button"
                class="member__item"
                @click="handleAction(item.action)"
              >
                {{ item.title }}
                <Icon
                  v-if="item.icon"
                  :icon-name="item.icon"
                  class="member__icon"
                />
              </button>
              <a
                v-else
                :href="item.path"
                class="member__item"
              >
                {{ item.title }}
                <Icon
                  v-if="item.icon"
                  :icon-name="item.icon"
                  class="member__icon"
                />
              </a>
            </template>
          </div>
        </div>

        <a
          href="#"
          class="actions__item"
        >
          <Icon
            icon-name="cart"
            class="actions__icon"
          />
        </a>
      </div>
    </div>
  </header>

  <teleport to="body">
    <transition name="modal-fade">
      <component
        v-if="activeModal"
        :is="currentModalComponent"
        @close="closeModal"
        @login-success="loginSuccess"
      />
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 20;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.3s ease;
    &.active {
      opacity: 1;
      visibility: visible;
    }
  }
  .header {
    z-index: 50;
    position: fixed;
    top: 15px;
    left: 17px;
    right: 17px;
    height: 110px;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border-radius: 60px;
    padding: 12px 65px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo__link {
    display: flex;
    align-items: center;
    text-decoration: none;
    img {
      height: 86px;
      width: auto;
      display: block;
    }
  }

  // 主導覽
  .menulist {
    display: flex;
    align-items: center;
    gap: 230px;
  }
  .nav {
    display: flex;
    align-items: center;
    .nav__list {
      display: flex;
      align-items: center;
      gap: 65px;
      position: relative;
      padding: 0;
      margin: 0;
      list-style: none;
    }
  }
  .nav__item {
    position: relative;
    padding: 50px 0;
    a {
      text-decoration: none;
    }
  }
  .nav__link {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0;
    text-decoration: none;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
    @include fontSet(
      $font: $basic-font,
      $fw: bold,
      $size: px(24),
      $color: color(text, dark),
      $ls: 4.8px
    );
    .nav__arrow {
      @include font-size(30);
    }
  }
  .nav__link:hover {
    color: color(button, main);
  }

  //子選單
  .nav__submenu,
  .member__menu {
    position: absolute;
    top: 100%;
    margin-top: 5px;
    z-index: 60;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(0);
    transition: 0.3s ease;
  }
  .nav__item:hover > .nav__submenu,
  .actions__member:hover > .member__menu {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
  }

  //主導覽子選單
  .nav__submenu {
    position: fixed;
    left: 0;
    width: 100%;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    padding: 55px 300px;
    align-items: center;
    justify-content: center;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 35px 50px;
    .submenu__title {
      grid-column: 1/2;
      text-align: center;
      padding-right: 50px;
      border-right: 1px solid color(text, dark);
      a {
        @include fontSet(
          $font: $basic-font,
          $fw: bold,
          $size: px(36),
          $color: color(text, dark),
          $ls: 4.8px
        );
        margin: 0;
      }
      a:hover {
        color: color(button, main);
      }
    }
  }
  .submenu__content {
    grid-column: 2/5;
  }
  .recipes__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 35px 30px;
  }
  .recipes__item {
    @include fontSet(
      $font: $basic-font,
      $fw: bold,
      $size: px(24),
      $color: color(text, dark),
      $ls: 4.8px
    );
    text-align: center;
    padding: 10px;
    border-radius: 20px;
    transition: all 0.2s ease;
    &:hover {
      background-color: color(button, main);
      color: color(text, light);
    }
  }
  .school__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 35px 30px;
  }
  .school__item {
    @include fontSet(
      $font: $basic-font,
      $fw: bold,
      $size: px(24),
      $color: color(text, dark),
      $ls: 4.8px
    );
    text-align: center;
    padding: 10px;
    border-radius: 20px;
    transition: all 0.2s ease;
    &:hover {
      background-color: color(button, main);
      color: color(text, light);
    }
  }
  // 右側icon選單
  .actions {
    display: flex;
    align-items: center;
    gap: 55px;
    .actions__member {
      position: relative;
      padding: 50px 0;
    }
    .actions__item {
      display: block;
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      color: color(text, dark);
      transition: all 0.2s ease;
    }
    .actions__item:hover {
      color: color(button, main);
    }
    .actions__icon {
      @include font-size(40);
    }
    .actions__member:hover > .overlay {
      opacity: 1;
      visibility: visible;
    }
  }

  // 會員子選單
  .member__menu {
    position: fixed;
    width: 230px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    padding: 5px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    right: 5%;
    .member__item {
      @include fontSet(
        $font: $basic-font,
        $fw: bold,
        $size: px(24),
        $color: color(text, dark),
        $ls: 4.8px
      );
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: none;
      border: none;
      padding: 6px 30px;
      width: 100%;
      text-decoration: none;
      color: color(text, dark);
      cursor: pointer;
    }
    .member__item:hover {
      background-color: color(button, main);
      border-radius: 20px;
      color: color(text, light);
    }
    .member__icon {
      @include font-size(24);
    }
  }
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: 0.1s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
</style>
