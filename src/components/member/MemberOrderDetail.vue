<script setup>
  import Icon from '@/components/common/Icon.vue';
  import OrderItem from '../cart/OrderItem.vue';
  import { ref, computed } from 'vue';

  // const filter = ref('所有訂單');

  const orders = ref([
    {
      id: '12345',
      date: '2025-07-01',
      number: 'SS123456889',
      status: '已完成',
      payment: '已付款',
      products: [
        {
          name: '不鏽鋼奶油刀',
          image: new URL('@/assets/image/Product/product-knife.png', import.meta.url).href,
          quantity: 1,
          price: 29,
        },
        {
          name: '魚鱗刨刀',
          image: new URL('@/assets/image/Product/product-knife.png', import.meta.url).href,
          quantity: 1,
          price: 29,
        },
        {
          name: '日式和風筷架',
          image: new URL('@/assets/image/Product/product-knife.png', import.meta.url).href,
          quantity: 1,
          price: 29,
        },
      ],
      shippingCost: 100,
    },
  ]);

  const total = computed(() => {
    const order = orders.value[0]; // 取第一筆
    const productsTotal = order.products.reduce((sum, p) => {
      return sum + p.quantity * p.price;
    }, 0);
    return productsTotal + order.shippingCost;
  });

  // const filteredOrder = computed(() => {
  //   if (filter.value === '所有訂單') {
  //     return orders.value;
  //   }
  //   return orders.value.filter((order) => order.status === filter.value);
  // });

  // const getStatusClass = (status) => {
  //   switch (status) {
  //     case '待確認':
  //       return 'status-pending';
  //     case '已出貨':
  //       return 'status-sipped';
  //     case '已完成':
  //       return 'status-completed';
  //     default:
  //       return '';
  //   }
  // };

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
  <div class="order-detail__container">
    <div
      class="order-detail"
      v-for="order in orders"
      :key="order.id"
    >
      <section class="order-detail__product">
        <header class="order-detail__header">
          <div class="order-detail__header-top">
            <div class="order-detail__id">訂單編號 #{{ order.id }}</div>
            <div class="order-detail__date">訂購日期 {{ order.date }}</div>
            <div class="order-detail__number">物流單號 {{ order.number }}</div>

            <button class="order-detail__cancel__btn">退貨</button>
          </div>

          <div class="order-detail__header-bottom">
            <div class="order-detail__status">
              <div class="order-detail__status-section">
                <span class="order-detail__label">訂單狀態</span>
                <span class="order-detail__status-tag">{{ order.status }}</span>
              </div>
              <div class="order-detail__payment-section">
                <span class="order-detail__label">付款狀態</span>
                <span>{{ order.payment }}</span>
              </div>
            </div>
            <div class="order-detail__info">
              <p class="order-detail__header-total">
                訂單金額
                <span class="order-detail__header-total-price">${{ total }}</span>
              </p>
            </div>
          </div>
        </header>

        <div class="order-detail__items">
          <div
            class="order-detail__item"
            v-for="product in order.products"
          >
            <div class="order-detail__item-pic">
              <img
                class="order-detail__item-image"
                :src="product.image"
                :alt="product.name"
              />
            </div>
            <div class="order-detail__item-info">
              <h3 class="order-detail__item-name">{{ product.name }}</h3>
              <span class="order-detail__item-unit-price">
                NT$
                <span class="order-detail__item-unit-price-number">{{ product.price }}</span>
              </span>
            </div>
            <div class="order-detail__item-quantity">數量 {{ product.quantity }}</div>
            <div class="order-detail__item-subtotal">
              NT$
              <span class="order-detail__item-subtotal-number">
                {{ product.price * product.quantity }}
              </span>
            </div>
          </div>
          <div class="order-detail__shipping-cost">
            <div class="order-detail__shipping-cost-content">
              運費
              <span class="order-detail__shipping-cost-price">NT${{ order.shippingCost }}</span>
            </div>
          </div>
          <div class="order-detail__total">
            <div class="order-detail__total-content">
              總金額
              <span class="order-detail__total-price">NT${{ total }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="order-detail__payment">
        <header class="order-detail__payment-title">付款資訊</header>
        <div class="order-detail__payment-content">
          <div class="order-detail__payment-label">付款方式</div>
          <span class="order-detail__payment-desc">信用卡</span>
        </div>
      </section>
      <section class="order-detail__user-info">
        <header class="order-detail__user-info-title">收件人資訊</header>

        <div class="order-detail__user-info-content">
          <div class="order-detail__user-info-label">收件人</div>
          <span class="order-detail__user-info-desc">小胖子</span>
          <div class="order-detail__user-info-label">連絡電話</div>
          <span class="order-detail__user-info-desc">0912345678</span>
          <div class="order-detail__user-info-label">收件地址</div>
          <span class="order-detail__user-info-desc">230 桃園市中壢區復興路46號9樓</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .order-detail__container {
    width: 100%;
    background: color(backgroundColor, panel);
    border-radius: px(15);
    box-shadow: 0 0 11.4px 0 rgba(0, 0, 0, 0.21);
    padding: px(30) px(25);
    position: relative;
    @include fontSet($size: px(24), $color: color(text, dark), $ls: 1.8px);
  }

  .order-detail {
    overflow: hidden;

    &__product {
      margin-bottom: px(15);
    }

    &__header {
      background-color: color(backgroundColor, panel);
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

      &-top {
        @include flex($wrap: wrap, $jc: space-between);
        padding-bottom: px(12);
        border-bottom: px(1) solid color(text, dark);
        gap: px(10);
      }

      &-bottom {
        @include flex($wrap: wrap, $jc: space-between);
        row-gap: px(15);
        padding: px(20) 0 px(30) 0;
      }
    }

    &__cancel__btn {
      padding: px(7) px(25);
      border: none;
      border-radius: px(20);
      background: color(search, placeholder);
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.25);
      @include fontSet($size: px(20), $color: color(text, light), $ls: 3px);
    }

    &__status {
      display: flex;
      align-items: center;
      column-gap: 50px;
      row-gap: px(15);
    }

    &__status-section,
    &__payment-section {
      @include font-size(20);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    &__label {
      color: color(text, dark);
    }

    &__status-tag {
      padding: 7px 25px;
      border-radius: 20px;
      color: color(text, dark);
      background-color: #fff;
    }

    &__info {
      @include font-size(24);
    }

    &__items {
      padding: px(30) px(20);
      border-radius: px(20);
      background-color: white;
    }

    &__item {
      position: relative;
      display: grid;
      grid-template-columns: px(166) 2fr 1fr;
      padding: px(20) 0;

      &:first-child {
        padding-top: 0;
      }

      & + & {
        border-top: px(1) solid color(text, dark);
      }

      &-pic {
        width: px(136);
        height: px(136);
        border-radius: px(20);
        overflow: hidden;
      }

      &-image {
        @include fit();
        aspect-ratio: 1 / 1;
      }

      &-info {
        @include flex();
      }

      &-name {
        flex: 1;
        @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      }

      &-unit-price {
        flex: 1;
        text-align: center;
        @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

        &-number {
          @include font-size(20);
        }
      }

      &-quantity {
        @include flex();
        @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
      }

      &-subtotal {
        position: absolute;
        bottom: px(20);
        right: 0;
        @include flex($jc: flex-end);
        @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
        text-align: center;
      }
    }

    &__shipping-cost {
      padding: px(35) 0;
      border-top: px(1) solid color(text, dark);
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

      &-content {
        width: fit-content;
        margin-left: auto;
      }

      &-price {
        margin-left: px(70);
      }
    }

    &__total {
      padding-top: px(30);
      border-top: px(1) solid color(text, dark);
      @include fontSet($size: px(32), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

      &-content {
        width: fit-content;
        margin-left: auto;
      }

      &-price {
        margin-left: px(70);
      }
    }

    &__payment {
      margin-bottom: px(15);
      background-color: white;
      border-radius: px(20);
      padding: px(16) px(20);
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

      &-title {
        padding: 0 px(5) px(16) px(5);
        border-bottom: px(1) solid color(text, dark);
      }

      &-content {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: px(20) px(60);
        padding: px(24) px(5);
      }
    }

    &__user-info {
      background-color: white;
      border-radius: px(20);
      padding: px(16) px(20);
      @include fontSet($size: px(20), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);

      &-title {
        padding: 0 px(5) px(16) px(5);
        border-bottom: px(1) solid color(text, dark);
      }

      &-content {
        display: grid;
        grid-template-columns: max-content 1fr;
        gap: px(20) px(60);
        padding: px(24) px(5);
      }
    }
  }

  @include rwdmax(1200) {
    .order-detail {
      &__product {
        margin-bottom: px(15);
      }

      &__header {
        &-top {
          column-gap: px(100);
        }

        &-bottom {
          @include flex($wrap: wrap, $jc: space-between);
          padding: px(20) 0 px(30) 0;
        }
      }
    }
  }

  @include rwdmax(768) {
    .order-detail__container {
      padding: 20px 10px;
    }

    .order-detail {
      &__product {
        margin-bottom: px(20);
      }

      &__header {
        background-color: color(backgroundColor, panel);
        @include font-size(18);

        &-top {
          position: relative;
          align-items: flex-start;
          flex-direction: column;
        }

        &-bottom {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      &__cancel__btn {
        position: absolute;
        right: 0;
        top: 0;
        @include font-size(18);
      }

      &__status {
        flex-direction: column;
        align-items: flex-start;
      }

      &__status-section,
      &__payment-section {
        @include font-size(18);
        column-gap: px(20);
      }

      &__info {
        @include font-size(20);
      }

      &__header-total-price {
        margin-left: px(10);
      }

      &__items {
        padding: px(20) px(10);
      }

      &__item {
        position: relative;
        grid-template-columns: px(120) 1fr 1fr;
        border-bottom: 1px solid #f0f0f0;

        &-pic {
          width: px(100);
          height: px(100);
          border-radius: px(20);
          overflow: hidden;
        }

        &-image {
          @include fit();
          aspect-ratio: 1 / 1;
        }

        &-info {
          @include flex($d: column, $jc: space-evenly, $ai: flex-start);
          min-width: max-content;
        }

        &-name {
          flex: unset;
        }

        &-unit-price {
          flex: unset;
        }

        &-quantity {
          align-items: flex-end;
          justify-content: flex-end;
          margin-bottom: px(10);
          @include font-size(20);
        }

        &-subtotal {
          position: static;
          grid-column: span 3;
          margin-left: auto;
          margin-top: px(20);
          @include font-size(20);
        }
      }

      &__shipping-cost {
        padding: px(20) 0;

        &-price {
          margin-left: px(30);
        }
      }

      &__total {
        padding: px(20) 0;
        @include font-size(24);

        &-price {
          margin-left: px(30);
        }
      }

      &__payment {
        margin-bottom: px(20);
        padding: px(10);
        @include font-size(18);

        &-title {
          padding: 0 0 px(10) 0;
        }

        &-content {
          column-gap: px(20);
          padding: px(15) 0;
        }
      }

      &__user-info {
        margin-bottom: px(20);
        padding: px(10);
        @include font-size(18);

        &-title {
          padding: 0 0 px(10) 0;
        }

        &-content {
          column-gap: px(20);
          padding: px(15) 0;
        }
      }
    }
  }
</style>
