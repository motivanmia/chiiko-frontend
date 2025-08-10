<script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const goToPage = () => {
    router.push('/product-detail');
  };

  const imageUrl = new URL('@/assets/image/Product/kitchen-knife.jpg', import.meta.url).href;

  //上面後續要更改先用一張圖片示意

  import MemberSidebar from './MemberSidebar.vue';
  import MemberCard from './MemberCard.vue';
  import MemberDashboard from './MemberDashboard.vue';
</script>

<template>
  <div class="member-collect">
    <div
      v-for="card in 9"
      class="member-card__box"
    >
      <MemberCard
        @click="goToPage"
        :img-src="imageUrl"
        img-alt="不鏽鋼奶油刮刀"
        title-text="不鏽鋼奶油刮刀"
        icon-name="heart"
        icon-description="已加入願望清單"
      ></MemberCard>
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
