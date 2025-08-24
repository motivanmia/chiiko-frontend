import { createRouter, createWebHistory, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// 全局前置守衛
const apiBase = import.meta.env.VITE_API_BASE;
async function checkAndSetAuthState() {
  const authStore = useAuthStore();
  try {
    // 引入check_session api
    const response = await fetch(`${apiBase}/users/check_session.php`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      // 在這裡主動更新 Pinia Store 的狀態
      authStore.isLoggedIn = data.is_logged_in;
      if (data.is_logged_in) {
        authStore.user = data.user;
      }
      return data.is_logged_in;
    }
    // API 回應不成功，將狀態設為登出
    authStore.isLoggedIn = false;
    authStore.user = null;
    return false;
  } catch (error) {
    console.error('Session check failed:', error);
    // 網路錯誤，將狀態設為登出
    authStore.isLoggedIn = false;
    authStore.user = null;
    return false;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    // query 有變不滾動
    const samePath = to.path === from.path;
    const queryChanged = samePath && JSON.stringify(to.query) !== JSON.stringify(from.query);

    if (queryChanged) {
      return false;
    }

    return { left: 0, top: 0, behavior: 'smooth' };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/account',
      component: () => import('@/pages/AccountPage.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/account/profile',
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/components/member/MemberProfile.vue'),
        },
        {
          path: 'password',
          name: 'password',
          component: () => import('@/components/member/MemberChangePwd.vue'),
        },
        {
          path: 'inform',
          name: 'inform',
          component: () => import('@/components/member/MemberInform.vue'),
        },
        {
          path: 'my-recipe',
          name: 'my-recipe',
          component: () => import('@/components/member/MemberRecipe.vue'),
        },
        {
          path: 'recipe-collect',
          name: 'recipe-collect',
          component: () => import('@/components/member/MemberCollect.vue'),
        },
        {
          path: 'wishlist',
          name: 'wishlist',
          component: () => import('@/components/member/MemberWish.vue'),
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/components/member/MemberOrder.vue'),
        },
        {
          path: 'order-detail/:id',
          name: 'order-detail',
          component: () => import('@/components/member/MemberOrderDetail.vue'),
        },
      ],
    },
    {
      path: '/school',
      name: 'school',
      component: () => import('@/pages/SchoolPage.vue'),
    },
    {
      path: '/recipe-detail/:id',
      name: 'recipe-detail',
      component: () => import('@/pages/RecipeDetailPage.vue'),
    },
    {
      path: '/recipe-edit',
      name: 'recipe-edit',
      component: () => import('@/pages/RecipeEditPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import('@/pages/RecipeOverview.vue'),
    },
    {
      path: '/recipes/:category?',
      name: 'recipes',
      component: () => import('@/pages/RecipeCategoryPage.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/pages/ProductPage.vue'),
    },
    {
      path: '/product-detail',
      name: 'product-detail',
      component: () => import('@/pages/ProductContent.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/pages/CartPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/order-success',
      name: 'order-success',
      component: () => import('@/pages/OrderSuccessPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/pages/RecipeSearch.vue'),
    },
    {
      path: '/none',
      name: 'none',
      component: () => import('@/pages/RecipeSearchNone.vue'),
    },
  ],
});

// 全局導航守衛
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const authStore = useAuthStore();

  // 在每次導航前，先同步 Pinia Store 的登入狀態
  const isAuthenticated = await checkAndSetAuthState();

  if (requiresAuth && !authStore.isLoggedIn) {
    // 儲存用戶想去的路徑
    authStore.setRedirectPath(to.fullPath);

    authStore.openModal('login');

    // 導向到一個不會被攔截的頁面，例如首頁
    if (from.name !== 'home') {
      // 避免無限循環
      next({ name: 'home' });
    } else {
      next(false); // 停在原地，只彈出燈箱
    }
  } else {
    // 如果不需要驗證，或用戶已登入，則正常放行
    next();
  }
});

export default router;
