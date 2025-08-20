<template>
  <div class="page-container">
    <RouterLink
      to="/"
      tag="button"
      class="back-button"
      @click="goBack"
    >
      <Icon icon-name="leftA" />
      回前頁
    </RouterLink>

    <div class="recipe-editor">
      <div class="form-content-wrapper">
        <h1 class="recipe-editor__title">編輯食譜</h1>

        <!-- ⭐️ 關鍵修改 1: 監聽子層的 @update:file 事件，並將檔案存到 file ref 中 -->
        <ImageUploader @update:file="file = $event" />

        <InputSingleline
          label="輸入食譜名稱"
          v-model="form.title"
          :maxLength="15"
          :warning="titleWarning"
          :placeholder="'例：香煎豆腐卷（最多15字）'"
        />

        <TextareaAutosize
          label="簡介"
          v-model="form.description"
          :maxLength="40"
          :initial-height="135"
          :warning="descriptionWarning"
          :placeholder="'請輸入食譜描述（最多40字）'"
        />

        <TagInput v-model="form.tags" />
        <RecipeMeta
          :categories="categories"
          v-model:category="form.category"
          v-model:time="form.time"
          v-model:servings="form.servings"
        />
        <IngredientsManager v-model="form.ingredients" />
        <StepsManager v-model="form.steps" />
      </div>
    </div>

    <div class="action-group">
      <BaseButton
        @click="saveDraft"
        variant="secondary"
        class="action-button-override"
      >
        暫存草稿
      </BaseButton>
      <BaseButton
        @click="publishRecipe"
        variant="primary"
        class="action-button-override"
      >
        發布食譜
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import Icon from '@/components/common/Icon.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  import ImageUploader from '@/components/recipe-editor/ImageUploader.vue';
  import TagInput from '@/components/recipe-editor/TagInput.vue';
  import RecipeMeta from '@/components/recipe-editor/RecipeMeta.vue';
  import IngredientsManager from '@/components/recipe-editor/IngredientsManager.vue';
  import StepsManager from '@/components/recipe-editor/StepsManager.vue';
  import InputSingleline from '@/components/recipe-editor/InputSingleline.vue';
  import TextareaAutosize from '@/components/recipe-editor/TextareaAutosize.vue';

  const router = useRouter();
  const goBack = () => router.back();

  // ⭐️ 核心修正 1: 將 categories 陣列的定義「提升」到函式外部
  // 這樣 <template> 和 publishRecipe 函式就都能訪問到它了
  const categories = [
    { value: 'single', label: '一人料理', id: 1 },
    { value: 'family', label: '家庭聚餐', id: 2 },
    { value: 'romantic', label: '浪漫晚餐', id: 3 },
    { value: 'outdoor', label: '戶外料理', id: 4 },
    { value: 'lazy', label: '懶人快煮', id: 5 },
    { value: 'fitness', label: '健身/減糖餐', id: 6 },
    { value: 'budget', label: '低預算料理', id: 7 },
    { value: 'festival', label: '慶生/節慶料理', id: 8 },
  ];

  const form = reactive({
    title: '',
    description: '',
    tags: [],
    category: 'single',
    time: '5~10',
    servings: '1~2',
    ingredients: [{ name: '', amount: '' }],
    steps: [''],
  });

  const file = ref(null);

  const titleWarning = computed(() => (form.title.length > 15 ? '標題不能超過 15 字喔！' : ''));

  const descriptionWarning = computed(() =>
    form.description.length > 40 ? '內文太長囉，麻煩請幫我濃縮在40字以內！' : '',
  );

  const saveDraft = () => alert('草稿已儲存');

  const publishRecipe = async () => {
    // --- 前端基本驗證 ---
    const errors = [];
    if (!form.title.trim()) errors.push('請輸入食譜名稱。');
    if (!form.description.trim()) errors.push('請輸入簡介。');
    if (!file.value) errors.push('請上傳一張食譜圖片。');
    // ... 其他驗證 ...

    if (errors.length > 0) {
      alert('請修正以下問題：\n\n- ' + errors.join('\n- '));
      return;
    }

    try {
      // ⭐️ 核心修正 2: categories 的定義已經移到外面，所以這裡不需要再定義

      // 根據使用者選擇的 form.category，去陣列中找到完整的物件
      const selectedCategory = categories.find((cat) => cat.value === form.category);

      const apiBase = import.meta.env.VITE_API_BASE;
      let imagePath = '';

      // --- 階段一：上傳【圖片】---
      const formData = new FormData();
      formData.append('image', file.value);
      const imageResponse = await axios.post(`${apiBase}/recipe/upload_image.php`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      imagePath = imageResponse.data.imagePath;
      if (!imagePath) throw new Error('後端未成功回傳圖片路徑');

      // --- 階段二：發佈【主食譜】資訊 ---
      const recipePayload = {
        user_id: 1,
        manage_id: null,
        // 從找到的物件中，安全地取出 id 作為要傳送的值
        recipe_categary_id: selectedCategory ? selectedCategory.id : null,
        name: form.title,
        content: form.description,
        serving: form.servings,
        image: imagePath,
        cooked_time: form.time,
        status: 0,
        tag: form.tags.map((tag) => `#${tag}`).join(''),
      };

      const recipeResponse = await axios.post(`${apiBase}/recipe/post_recipe.php`, recipePayload);
      const newRecipeId = recipeResponse.data.recipe_id;
      if (!newRecipeId) throw new Error('後端未回傳 recipe_id');

      // --- 階段三 & 四：發佈【食材】與【步驟】 ---
      const ingredientsPayload = {
        recipe_id: newRecipeId,
        ingredients: form.ingredients.filter((item) => item.name && item.amount),
      };
      await axios.post(`${apiBase}/recipe/post_ingredients.php`, ingredientsPayload);

      const stepsPayload = {
        recipe_id: newRecipeId,
        steps: form.steps.filter((step) => step),
      };
      await axios.post(`${apiBase}/recipe/post_steps.php`, stepsPayload);

      // --- 如果全部成功 ---
      alert('🎉 您的美味食譜已成功發布！');
      router.push('/');
    } catch (error) {
      // --- 統一的錯誤處理 ---
      console.error('發布食譜時發生錯誤:', error);
      const errorMessage = error.response?.data?.error || '發布失敗，請檢查網路連線或稍後再試。';
      alert(`發布失敗：\n${errorMessage}`);
    }
  };
</script>

<style lang="scss" scoped>
  /* 
  您所有的頁面樣式都【無需修改】，因為新組件的 class 結構與舊的一致，
  所以您寫的 :deep() 樣式會繼續正常運作。
*/
  .page-container {
    position: relative;
    padding: 100px 32px 180px 32px;
    letter-spacing: 1.2px;
  }

  .back-button {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(calc(-600px - 150px));
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #d6b59c;
    border: none;
    border-radius: 20px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.2s ease;
    text-decoration: none;

    &:hover {
      background-color: #d8c9b8;
    }
  }

  .recipe-editor {
    width: 1200px;
    max-width: 100%;
    background-color: #ead7c4;
    padding: 32px;
    border-radius: 20px;
    box-sizing: border-box;
    margin: 0 auto;
  }

  .form-content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
  .form-content-wrapper > * {
    margin: 0;
  }
  input,
  textarea {
    font-size: 20px;
  }
  :deep(.tag-input-component) + :deep(.recipe-meta-component) {
    margin-top: 15px;
  }
  :deep(.recipe-meta-component) + :deep(.ingredients-manager-component) {
    margin-top: 70px;
  }

  .recipe-editor__title {
    font-size: 32px;
    text-align: center;
    font-weight: bold;
  }

  .action-group {
    display: flex;
    justify-content: space-between;
    width: 800px;
    max-width: 100%;
    margin: 100px auto 0;
  }

  .action-button-override {
    width: 320px;
    font-size: 32px;
  }

  @media (max-width: 1500px) {
    .page-container {
      padding: 20px 10px 80px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .back-button {
      position: static;
      transform: none;
      margin: 0 0 20px 0;
      align-self: flex-start;
    }

    .recipe-editor {
      width: 100%;
      padding: 20px 10px;
    }

    .recipe-editor__title {
      font-size: 28px;
    }

    :deep(.form-field),
    :deep(.form-section),
    :deep(.meta-row) {
      width: 100% !important;
      max-width: 100% !important;
    }

    .action-group {
      flex-direction: row;
      width: 100%;
      gap: 16px;
      margin-top: 40px;
    }
    .action-button-override {
      width: 100%;
      font-size: 24px;
    }
  }
</style>
