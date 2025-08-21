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
    grid-template-columns: 300px 1fr;
    grid-template-rows: 97px 1fr;
    grid-template-areas:
      'b a '
      'b c '
      'b c ';
    gap: 10px;
    max-width: 1200px;
    margin: 0 auto;
    @include rwdmax(1200) {
      grid-template-columns: 250px 1fr;
      padding-inline: px(10);
      max-width: 1020px;
      margin: 0 auto;
    }
    @include rwdmax(1024) {
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
    }
    @include rwdmax(1024) {
      max-width: 730px;
      padding-inline: px(10);
    }
  }
  .member__board {
    grid-area: a;
    @include rwdmax(1200) {
    }
    @include rwdmax(1024) {
      max-width: 730px;
      padding-inline: px(10);
    }
  }
  .member__contant {
    grid-area: c;
    @include rwdmax(1200) {
    }
    @include rwdmax(1024) {
      max-width: 730px;
      padding-inline: px(10);
    }
  }
</style>
