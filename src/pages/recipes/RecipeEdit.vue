<script setup></script>

<template>
  <div class="recipe-editor">
    <div class="recipe-editortatale">
      <h1 class="recipe-editor__title">編輯食譜</h1>

      <!-- 拖曳上傳區 -->
      <div
        class="recipe-editor__upload-zone"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <!-- 預覽圖片 -->
        <img
          v-if="previewUrl"
          :src="previewUrl"
          class="recipe-editor__image-preview"
        />

        <!-- 提示文字與按鈕 -->
        <div class="recipe-editor__upload-content">
          <p class="recipe-editor__upload-text">拖曳圖片到這裡即可上傳</p>
          <button
            type="button"
            @click="triggerFile"
            class="recipe-editor__button"
          >
            選擇檔案
          </button>
        </div>

        <!-- 隱藏檔案輸入 -->
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          class="recipe-editor__file-input"
          @change="handleFileChange"
        />
      </div>

      <!-- 食譜名稱 -->
      <div class="recipe-editor__field">
        <label class="recipe-editor__name">輸入食譜名稱</label>
        <input
          v-model="form.title"
          placeholder="例：香煎豆腐卷（最多15字）"
          maxlength="15"
          class="recipe-editor__input"
        />
        <p
          v-if="titleWarning"
          class="recipe-editor__warning"
        >
          {{ titleWarning }}
        </p>
      </div>

      <!-- 簡介 -->
      <div class="recipe-editor__description">
        <label class="recipe-editor__label">食譜簡介</label>
        <textarea
          v-model="form.description"
          placeholder="輸入食譜描述（最多40字）"
          maxlength="40"
          class="recipe-editor__textarea"
        ></textarea>
        <p
          v-if="descriptionWarning"
          class="recipe-editor__warninglabel"
        >
          {{ descriptionWarning }}
        </p>
      </div>
      <!-- 食譜標籤 -->
      <div class="recipe-editor__tatletag">
        <label class="recipe-editor__treetag">食譜標籤（最多3個）</label>

        <div class="recipe-editor__tag-container">
          <!-- 顯示標籤-->
          <span
            v-for="(tag, index) in form.tags"
            :key="index"
            class="recipe-editor__tag"
          >
            #{{ tag }}
          </span>

          <!-- 輸入欄 -->
          <input
            v-model="newTag"
            @keydown.enter.prevent="addTag"
            @keydown.backspace="handleBackspace"
            placeholder="按 Enter 新增標籤"
            class="recipe-editor__tag-input"
          />
        </div>
      </div>

      <!-- 分類 / 時間 / 份數 -->
      <div class="recipe-editor__meta-row">
        <!-- 分類 -->
        <div class="recipe-editor__preferences-wrapper">
          <select
            v-model="form.category"
            class="recipe-editor__preferences"
          >
            <option
              v-for="categ in categories"
              :key="categ.value"
              :value="categ.value"
              class="recipe-editor__yamipreferences"
            >
              {{ categ.label }}
            </option>
          </select>
        </div>
        <!-- 時間 + 單位 -->
        <div class="recipe-editor__tatletime-group">
          <select
            v-model="form.time"
            class="recipe-editor__time-group"
          >
            <option
              v-for="time in timeOptions"
              :key="time.value"
              :value="time.value"
            >
              {{ time.label }}
            </option>
          </select>
          <span class="recipe-editor__cook-time">分鐘</span>
        </div>

        <!-- 份數 + 單位 -->
        <div class="recipe-editor__tatleservings">
          <select
            v-model="form.servings"
            class="recipe-editor__servings"
          >
            <option
              v-for="serving in servingOptions"
              :key="serving.value"
              :value="serving.value"
            >
              {{ serving.label }}
            </option>
          </select>
          <span class="recipe-editor__peopleservings">人份</span>
        </div>
      </div>

      <!-- 所需食材 -->
      <div class="recipe-editor__tatleingredientstatle">
        <label class="recipe-editor__ggingredients">所需食材</label>
        <div class="recipe-editor__tatleingredients">
          <div
            v-for="(item, index) in form.ingredients"
            :key="index"
            class="recipe-editor__ingredients"
            @dragover.prevent
            @drop="drop(index)"
          >
            <input
              v-model="item.name"
              placeholder="食材名稱"
              class="recipe-editor__ingredient-name"
            />
            <input
              v-model="item.amount"
              placeholder="份量"
              class="recipe-editor__ingredient-amount"
            />
            <button
              type="button"
              @click="removeIngredient(index)"
              :disabled="form.ingredients.length === 1"
              class="recipe-editor__ingredient-remove"
              title="至少要保留1筆"
            >
              <Icon
                icon-name="remove"
                class="remove"
              />
            </button>
            <button
              class="recipe-editor__ingredient-drag"
              draggable="true"
              @dragstart="dragStart(index)"
              title="拖曳換位置"
            >
              <Icon
                icon-name="drag"
                class="drag"
              />
            </button>
          </div>
        </div>
        <button
          @click="addIngredient"
          class="recipe-editor__add-ingredient"
        >
          <Icon
            icon-name="plus"
            class="plus"
          />
          新增食材
        </button>
      </div>
      <!-- 步驟 -->

      <div class="tatlerecipe-editor__steps">
        <label class="recipe-editor__steps">料理步驟</label>
        <div
          v-for="(step, index) in form.steps"
          :key="index"
          class="recipe-editor__step-group"
          @dragover.prevent
          @drop="dropStep(index)"
        >
          <div class="recipe-editor__step-field">
            <label class="recipe-editor__step-label">步驟 {{ index + 1 }}</label>
            <textarea
              v-model="form.steps[index]"
              placeholder="請輸入步驟內容"
              class="recipe-editor__step-input"
            ></textarea>
          </div>

          <!-- 刪除按鈕 -->
          <div class="recipe-editor__step-removetatle">
            <button
              class="recipe-editor__step-remove"
              @click="removeSteps(index)"
              :disabled="form.steps.length === 1"
              title="至少保留一筆"
            >
              <Icon
                icon-name="remove"
                class="remove"
              />
            </button>

            <!-- 拖曳 icon -->
            <button
              class="recipe-editor__step-drag"
              draggable="true"
              @dragstart="dragStepStart(index)"
              title="拖曳換位置"
            >
              <Icon
                icon-name="drag"
                class="drag"
              />
            </button>
          </div>
        </div>
        <!-- 新增步驟 -->
        <button
          @click="addStep"
          class="recipe-editor__add-step"
        >
          <Icon
            icon-name="plus"
            class="plus"
          />
          新增步驟
        </button>
      </div>
    </div>
  </div>
  <!-- 儲存按鈕 -->
  <div class="recipe-editor__action-group">
    <button
      class="recipe-editor__button--secondary"
      @click="saveDraft"
    >
      暫存草稿
    </button>
    <button
      class="recipe-editor__button--primary"
      @click="publishRecipe"
    >
      發布食譜
    </button>
  </div>
