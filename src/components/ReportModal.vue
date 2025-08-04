<template>
  <!-- v-if 控制整個燈箱的顯示與隱藏 -->
  <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
     <div class="modal-container">
          <button @click="$emit('close')" class="close-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    <div class="modal-content">
      <!-- 關閉按鈕 -->


      <h2>檢舉留言</h2>

      <!-- 檢舉選項列表 -->
      <div class="options-list">
        <label v-for="option in reportOptions" :key="option.id" class="option-label">
          <input 
            type="radio" 
            name="report-reason"
            :value="option.id"
            v-model="selectedReason" 
          />
          
            <div class="custom-radio">
          <!-- ✅ 將 Icon 放在這裡 -->
          <Icon icon-name="check" class="check" />
        </div>
          <div class="option-text">
            <strong>{{ option.title }}</strong>
            <p>{{ option.description }}</p>
          </div>
        </label>
      </div>

      <!-- 提出檢舉按鈕 -->
      <button 
        class="submit-btn" 
        :disabled="!selectedReason"
        @click="handleSubmit"
      >
        提出檢舉
      </button>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 接收來自父元件的 props
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

// 定義會觸發的事件
const emit = defineEmits(['close', 'submitReport']);

// 檢舉選項的資料
const reportOptions = ref([
    { id: 'hate_speech', title: '仇恨言論', description: '誹謗言詞、種族主義或性別歧視的刻板印象、去人性化、煽動恐懼或歧視、仇恨提及、仇恨符號和標誌。' },
    { id: 'harassment', title: '謾罵和騷擾', description: '侮辱言詞、令人不悅的色情內容和圖像化、不必要的「工作場所不宜」和寫實內容、否認暴力事件、有針對性的騷擾以及煽動騷擾。' },
    { id: 'violence', title: '暴力言論', description: '暴力威脅、期望傷害的發生、宣揚暴力行為、煽動暴力行為、以密碼煽動暴力行為。' },
    { id: 'privacy', title: '侵犯隱私', description: '分享私人資訊、威脅要分享/公開私人資訊、分享非自願的私密圖片、分享我不想在平台上公開的個人圖片。' },
    { id: 'spam', title: '垃圾內容', description: '詐騙、虛假帳戶、惡意連結、無意義/重複或廣告性質的留言。' },
]);

// 用來儲存使用者選擇的選項
const selectedReason = ref(null);

function handleSubmit() {
  if (selectedReason.value) {
    emit('submitReport', selectedReason.value);
    // 提交後可以選擇性地關閉燈箱
    emit('close');
  }
}
</script>

<style scoped>
/* =================================================================== */
/*                          燈箱整體佈局與背景                          */
/* =================================================================== */

/* 燈箱的半透明黑色背景遮罩 */
.modal-overlay {
  /* 定位：固定在視窗上，不隨頁面滾動 */
  position: fixed;
  /* top, left, width, height: 讓遮罩鋪滿整個螢幕 */
  top: 0;
  left: 0;
  width: 100vw; /* vw = viewport width，視窗寬度的 100% */
  height: 100vh; /* vh = viewport height，視窗高度的 100% */
  
  /* 顏色：半透明的黑色，rgba 的 a 代表透明度 */
  background-color: rgba(0, 0, 0, 0.6);
  
  /* Flexbox 佈局：讓裡面的內容 (.modal-content) 可以輕易地垂直和水平置中 */
  display: flex;
  justify-content: center; /* 水平置中 */
  align-items: center;     /* 垂直置中 */
  
  /* 堆疊層級：設定一個很高的數字，確保它浮在所有頁面內容的最上層 */
  z-index: 1000;
}

