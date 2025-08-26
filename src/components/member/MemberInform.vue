<script setup>
  import { onMounted } from 'vue';
  import { useNotificationStore } from '@/stores/notification';
  import { useRouter } from 'vue-router';

  const notifyStore = useNotificationStore();
  const router = useRouter();

  onMounted(() => {
    notifyStore.loadNotifications();
  });

  function handleClick(item) {
    if (item.type === 19 || item.type === 20 || item.type === 21 || item.type === 22) {
      // 訂單相關通知
      router.push({ name: 'order-detail', params: { id: item.order_id } });
    } else if (item.type === 30 && item.recipe_id) {
      //  食譜留言通知
      router.push({ name: 'recipe-detail', params: { id: item.recipe_id } });
    } else if ((item.type === 10 || item.type === 11) && item.recipe_id) {
      //  食譜上架/審核通知
      router.push({ name: 'recipe-detail', params: { id: item.recipe_id } });
    } else {
      console.log('暫無對應頁面，通知內容：', item);
    }

    notifyStore.markRead(item.notification_id);
  }
</script>

<template>
  <div class="Inform">
    <div
      class="Inform__card"
      v-for="item in notifyStore.list"
      :key="item.notification_id"
      :class="{ 'Inform__card--unread': item.status === '0' }"
      @click="handleClick(item)"
    >
      <h1 class="Inform__content">{{ item.content_title }}</h1>
      <p class="Inform__source">{{ item.content_text }}</p>
      {{ item.created_date }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .Inform {
    width: 100%;
    background: color(backgroundColor, panel);
    border-radius: 15px;
    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
    padding: 20px 45px;
    position: relative;
    cursor: pointer;
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
      box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
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
