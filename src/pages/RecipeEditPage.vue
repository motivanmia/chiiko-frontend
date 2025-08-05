<script setup></script>

<template>
  <div class="recipe-editor">
    <div class="back-button-wrapper">
      <button class="back-button">
        <Icon
          icon-name="leftA"
          class="leftA"
        />
        回前頁
      </button>
    </div>
    <div class="shit__css">
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
            <p class="recipe-editor__upload-text"></p>
            <button
              type="button"
              @click="triggerFile"
              class="recipe-editor__button2"
            >
              新增食譜圖片
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
          <div class="input-with-counter">
            <input
              v-model="form.title"
              placeholder="例：香煎豆腐卷（最多15字）"
              maxlength="15"
              class="recipe-editor__input"
            />
            <span class="char-counter">{{ form.title.length }} / 15</span>
          </div>
          <p
            v-if="titleWarning"
            class="recipe-editor__warning"
          >
            {{ titleWarning }}
          </p>
        </div>
      </div>

      <!-- 簡介 -->

      <div class="recipe-editor__description">
        <label class="recipe-editor__label">簡介</label>

        <!-- ✅ 定位容器 -->
        <div class="input-with-counter">
          <textarea
            v-model="form.description"
            placeholder="請輸入食譜描述（最多40字）"
            maxlength="40"
            class="recipe-editor__textarea"
          ></textarea>

          <!-- ✅ 計數器會相對於這個容器定位 -->
          <span class="recipe-editor__label-counter">{{ form.description.length }} / 40</span>
        </div>

        <!-- ⚠️ 額外警告文字 -->
        <p
          v-if="descriptionWarning"
          class="recipe-editor__warninglabel"
        >
          {{ descriptionWarning }}
        </p>
      </div>

      <!-- 食譜標籤 -->
      <div class="recipe-editor__tatletag">
        <div class="tag-label-row">
          <label class="recipe-editor__treetag">食譜標籤</label>
          <label class="recipe-editor__treetag2">最多可新增3個標籤</label>
        </div>

        <!-- ✅ 新增一層定位包裝 -->
        <div class="input-with-counter">
          <div class="recipe-editor__tag-container">
            <!-- 顯示標籤 -->
            <span
              v-for="(tag, index) in form.tags"
              :key="index"
              class="recipe-editor__tag"
            >
              #{{ tag }}
            </span>

            <!-- ✅ tag 輸入欄 -->
            <input
              v-model="newTag"
              @keydown.enter.prevent="addTag"
              @keydown.backspace="handleBackspace"
              placeholder="按下鍵盤上的 Enter鍵 或換行來新增 #標籤，每個標籤限6字"
              class="recipe-editor__tag-input"
              maxlength="6"
            />
          </div>

          <!-- ✅ tag 字數計數器 -->
          <span class="char-counter">{{ newTag.length }} / 6</span>
        </div>
      </div>

      <!-- 分類 / 時間 / 份數 -->
      <div class="recipe-editor__meta-row">
        <!-- ✅ 分類 -->
        <div class="recipe-editor__preferences-wrapper">
          <label class="recipe-editor__label">食譜分類</label>
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

        <!-- ✅ 時間 -->
        <div class="recipe-editor__tatletime-group">
          <label class="recipe-editor__label">
            烹調時間
            <span class="unit-label">（分鐘）</span>
          </label>
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
        </div>

        <!-- ✅ 份數 -->
        <div class="recipe-editor__tatleservings">
          <label class="recipe-editor__label">
            料理份數
            <span class="unit-label">（人份）</span>
          </label>
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
        </div>
      </div>

      <!-- 所需食材 -->
      <div class="recipe-editor__tatleingredientstatle">
        <div class="recipe-editor__ggingredients3">
          <label class="recipe-editor__ggingredients">所需食材</label>
          <label class="recipe-editor__ggingredients2">食材15字以內，份量10字以內</label>
        </div>
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
              placeholder="食材"
              class="recipe-editor__ingredient-name"
              maxlength="15"
            />
            <input
              v-model="item.amount"
              placeholder="份量"
              class="recipe-editor__ingredient-amount"
              maxlength="10"
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
            <label class="recipe-editor__step-label">步驟 {{ numberToChinese(index + 1) }}</label>
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

  const numberToChinese = (num) => {
    const units = ['', '十', '百', '千'];
    const chars = '零一二三四五六七八九';

    if (num <= 10) return chars[num];

    let result = '';
    const digits = String(num).split('').reverse();

    for (let i = 0; i < digits.length; i++) {
      const n = Number(digits[i]);
      if (n !== 0) {
        result = chars[n] + units[i] + result;
      } else if (!result.startsWith('零')) {
        result = '零' + result;
      }
    }

    if (result.startsWith('一十')) {
      result = result.slice(1);
    }

    return result.replace(/零+$/, '');
  };