/* 燈箱的主要內容白色卡片 */
.modal-content {
  /* 顏色與尺寸 */
  background: white;
  width: 850px;  /* 固定寬度為 850px */
  height: 1000px; /* 固定高度為 1000px */
  border-radius: 20px;
  /* 內距 (Padding)：內容與邊框之間的距離，上下左右都是 60px */
  padding: 60px 90px 60px 90px;
  
  /* 定位：設為相對定位，這樣裡面的絕對定位元素 (如 .close-btn) 才能相對於它來定位 */
  position: relative;
}

/* =================================================================== */
/*                             燈箱內部元素                             */
/* =================================================================== */

/* 右上角的「X」關閉按鈕 */
/* 燈箱的半透明黑色背景遮罩 (此區塊樣式不變) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* ✅ 新增：內容和按鈕的共同容器，這是新的定位錨點 */
.modal-container {
  position: relative; /* 關鍵：設定為相對定位，為內部的絕對定位元素提供基準 */
  /* 我們不需要給它寬高，它會被裡面的 .modal-content 自然撐開 */
}


/* 燈箱的主要內容白色卡片 (此區塊樣式不變) */
.modal-content {
  background: white;
  width: 850px;
  height: 1000px;
  border-radius: 20px;
  padding: 60px 90px;
  /* position: relative; <-- 這一行可以移除了，因為基準點換人了 */
}


/* =================================================================== */
/*                             燈箱內部元素                             */
/* =================================================================== */

/* ✅ 更新：右上角的「X」關閉按鈕 */
.close-btn {
  /* 定位：絕對定位，現在是相對於 .modal-container */
  position: absolute;
  
  /* 關鍵定位技巧：將按鈕的左上角，對齊到容器的右上角 */
  top: 0;
  right: 0;

  /* 
    再用 transform 將按鈕向右平移自身寬度的 50%，向上平移自身高度的 50%。
    這會讓按鈕的「中心點」剛好在容器的右上角，完美地浮在角落。
  */
  transform: translate(40%, -35%);
  z-index: 10;
  /* 尺寸與外觀 */
  width: 50px;
  height: 50px;
  background: #D97C48;
  border: none;
  border-radius: 50%;
  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
}


.close-btn:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
}

/* 燈箱主標題 "檢舉留言" */
h2 {
  text-align: center; /* 文字水平置中 */
  font-size: 26px;    /* 字體大小 */
  font-weight: 600;   /* 字體粗細 (600 約等於 bold) */
  
  /* 外距 (Margin)：元素與其他元素之間的距離 */
  margin-bottom: 50px; /* 與下方的選項列表之間，保留 30px 的底部間距 */
}

/* 包裹所有選項的列表容器 */
.options-list {
  display: flex;
  flex-direction: column; /* 讓所有選項垂直排列 */
  
  /* 間距：設定選項與選項之間的垂直距離為 24px */
  gap: 50px;
}

/* 單一選項的容器 (包含 radio 按鈕和文字) */
.option-label {
  display: flex;
  align-items: flex-start; /* 讓 radio 按鈕和文字從頂部對齊 */
  
  /* 間距：radio 按鈕和右側文字之間的水平距離為 16px */
  gap: 16px;
  
  cursor: pointer; /* 滑鼠移上去時顯示為可點擊的手指圖示 */
}

/* 選項的文字區塊 */
.option-text strong {
  display: block; /* 讓標題獨佔一行 */
  font-size: 24px;
  margin-bottom: 10px; /* 標題和下方描述之間的垂直距離 */
}
.option-text p {
  font-size: 20px;
  color: #666;
  line-height: 1.6; /* 行高：增加文字的垂直間距，使其更容易閱讀 */
  letter-spacing: 3px;
}

/* =================================================================== */
/*                          自定義 Radio 按鈕樣式                        */
/* =================================================================== */

/* 隱藏瀏覽器預設的 radio 按鈕 */
.option-label input[type="radio"] {
  display: none;
}

