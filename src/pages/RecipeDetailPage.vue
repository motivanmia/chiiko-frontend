<template>
    <div class="wrappertatle">
  <div class="outer-wrapper">
    <div class="recipe-wrapper">
      <!-- 食物圖片 -->
      <img
        src="@/assets/image/Group_537.png"
        alt="香煎豆腐卷"
        class="recipe-image"
      />

      <!-- 標題 + 發布者 -->
      <div class="recipe-card">
        <!-- 標題 + 發布者 -->
        <div class="header">
          <h1>香煎豆腐卷</h1>
          <h2>由管理員 發佈</h2>
        </div>

        <!-- 介紹文字 -->
        <p class="description">
          酥酥脆脆的肉片外皮，
          <br />
          軟嫩的豆腐，
          <br />
          很適合當下酒菜的料理。
        </p>

        <!-- TAG 區塊 -->
        <div class="tags">
          <span># 快速</span>
          <span># 三明治</span>
          <span># 微波爐</span>
        </div>

        <!-- 收藏與回覆 -->
        <div class="meta">
          <div>
            <span><Icon
                  icon-name="markL"
                  class="markL"
                /></span>
            105收藏
          </div>
          <div>
            <span><Icon
                  icon-name="comment"
                  class="comment"
                /></span>
            50回覆
          </div>
        </div>

        <!-- 時間與份數 -->
        <div class="time-serving">
          <div class="info-block">
            <div class="top">
              <span>
                <Icon
                  icon-name="time"
                  class="cookingtime"
                />
              </span>
              <p class="label">烹煮時間</p>
            </div>
            <p class="value">10分鐘</p>
          </div>

          <div class="divider"></div>

          <div class="info-block">
            <div class="top">
              <span>
                <Icon
                  icon-name="portion"
                  class="portion"
                />
              </span>
              <p class="label">料理份數</p>
            </div>
            <p class="value">1-2人份</p>
          </div>
        </div>
        <!-- 按鈕區 -->
        <div class="button-group">
          <button class="btn btn-collect">
            <Icon
              icon-name="markL"
              class="icon"
            />
            收藏
          </button>
          <button class="btn btn-share">
            <Icon
              icon-name="share"
              class="icon"
            />
            分享
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 步驟區塊 -->
  <div class="step-ingredient-wrapper">
    <!-- 左邊：料理步驟 -->
    <div class="step-box">
      <h3 class="step-title"></h3>
      <div
        v-for="(step, index) in steps"
        :key="index"
      >
        <p class="step-label">步驟{{ numberToChinese(index + 1) }}</p>
        <p class="step-text">{{ step }}</p>
      </div>
    </div>

    <!-- 右邊：所需食材 -->
    <div class="ingredient-box">
      <div class="section-ingredient-header">
        <h3 class="section-ingredient-title">所需食材</h3>
        <Icon
          icon-name="copy"
          class="copy-icon"
          @click="copyIngredients"
        />
      </div>
      <ul class="section-ingredient-list">
        <li
          class="section-ingredient-item"
          v-for="(item, index) in ingredients"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
  <!-- 留言區 -->
  <div>


    <!-- ✅ 2. 在您想放置留言區的地方，像這樣使用元件 -->
     <div class="comment-section-container">
    <CommentSection 
      :initial-comments="recipeComments" 
      :current-user-avatar="currentUserAvatar"
    />
</div>
  </div>
  </div>

</template>

<script setup>
  import { ref } from 'vue';
  import Icon from '@/components/common/Icon.vue';
  import CommentSection from '@/components/CommentSection.vue';
  import avatarImage from '@/assets/image/Mask group.png';
  import postImage from '@/assets/image/Rectangle_5.png'; 

  // 模擬資料
  const steps = [
    '將板豆腐切成小塊（大小剛好能卷進肉片即可）',
    '將切好的板豆腐包進薄肉片裡',
    '將包好的肉片豆腐裹上一層起司酥炸粉，放在盤子上靜置五分鐘',
    '靜置好的肉片豆腐再裹上一層麵包粉',
    '平底鍋熱油，放進裹好粉的肉片豆腐，煎至金黃酥脆即可。',
  ];

  const ingredients = [
    '板豆腐／一盒',
    '起司酥炸粉／適量',
    '椒鹽粉／適量',
    '薄片的豬肉片／一盒',
    '麵包粉／適量',
  ];

  function numberToChinese(num) {
  // 確保輸入的是數字且大於0
  if (typeof num !== 'number' || num < 1) {
    return '';
  }

  // 中文數字的對應表
  const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

  // 處理 1 到 10 的情況
  if (num <= 10) {
    return chineseNums[num];
  }

  // 處理 11 到 19 的情況
  if (num > 10 && num < 20) {
    // 例如：12 -> '十' + '二'
    return '十' + chineseNums[num % 10];
  }

  // 處理 20, 30, 40 ... 99 的情況
  if (num >= 20 && num < 100) {
    const tens = Math.floor(num / 10); // 取十位數，例如 23 -> 2
    const ones = num % 10;           // 取個位數，例如 23 -> 3

    if (ones === 0) {
      // 如果是 20, 30 這種整數
      return chineseNums[tens] + '十'; // 例如：'二' + '十'
    } else {
      // 如果是 21, 35 這種非整數
      return chineseNums[tens] + '十' + chineseNums[ones]; // 例如：'二' + '十' + '三'
    }
  }

  // 如果數字大於等於100，暫時返回原數字 (您可以根據需求擴展此函式)
  return num.toString();
}


 const recipeComments = ref([
  {
      id: 1, // 記得為每則留言加上 ID
      name: '小胖子',
      message: '太好吃了！我還加了辣椒！',
      avatar: avatarImage, // 這裡應該是真實路徑
      showOptions: false,
      showReplyBox: false,   
      reply: '' ,
      image: postImage  // 這裡應該是真實路徑
    },
    {
      id: 2,
      name: '大胖子',
      message: '板豆腐硬一點比較好？',
      avatar: avatarImage,
      showOptions: false,
      showReplyBox: false,  
      reply: ''  
    },
]);

