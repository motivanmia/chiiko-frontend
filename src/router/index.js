import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import AccountPage from '@/pages/AccountPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      behavior: 'smooth',
    };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/account',
      component: AccountPage,
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
          path: 'order-detail',
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
    },
    {
      path: '/recipe-overview',
      name: 'recipe-overview',
      component: () => import('@/pages/RecipeOverview.vue'),
    },
    {
      path: '/product',
      name: 'product',
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
    },
    {
      path: '/order-success',
      name: 'order-success',
      component: () => import('@/pages/OrderSuccessPage.vue'),
    },
    // {
    //   path: '/solo',
    //   name: 'solo',
    //   component: () => import('@/pages/RecipeSolo.vue'),
    // },
    {
      path: '/recipes/:category',
      name: 'recipes',
      component: () => import('@/pages/RecipeCategoryPage.vue'),
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

export default router;