</script>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<style scoped>
  .recipe-editor {
    position: relative;
    width: 1200px;
    background-color: #ead7c4;
    margin: 0px auto;
    padding-bottom: 60px;
  }

  .back-button-wrapper {
    position: absolute;
    top: 0px;
    left: -183px;
  }

  .recipe-editortatale {
    padding: 32px;
  }

  .recipe-editor__title {
    font-size: 32px;
    text-align: center;
    font-weight: bold;
  }

  .recipe-editor__upload-zone {
    height: 400px;
    width: 480px;
    background-color: #fff7ed;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px auto 50px auto;
    border-radius: 20px;
  }

  .recipe-editor__upload-content .recipe-editor__button--primary {
    z-index: 2;
    text-align: center;
    color: #ea580c;
    font-size: 16px;
  }

  .recipe-editor__button--primary,
  .recipe-editor__button--secondary {
    width: 320px;
    height: 60px;
    border-radius: 20px;
  }

  .recipe-editor__upload-content button,
  .recipe-editor__button {
    margin-top: 8px;
    padding: 6px 12px;
    border: none;
    background-color: #d97c48;
    color: white;
    border-radius: 20px;
    cursor: pointer;
  }

  .recipe-editor__upload-content button:hover,
  .recipe-editor__button:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
  }

  .recipe-editor__image-preview {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
    opacity: 0.4;
    pointer-events: none;
  }

  .recipe-editor__file-input {
    display: none;
  }

  .recipe-editor__field {
    width: 800px;
    margin: 0 auto 30px;
  }

  .recipe-editor__input {
    width: 800px;
  }

  .recipe-editor__input::placeholder {
    color: #9ca3af;
  }

  .recipe-editor__description {
    width: 800px;
    margin: 0 auto 30px;
  }

  .recipe-editor__tag-input {
    width: 800px;
  }

  .recipe-editor__tatletag,
  .recipe-editor__action-group {
    width: 800px;
    margin: 0 auto 45px;
  }
  .recipe-editor__button--primary,
  .recipe-editor__button--secondary {
    font-size: 32px;
    border-radius: 20px;
    cursor: pointer;
  }
  .recipe-editor__button--secondary {
    background-color: #fff;
  }
  .recipe-editor__button--primary {
    border: none;
    background-color: #d97c48;
    color: white;
  }
  .recipe-editor__action-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 170px;
    margin-top: 90px;
  }

  .recipe-editor__treetag,
  .recipe-editor__label,
  .recipe-editor__tag,
  .recipe-editor__steps,
  .recipe-editor__name,
  .recipe-editor__ggingredients {
    display: block;
    margin-bottom: 10px;
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
    padding: 0.75rem 2.5rem 0.75rem 1.5rem;
    border: none;
    border-radius: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
    background-color: white;
    resize: none;
  }

  .recipe-editor__textarea {
    height: 135px;
    width: 800px;
  }

  .recipe-editor__meta-row {
    width: 800px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin: 0 auto 100px;
  }

  .recipe-editor__peopleservings,
  .recipe-editor__cook-time {
    margin-left: 5px;
  }

  .recipe-editor__ingredient-name {
    flex-grow: 1;
    margin-right: 0;
    margin-left: 0;
  }
  .recipe-editor__ingredient-amount {
    width: 300px;
  }

  .recipe-editor__tatleingredientstatle,
  .tatlerecipe-editor__steps {
    width: 800px;
    margin: 105px auto 1.5rem;
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
    padding: 0.75rem 2.5rem 0.75rem 1.5rem;
    border: none;
    border-radius: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    margin-top: 8px;
    padding: 6px 12px;
    border: none;
    background-color: #d97c48;
    color: white;
    cursor: pointer;
    font-size: 24px;
  }

  .recipe-editor__ingredients {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .recipe-editor__step-input {
    width: 700px;
    height: 100px;
  }

  .recipe-editor__step-group {
    display: flex;
    align-items: flex-start;
    gap: 56px;
    margin-bottom: 16px;
    margin-top: 16px;
  }

  .recipe-editor__step-label {
    display: block;
    margin-bottom: 0.5rem;
  }

  /* 文字輸入框 */
  .recipe-editor__step-input {
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    padding: 12px;
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
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
  }

  .recipe-editor__treetag2,
  .unit-label,
  .recipe-editor__ggingredients2 {
    font-size: 20px;
    color: #828282;
    font-weight: normal;
  }

  .tag-label-row,
  .recipe-editor__ggingredients3 {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .recipe-editor__ggingredients3 {
    display: flex;
    align-items: baseline;
    gap: 16px;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .page-container {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 24px;
    padding: 0 32px;
    max-width: 1440px;
    margin: 0 auto;
  }

  .back-button {
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
  }

  .recipe-editor__button2 {
    width: 225px;
    height: 60px;
    border-radius: 20px;
    font-size: 24px;
  }
  s .back-button:hover {
    background-color: #d8c9b8;
  }

  .recipe-editor {
    width: 1200px;
    background-color: #ead7c4;
    margin: 32px auto;
    border-radius: 20px;
    margin-top: 226px;
  }

  .input-with-counter,
  .recipe-editor__label,
  .input-with-counter {
    position: relative;
    width: 100%;
  }

  .char-counter,
  .recipe-editor__label-counter,
  .char-counter {
    position: absolute;
    bottom: 12px;
    right: 20px;

    font-size: 16px;
    color: #888;
    pointer-events: none;
  }
</style>

<style lang="scss" scoped>
  @media (max-width: 768px) {
    .back-button-wrapper {
      position: static;
      left: 0;
    }

    .recipe-editor {
      width: 100%;
      margin: 0;
    }

    .recipe-editor__field,
    .recipe-editor__description,
    .recipe-editor__tatletag,
    .recipe-editor__action-group,
    .recipe-editor__meta-row,
    .recipe-editor__tatleingredientstatle,
    .tatlerecipe-editor__steps {
      width: 100%;
      margin-left: 0;
      margin-right: 0;
    }

    .recipe-editor__input,
    .recipe-editor__textarea,
    .recipe-editor__tag-input,
    .recipe-editor__add-ingredient,
    .recipe-editor__add-step,
    .recipe-editor__action-group .recipe-editor__button--primary,
    .recipe-editor__action-group .recipe-editor__button--secondary {
      width: 100%;
      box-sizing: border-box;
    }

    .recipe-editor__upload-zone {
      width: 340px;
      height: 290px;
      margin-left: 0;
    }

    .recipe-editor__meta-row {
      flex-direction: column;
      gap: 24px;
      margin-bottom: 48px;
    }
    .recipe-editor__preferences,
    .recipe-editor__time-group,
    .recipe-editor__servings {
      width: 100%;
    }

    .recipe-editor__ingredients {
      flex-direction: column;
      align-items: stretch;
    }
    .recipe-editor__ingredient-amount {
      width: 100%;
    }

    .recipe-editor__step-group {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    .recipe-editor__step-input {
      width: 100%;
    }
    .recipe-editor__step-remove,
    .recipe-editor__step-drag {
      align-self: flex-end;
      margin-top: 0;
      margin-bottom: 16px;
    }

    .recipe-editor__action-group {
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
      margin-top: 48px;
    }

    .recipe-editor__title {
      font-size: 28px;
    }
    .recipe-editor__treetag,
    .recipe-editor__label,
    .recipe-editor__tag,
    .recipe-editor__steps,
    .recipe-editor__name,
    .recipe-editor__ggingredients {
      font-size: 24px;
    }
  }
</style>
