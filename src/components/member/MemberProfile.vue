<script setup>
  import Icon from '@/components/common/Icon.vue';
  import { ref, reactive, nextTick } from 'vue';
  import CancelButton from '@/components/button/CancelButton.vue';
  import ConfirmButton from '@/components/button/ConfirmButton.vue';
  import Swal from 'sweetalert2';

  // 是否在編輯模式
  const isEdit = ref(false);

  // 找第一個輸入框
  const firstInput = ref(null);

  // 表單資料
  const userInfo = reactive({
    name: '張小花',
    nickname: '花媽媽烹飪教室',
    phone: '0912-345-678',
    birthdate: '1911-01-01',
    email: 'flower@gmail.com',
    address: '320 桃園市中壢區復興路46號9樓',
  });

  // 儲存編輯前的原始資料
  let originalUserInfo = {};

  // 切換編輯模式
  const enterEditMode = async () => {
    // 備份目前的資料
    originalUserInfo = JSON.parse(JSON.stringify(userInfo));

    //開啟編輯模式
    isEdit.value = true;

    // 聚焦第一個輸入框
    await nextTick();
    if (firstInput.value) {
      firstInput.value.focus();
    }
  };

  // 儲存變更
  const saveChange = () => {
    isEdit.value = false;
    Swal.fire({
      icon: 'success',
      title: '修改成功',
    });
    // 清空備份資料
    originalUserInfo = {};
  };

  // 取消編輯
  const cancelEdit = () => {
    // 將備份資料還原
    Object.assign(userInfo, originalUserInfo);
    isEdit.value = false;
    originalUserInfo = {};
  };

  const cancelBtnClick = () => {
    cancelEdit();
  };
</script>

<template>
  <div class="member__info">
    <form
      @submit.prevent="saveChange"
      :class="{ 'is-edit': isEdit }"
    >
      <button
        type="button"
        @click="enterEditMode"
        class="edit__btn"
        :class="{ isactive: isEdit }"
        title="編輯資料"
      >
        <Icon
          icon-name="revise"
          class="edit__icon"
        />
      </button>
      <div class="form__wrap">
        <div class="form__group">
          <label for="name">姓名</label>
          <input
            type="text"
            id="name"
            v-model="userInfo.name"
            :readonly="!isEdit"
            ref="firstInput"
          />
        </div>
        <div class="form__group">
          <label for="nickname">暱稱</label>
          <input
            type="text"
            id="nickname"
            v-model="userInfo.nickname"
            :readonly="!isEdit"
          />
        </div>
      </div>
      <div class="form__wrap">
        <div class="form__group">
          <label for="phone">手機</label>
          <input
            type="tel"
            id="phone"
            v-model="userInfo.phone"
            :readonly="!isEdit"
          />
        </div>
        <div class="form__group">
          <label for="birthdate">生日</label>
          <input
            type="text"
            id="birthdate"
            v-model="userInfo.birthdate"
            :readonly="isEdit"
          />
        </div>
      </div>
      <div class="form__group">
        <label for="email">電子信箱</label>
        <input
          type="email"
          id="email"
          v-model="userInfo.email"
          :readonly="isEdit"
        />
      </div>
      <div class="form__group">
        <label for="address">收件地址</label>
        <input
          type="text"
          id="address"
          v-model="userInfo.address"
          :readonly="!isEdit"
        />
      </div>

      <!-- 編輯模式操作按鈕 -->
      <div
        v-if="isEdit"
        class="form__action"
      >
        <CancelButton
          type="button"
          @click="cancelBtnClick"
        >
          取消修改
        </CancelButton>
        <ConfirmButton type="submit">儲存變更</ConfirmButton>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .member__info {
    width: 100%;
    margin-top: 10px;
    background: color(backgroundColor, panel);
    border-radius: 15px;
    padding: 65px 45px;
    position: relative;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(24),
      $color: color(text, dark),
      $ls: 1.8px
    );
    @include rwdmax(768) {
      @include font-size(20);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 30px;
      .form__wrap {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 90px;
        @include rwdmax(768) {
          flex-direction: column;
          gap: 30px;
        }
      }
    }
    form.is-edit {
      .form__group input:not([readonly]) {
        background-color: #ffffff;
        pointer-events: auto;
        cursor: text;
        border-color: #ccc;

        &:focus {
          outline: none;
          border-color: color(button, main);
        }
      }
      .form__group input[readonly] {
        background: color(search, placeholder);
        cursor: not-allowed;
        pointer-events: none;
      }
    }
    .form__action {
      display: flex;
      justify-content: space-around;
      margin-top: 30px;
      @include rwdmax(1200) {
        justify-content: space-between;
        gap: 50px;
      }
      @include rwdmax(768) {
        flex-direction: column;
        gap: 25px;
        --btn-padding: 12px 99px;
      }
    }
  }
  .edit__btn {
    @include font-size(25);
    color: color(text, light);
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: none;
    position: absolute;
    right: 20px;
    top: 20px;
    background: #868686;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;
    .edit__icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &.isactive {
      background: #868686;
      box-shadow: 0 0 2.2px 3px rgba(0, 0, 0, 0.25) inset;
      cursor: auto;
    }
  }
  .form__group {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
    label {
      display: block;
    }
    input {
      background: #fff;
      cursor: default;
      pointer-events: none;
      width: 100%;
      padding: 8px 20px;
      outline: none;
      box-sizing: border-box;
      border-radius: 20px;
      border: 1px solid transparent;
      @include fontSet(
        $font: $basic-font,
        $fw: normal,
        $size: px(24),
        $color: color(text, dark),
        $ls: 1.8px
      );
      @include rwdmax(768) {
        @include font-size(20);
      }
    }
  }
</style>
