<script setup>
  import MemberDashboard from '@/components/member/MemberDashboard.vue';
  import MemberSidebar from '@/components/member/MemberSidebar.vue';
</script>

<template>
  <div class="member__control">
    <div>
      <MemberSidebar />
    </div>
    <div class="member__contant">
      <MemberDashboard />
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  main {
    margin-top: 215px;
  }
  .member__control {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 215px;
  }
  .member__contant {
    width: 100%;
    max-width: 887px;
    margin-bottom: 200px;
  }
</style>
