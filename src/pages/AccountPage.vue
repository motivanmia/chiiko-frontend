<script setup>
  import MemberDashboard from '@/components/member/MemberDashboard.vue';
  import MemberSidebar from '@/components/member/MemberSidebar.vue';
</script>

<template>
  <div class="member__control">
    <div>
      <MemberSidebar />
    </div>
    <div>
      <MemberDashboard />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .member__control {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
</style>
