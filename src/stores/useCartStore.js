import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useCartStore = defineStore('cart', () => {
  const router = useRouter();

  // 購物車商品
  const products = ref([
    {
      id: 1,
      name: '不鏽鋼防夾刀',
      price: 200,
      quantity: 1,
      image: new URL('@/assets/image/footer/01.png', import.meta.url).href,
    },
    {
      id: 2,
      name: '魚鱗刮刀',
      price: 1350,
      quantity: 1,
      image: new URL('@/assets/image/footer/01.png', import.meta.url).href,
    },
    {
      id: 3,
      name: '日式長麵條板',
      price: 1150,
      quantity: 1,
      image: new URL('@/assets/image/footer/01.png', import.meta.url).href,
    },
  ]);

  // 付款表單
  const paymentForm = ref({
    delivery: 'home',
    location: 'mainIsland',
    paymentMethod: 'card',
    cardNumber: '',
    expMonth: '',
    cvv: '',
    cardHolder: '',
  });

  // 收貨人表單
  const recipientForm = ref({
    buyerName: '小胖子',
    buyerPhone: '0912345678',
    buyerCity: '桃園市',
    buyerDistrict: '中壢區',
    buyerPostal: '320',
    buyerAddress: '復興路46號9樓',
    recipientName: '',
    recipientPhone: '',
    recipientCity: '',
    recipientDistrict: '',
    recipientPostal: '',
    recipientAddress: '',
  });

  // 收件人同購買人
  const sameAsRecipient = ref(false);

  // 內部標記，防止循環更新
  let isUpdatingFromBuyer = false;

  // 步驟
  const currentStep = ref(1);

  // 小計
  const subtotal = computed(() => {
    return products.value.reduce((sum, product) => {
      return sum + product.price * product.quantity;
    }, 0);
  });

  // 運費
  const shippingCost = computed(() => {
    if (subtotal.value >= 1000) return 0;
    return paymentForm.value.location === 'mainIsland' ? 100 : 200;
  });

  // 總價
  const total = computed(() => {
    return subtotal.value + shippingCost.value;
  });

  // 商品數量
  const productCount = computed(() => {
    return products.value.reduce((count, product) => count + product.quantity, 0);
  });

  // 增加商品數量
  const increaseQuantity = (productId) => {
    const product = products.value.find((p) => p.id === productId);
    if (product) {
      product.quantity++;
    }
  };

  // 減少商品數量
  const decreaseQuantity = (productId) => {
    const product = products.value.find((p) => p.id === productId);
    if (product && product.quantity > 1) {
      product.quantity--;
    }
  };

  // 移除商品
  const removeProduct = (productId) => {
    const index = products.value.findIndex((p) => p.id === productId);
    if (index > -1) {
      products.value.splice(index, 1);
    }
  };

  // 新增商品
  const addProduct = (product) => {
    const existingProduct = products.value.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += product.quantity || 1;
    } else {
      products.value.push({ ...product, quantity: product.quantity || 1 });
    }
  };

  // 付款方式操作
  const updatePaymentForm = (field, value) => {
    paymentForm.value[field] = value;
  };

  const updateCardData = (cardData) => {
    Object.assign(paymentForm.value, cardData);
  };

  // 收貨人資料操作
  const updateRecipientForm = (field, value) => {
    const oldValue = recipientForm.value[field];
    recipientForm.value[field] = value;

    // 如果是手動更新 recipient 欄位，且目前是同步狀態，則關閉同步
    if (!isUpdatingFromBuyer && sameAsRecipient.value && field.startsWith('recipient')) {
      // 檢查是否真的有改變
      if (oldValue !== value) {
        sameAsRecipient.value = false;
      }
    }
  };

  const toggleSameAsRecipient = (value) => {
    sameAsRecipient.value = value;
    if (value) {
      // 如果選擇同購買人資料，將購買人資料同步到收件人
      syncBuyerToRecipient();
    } else {
      // 如果取消同購買人資料，清空收貨人獨立資料
      isUpdatingFromBuyer = true;
      recipientForm.value.recipientName = '';
      recipientForm.value.recipientPhone = '';
      recipientForm.value.recipientCity = '';
      recipientForm.value.recipientDistrict = '';
      recipientForm.value.recipientPostal = '';
      recipientForm.value.recipientAddress = '';
      isUpdatingFromBuyer = false;
    }
  };

  // 同步購買人資料到收件人 - 使用 setTimeout 避免 watch 干擾
  const syncBuyerToRecipient = () => {
    isUpdatingFromBuyer = true;

    // 先更新基本資料
    recipientForm.value.recipientName = recipientForm.value.buyerName;
    recipientForm.value.recipientPhone = recipientForm.value.buyerPhone;
    recipientForm.value.recipientAddress = recipientForm.value.buyerAddress;

    // 地址需要按順序更新，避免被 AddressGroup 的 watch 重置
    setTimeout(() => {
      // 先更新縣市
      recipientForm.value.recipientCity = recipientForm.value.buyerCity;

      setTimeout(() => {
        // 再更新區域
        recipientForm.value.recipientDistrict = recipientForm.value.buyerDistrict;

        setTimeout(() => {
          // 最後更新郵遞區號
          recipientForm.value.recipientPostal = recipientForm.value.buyerPostal;
          isUpdatingFromBuyer = false;
        }, 10);
      }, 10);
    }, 10);
  };

  // 監聽購買人資料變化，如果開啟同步則自動更新收件人資料
  watch(
    () => [
      recipientForm.value.buyerName,
      recipientForm.value.buyerPhone,
      recipientForm.value.buyerCity,
      recipientForm.value.buyerDistrict,
      recipientForm.value.buyerPostal,
      recipientForm.value.buyerAddress,
    ],
    () => {
      if (sameAsRecipient.value) {
        syncBuyerToRecipient();
      }
    },
  );

  // 步驟控制
  const setCurrentStep = (step) => {
    currentStep.value = step;
  };

  const nextStep = () => {
    if (currentStep.value < 3) {
      currentStep.value++;
    }
  };

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  // 訂單提交
  const submitOrder = () => {
    const orderData = {
      products: products.value,
      payment: paymentForm.value,
      recipient: sameAsRecipient.value
        ? {
            name: recipientForm.value.buyerName,
            phone: recipientForm.value.buyerPhone,
            city: recipientForm.value.buyerCity,
            district: recipientForm.value.buyerDistrict,
            postal: recipientForm.value.buyerPostal,
            address: recipientForm.value.buyerAddress,
          }
        : {
            name: recipientForm.value.recipientName,
            phone: recipientForm.value.recipientPhone,
            city: recipientForm.value.recipientCity,
            district: recipientForm.value.recipientDistrict,
            postal: recipientForm.value.recipientPostal,
            address: recipientForm.value.recipientAddress,
          },
      subtotal: subtotal.value,
      shippingCost: shippingCost.value,
      total: total.value,
      orderTime: new Date().toISOString(),
    };

    router.push({ path: '/order-success' });
    // console.log('提交訂單:', orderData);

    // 這裡可以調用 API 提交訂單
    return orderData;
  };

  // 清空購物車
  const clearCart = () => {
    products.value = [];
  };

  // 重置表單
  const resetForms = () => {
    paymentForm.value = {
      delivery: 'home',
      location: 'mainIsland',
      paymentMethod: 'card',
      cardNumber: '',
      expMonth: '',
      cvv: '',
      cardHolder: '',
    };

    recipientForm.value = {
      buyerName: '小胖子',
      buyerPhone: '0912345678',
      buyerCity: '桃園市',
      buyerDistrict: '中壢區',
      buyerPostal: '320',
      buyerAddress: '復興路46號9樓',
      recipientName: '',
      recipientPhone: '',
      recipientCity: '',
      recipientDistrict: '',
      recipientPostal: '',
      recipientAddress: '',
    };

    sameAsRecipient.value = false;
    currentStep.value = 1;
  };

  return {
    // 狀態
    products,
    paymentForm,
    recipientForm,
    sameAsRecipient,
    currentStep,

    // 計算屬性
    subtotal,
    shippingCost,
    total,
    productCount,

    // 商品方法
    increaseQuantity,
    decreaseQuantity,
    removeProduct,
    addProduct,

    // 付款方法
    updatePaymentForm,
    updateCardData,

    // 收貨人方法
    updateRecipientForm,
    toggleSameAsRecipient,

    // 步驟控制
    setCurrentStep,
    nextStep,
    prevStep,

    // 訂單方法
    submitOrder,
    clearCart,
    resetForms,
  };
});