</template>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<script setup>
  import Icon from '@/components/common/Icon.vue';
  import { reactive, computed, ref } from 'vue';
  //料理tag
  const newTag = ref('');

  function addTag() {
    const tag = newTag.value.trim();

    if (form.tags.length >= 3) {
      alert('最多只能輸入 3 個標籤喔～');
      return;
    }

    if (tag && !form.tags.includes(tag)) {
      form.tags.push(tag);
      newTag.value = '';
    }
  }

  function handleBackspace() {
    if (newTag.value === '' && form.tags.length > 0) {
      form.tags.pop();
    }
  }

  //拖曳食譜圖片
  const previewUrl = ref('');
  const fileInput = ref(null);

  function triggerFile() {
    fileInput.value?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      previewUrl.value = URL.createObjectURL(file);
    }
  }

  function handleDrop(event) {
    const file = event.dataTransfer.files[0];
    if (file) {
      previewUrl.value = URL.createObjectURL(file);
    }
  }

  //表單資料
  const form = reactive({
    title: '',
    description: '',
    tags: [],
    category: 'single',
    time: 0,
    servings: 0,
    ingredients: [
      { name: '', amount: '' },
      { name: '', amount: '' },
    ],
    steps: ['', '', ''],
  });
  //食譜標題不超過15字
  const titleWarning = computed(() => {
    return form.title.length > 15 ? '標題不能超過 15 字喔！' : '';
  });
  //食譜內文不超過40字
  const descriptionWarning = computed(() => {
    return form.description.length > 40 ? '內文太長囉，麻煩請幫我濃縮在40字以內！' : '';
  });

  //新增食材
  function addIngredient() {
    form.ingredients.push({ name: '', amount: '' });
  }
  //刪除食材（並至少有一筆食材）
  function removeIngredient(index) {
    if (form.ingredients.length > 1) {
      form.ingredients.splice(index, 1);
    }
  }
  //新增步驟
  function addStep() {
    form.steps.push('');
  }
  //刪除步驟（並至少有一筆步驟）
  function removeSteps(index) {
    if (form.steps.length > 1) {
      form.steps.splice(index, 1);
    }
  }
  //拖曳
  const draggedIndex = ref(null);
  const draggedStepIndex = ref(null);

  function dragStart(index) {
    draggedIndex.value = index;
  }

  function drop(dropIndex) {
    const draggedItem = form.ingredients[draggedIndex.value];
    form.ingredients.splice(draggedIndex.value, 1);
    form.ingredients.splice(dropIndex, 0, draggedItem);
    draggedIndex.value = null;
  }

  function dragStepStart(index) {
    draggedStepIndex.value = index;
  }

  function dropStep(dropIndex) {
    const draggedItem = form.steps[draggedStepIndex.value];
    form.steps.splice(draggedStepIndex.value, 1);
    form.steps.splice(dropIndex, 0, draggedItem);
    draggedStepIndex.value = null;
  }
  //類別選單陣列
  const categories = [
    { value: 'single', label: '一人料理' },
    { value: 'family', label: '家庭聚餐' },
    { value: 'romantic', label: '浪漫晚餐' },
    { value: 'outdoor', label: '戶外料理' },
    { value: 'lazy', label: '懶人快主' },
    { value: 'fitness', label: '健身/減糖餐' },
    { value: 'budget', label: '低預算料理' },
    { value: 'festival', label: '慶生/節慶料理' },
  ];

  const servingOptions = [
    { value: '2', label: '1~2' },
    { value: '4', label: '3~4' },
    { value: '6', label: '5~6' },
    { value: '8', label: '7~8' },
    { value: '10', label: '9+' },
  ];

  const timeOptions = [
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
    { value: '45', label: '45' },
    { value: '60', label: '60' },
    { value: '90', label: '90' },
    { value: '120', label: '120' },
    { value: '180+', label: '180+' },
  ];
  /* 食譜儲存 */
  function saveDraft() {
    alert('📄 草稿已儲存成功！');
  }
  /* 食譜發布 */
  function publishRecipe() {
    alert('🎉 食譜已成功發布！');
  }
