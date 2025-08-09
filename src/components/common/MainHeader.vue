<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import Icon from '@/components/common/Icon.vue';
  import LoginModal from '@/components/user/Login.vue';
  import SigninModal from '@/components/user/signin.vue';
  import ForgetPswModal from '@/components/user/ForgetPsw.vue';

  // nav選單項目
  const navLinks = ref([
    { key: 'recipes', title: '靈感×食譜', path: '/recipe', isOpen: true },
    { key: 'school', title: '食材學堂', path: '/school', isOpen: true },
    { key: 'prodouts', title: '好物精選', isOpen: false, path: '/product' },
  ]);

  const navItemRecipes = [
    { title: '一人料理', path: '/solo' },
    { title: '家庭聚餐', path: '/solo' },
    { title: '浪漫晚餐', path: '/solo' },
    { title: '戶外料理', path: '/solo' },
    { title: '懶人快煮', path: '/solo' },
    { title: '健身/減糖餐', path: '/solo' },
    { title: '低預算料理', path: '/solo' },
    { title: '慶生/節慶料理', path: '/solo' },
  ];

  const navItemSchool = [
    { title: '植物性食材', path: '/school?category=vegetable' },
    { title: '動物性食材', path: '/school?category=meat' },
  ];

  // 登入狀態
  const isLogin = ref(localStorage.getItem('isLogin') === 'true');

  const memberMenuItem = computed(() => (isLogin.value ? menuItemLogin : menuItemLogout));

  // 登出
  const logout = () => {
    isLogin.value = false;
    localStorage.removeItem('isLogin');
  };

  // 登入前的會員選單
  const menuItemLogout = [
    { title: '登入', icon: 'login', action: 'login' },
    { title: '註冊', action: 'signin' },
  ];

  // 登入後的會員選單
  const menuItemLogin = [
    { title: '登出', icon: 'logout', action: 'logout' },
    { title: '會員資料', path: '/account' },
    { title: '消息通知', path: '/account/inform' },
    { title: '我的食譜', path: '/account/my-recipe' },
    { title: '食譜收藏', path: '/account/recipe-collect' },
    { title: '願望清單', path: '/account/wishlist' },
    { title: '訂單查詢', path: '/account/orders' },
  ];

  // 判斷是否為1200px以下
  const isMobile = ref(false);
  // 子選單hover/click判定
  const activeSubMenu = ref(null);
  // 漢堡選單開關
  const isHamMenuOpen = ref(false);
  // 漢堡選單內摺疊選單
  const openHamMenuItem = ref(null);
  // 選單開啟覆蓋陰影
  const overlayVisible = computed(() => activeSubMenu.value !== null && !isHamMenuOpen.value);

  // 桌面板hover
  const handleMouseOver = (menuKey) => {
    if (!isMobile.value) {
      activeSubMenu.value = menuKey;
    }
  };
  const handleMouseLeave = () => {
    if (!isMobile.value) {
      activeSubMenu.value = null;
    }
  };

  // 行動版會員click
  const handleClick = (menuKey) => {
    if (isMobile.value && menuKey === 'member') {
      activeSubMenu.value = activeSubMenu.value === menuKey ? null : menuKey;
    }
  };

  // 開關漢堡選單
  const toggleHamMenu = () => {
    isHamMenuOpen.value = !isHamMenuOpen.value;

    if (isHamMenuOpen.value) {
      activeSubMenu.value = null;
    }
  };

  // 開關漢堡選單內部選項
  const toggleHamItem = (key) => {
    openHamMenuItem.value = openHamMenuItem.value === key ? null : key;
  };

  // 檢查螢幕寬度
  const checkScreenWidth = () => {
    isMobile.value = window.innerWidth <= 1200;
    if (!isMobile.value) {
      activeSubMenu.value = null;
      isHamMenuOpen.value = false;
    }
  };

  // 監聽視窗大小變化
  onMounted(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenWidth);
  });

  // 登入/註冊彈窗
  const activeModal = ref(null);
  const ModalComponents = {
    login: LoginModal,
    signin: SigninModal,
    forgetpsw:ForgetPswModal,
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
    localStorage.setItem('isLogin', 'true');
    closeModal();
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  };

  const showToast = ref(false); // 顯示登入成功提示
