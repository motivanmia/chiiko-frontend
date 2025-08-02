import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import AccountPage from '@/pages/AccountPage.vue';
import SchoolPage from '@/pages/SchoolPage.vue';
import RecipeDetailPage from '@/pages/RecipeDetailPage.vue';
import RecipeEditPage from '@/pages/RecipeEditPage.vue';
import RecipeOverview from '@/pages/RecipeOverview.vue';

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
      name: 'account',
      component: AccountPage,
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
  ],
});

export default router;