/* 我們自己畫的、圓形的 radio 按鈕容器 */
.custom-radio {
  flex-shrink: 0;
  width: 32px;  /* ✅ 稍微加大尺寸以容納圖示 */
  height: 32px;
  border: 2px solid #ccc;
  border-radius: 50%;
  margin-top: 2px;
  position: relative;
  transition: all 0.2s ease; /* 讓所有變化都有動畫效果 */
  
  /* ✅ 使用 Flexbox 來置中裡面的打勾圖示 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ✅ 關鍵：將選中時的樣式改為改變背景色和邊框色 */
.option-label input[type="radio"]:checked + .custom-radio {
  background-color: #6D6D6D; /* 選中時的深灰色背景 */
  border-color: #6D6D6D;     /* 邊框也變為同色 */
}

/* ✅ 關鍵：移除原本用來畫「點」的 ::after 偽元素，
   改為直接控制裡面的 SVG 圖示顏色 */
.option-label .check {
  font-size: 20px; /* 控制打勾圖示的大小 */
  color: white;    /* 圖示顏色為白色 */
  opacity: 0;      /* 預設是完全透明的 */
  transition: opacity 0.2s ease;
}

.option-label input[type="radio"] {
  display: none;
}

/* 我們自己畫的、圓形的 radio 按鈕容器 */
.custom-radio {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border: 2px solid #ccc; /* 未選中時的灰色邊框 */
  border-radius: 50%;
  margin-top: 2px;
  position: relative;
  transition: all 0.2s ease;
  
  /* 使用 Flexbox 來置中裡面的打勾圖示 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ✅ 關鍵 1：當 radio 被「選中」時，後面緊跟的 .custom-radio 的樣式 */
.option-label input[type="radio"]:checked + .custom-radio {
  background-color: #6D6D6D; /* 背景變為深灰色 */
  border-color: #6D6D6D;     /* 邊框也變為深灰色 */
}


.option-label input[type="radio"]:checked ~ .check {
  opacity: 1; /* ✅ 當 radio 被選中時，讓打勾圖示變得不透明 */
}

.check { /* 這是您在 <Icon> 上加的 class */
  font-size: 20px;
  color: white; /* 圖示顏色為白色 */
  
  /* 預設是完全透明的，看不見 */
  opacity: 0;
  
  /* 當透明度變化時，有 0.2 秒的動畫效果 */
  transition: opacity 0.2s ease;
}

/* ✅ 關鍵 3：當 radio 被「選中」時，讓它對應的 .check 圖示顯示出來 */
.option-label input[type="radio"]:checked ~ .check,
.option-label input[type="radio"]:checked + .custom-radio .check { /* 增加一個選擇器以防萬一 */
  opacity: 1; /* 透明度變為 1，圖示變得可見 */
}

/* =================================================================== */
/*                          提交按鈕的樣式                           */
/* =================================================================== */

.submit-btn {
  display: block; /* 讓它獨佔一行 */
  width: 75%;     /* 寬度為父容器的一半 */
  
  /* 外距：上下 40px，左右自動 (auto) 來實現水平置中 */
  margin: 40px auto 0;
  
  /* 內距：文字與邊框之間的距離，上下 12px，左右 20px */
  padding: 12px 20px;
  
  border-radius: 24px;
  border: none;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  
  /* 過渡效果：當背景色和文字顏色改變時，有 0.2 秒的動畫 */
  transition: background-color 0.2s, color 0.2s;
}

/* 當按鈕處於「禁用」(:disabled) 狀態時的樣式 */
.submit-btn:disabled {
  background-color: #e0e0e0; /* 灰色背景 */
  color: #aaa;              /* 淺灰色文字 */
  cursor: not-allowed;       /* 滑鼠移上去時顯示為「禁止」圖示 */
}

/* 當按鈕「不是」禁用狀態時的樣式 */
.submit-btn:not(:disabled) {
  background-color: #D97C48; /* 橘色背景 */
  color: white;              /* 白色文字 */
}
.submit-btn:not(:disabled):hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
}
</style>