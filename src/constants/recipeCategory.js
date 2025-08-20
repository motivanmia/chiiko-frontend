// 食譜分類的情境名稱
export const categoryName = [
  {
    id: 1,
    title: '一人料理',
    key:'solo-meal', // <-- 作為動態路由的參數
    image: new URL('@/assets/image/Recipes/solo-meal.jpg', import.meta.url).href,
    indexImage: new URL('@/assets/image/Home/index-solo-meal.jpg', import.meta.url).href,
  },
  {
    id: 2,
    title: '家庭聚餐',
    key:'family-feast',
    image: new URL('@/assets/image/Recipes/family-feast.jpg', import.meta.url).href,
    indexImage: new URL('@/assets/image/Home/index-family-feast.jpg', import.meta.url).href,
  },
  {
    id: 3,
    title: '浪漫晚餐',
    key:'romantic-dinner',
    image: new URL('@/assets/image/Recipes/romantic-dinner.jpg', import.meta.url).href,
    indexImage: new URL('@/assets/image/Home/index-romantic-dinner.jpg', import.meta.url).href,
  },
  {
    id: 4,
    title: '戶外料理',
    key:'outdoor-cooking',
    image: new URL('@/assets/image/Recipes/outdoor-cooking.jpg', import.meta.url).href,
    indexImage: new URL('@/assets/image/Home/index-outdoor-cooking.jpg', import.meta.url).href,
  },
  {
    id: 5,
    title: '懶人快煮',
    key:'quick-easy',
    image: new URL('@/assets/image/Recipes/quick-easy.jpg', import.meta.url).href,
    indexImage: new URL('@/assets/image/Home/index-quick-easy.jpg', import.meta.url).href,
  },
  {
    id: 6,
    title: '健身/減糖餐',
    key:'low-crab',
    image: new URL('@/assets/image/Recipes/low-crab.jpg', import.meta.url).href,
    indexImage: new URL('@/assets/image/Home/index-low-carb.jpg', import.meta.url).href,
  },
  {
    id: 7,
    title: '低預算料理',
    key:'cheap',
    image: new URL('@/assets/image/Recipes/cheap.jpg', import.meta.url).href,
    indexImage: new URL('@/assets/image/Home/index-cheap.jpg', import.meta.url).href,
  },
  {
    id: 8,
    title: '慶生/節慶料理',
    key:'holiday',
    image: new URL('@/assets/image/Recipes/holiday.jpg', import.meta.url).href,
    indexImage: new URL('@/assets/image/Home/index-holiday.jpg', import.meta.url).href,
  },
];