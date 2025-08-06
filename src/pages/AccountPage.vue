<script setup>
  import MemberDashboard from '@/components/member/MemberDashboard.vue';
  import MemberSidebar from '@/components/member/MemberSidebar.vue';
</script>

<template>
  <div class="member__control">
    <div class="member__board">
      <MemberDashboard />
    </div>
    <div class="member__sidebar">
      <MemberSidebar />
    </div>
    <div class="member__contant">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .member__control {
    display: grid;
    grid-template-areas:
      'b a '
      'b c '
      'b c ';
    gap: 10px;
    justify-content: center;
    @include rwdmax(1200) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 0 auto;
      width: fit-content;
    }
    @include rwdmax(768) {
      width: 100%;
    }
  }
  .member__sidebar {
    grid-area: b;
    @include rwdmax(1200) {
      padding-inline: px(10);
    }
  }
  .member__board {
    grid-area: a;
    @include rwdmax(1200) {
      padding-inline: px(10);
    }
  }
  .member__contant {
    grid-area: c;
    width: 100%;
    max-width: 887px;
    margin-bottom: 200px;
    @include rwdmax(1200) {
      margin-bottom: 150px;
      padding-inline: px(10);
    }
  }
</style>
