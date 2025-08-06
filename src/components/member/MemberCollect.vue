<script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const goToPage = () => {
    router.push('/recipe-detail');
  };

  const imageUrl = new URL('@/assets/image/Member/spring-onion-soba.jpg', import.meta.url).href;

  //上面後續要更改

  import MemberSidebar from './MemberSidebar.vue';
  import MemberCard from './MemberCard.vue';
  import MemberDashboard from './MemberDashboard.vue';
</script>

<template>
  <div class="member-collect">
    <div
      v-for="cards in 9"
      class="member-card__box"
    >
      <MemberCard
        @click="goToPage"
        :img-src="imageUrl"
        img-alt="蔥花溫蕎麥麵"
        title-text="蔥花溫蕎麥麵"
        icon-name="mark"
        icon-description="已收藏"
      ></MemberCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .member-collect {
    background-color: color(backgroundColor, panel);
    padding: 40px 20px;
    border-radius: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    justify-content: center;
    @include rwdmax(1200) {
      max-width: 768px;
    }
  }
</style>
