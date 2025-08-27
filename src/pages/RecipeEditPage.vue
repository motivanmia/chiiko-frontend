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
        <h1 class="recipe-editor__title">{{ pageTitle }}</h1>

        <ImageUploader
          @update:file="file = $event"
          :initial-image="existingImageUrl"
        />

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
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
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
  import { useUserStore } from '@/stores/user';
  import { useRecipeStore } from '@/stores/recipeStore';
  import Swal from 'sweetalert2';

  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const recipeStore = useRecipeStore();

  const goBack = () => router.back();

  const recipeId = computed(() => route.params.id || null);
  const isEditMode = computed(() => !!recipeId.value);
  const pageTitle = computed(() => (isEditMode.value ? '編輯食譜' : '新增食譜'));

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
  const existingImageUrl = ref('');

  const titleWarning = computed(() => (form.title.length > 15 ? '標題不能超過 15 字喔！' : ''));
  const descriptionWarning = computed(() =>
    form.description.length > 40 ? '內文太長囉，麻煩請幫我濃縮在40字以內！' : '',
  );

  const syncFormDataWithStore = (recipeData) => {
    if (!recipeData) return;
    form.title = recipeData.name;
    form.description = recipeData.content;
    form.tags = recipeData.tag ? recipeData.tag.split('#').filter(Boolean) : [];
    const currentCategory = categories.find((cat) => cat.id === recipeData.recipe_category_id);
    form.category = currentCategory ? currentCategory.value : 'single';
    form.time = recipeData.cooked_time;
    form.servings = recipeData.serving;
    form.ingredients =
      recipeData.ingredients?.length > 0 ? recipeData.ingredients : [{ name: '', amount: '' }];
    form.steps = recipeData.steps?.length > 0 ? recipeData.steps.map((s) => s.content) : [''];
    existingImageUrl.value = recipeData.image;
  };

  onMounted(async () => {
    if (isEditMode.value && recipeId.value) {
      await recipeStore.fetchRecipeById(recipeId.value);
      if (recipeStore.currentRecipe) {
        syncFormDataWithStore(recipeStore.currentRecipe);
      } else {
        alert('找不到該食譜資料，將返回前頁。');
        router.back();
      }
    }
  });

  const uploadImage = async () => {
    if (!file.value) {
      return existingImageUrl.value;
    }
    const apiBase = import.meta.env.VITE_API_BASE;
    const formData = new FormData();
    formData.append('image', file.value);
    const imageResponse = await axios.post(`${apiBase}/recipe/upload_image.php`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const imagePath = imageResponse.data.imagePath;
    if (!imagePath) throw new Error('後端未成功回傳圖片路徑');
    return imagePath;
  };

  const createOrUpdateRecipe = async (imagePath, statusCode) => {
    const apiBase = import.meta.env.VITE_API_BASE;
    const selectedCategory = categories.find((cat) => cat.value === form.category);

    // 🚩 核心修正：處理空值，確保所有欄位都有值
    const recipePayload = {
      ...(isEditMode.value && { recipe_id: recipeId.value }),
      manager_id: null,
      recipe_category_id: selectedCategory ? selectedCategory.id : null,
      name: form.title || '',
      content: form.description || '',
      serving: form.servings || '',
      image: imagePath || '',
      cooked_time: form.time || '',
      status: statusCode,
      tag: form.tags.length > 0 ? form.tags.map((tag) => `#${tag}`).join('') : '',
      views: 0,
    };

    const recipeApiEndpoint = isEditMode.value
      ? `${apiBase}/recipe/update_recipe.php`
      : `${apiBase}/recipe/post_recipe.php`;

    const recipeResponse = await axios.post(recipeApiEndpoint, recipePayload);

    const targetRecipeId = isEditMode.value ? recipeId.value : recipeResponse.data.recipe_id;
    if (!targetRecipeId) {
      throw new Error('後端未回傳有效的 recipe_id');
    }
    return targetRecipeId;
  };

  const updateRelatedData = async (targetRecipeId) => {
    const apiBase = import.meta.env.VITE_API_BASE;
    const validIngredients = form.ingredients.filter((item) => item.name && item.amount);
    if (validIngredients.length > 0) {
      await axios.post(`${apiBase}/recipe/post_ingredients.php`, {
        recipe_id: targetRecipeId,
        ingredients: validIngredients,
        mode: isEditMode.value ? 'replace' : 'append',
      });
    }

    const validSteps = form.steps.filter((step) => step && step.trim());
    if (validSteps.length > 0) {
      await axios.post(`${apiBase}/recipe/post_steps.php`, {
        recipe_id: targetRecipeId,
        steps: validSteps,
        mode: isEditMode.value ? 'replace' : 'append',
      });
    }
  };

  const submitRecipe = async (statusCode) => {
    // 顯示「正在處理」的提示
    Swal.fire({
      title: '處理中...',
      text: '請稍後，正在上傳您的食譜...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const apiBase = import.meta.env.VITE_API_BASE;
      const selectedCategory = categories.find((cat) => cat.value === form.category);

      // 🚩 核心修正：將所有資料打包在 FormData 中
      const formData = new FormData();
      if (isEditMode.value) {
        formData.append('recipe_id', recipeId.value);
      }
      // 從 userStore 取得 user_id，如果沒有則不傳送
      if (userStore.user?.user_id) {
        formData.append('user_id', userStore.user.user_id);
      }
      formData.append('manager_id', '');
      formData.append('recipe_category_id', selectedCategory ? selectedCategory.id : '');
      formData.append('name', form.title || '');
      formData.append('content', form.description || '');
      formData.append('serving', form.servings || '');
      formData.append('cooked_time', form.time || '');
      formData.append('status', statusCode);
      formData.append(
        'tag',
        form.tags.length > 0 ? form.tags.map((tag) => `#${tag}`).join('') : '',
      );
      formData.append('views', 0);

      // 處理圖片：如果有新檔案則上傳，否則傳送現有圖片路徑
      if (file.value) {
        formData.append('image', file.value);
      } else if (existingImageUrl.value) {
        formData.append('image', existingImageUrl.value);
      } else {
        formData.append('image', '');
      }

      // 將食材和步驟陣列 JSON 序列化後再傳送
      formData.append('ingredients', JSON.stringify(form.ingredients));
      formData.append('steps', JSON.stringify(form.steps));

      const recipeApiEndpoint = isEditMode.value
        ? `${apiBase}/admin/recipe/update_recipe.php`
        : `${apiBase}/admin/recipe/post_recipe.php`;

      // 只發送一個請求
      const response = await axios.post(recipeApiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.close();

      const result = response.data;
      if (result.status === 'success') {
        const successTitle = isEditMode.value ? '食譜已成功更新！' : '食譜已成功發布！';
        Swal.fire({
          icon: 'success',
          title: successTitle,
          text: '您的食譜已成功送出！',
          showConfirmButton: false,
          timer: 1500,
        });
        router.push({ name: 'my-recipe' });
      } else {
        throw new Error(result.message || '後端回傳了錯誤');
      }
    } catch (error) {
      console.error('操作食譜時發生錯誤:', error);
      const errorMessage =
        error.response?.data?.message || error.message || '操作失敗，請檢查網路連線或稍後再試。';
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: '操作失敗',
        text: errorMessage,
      });
    }
  };

  const saveDraft = () => {
    if (!form.title.trim()) {
      Swal.fire({
        icon: 'warning',
        title: '請至少輸入食譜名稱，才能儲存草稿喔！',
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    submitRecipe(3);
  };

  const publishRecipe = () => {
    const errors = [];
    if (!form.title.trim()) errors.push('請輸入食譜名稱。');
    if (!form.description.trim()) errors.push('請輸入簡介。');
    if (!isEditMode.value && !file.value && !existingImageUrl.value) {
      errors.push('請上傳一張食譜圖片。');
    }
    if (form.tags.length === 0) errors.push('請至少新增一個食譜標籤。');
    if (form.ingredients.some((item) => !item.name.trim() || !item.amount.trim())) {
      errors.push('所有「所需食材」和「份量」的欄位都必須填寫。');
    }
    if (form.steps.some((step) => !step.trim())) {
      errors.push('所有「料理步驟」都必須填寫內容。');
    }

    if (errors.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: '發布前請修正以下問題：',
        html: `<ul>${errors.map((err) => `<li>${err}</li>`).join('')}</ul>`,
        confirmButtonText: '確定',
      });
      return;
    }
    submitRecipe(0);
  };
</script>

<style lang="scss" scoped>
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
