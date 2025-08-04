import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import AccountPage from '@/pages/AccountPage.vue';
import SchoolPage from '@/pages/SchoolPage.vue';
import RecipeDetailPage from '@/pages/RecipeDetailPage.vue';
import RecipeEditPage from '@/pages/RecipeEditPage.vue';
import RecipeOverview from '@/pages/RecipeOverview.vue';
import RecipeSolo from '@/pages/RecipeSolo.vue';
import RecipeSearch from '@/pages/RecipeSearch.vue';
import RescipeSearchNone from '@/pages/RecipeSearchNone.vue';
import RecipeSearchNone from '@/pages/RecipeSearchNone.vue';

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
          component: () => import('@/components/member/MemberPwd.vue'),
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
          component: () => import('@/components/member/MemberProfile.vue'),
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
    {
      path: '/school',
      name: 'school',
      component: SchoolPage 
    },
    { 
      path: '/RecipeDetail', 
      name: 'RecipeDetail', 
      component: RecipeDetailPage 
    },
    { 
      path: '/RecipeEdit', 
      name: 'RecipeEdit', 
      component: RecipeEditPage 
    },
    {
      path: '/recipe',
      name: 'recipe',
      component: RecipeOverview
    },
    {
      path: '/solo',
      name: 'solo',
      component: RecipeSolo
    },
    {
      path: '/search',
      name: 'search',
      component: RecipeSearch
    },
    {
      path: '/none',
      name: 'none',
      component: RecipeSearchNone
    },
  ],
});

export default router;
