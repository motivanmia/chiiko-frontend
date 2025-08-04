import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import AccountPage from '@/pages/AccountPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          // 待更換新頁面
        },
        {
          path: 'inform',
          name: 'inform',
          component: () => import('@/components/member/MemberProfile.vue'),
          // 待更換新頁面
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
          component: () => import('@/components/member/MemberDesire.vue'),
          // 待更換新頁面
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/components/member/MemberProfile.vue'),
          // 待更換新頁面
        },
      ],
    },
    ,
    {
      path: '/school',
      name: 'school',
      component: () => import('@/pages/SchoolPage.vue'),
    },
    {
      path: '/recipe-detail',
      name: 'recipe-detail',
      component: () => import('@/pages/RecipeDetailPage.vue'),
    },
    {
      path: '/recipe-edit',
      name: 'recipe-edit',
      component: () => import('@/pages/RecipeEditPage.vue'),
    },
    {
      path: '/recipe',
      name: 'recipe',
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
  ],
});

export default router;
