<template>
  <div class="meta-row recipe-meta-component">
    <div class="meta-item-full">
      <label class="form-label">食譜分類</label>
      <select
        :value="category"
        @input="$emit('update:category', $event.target.value)"
        class="form-select"
      >
        <option
          v-for="c in categories"
          :key="c.value"
          :value="c.value"
        >
          {{ c.label }}
        </option>
      </select>
    </div>
    <div class="meta-item-half">
      <label class="form-label">
        烹調時間
        <span class="unit-label">（分鐘）</span>
      </label>
      <select
        :value="time"
        @input="$emit('update:time', $event.target.value)"
        class="form-select"
      >
        <option
          v-for="t in timeOptions"
          :key="t.value"
          :value="t.value"
        >
          {{ t.label }}
        </option>
      </select>
    </div>
    <div class="meta-item-half">
      <label class="form-label">
        料理份數
        <span class="unit-label">（人份）</span>
      </label>
      <select
        :value="servings"
        @input="$emit('update:servings', $event.target.value)"
        class="form-select"
      >
        <option
          v-for="s in servingOptions"
          :key="s.value"
          :value="s.value"
        >
          {{ s.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
  // ... 您的 script 內容完全不需要修改 ...
  defineProps(['category', 'time', 'servings']);
  defineEmits(['update:category', 'update:time', 'update:servings']);
  const categories = [
    { value: 'single', label: '一人料理' },
    { value: 'family', label: '家庭聚餐' },
    { value: 'romantic', label: '浪漫晚餐' },
    { value: 'outdoor', label: '戶外料理' },
    { value: 'lazy', label: '懶人快煮' },
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
</script>

<style lang="scss" scoped>
  /* 桌面版樣式 */
  .meta-row {
    width: 800px;
    max-width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  .form-label {
    display: block;
    margin-bottom: 15px;
    font-size: 28px;
  }
  .unit-label {
    font-size: 20px;
    color: #828282;
  }
  .form-select {
    height: 60px;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 20px;
    font-size: 24px;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    width: 260px;
  }
  .form-select.short {
    width: 192px;
  }

  /* FIX: 手機版樣式 */
  @media (max-width: 768px) {
    .meta-row {
      flex-direction: row; /* 維持水平排列 */
      flex-wrap: wrap; /* 允許換行 */
      gap: 16px;
    }

    .meta-row > div {
      /* 關鍵！讓每個區塊佔據大約一半的寬度 (扣除 gap) */
      flex: 1 1 calc(50% - 8px);
    }

    /* 第一個分類區塊，讓它自己佔滿一行 */
    .meta-row > div:first-child {
      flex: 1 1 100%;
    }

    .form-select {
      width: 100%;
    }
    .form-label {
      font-size: 20px;
    }
    .unit-label {
      font-size: 16px;
    }
  }
</style>
