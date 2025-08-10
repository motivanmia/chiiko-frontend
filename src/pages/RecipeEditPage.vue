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
        <ImageUploader />

        <!-- ⭐️ 關鍵 1: 將 FormField 替換為【InputSingleline】 -->
        <!-- 這個組件是固定高度、不換行的 -->
        <InputSingleline
          label="輸入食譜名稱"
          v-model="form.title"
          :maxLength="15"
          :warning="titleWarning"
          :placeholder="'例：香煎豆腐卷（最多15字）'"
        />

        <!-- ⭐️ 關鍵 2: 將 FormField 替換為【TextareaAutosize】 -->
        <!-- 這個組件是可自動增高、會自動折行的，並且不再需要 slot -->
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
  import { reactive, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import Icon from '@/components/common/Icon.vue';
  import BaseButton from '@/components/common/BaseButton.vue';
  import ImageUploader from '@/components/recipe-editor/ImageUploader.vue';
  import TagInput from '@/components/recipe-editor/TagInput.vue';
  import RecipeMeta from '@/components/recipe-editor/RecipeMeta.vue';
  import IngredientsManager from '@/components/recipe-editor/IngredientsManager.vue';
  import StepsManager from '@/components/recipe-editor/StepsManager.vue';

  // ⭐️ 關鍵 3: 引入兩個全新的、獨立的組件，並移除舊的 FormField
  import InputSingleline from '@/components/recipe-editor/InputSingleline.vue';
  import TextareaAutosize from '@/components/recipe-editor/TextareaAutosize.vue';

  // --- 以下您的 Script 邏輯完全不需要修改 ---

  const router = useRouter();
  const goBack = () => router.back();

  const form = reactive({
    title: '',
    description: '',
    tags: [],
    category: 'single',
    time: 5,
    servings: 2,
    ingredients: [{ name: '', amount: '' }],
    steps: [''],
  });

  const titleWarning = computed(() => (form.title.length > 15 ? '標題不能超過 15 字喔！' : ''));

  const descriptionWarning = computed(() =>
    form.description.length > 40 ? '內文太長囉，麻煩請幫我濃縮在40字以內！' : '',
  );

  const saveDraft = () => alert('草稿已儲存');

  const publishRecipe = () => {
    const errors = [];
    if (!form.title.trim()) {
      errors.push('請輸入食譜名稱。');
    }
    if (!form.description.trim()) {
      errors.push('請輸入簡介。');
    }
    if (form.tags.length === 0) {
      errors.push('請至少新增一個食譜標籤。');
    }
    if (form.ingredients.some((item) => !item.name.trim() || !item.amount.trim())) {
      errors.push('所有「所需食材」和「份量」的欄位都必須填寫。');
    }
    if (form.steps.some((step) => !step.trim())) {
      errors.push('所有「料理步驟」都必須填寫內容。');
    }
    if (errors.length > 0) {
      alert('請修正以下問題：\n\n- ' + errors.join('\n- '));
      return;
    }
    alert('🎉 食譜已成功發布！');
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
