<script setup>
  import Icon from '@/components/common/Icon.vue';
  import { ref, reactive, nextTick } from 'vue';
  import CancelButton from '@/components/button/CancelButton.vue';
  import ConfirmButton from '@/components/button/ConfirmButton.vue';
  import Swal from 'sweetalert2';

  const Inform = [
    {
      id: 1,
      content: '您有一則新留言',
      source: '王大餅：這個食譜太棒了！我照著做出來的味道超好！',
      isRead: false,
    },
    {
      id: 2,
      content: '你的食譜已審核通過囉',
      source: '麻婆豆腐',
      isRead: false,
    },
    {
      id: 3,
      content: '您訂購的商品已出貨',
      source: '訂單編號 #12345',
      isRead: false,
    },
    {
      id: 4,
      content: '您有一則新留言',
      source: '王大餅：這個食譜太棒了！我照著做出來的味道超好！',
      isRead: true,
    },
    {
      id: 5,
      content: '你的食譜已審核通過囉',
      source: '麻婆豆腐',
      isRead: true,
    },
    {
      id: 6,
      content: '您訂購的商品已出貨',
      source: '訂單編號 #12345',
      isRead: true,
    },
  ];
</script>

<template>
  <div class="Inform">
    <div
      class="Inform__card"
      v-for="item in Inform"
      :class="{ 'Inform__card--unread': !item.isRead }"
    >
      <h1 class="Inform__content">{{ item.content }}</h1>
      <p class="Inform__source">{{ item.source }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .Inform {
    width: 100%;
    background: color(backgroundColor, panel);
    border-radius: 15px;
    padding: 20px 45px;
    position: relative;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(24),
      $color: color(text, dark),
      $ls: 1.8px
    );
    @include rwdmax(768) {
      padding: 5px 10px;
    }

    &__card {
      width: 100%;
      border-radius: 20px;
      margin: 30px auto;
      background-color: white;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
      padding: 5px 30px;
      @include rwdmax(768) {
        margin: 15px auto;
      }
      &--unread {
        background-color: color(backgroundColor, beige);
      }
    }

    &__content {
      color: #000;
      font-family: 'Noto Sans TC';
      font-size: 24px;
      letter-spacing: 2.4px;
      margin: 20px auto;
    }

    &__source {
      color: #636363;
      font-size: 20px;
      font-weight: 400;
      letter-spacing: 2px;
      margin: 20px auto;
    }
  }
</style>
