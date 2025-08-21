<script setup>
  import Icon from '@/components/common/Icon.vue';
  import { ref, reactive, nextTick, onMounted, watch } from 'vue';
  import CancelButton from '@/components/button/CancelButton.vue';
  import ConfirmButton from '@/components/button/ConfirmButton.vue';
  import Swal from 'sweetalert2';
  import twZipcodes from '@/assets/taiwan_districts.json';
  import { useUserStore } from '@/stores/user';
  import { useRoute } from 'vue-router';

  const userStore = useUserStore();
  const route = useRoute();
  const isLoading = ref(true);

  // 是否在編輯模式
  const isEdit = ref(false);

  // 找第一個輸入框
  const firstInput = ref(null);

  // 表單資料
  const userInfo = reactive({
    name: '',
    nickname: '',
    phone: '',
    account: '',
    address: '',
  });

  // 電話自動加上-符號(0912-345-678)
  const formatPhone = () => {
    if (!userInfo.phone) {
      return;
    }
    let value = userInfo.phone;

    // 移除非數字字符
    value = value.replace(/[^0-9]/g, '');
    // 最多10個數字
    value = value.substring(0, 10);

    // 在第四跟第七個數字後加入-符號
    let formatValue = '';
    if (value.length > 4 && value.length <= 7) {
      formatValue = `${value.substring(0, 4)}-${value.substring(4)}`;
    } else if (value.length > 7) {
      formatValue = `${value.substring(0, 4)}-${value.substring(4, 7)}-${value.substring(7)}`;
    } else {
      formatValue = value;
    }

    //更新到userInfo.phont
    userInfo.phone = formatValue;
  };

  // 儲存編輯前的原始資料
  let originalUserInfo = {};

  // 當store的使用者資料載入或變動時 更新本地的表單資料
  watch(
    () => userStore.info,
    (newInfo) => {
      // 檢查是否有新的使用者資料
      if (newInfo) {
        // 有資料就更新本地表單
        userInfo.name = newInfo.name || '';
        userInfo.nickname = newInfo.nickname || '';
        userInfo.phone = newInfo.phone || '';
        userInfo.account = newInfo.account || '';
        userInfo.address = newInfo.address || '';
        isLoading.value = false;
        formatPhone();
      } else {
        // 如果沒有資料 (例如登出)，清空本地表單並設定為載入中
        // 這也是為了處理從登入頁面直接跳轉過來，但資料還沒載入完成的情況
        Object.assign(userInfo, {
          name: '',
          nickname: '',
          phone: '',
          account: '',
          address: '',
        });
        isLoading.value = true;
      }
    },
    { immediate: true },
  );

  // 這段會確保無論從哪個頁面進入這個路由，都會觸發資料獲取
  watch(
    () => route.path,
    (newPath) => {
      // 檢查當前路由是否是會員資料頁面
      if (newPath.includes('/account/profile')) {
        // 在進入會員頁面時，強制重新獲取資料
        userStore.fetchUserInfo();
      }
    },
    { immediate: true },
  );

  // const fetchMemberData = async () => {
  //   isLoading.value = true;
  //   try {
  //     const response = await axios.get(`${apiBase}/member/get_profile.php`);
  //     console.log(response.data);
  //     // 檢查後端回傳的狀態和資料是否存在
  //     if (response.data && response.data.status === 'success' && response.data.data) {
  //       const memberData = response.data.data;
  //       userInfo.name = memberData.name;
  //       userInfo.nickname = memberData.nickname;
  //       userInfo.phone = memberData.phone;
  //       userInfo.email = memberData.account;
  //       userInfo.address = memberData.address;

  //       formatPhone();
  //     }
  //   } catch (error) {
  //     console.log('取得會員資料失敗:', error);
  //     Swal.fire({
  //       icon: 'error',
  //       title: '資料載入失敗',
  //       text: '無法連線至伺服器，請稍後再試。',
  //     });
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };

  // onMounted(() => {
  //   fetchMemberData();
  // });

  // 輸入地址帶入郵遞區號
  watch(
    () => userInfo.address,
    (newAddress) => {
      // 在編輯模式下作用
      if (!isEdit.value) return;

      // 移除地址開頭的舊郵遞區號
      const addressWithoutZip = newAddress.replace(/^\d{3}\s*/, '');

      let foundZip = '';

      // 將'台'字轉換為'臺'
      const normalizedAddress = addressWithoutZip.replace(/台/g, '臺');

      // 找所有縣市區域
      for (const city of twZipcodes) {
        if (!city.districts) continue;
        for (const district of city.districts) {
          // 組合縣市區域名稱
          const fullDistrictName = city.name + district.name;

          // 檢查去掉郵遞區號的地址是否以此縣市區域開頭 找到符合的就跳出內層迴圈
          if (normalizedAddress.startsWith(fullDistrictName)) {
            foundZip = district.zip;
            break;
          }
        }
        // 如果已經在內層迴圈找到就跳出外層迴圈
        if (foundZip) {
          break;
        }
      }

      // 如果找到對應的郵遞區號就更新地址
      if (foundZip) {
        const newAddressZip = `${foundZip} ${addressWithoutZip}`;

        // 只有真的改變地址時才更新 避免無限迴圈
        if (userInfo.address !== newAddressZip) {
          userInfo.address = newAddressZip;
        }
      }
    },
    {
      deep: true,
    },
  );

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
          <label for="phone">手機</label>
          <input
            type="tel"
            id="phone"
            v-model="userInfo.phone"
            @input="formatPhone"
            :readonly="!isEdit"
          />
        </div>
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
      <div class="form__group">
        <label for="account">電子信箱</label>
        <input
          type="email"
          id="account"
          v-model="userInfo.account"
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
    background: color(backgroundColor, panel);
    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
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
    @include rwdmax(1200) {
      @include font-size(22);
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
        @include rwdmax(1200) {
          gap: 20px;
        }
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
        --btn-padding: 12px 90px;
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
      @include rwdmax(1200) {
        @include font-size(20);
      }
    }
  }
</style>
