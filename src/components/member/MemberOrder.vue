<script setup>
  import Icon from '@/components/common/Icon.vue';
  import { ref, computed, onMounted } from 'vue';
  import { useCartStore } from '@/stores/useCartStore';
  import { storeToRefs } from 'pinia';
  import PageEmpty from './PageEmpty.vue';

  const cart = useCartStore();
  const { orders } = storeToRefs(cart);
  const { loadOrders, changeOrder } = cart;

  const filter = ref('所有訂單');
  const filterOptions = ref(['所有訂單', '待確認', '已出貨', '已完成', '取消/退貨']);

  const filteredOrder = computed(() => {
    if (!orders.value) {
      return [];
    }
    if (filter.value === '所有訂單') {
      return orders.value;
    }
    return orders.value.filter((order) => order.order_status_text === filter.value);
  });

  const getStatusClass = (status) => {
    switch (status) {
      case '待確認':
        return 'status-pending';
      case '已出貨':
        return 'status-sipped';
      case '已完成':
        return 'status-completed';
      default:
        return '';
    }
  };

  const copyTrackingNumber = async (trackingNumber) => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    } catch (error) {
      console.error('無法複製文字: ', error);
    }
  };
  const showToast = ref(false); // 顯示複製成功提示

  const cancelOrder = (orderId) => {
    changeOrder({
      order_id: orderId,
      order_status: '取消/退貨',
    });
  };

  onMounted(() => {
    loadOrders();
  });

  const goToProduct = () => {
    router.push('/products');
  };
</script>

<template>
  <div class="order__container">
    <div class="filter__btn">
      <button
        v-for="option in filterOptions"
        :key="option"
        @click="filter = option"
        :class="{ active: filter === option }"
      >
        {{ option }}
      </button>
    </div>

    <!-- 手機版選單 -->
    <div class="filter__select">
      <select v-model="filter">
        <option
          v-for="option in filterOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <Icon
        icon-name="downA"
        class="arrow__icon"
      />
    </div>

    <div
      v-if="filteredOrder.length > 0"
      class="orders"
    >
      <router-link
        :to="`/account/order-detail/${order.order_id}`"
        class="order__card"
        v-for="order in filteredOrder"
        :key="order.order_id"
      >
        <div class="order__header">
          <span>
            訂單編號
            <p>#{{ order.order_id }}</p>
          </span>
          <span>
            訂購日期
            <p>{{ order.created_at.split(' ')[0] }}</p>
          </span>
          <span
            v-if="order.order_status_text !== '待確認' && order.order_status_text !== '取消/退貨'"
            class="tracking__number"
          >
            物流單號
            <p>{{ order.tracking_number }}</p>
            <button
              @click.prevent.stop="copyTrackingNumber(order.tracking_number)"
              class="copy__btn"
            >
              <Icon
                icon-name="copy"
                class="copy__icon"
              />
            </button>
          </span>
          <button
            v-if="order.order_status_text === '待確認'"
            class="cancel__btn"
            @click.prevent.stop="cancelOrder(order.order_id)"
          >
            取消
          </button>
        </div>

        <div class="order__body">
          <img
            :src="order.first_preview_image"
            :alt="order.first_product_name"
            class="product__img"
          />
          <div class="product__details">
            <p>{{ order.first_product_name }}</p>
            <p>商品總數：{{ order.total_items }}</p>
          </div>
        </div>

        <div class="order__footer">
          <div class="status">
            <div class="status__section">
              <span class="label">訂單狀態</span>
              <span :class="['status-tag', getStatusClass(order.order_status_text)]">
                {{ order.order_status_text }}
              </span>
            </div>
            <div class="payment__section">
              <span class="label">付款狀態</span>
              <span>{{ order.payment_status_text }}</span>
            </div>
          </div>
          <div class="order__info">
            <p class="order__total">訂單金額 ${{ order.final_price }}</p>
          </div>
        </div>
      </router-link>
    </div>
    <div
      v-else
      class="empty"
    >
      <PageEmpty
        title-text="目前尚未有訂單"
        button-text="去好物精選逛逛"
        @confirm-click="goToProduct"
      ></PageEmpty>
    </div>
  </div>

  <transition name="fade">
    <div
      v-if="showToast"
      class="toast"
    >
      複製成功
    </div>
  </transition>
</template>