const currentUserAvatar = ref(avatarImage);


  function copyIngredients() {
    const text = ingredients.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('食材清單已複製！');
    });
  }
</script>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<style scoped>

.comment-image {

  max-width: 160px;
  max-height: 160px;
  border-radius: 8px;
  object-fit: cover;
}

  .wrappertatle{
    margin-top: 230px;
    margin-bottom: 200px;
  }

  /* 食譜圖片 */
  .recipe-image {
    width: 800px;
    height: 640px;
    object-fit: cover;
    border-radius: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  /* 食譜 */
  .recipe-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 0px;
    margin: 0px auto;
  }

  /* 小卡排版 */

.recipe-card {
  width: 393px; /* 稍微加寬一點以容納內容 */
  background-color: #EAD7C4; /* 使用目標圖片中較淺的背景色 */
  padding: 15px; /* 統一內距 */
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  
  /* 使用 Flexbox 來控制內部元素的排列，這是佈局的核心 */
  display: flex;
  flex-direction: column; /* 讓所有子元素垂直堆疊 */
}

/* =================================================================== */
/*                         卡片內部各區塊樣式                           */
/* =================================================================== */

/* 標題 + 發布者 */
.header {
  /* 這個容器不需要太多特殊樣式，間距由父層的 gap 控制 */
}
.recipe-card h1 {
  font-size: 32px; /* 稍微加大標題 */
  font-weight: 600;
  margin-top: 10px; /* 移除 h1 預設的 margin */
  letter-spacing: 2px;
}
.recipe-card h2 {
  text-align: right;
  color: #888; /* 使用較柔和的灰色 */
  font-size: 16px;
  font-weight: normal;
  margin-top: 5px;
  margin-bottom: 50px; /* 微調與標題的距離 */
}

/* 介紹文字 */
.description {
  font-size: 24px; /* 稍微縮小字體以符合比例 */
  line-height: 1.2; /* 增加行高，提升易讀性 */
  letter-spacing: 2px;
  color: #333;
  margin-bottom: 25px;
}

/* TAG 區塊 */
.tags {
  color: #888;
  font-size: 16px;
  margin-bottom: 30px;
  letter-spacing: 2px;
}

/* 收藏與回覆 */
.meta {
  display: flex;
  align-items: center;
  gap: 15px; /* 調整兩個項目之間的距離 */
  font-size: 16px;
  color: #555;
  margin-bottom: 50px;
}
/* 讓 icon 和文字垂直對齊 */
.meta > div {
  display: flex;
  align-items: center;
  gap: 8px;
}
.markL, .comment {
    font-size: 16px;
}
.comment {
  transform: scaleX(-1); /* 水平翻轉 */
}

/* 時間與份數 */
.time-serving {
  display: flex;
  align-items: center;
  justify-content: space-around; /* 讓內容均勻分佈 */
  padding: 16px 0; /* 增加上下內距 */
  /* margin-top: 1rem; <-- 已由父層 gap 取代 */
  font-size: 24px;
}
.info-block {
  text-align: center;
  margin-bottom: 40px;
}
.top {
  display: flex;
  align-items: center;
  gap: 4px;
}
.label
{  
  font-size: 24px;
}
.value {
  margin: 20px 0 0; /* 與上方標題的距離 */
  font-size: 20px;
}

/* 分隔線 */
.divider {
  width: 1px;
  height: 48px; /* 稍微加長 */
  background-color: #000000;
}


/* =================================================================== */
/*                          按鈕區塊 (收藏 & 分享)                      */
/* =================================================================== */

/* 包裹「收藏」和「分享」兩個按鈕的容器 */
.button-group {
  /* 啟用 Flexbox 佈局，讓裡面的按鈕可以水平排列 */
  display: flex;
  justify-content: center;
  /* 設定按鈕與按鈕之間的水平間距為 16px */
  gap: 14px;
  margin-bottom: 25px;
}

/* 兩個按鈕共用的樣式 (.btn-collect 和 .btn-share 都會套用) */


