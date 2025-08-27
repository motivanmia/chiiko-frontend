<script setup>
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { ref, onMounted } from 'vue';

  import MemberSidebar from './MemberSidebar.vue';
  import MemberCard from './MemberCard.vue';
  import MemberDashboard from './MemberDashboard.vue';
  import PageEmpty from './PageEmpty.vue';
  const imageUrl = new URL('@/assets/image/Product/kitchen-knife.jpg', import.meta.url).href;

  const router = useRouter();
  const allWish = ref([]);

  // 用 ENV 會更乾淨
  const API_BASE = import.meta.env.VITE_API_BASE;
  const apiUrl = `${API_BASE}/member/get_prouct_wish.php`;
  const deleteApiUrl = `${API_BASE}/member/delete_prouct_wish.php`;

  const goToProduct = () => {
    router.push('/products');
  };

  const fetchWish = async () => {
    try {
      const response = await axios.get(apiUrl, {
        params: { user_id: 1 }, // 假設是 user_id 1
        withCredentials: true,
      });

      const apiResponse = response.data || {}; // 防呆
      console.log('📌 後端完整回應：', response);

      if (apiResponse.success) {
        allWish.value = apiResponse.data;
        console.log('成功取得收藏資料', allWish.value);
      } else {
        console.error('API錯誤:', apiResponse.error || '後端回傳資料格式不正確');
        allWish.value = [];
      }
    } catch (error) {
      // ✅ 這段就是你貼的 catch 區塊
      if (error.response) {
        // 後端有回應，但狀態碼非 2xx
        console.error('取得收藏資料失敗，後端回傳：', error.response.data);
      } else if (error.request) {
        // 請求發出去但沒收到回應
        console.error('取得收藏資料失敗，沒有收到回應', error.request);
      } else {
        // 其他錯誤
        console.error('取得收藏資料失敗，其他錯誤', error.message);
      }
      allWish.value = [];
    }
  };

  const handleDeleteWish = async (wishId) => {
    try {
      // 用 DELETE 方法呼叫，body 必須放在 data
      const response = await axios.delete(deleteApiUrl, {
        data: { wishlist_id: wishId }, // ⚠ 注意欄位名稱必須跟後端一致
      });

      const apiResponse = response.data;
      if (apiResponse.success) {
        console.log('成功刪除收藏', apiResponse.message);
        // 從 allWish 移除該筆資料，更新畫面
        allWish.value = allWish.value.filter((wish) => wish.wishlist_id !== wishId);
      } else {
        console.error('刪除收藏失敗:', apiResponse.error);
      }
    } catch (error) {
      if (error.response) {
        console.error('刪除收藏失敗，後端回傳：', error.response.data);
      } else if (error.request) {
        console.error('刪除收藏失敗，沒有收到回應', error.request);
      } else {
        console.error('刪除收藏失敗，其他錯誤', error.message);
      }
    }
  };

  onMounted(() => {
    fetchWish();
  });

  // 假資料示意圖 (等後端有正確圖片連結就不用這個了)
</script>

<template>
  <div class="member-collect">
    <div v-if="allWish.length <= 0">
      <PageEmpty
        title-text="目前沒有任何收藏商品"
        button-text="去好物精選逛逛"
        @confirm-click="goToProduct"
      ></PageEmpty>
    </div>
    <div
      v-else
      v-for="wish in allWish"
      :key="wish.wish_id"
      class="member-card__box"
    >
      <MemberCard
        :img-src="wish.image || imageUrl"
        :img-alt="wish.product_name"
        :title-text="wish.product_name"
        :subtitle-text="'NT$ ' + wish.price"
        icon-name="mark"
        icon-description="已收藏"
        @delete-click="handleDeleteWish(wish.wishlist_id)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .member-collect {
    background-color: color(backgroundColor, panel);
    padding: 40px 20px;
    border-radius: 15px;
    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    justify-content: center;
    @include rwdmax(1200) {
      max-width: 768px;
    }
  }

  .member-card__box {
    // 這個選擇器會找到 .member-card__box 裡的所有元件
    // 然後穿透進去找到 .mark-icon 或 .heart-icon

    :deep(.heart-icon) {
      color: red; // 願望清單 ICON 的顏色
    }
  }
</style>
