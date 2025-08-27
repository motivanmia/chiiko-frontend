<script setup>
  import Icon from '../common/Icon.vue';
  import { defineProps, defineEmits, ref } from 'vue';
  import { useRouter } from 'vue-router'; // 引入 useRouter
  import Swal from 'sweetalert2';

  // 宣告 props
  const props = defineProps({
    imgSrc: {
      type: String,
      required: true,
      default: '',
    },
    imgAlt: {
      type: String,
      default: '圖片',
    },
    titleText: {
      type: String,
      required: true,
      default: '標題',
    },
    iconName: {
      type: String,
      default: 'mark',
    },
    iconDescription: {
      type: String,
      default: '已收藏',
    },
    // 用於導航的食譜 ID
    recipeId: {
      type: [String, Number],
      required: true,
    },
  });

  const emit = defineEmits(['delete-click']);

  const handleDelete = async () => {
    // 使用 Swal.fire() 顯示確認對話框
    const result = await Swal.fire({
      title: '確定要刪除這筆收藏嗎？',
      text: '此操作無法復原。',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確定刪除',
      cancelButtonText: '取消',
    });
    // 檢查使用者的選擇
    if (result.isConfirmed) {
      emit('delete-click');
      Swal.fire({
        title: '刪除中...',
        text: '請稍後...',
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };
</script>

<template>
  <router-link
    class="member-card"
    :to="{ name: 'recipe-detail', params: { id: props.recipeId } }"
  >
    <div class="member-card__pic">
      <img
        :src="props.imgSrc"
        :alt="props.imgAlt"
      />
      <div class="member-card__title">
        <h3>{{ props.titleText }}</h3>
      </div>

      <div class="member-card__content">
        <Icon
          :icon-name="props.iconName"
          :class="['member-card__icon', props.iconName === 'mark' ? 'mark-icon' : 'heart-icon']"
          @click.prevent.stop="handleDelete"
        />
        <p>{{ props.iconDescription }}</p>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
  .member-card {
    background-color: white;

    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);

    border-radius: 20px;

    padding: 10px;

    display: flex;

    flex-direction: column;

    width: 265px;

    height: 275px;

    &__pic {
      // cursor: pointer;

      display: flex;

      flex-direction: column;

      justify-content: center;

      & > img {
        width: 100%;

        aspect-ratio: 1 / 0.8;

        border-radius: 20px;

        cursor: pointer;
      }
    }

    .member-card__title {
      display: flex;

      flex-direction: column;

      align-self: center;

      margin-top: 10px;

      & > h3 {
        font-size: px(20);

        letter-spacing: 1.2px;

        color: color(text, dark);
      }
    }

    .member-card__content {
      display: flex;

      align-items: center;

      justify-content: center;

      margin-top: 10px;

      & > p {
        font-size: px(16);

        color: color(text, dark);

        letter-spacing: 1.2px;

        padding-left: 5px;
      }

      .heart-icon {
        color: color(heart, bright); // 直接在這裡設定 heart-icon 的顏色

        font-size: 20px;

        cursor: pointer;
      }

      .mark-icon {
        color: color(text, dark); // 直接在這裡設定 mark-icon 的顏色

        font-size: 20px;

        cursor: pointer;
      }
    }
  }
</style>
