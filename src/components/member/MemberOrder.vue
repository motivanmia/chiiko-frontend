<script setup>
  import Icon from '@/components/common/Icon.vue';
  import { ref, computed } from 'vue';

  const filter = ref('所有訂單');

  const orders = ref([
    {
      id: '12345',
      date: '2025-07-01',
      status: '待確認',
      payment: '已付款',
      product: {
        name: '不鏽鋼奶油鋼刀',
        image: new URL('@/assets/image/Product/product-knife.png', import.meta.url).href,
      },
      quantity: '3',
      price: '187',
      trackingNumber: null,
    },
    {
      id: '12346',
      date: '2025-07-01',
      status: '已出貨',
      payment: '已付款',
      product: {
        name: '不鏽鋼奶油鋼刀',
        image: new URL('@/assets/image/Product/product-knife.png', import.meta.url).href,
      },
      quantity: '3',
      price: '187',
      trackingNumber: 'S12345',
    },
    {
      id: '12347',
      date: '2025-07-01',
      status: '已完成',
      payment: '已付款',
      product: {
        name: '不鏽鋼奶油鋼刀',
        image: new URL('@/assets/image/Product/product-knife.png', import.meta.url).href,
      },
      quantity: '3',
      price: '187',
      trackingNumber: 'S12345',
    },
  ]);

  const filteredOrder = computed(() => {
    if (filter.value === '所有訂單') {
      return orders.value;
    }
    return orders.value.filter((order) => order.status === filter.value);
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
      console.error('無法複製文字: ', err);
    }
  };
  const showToast = ref(false); // 顯示複製成功提示
</script>

<template>
  <div class="order__container">
    <div class="filter__btn">
      <button
        @click="filter = '所有訂單'"
        :class="{ active: filter === '所有訂單' }"
      >
        所有訂單
      </button>
      <button
        @click="filter = '待確認'"
        :class="{ active: filter === '待確認' }"
      >
        待確認
      </button>
      <button
        @click="filter = '已出貨'"
        :class="{ active: filter === '已出貨' }"
      >
        已出貨
      </button>
      <button
        @click="filter = '已完成'"
        :class="{ active: filter === '已完成' }"
      >
        已完成
      </button>
      <button
        @click="filter = '取消/退貨'"
        :class="{ active: filter === '取消/退貨' }"
      >
        取消/退貨
      </button>
    </div>

    <div class="orders">
      <div
        class="order__card"
        v-for="order in filteredOrder"
        :key="order.id"
      >
        <div class="order__header">
          <span>
            訂單編號
            <p>#{{ order.id }}</p>
          </span>
          <span>
            訂購日期
            <p>{{ order.date }}</p>
          </span>
          <span
            v-if="order.trackingNumber"
            class="tracking__number"
          >
            物流單號
            <p>{{ order.trackingNumber }}</p>
            <button
              @click="copyTrackingNumber(order.trackingNumber)"
              class="copy__btn"
            >
              <Icon
                icon-name="copy"
                class="copy__icon"
              />
            </button>
          </span>
          <button
            v-if="order.status === '待確認'"
            class="cancel__btn"
          >
            取消
          </button>
        </div>

        <div class="order__body">
          <img
            :src="order.product.image"
            :alt="order.product.name"
            class="product__img"
          />
          <div class="product__details">
            <p>{{ order.product.name }}</p>
            <p>商品總數：{{ order.quantity }}</p>
          </div>
        </div>

        <div class="order__footer">
          <div class="status">
            <div class="status__section">
              <span class="label">訂單狀態</span>
              <span :class="['status-tag', getStatusClass(order.status)]">{{ order.status }}</span>
            </div>
            <div class="payment__section">
              <span class="label">付款狀態</span>
              <span>{{ order.payment }}</span>
            </div>
          </div>
          <div class="order__info">
            <p class="order__total">訂單金額 ${{ order.price }}</p>
          </div>
        </div>
      </div>
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
  .order__container {
    width: 100%;
    min-height: 600px;
    background: color(backgroundColor, panel);
    border-radius: 15px;
    padding: 30px 25px;
    position: relative;
    @include fontSet(
      $font: $basic-font,
      $fw: normal,
      $size: px(24),
      $color: color(text, dark),
      $ls: 1.8px
    );
    @include rwdmax(768) {
      padding: 20px 10px;
    }
  }
  .filter__btn {
    display: flex;
    gap: 15px;
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
  .orders {
    display: flex;
    flex-direction: column;
    gap: 30px;
    padding-top: 60px;
    .order__card {
      background: #fff;
      border-radius: 15px;
      padding: 15px 20px;
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
    }
    .order__header {
      display: flex;
      align-items: center;
      gap: 50px;
      span {
        color: color(text, base);
        display: flex;
        gap: 0.5em;
        @include font-size(20);
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
      @include fontSet(
        $font: $basic-font,
        $fw: normal,
        $size: px(20),
        $color: color(text, light),
        $ls: 3px
      );
    }
    .tracking__number {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .copy__btn {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      .copy__icon {
        @include font-size(25);
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
      height: 125px;
      border-radius: 20px;
      object-fit: cover;
    }
    .product__details {
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      @include font-size(20);
    }
  }
  .order__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .status {
      display: flex;
      align-items: center;
      gap: 50px;
    }
    .status__section,
    .payment__section {
      @include font-size(20);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .label {
      color: color(text, base);
    }
    .status-tag {
      padding: 7px 25px;
      border-radius: 20px;
      background: color(text, base);
      color: color(text, light);
    }
    .order__info {
      @include font-size(24);
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