</script>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<style scoped>
  .recipe-editor {
    width: 1200px;
    background-color: #ead7c4;
    margin: 32px auto;
    border-radius: 20px;
  }

  .recipe-editortatale {
    padding: 32px;
  }

  .recipe-editor__title {
    font-size: 32px;
    text-align: center;
    margin-bottom: 24px;
  }

  .recipe-editor__upload-zone {
    position: relative; /* 讓內部元素（如 .preview）可以絕對定位 */
    height: 400px; /* 設定拖曳區高度 */
    width: 480px;
    border: 2px dashed #f97316; /* 橘色虛線邊框，提示可以拖曳 */
    border-radius: 12px; /* 圓角邊框讓區塊更柔和 */
    background-color: #fff7ed; /* 淡橘色背景，提升辨識度 */
    display: flex; /* 使用 flex 排版使內容置中 */
    justify-content: center; /* 水平置中內容 */
    align-items: center; /* 垂直置中內容 */
    margin: 0 auto 24px;
  }

  .recipe-editor__upload-content .recipe-editor__button--primary {
    position: relative; /* 保持預設排版，但可搭配 z-index 疊層 */
    z-index: 2; /* 確保內容浮在預覽圖上方 */
    text-align: center; /* 文字置中 */
    color: #ea580c; /* 深橘文字，呼應整體色系 */
    font-size: 16px; /* 文字大小 */
  }

  .recipe-editor__button--primary,
  .recipe-editor__button--secondary {
    width: 320px;
    height: 60px;
    border-radius: 20px;
  }

  .recipe-editor__upload-content button,
  .recipe-editor__button {
    margin-top: 8px; /* 與文字之間的間距 */
    padding: 6px 12px; /* 內距讓按鈕看起來更舒適 */
    border: none; /* 移除預設邊框 */
    background-color: #fb923c; /* 按鈕底色（橘色） */
    color: white; /* 文字為白色 */
    border-radius: 6px; /* 圓角讓按鈕看起來柔和 */
    cursor: pointer; /* 滑鼠移過去顯示為可點擊 */
  }

  .recipe-editor__upload-content button:hover,
  .recipe-editor__button:hover {
    background-color: #f97316; /* 滑鼠移入時更深的橘色，強化互動回饋 */
  }

  .recipe-editor__image-preview {
    position: absolute; /* 讓圖片覆蓋整個 upload-area */
    inset: 0; /* 相當於 top, right, bottom, left 都為 0，填滿父元素 */
    width: 100%; /* 寬度佔滿容器 */
    height: 100%; /* 高度佔滿容器 */
    object-fit: cover; /* 圖片等比例縮放填滿，不變形 */
    border-radius: 12px; /* 與 upload-area 一致的圓角 */
    opacity: 0.4; /* 降低透明度，讓上方內容清晰可見 */
    pointer-events: none; /* 不影響滑鼠事件，讓底圖不能被點選 */
  }

  .recipe-editor__file-input {
    display: none; /* 隱藏 input[type="file"] 元素 */
  }

  .recipe-editor__field {
    width: 800px;
    margin: 0 auto 1.5rem;
  }

  .recipe-editor__input {
    width: 800px;
  }

  .recipe-editor__input::placeholder {
    color: #9ca3af;
  }

  .recipe-editor__description {
    width: 800px;
    margin: 0 auto 1.5rem;
  }

  .recipe-editor__textarea {
    width: 100%;
    height: 120px;
  }

  .recipe-editor__tag-input {
    width: 800px;
  }

  .recipe-editor__tatletag,
  .recipe-editor__action-group {
    width: 800px;
    margin: 0 auto 1.5rem;
  }
  .recipe-editor__button--primary,
  .recipe-editor__button--secondary {
    font-size: 32px;
    border-radius: 20px; /* 圓角讓按鈕看起來柔和 */
    cursor: pointer; /* 滑鼠移過去顯示為可點擊 */
  }
  .recipe-editor__button--secondary {
    background-color: #fff;
  }
  .recipe-editor__button--primary {
    border: none; /* 移除預設邊框 */
    background-color: #fb923c; /* 按鈕底色（橘色） */
    color: white; /* 文字為白色 */
  }
  .recipe-editor__action-group {
    display: flex; /* ✨ 關鍵：啟用 flex 排列 */
    justify-content: space-between; /* ✨ 左右分開 */
    align-items: center;
  }

  .recipe-editor__treetag,
  .recipe-editor__label,
  .recipe-editor__tag,
  .recipe-editor__steps,
  .recipe-editor__name,
  .recipe-editor__ggingredients {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
    font-size: 28px;
  }

  .recipe-editor__preferences {
    width: 260px;
  }

  .recipe-editor__time-group,
  .recipe-editor__servings {
    width: 192px;
  }

  .recipe-editor__input,
  .recipe-editor__textarea,
  .recipe-editor__tag-input,
  .recipe-editor__preferences,
  .recipe-editor__time-group,
  .recipe-editor__servings,
  .recipe-editor__ingredient-name,
  .recipe-editor__ingredient-amount,
  .recipe-editor__step-input {
    height: 60px;
    padding: 0.75rem 2.5rem 0.75rem 1.5rem; /* 預留右側空間給字數提示 */
    border: none;
    border-radius: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    background-color: white;
  }

  .recipe-editor__meta-row {
    width: 800px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin: 0 auto 20px;
  }

  .recipe-editor__peopleservings,
  .recipe-editor__cook-time {
    margin-left: 5px;
  }

  .recipe-editor__ingredient-name {
    width: 393px;
    margin-right: 10px;
    margin-left: 10px;
  }
  .recipe-editor__ingredient-amount {
    width: 300px;
  }

  .recipe-editor__tatleingredientstatle,
  .tatlerecipe-editor__steps {
    width: 800px;
    margin: 0 auto 1.5rem;
  }

  .recipe-editor__ingredient-drag,
  .recipe-editor__step-remove,
  .recipe-editor__ingredient-remove,
  .recipe-editor__step-drag {
    font-size: 20px;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .recipe-editor__ingredient-remove,
  .recipe-editor__ingredient-drag {
    align-self: flex-start;
    margin-top: -6px;
  }

  .recipe-editor__add-ingredient,
  .recipe-editor__add-step {
    width: 800px;
    height: 60px;
    padding: 0.75rem 2.5rem 0.75rem 1.5rem; /* 預留右側空間給字數提示 */
    border: none;
    border-radius: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    margin-top: 8px; /* 與文字之間的間距 */
    padding: 6px 12px; /* 內距讓按鈕看起來更舒適 */
    border: none; /* 移除預設邊框 */
    background-color: #fb923c; /* 按鈕底色（橘色） */
    color: white; /* 文字為白色 */
    cursor: pointer; /* 滑鼠移過去顯示為可點擊 */
    font-size: 24px;
  }

  .recipe-editor__ingredients {
    display: flex; /* ✨ 關鍵：啟用 flex 排列 */
    justify-content: space-between; /* ✨ 左右分開 */
    align-items: center; /* 垂直置中可選 */
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .recipe-editor__step-input {
    width: 700px;
    height: 100px;
  }

  .recipe-editor__step-group {
    display: flex;
    align-items: flex-start; /* 讓左欄和右欄從頂部對齊 */
    gap: 56px; /* 左右欄之間的間距 */
    margin-bottom: 16px;
    margin-top: 16px; /* 每一個步驟之間的間距 */
  }

  .recipe-editor__step-label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem; /* 這樣會讓下面的 input 往下推開 */
  }

  /* 文字輸入框 */
  .recipe-editor__step-input {
    border: 1px solid #e0e0e0; /* 淺灰色邊框 */
    border-radius: 20px; /* 圓角效果 */
    padding: 12px;
    resize: vertical; /* 允許使用者垂直調整大小 */
    font-size: 16px;
  }

  .recipe-editor__step-remove,
  .recipe-editor__step-drag {
    align-self: flex-start;
    margin-top: 20px;
  }

  .recipe-editor__button--primary:hover,
  .recipe-editor__button--secondary:hover,
  .recipe-editor__add-step:hover,
  .recipe-editor__add-ingredient:hover {
    transform: scale(0.95);
    opacity: 0.85;
  }
</style>

<style lang="scss" scoped></style>