/* 「收藏」按鈕的專屬樣式 */
.btn-collect {
  background-color: white; /* 白色背景 */
  color: #333;            /* 深灰色文字 */
  border-color: #ddd;      /* 淺灰色邊框 (會覆蓋 .btn 的透明邊框) */
  width: 153px;
  height: 47px;
}
/* 當滑鼠懸停在「收藏」按鈕上時的樣式 */
.btn-collect:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
}

/* 「分享」按鈕的專屬樣式 */
.btn-share {
  background-color: #D97C48; /* 橘色背景 */
  color: white;              /* 白色文字 */
  border: none;              /* 移除邊框 (會覆蓋 .btn 的透明邊框) */
  width: 153px;
  height: 47px;
}
/* 當滑鼠懸停在「分享」按鈕上時的樣式 */
.btn-share:hover {
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    transition: 0.2s ease;
}

.btn {

 
  /* 啟用 Flexbox，用來對齊按鈕【內部】的圖示和文字 */
  display: flex;
  align-items: center;     /* 讓圖示和文字垂直置中 */
  justify-content: center; /* 讓圖示和文字水平置中 */
  
  /* 圖示與文字之間的水平間距 */
  gap: 8px;
  
  /* 內距 (Padding)：設定按鈕內容與邊框之間的距離 */
  /* 上下 12px，左右 0px。因為按鈕寬度是自動伸展的，所以左右 padding 設為 0 即可。 */
  padding: 13px 0;
  
  /* 邊框圓角：設定一個非常大的值，會讓按鈕變成完美的膠囊形狀 */
  border-radius: 999px;
  
  /* 字體大小和粗細 */
  font-size: 20px;

  
  /* 
    預設一個透明的邊框。
    這是一個小技巧，用來防止當滑鼠懸停 (hover) 在 .btn-collect 上，
    突然增加邊框時，導致整個按鈕輕微「跳動」一下的問題。
  */
  border: 2px solid transparent;
  

}

/* =================================================================== */
/*                      頁面主要區塊佈局 (圖片、步驟、食材)                */
/* =================================================================== */

/* 包裹「食譜圖片」和「右側小卡」的容器 */
.outer-wrapper {
  /* 啟用 Flexbox，並讓裡面的內容水平置中 */
  display: flex;
  justify-content: center;
}
.recipe-wrapper {
  display: flex; /* 讓圖片和小卡可以水平並排 */
  gap: 10px;   /* 圖片和小卡之間的水平間距 */
}

/* 包裹「料理步驟」和「所需食材」的容器 */
.step-ingredient-wrapper {
  display: flex;
  justify-content: center; /* 水平置中 */
  align-items: flex-start; /* 讓兩個區塊的頂部對齊 */
  gap: 10px;               /* 兩個區塊之間的水平間距 */
  margin-top: 10px;        /* 與上方的 .outer-wrapper 之間的垂直距離 (1rem 約等於 16px) */
}

/* 「料理步驟」和「所需食材」兩個盒子的共用樣式 */
.step-box,
.ingredient-box {
  padding: 35px;   /* 內距 */
  border-radius: 20px; /* 圓角 */
}

/* 「料理步驟」盒子的專屬樣式 */
.step-box {
  width: 800px;           /* 固定寬度 */
  background-color: #ead7c4; /* 背景色 */
}
/* 「所需食材」盒子的專屬樣式 */
.ingredient-box {
  width: 393px;           /* 固定寬度 */
  background-color: #fff; /* 白色背景 */
  border: 1px solid #e5e7eb; /* 淺灰色邊框 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* 細微的陰影效果 */
}

/* 「所需食材」標題區塊的容器 */
.section-ingredient-header {
  display: flex;
  justify-content: space-between; /* 關鍵：讓標題和複製圖示左右分離、貼齊邊緣 */
  align-items: center;           /* 垂直置中對齊 */
}

/* 「所需食材」的標題 (h3) */
.section-ingredient-title {
  font-size: 32px;

}
.copy-icon {
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 15px
}

/* 為了調整標題和下方列表的間距，單獨為標題設定 margin-bottom */
.section-ingredient-title {
  margin-bottom: 40px;
}

/* 食材列表中的每一個項目 (li) */
.section-ingredient-item {
  margin-bottom: 25px; /* 項目之間的垂直間距 */
  font-size: 24px;
  color: #333;
}



/* "步驟 1", "步驟 2" ... 的標籤 */
.step-label {
  font-size: 28px;
  margin-bottom: 15px; /* 與下方步驟內容的垂直距離 */
}

/* 實際的步驟文字內容 */
.step-text {
  font-size: 24px;
  margin-bottom: 70px; /* 與下一個步驟標籤的垂直距離 */
  margin-left: 70px;   /* 左側縮排，製造出層次感 */
}
  /* 留言區 */






  /* RWD手機 */

  /* 電腦大螢幕維持原本排版 */
</style>
<!-- ──────────────────────────────────────────────────────────────────────── -->
<style lang="scss" scoped></style>