<style lang="scss" scoped>
  // .empty {
  //   width: 100%;
  //   background: color(backgroundColor, panel);
  //   border-radius: 15px;
  //   box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
  //   padding: 30px 25px;
  // }

  a {
    text-decoration: none;
  }

  .order__container {
    width: 100%;
    background: color(backgroundColor, panel);
    border-radius: 15px;
    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
    padding: 30px 25px;
    position: relative;
    @include rwdmax(768) {
      padding: 20px 10px;
    }
  }
  .filter__btn {
    display: flex;
    gap: 15px;
    @include rwdmax(768) {
      display: none;
    }
    button {
      width: 100%;
      padding: 10px 0;
      border-radius: 20px;
      border: none;
      background: #fff;
      cursor: pointer;
      color: color(text, dark);
      transition: 0.3s;
      @include font-size(20);
      &.active {
        background: color(button, main);
        color: color(text, light);
      }
    }
  }
  .filter__select {
    display: none; // 預設在桌面版隱藏
    @include rwdmax(768) {
      display: block; // 在手機版顯示
      position: relative;
    }
    select {
      width: 170px;
      padding: 5px 14px;
      border-radius: 20px;
      border: none;
      background: color(button, main);
      color: color(text, light);
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      @include font-size(20);
      cursor: pointer;
      &:focus {
        outline: none;
      }
    }
    .arrow__icon {
      position: absolute;
      top: 8%;
      left: 140px;
      pointer-events: none;
      color: color(text, light);
      @include font-size(35);
    }
  }
  .orders {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding-top: 50px;
    @include rwdmax(1200) {
      padding-top: 30px;
      gap: 20px;
    }
    .order__card {
      background: #fff;
      border-radius: 15px;
      padding: 15px 20px;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
      @include rwdmax(768) {
        padding: 15px;
      }
    }
    .order__header {
      display: flex;
      align-items: center;
      gap: 50px;
      @include rwdmax(768) {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
        position: relative;
      }

      span {
        color: color(text, base);
        display: flex;
        gap: 0.5em;
        @include font-size(20);
        @include rwdmax(768) {
          @include font-size(18);
        }
      }
      p {
        color: color(text, dark);
      }
    }
    .cancel__btn {
      margin-left: auto;
      padding: 7px 25px;
      border: none;
      border-radius: 20px;
      background: color(search, placeholder);
      border-radius: 20px;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
      cursor: pointer;
      @include fontSet(
        $font: $basic-font,
        $fw: normal,
        $size: px(20),
        $color: color(text, light),
        $ls: 3px
      );
      @include rwdmax(768) {
        position: absolute;
        top: -8%;
        right: 0;
        padding: 4px 20px;
        @include font-size(18);
      }
    }
    .tracking__number {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 5px;
      @include rwdmax(768) {
        margin-left: 0;
      }
    }
    .copy__btn {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      .copy__icon {
        @include font-size(25);
        @include rwdmax(768) {
          @include font-size(20);
        }
      }
    }
  }
  .order__body {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    .product__img {
      width: 160px;
      aspect-ratio: 4 / 3;
      border-radius: 20px;
      object-fit: cover;
      color: color(text, dark);
      @include rwdmax(500) {
        width: 120px;
      }
    }
    .product__details {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      color: color(text, dark);
      @include font-size(20);
      @include rwdmax(768) {
        flex-direction: column;
        gap: 10px;
        @include font-size(18);
      }
    }
  }
  .order__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    @include rwdmax(768) {
      flex-direction: column-reverse;
      align-items: normal;
      gap: 25px;
    }
    .status {
      display: flex;
      align-items: center;
      gap: 50px;
      @include rwdmax(768) {
        flex-direction: column;
        align-items: normal;
        gap: 10px;
      }
    }
    .status__section,
    .payment__section {
      @include font-size(20);
      display: flex;
      align-items: center;
      gap: 10px;
      color: color(text, dark);
      @include rwdmax(768) {
        @include font-size(18);
      }
    }
    .label {
      color: color(text, base);
    }
    .status-tag {
      padding: 7px 25px;
      border-radius: 20px;
      background: color(text, base);
      color: color(text, light);
      @include rwdmax(768) {
        padding: 4px 20px;
        @include font-size(18);
      }
    }
    .order__info {
      @include font-size(24);
      @include rwdmax(768) {
        text-align: right;
      }
    }
    .order__total {
      color: color(text, dark);
    }
  }

  .toast {
    position: fixed;
    top: 150px;
    left: 50%;
    transform: translateX(-50%);
    background: color(text, light);
    color: color(button, main);
    padding: 0.6em 1.2em;
    border-radius: 0.4em;
    font-size: 20px;
    pointer-events: none;
    z-index: 20;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
</style>