</script>

<template>
  <div
    class="overlay"
    :class="{ active: overlayVisible }"
  ></div>

  <header
    class="header"
    :class="{ 'hidden-up': isHamMenuOpen }"
  >
    <RouterLink
      to="/"
      class="logo__link"
    >
      <img
        src="@/assets/image/logo.svg"
        alt="logo"
      />
    </RouterLink>

    <div class="menulist">
      <!-- 主導覽 -->
      <nav class="nav">
        <ul class="nav__list">
          <li
            v-for="item in navLinks"
            :key="item.key"
            class="nav__item"
            @mouseleave="handleMouseLeave()"
          >
            <RouterLink
              :to="item.path"
              v-if="item.isOpen"
              class="nav__link"
              @mouseover="handleMouseOver(item.key)"
            >
              {{ item.title }}
              <Icon
                icon-name="downA"
                class="nav__arrow"
              />
            </RouterLink>
            <RouterLink
              v-else
              :to="item.path"
              class="nav__link"
            >
              {{ item.title }}
            </RouterLink>

            <!-- 子選單 -->
            <div
              v-if="item.key === 'recipes'"
              class="nav__submenu"
              :class="{ 'is-active': activeSubMenu === 'recipes' }"
            >
              <div class="submenu__title">
                <RouterLink to="/recipe">靈感×食譜</RouterLink>
              </div>
              <div class="submenu__content recipes__grid">
                <RouterLink
                  v-for="recipe in navItemRecipes"
                  :key="recipe.title"
                  :to="recipe.path"
                  class="recipes__item"
                >
                  {{ recipe.title }}
                </RouterLink>
              </div>
            </div>

            <div
              v-if="item.key === 'school'"
              class="nav__submenu"
              :class="{ 'is-active': activeSubMenu === 'school' }"
            >
              <div class="submenu__title">
                <RouterLink to="/school">食材學堂</RouterLink>
              </div>
              <div class="submenu__content school__grid">
                <RouterLink
                  v-for="school in navItemSchool"
                  :key="school.title"
                  :to="school.path"
                  class="school__item"
                >
                  {{ school.title }}
                </RouterLink>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <!-- 右側icon -->
      <div class="actions">
        <div
          class="actions__member"
          @mouseleave="handleMouseLeave()"
        >
          <span class="actions__item">
            <Icon
              icon-name="member"
              class="actions__icon"
              @mouseover="handleMouseOver('member')"
            />
          </span>
          <!-- 會員子選單 -->
          <div
            class="member__menu"
            :class="{ 'is-active': activeSubMenu === 'member' }"
          >
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
              <RouterLink
                v-else
                :to="item.path"
                class="member__item"
              >
                {{ item.title }}
                <Icon
                  v-if="item.icon"
                  :icon-name="item.icon"
                  class="member__icon"
                />
              </RouterLink>
            </template>
          </div>
        </div>

        <RouterLink
          to="/cart"
          class="actions__item"
        >
          <Icon
            icon-name="cart"
            class="actions__icon"
          />
        </RouterLink>
      </div>

      <!-- 1200px以下 -->
      <div class="ham__section">
        <div
          class="actions__member"
          @click="handleClick('member')"
        >
          <span class="actions__item">
            <Icon
              icon-name="member"
              class="actions__icon"
            />
          </span>
          <!-- 會員子選單 -->
          <div
            class="member__menu"
            :class="{ 'is-active': activeSubMenu === 'member' }"
          >
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
              <RouterLink
                v-else
                :to="item.path"
                class="member__item"
              >
                {{ item.title }}
                <Icon
                  v-if="item.icon"
                  :icon-name="item.icon"
                  class="member__icon"
                />
              </RouterLink>
            </template>
          </div>
        </div>
        <div
          class="ham"
          @click="toggleHamMenu"
        ></div>
      </div>
    </div>
  </header>

  <div
    class="ham__overlay"
    :class="{ 'is-active': isHamMenuOpen }"
  >
    <nav class="ham__nav">
      <div class="ham__header">
        <RouterLink
          to="/"
          class="logo__link"
        >
          <img
            src="@/assets/image/logo.svg"
            alt="logo"
          />
        </RouterLink>
        <div
          class="ham__close"
          @click="toggleHamMenu"
        ></div>
      </div>

      <div class="ham__body">
        <ul class="ham__list">
          <li
            v-for="item in navLinks"
            :key="item.key"
            class="ham__item"
          >
            <div
              v-if="item.isOpen"
              class="ham__link has-submenu"
            >
              <RouterLink
                :to="item.path"
                class="ham__link-title"
                @click="toggleHamMenu"
              >
                {{ item.title }}
              </RouterLink>
              <button
                type="button"
                class="ham__arrow-btn"
                @click.stop="toggleHamItem(item.key)"
              >
                <Icon
                  v-if="openHamMenuItem !== item.key"
                  icon-name="downA"
                  class="ham__arrow"
                />
                <Icon
                  v-else
                  icon-name="upA"
                  class="ham__arrow"
                />
              </button>
            </div>
            <RouterLink
              v-else
              :to="item.path"
              class="ham__link"
              @click="toggleHamMenu"
            >
              {{ item.title }}
            </RouterLink>

            <!-- 子選單 -->
            <div
              v-if="item.isOpen"
              class="ham__submenu"
              :class="{ 'is-open': openHamMenuItem === item.key }"
            >
              <template v-if="item.key === 'recipes'">
                <RouterLink
                  v-for="recipe in navItemRecipes"
                  :key="recipe.title"
                  :to="recipe.path"
                  class="ham__subitem"
                  @click="toggleHamMenu"
                >
                  {{ recipe.title }}
                </RouterLink>
              </template>
              <template v-if="item.key === 'school'">
                <RouterLink
                  v-for="school in navItemSchool"
                  :key="school.title"
                  :to="school.path"
                  class="ham__subitem"
                  @click="toggleHamMenu"
                >
                  {{ school.title }}
                </RouterLink>
              </template>
            </div>
          </li>
        </ul>
      </div>
      <div class="ham__footer">
        <RouterLink
          to="/cart"
          class="ham__cart"
          @click="toggleHamMenu"
        >
          購物車
          <span class="cart__count">3</span>
        </RouterLink>
      </div>
    </nav>
  </div>

  <teleport to="body">
    <transition
      name="modal-fade"
      mode="out-in"
    >
      <component
        :key="activeModal"
        v-if="activeModal"
        :is="currentModalComponent"
        @close="closeModal"
        @login-success="loginSuccess"
        @switch-to-signin="openModal('signin')"
        @switch-to-login="openModal('login')"
        @switch-to-forgetpsw="openModal('forgetpsw')"
      />
    </transition>
  </teleport>
  <transition name="fade">
    <div
      v-if="showToast"
      class="toast"
    >
      登入成功！
    </div>
  </transition>
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
    transition:
      transform 0.4s ease-out,
      opacity 0.3s ease;
    @include rwdmax(1440) {
      height: 75px;
      padding: 10px 50px;
      top: 10px;
      left: 12px;
      right: 12px;
    }
    @include rwdmax(1200) {
      height: 70px;
      padding: 8px 40px;
      top: 10px;
      left: 10px;
      right: 10px;
      &.hidden-up {
        transform: translateY(-150%);
        opacity: 0;
        pointer-events: none;
      }
    }
    @include rwdmax(768) {
      height: 60px;
      padding: 8px 27px;
    }
  }
  .logo__link {
    display: flex;
    align-items: center;
    text-decoration: none;
    img {
      height: 86px;
      width: auto;
      display: block;
      @include rwdmax(1440) {
        height: 56px;
      }
      @include rwdmax(1200) {
        height: 47px;
      }
      @include rwdmax(768) {
        height: 45px;
      }
    }
  }

  // 主導覽
  .menulist {
    display: flex;
    align-items: center;
    gap: 230px;
    @include rwdmax(1440) {
      gap: 150px;
    }
    @include rwdmax(1200) {
      gap: 0;
    }
  }
  .nav {
    display: flex;
    align-items: center;
    .nav__list {
      display: flex;
      align-items: center;
      gap: 25px;
      position: relative;
      padding: 0;
      margin: 0;
      list-style: none;
      @include rwdmax(1440) {
        gap: 10px;
      }
      @include rwdmax(1200) {
        display: none;
      }
    }
  }
  .nav__item {
    position: relative;
    padding: 50px 20px;
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
    @include rwdmax(1440) {
      gap: 5px;
      @include fontSet(
        $font: $basic-font,
        $fw: bold,
        $size: px(16),
        $color: color(text, dark),
        $ls: 3px
      );
    }
    @include rwdmax(1200) {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .nav__arrow {
      @include font-size(30);
      color: color(text, dark);
      @include rwdmax(1440) {
        @include font-size(20);
        color: color(text, dark);
      }
    }
  }
  .nav__link:hover {
    color: color(button, main);
    .nav__arrow {
      @include font-size(30);
      color: color(button, main);
      @include rwdmax(1440) {
        @include font-size(20);
        color: color(button, main);
      }
    }
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

  .nav__submenu.is-active,
  .member__menu.is-active {
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
    @include rwdmax(1440) {
      border-radius: 15px;
      gap: 35px 20px;
      padding: 40px 190px;
    }
    .submenu__title {
      grid-column: 1/2;
      text-align: center;
      padding-right: 50px;
      border-right: 1px solid color(text, dark);
      @include rwdmax(1440) {
        padding-right: 0;
      }
      a {
        @include fontSet(
          $font: $basic-font,
          $fw: bold,
          $size: px(36),
          $color: color(text, dark),
          $ls: 4.8px
        );
        margin: 0;
        @include rwdmax(1440) {
          @include font-size(24);
        }
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
    @include rwdmax(1440) {
      gap: 20px 20px;
    }
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
    @include rwdmax(1440) {
      @include font-size(16);
      letter-spacing: 4px;
      padding: 7px;
    }
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
    @include rwdmax(1440) {
      @include font-size(16);
      letter-spacing: 4px;
      padding: 7px;
    }
    &:hover {
      background-color: color(button, main);
      color: color(text, light);
    }
  }
  // 右側icon選單
  .actions {
    display: flex;
    align-items: center;
    gap: 35px;
    @include rwdmax(1440) {
      gap: 15px;
    }
    @include rwdmax(1200) {
      display: none;
    }
    .actions__member {
      position: relative;
      padding: 50px 20px;
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
      @include rwdmax(1440) {
        @include font-size(25);
      }
    }
    @include rwdmax(1200) {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
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
    @include rwdmax(1440) {
      border-radius: 15px;
      width: 150px;
      gap: 8px;
      padding: 3px;
    }
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
      @include rwdmax(1440) {
        padding: 5px 20px;
        letter-spacing: 4px;
        @include font-size(16);
      }
    }
    .member__item:hover {
      background-color: color(button, main);
      border-radius: 20px;
      color: color(text, light);
    }
    .member__icon {
      @include font-size(24);
      @include rwdmax(1440) {
        @include font-size(16);
      }
    }
  }

  // 行動版右側選單
  .ham__section {
    display: flex;
    position: relative;
    gap: 30px;
    @include rwdmin(1200) {
      display: none;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .actions__icon {
      @include font-size(25);
      color: color(text, dark);
    }
    .member__menu {
      width: 200px;
      gap: 5px;
      .member__item {
        @include font-size(18);
        padding: 10px 20px;
      }
      .member__icon {
        @include font-size(20);
      }
    }
    .ham {
      position: relative;
      width: 25px;
      height: 13px;
      display: block;
      cursor: pointer;
      margin: auto 0;

      &::before,
      &::after {
        content: '';
        height: 2px;
        width: 100%;
        background: color(text, dark);
        position: absolute;
        display: block;
      }
      &::before {
        top: 0;
      }
      &::after {
        bottom: 0;
      }
    }
  }

  // 漢堡選單
  .ham__overlay {
    z-index: 70;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    transition: opacity 0.4s ease;
    &.is-active {
      pointer-events: auto;
      opacity: 1;
      .ham__nav {
        transform: translateY(0);
      }
    }
  }
  .ham__nav {
    transform: translateY(-100%);
    transition: transform 0.3s ease-out;
    background: color(backgroundColor, beige);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    border-radius: 15px;
    padding: 8px 40px;
    overflow: auto;
    @include rwdmax(768) {
      padding: 8px 27px;
    }
  }
  .ham__header {
    display: flex;
    justify-content: space-between;
    .ham__close {
      position: relative;
      width: 25px;
      height: 13px;
      display: block;
      cursor: pointer;
      margin: auto 0;

      &::before,
      &::after {
        content: '';
        height: 2px;
        width: 100%;
        background: color(text, dark);
        position: absolute;
        display: block;
        top: 50%;
        right: 0;
      }
      &::before {
        transform: rotate(30deg);
      }
      &::after {
        transform: rotate(-30deg);
      }
    }
  }
  .ham__body {
    flex-grow: 1;
    padding: 25px 5px;
    @include rwdmax(768) {
      padding: 0px 5px;
    }
  }
  .ham__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .ham__item {
    text-decoration: none;
  }
  .ham__link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 5px;
    text-decoration: none;
    cursor: pointer;
    @include fontSet(
      $font: $basic-font,
      $fw: bold,
      $size: px(20),
      $color: color(text, dark),
      $ls: 4.8px
    );
    @include rwdmax(768) {
      @include fontSet(
        $font: $basic-font,
        $fw: bold,
        $size: px(18),
        $color: color(text, dark),
        $ls: 4.8px
      );
    }
    & {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    &.has-submenu {
      padding: 0;
    }
  }
  .ham__link-title {
    padding: 15px 5px;
    flex-grow: 1;
    text-decoration: underline;
    text-underline-offset: 3px;
    color: inherit;
  }
  .ham__arrow-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 15px;
    flex-shrink: 0;
    color: color(text, dark);
    .ham__arrow {
      display: block;
      @include font-size(30);
    }
  }
  // 漢堡子選單
  .ham__submenu {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-out;
    padding-left: 15px;
    &.is-open {
      max-height: 500px;
    }
  }
  .ham__subitem {
    display: block;
    padding: 10px 0;
    text-decoration: underline;
    text-underline-offset: 4px;
    @include fontSet(
      $font: $basic-font,
      $fw: bold,
      $size: px(16),
      $color: color(text, base),
      $ls: 4px
    );
  }
  .ham__footer {
    padding: 25px;
    flex-shrink: 0;
    @include rwdmax(768) {
      padding: 25px 0;
    }
  }
  .ham__cart {
    display: flex;
    background-color: color(backgroundColor, recipe);
    border-radius: 20px;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px;
    text-decoration: none;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(18),
      $color: color(text, light),
      $ls: 4px
    );
    .cart__count {
      display: inline-block;
      width: 23px;
      height: 23px;
      border-radius: 50%;
      background-color: color(orangeColor, base);
      text-align: center;
      line-height: 22px;
      margin-left: 5px;
      @include font-size(16);
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

  .toast {
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    background: color(text, light);
    color: color(button, main);
    padding: 0.6em 1.2em;
    border-radius: 0.4em;
    font-size: 20px;
    pointer-events: none;
    z-index: 20;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
</style>

<!-- //登入&註冊的燈箱轉換 -->
<style lang="scss">
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.8s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  .modal-fade-enter-to,
  .modal-fade-leave-from {
    opacity: 1;
  }
</style>
