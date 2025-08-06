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
  <!-- <div class="member-main"> -->
    <!-- <MemberSidebar /> -->
    <!-- <div class="member-content"> -->
      <!-- <MemberDashboard /> -->
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
    <!-- </div> -->
  <!-- </div> -->
</template>

<style lang="scss" scoped>
  .member-main{
    display: flex;
    gap:10px;
    justify-content: center;
    width: 100%;
    height: auto;
    margin-bottom: 200px;
  }

  .member-content {
    max-width: 887px;
    width: 100%;
    height: auto;
  }
  .member-collect {
    background-color: color(backgroundColor, panel);
    padding: 40px 20px;
    border-radius: 20px;
    display: flex;
    margin-top: 10px;
    flex-wrap: wrap;
    gap:25px;
    
  }


.member-card__box {


  :deep(.heart-icon) {
    color: red; // 願望清單 ICON 的顏色
  }
}




</style>
