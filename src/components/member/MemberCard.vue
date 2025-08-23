<script setup>
  import Icon from '../common/Icon.vue';
  import { defineProps, defineEmits, ref } from 'vue';

  //宣告props
  const props = defineProps({
    imgSrc: {
      //圖片
      type: String,
      required: true,
      default: '',
    },
    imgAlt: {
      //圖片alt
      type: String,
      default: '圖片',
    },
    titleText: {
      //標題
      type: String,
      required: true,
      default: '標題',
    },
    iconName: {
      //icon名稱
      type: String,
      default: 'mark',
    },
    iconDescription: {
      //內容
      type: String,
      default: '已收藏',
    },
  });

  const emit = defineEmits(['delete-click']);

  const handleDelete = ()=>{
    if(confirm('確定要刪除這筆收藏?')){
      emit('delete-click');
    }
  };
</script>

<template>
  <div class="member-card">
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
          :class="[
            'member-card__icon',
            props.iconName === 'mark' ? 'mark-icon' : 'heart-icon', // 動態 class
          ]"
          @click.stop="handleDelete"
        />
        <p>{{ props.iconDescription }}</p>
      </div>
    </div>
  </div>
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
        height: auto;
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
