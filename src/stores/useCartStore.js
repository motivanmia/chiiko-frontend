import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { patchCart, deleteCart, deleteCarts } from '@/api/fetch';
import Swal from 'sweetalert2';

// 表單預設值函式，避免重複
function getDefaultPaymentForm() {
  return {
    delivery: 'home',
    location: 'mainIsland',
    paymentMethod: 'card',
    cardNumber: '',
    expMonth: '',
    cvv: '',
    cardHolder: '',
  };
}

function getDefaultRecipientForm() {
  return {
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
}

export const useCartStore = defineStore('cart', () => {
  // 購物車商品
  const products = ref([]);

  // 付款表單
  const paymentForm = ref(getDefaultPaymentForm());

  // 收貨人表單
  const recipientForm = ref(getDefaultRecipientForm());

  // 收件人同購買人
  const sameAsRecipient = ref(false);

  // 內部標記，防止循環更新
  let isUpdatingFromBuyer = false;

  // 步驟
  const currentStep = ref(1);

  // 驗證
  const errors = ref({
    payment: {
      cardNumber: '',
      expMonth: '',
      cvv: '',
      cardHolder: '',
    },
    recipient: {
      name: '',
      phone: '',
      city: '',
      district: '',
      postal: '',
      address: '',
    },
  });

  // 小計
  const subtotal = computed(() => {
    return products.value.reduce((sum, product) => {
      return sum + product.unit_price * product.quantity;
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

  // 計算收件人資料：根據 sameAsRecipient 來決定用哪一組資料
  const recipientData = computed(() => {
    if (sameAsRecipient.value) {
      return {
        name: recipientForm.value.buyerName,
        phone: recipientForm.value.buyerPhone,
        city: recipientForm.value.buyerCity,
        district: recipientForm.value.buyerDistrict,
        postal: recipientForm.value.buyerPostal,
        address: recipientForm.value.buyerAddress,
      };
    }
    return {
      name: recipientForm.value.recipientName,
      phone: recipientForm.value.recipientPhone,
      city: recipientForm.value.recipientCity,
      district: recipientForm.value.recipientDistrict,
      postal: recipientForm.value.recipientPostal,
      address: recipientForm.value.recipientAddress,
    };
  });

  // 增加商品數量
  const increaseQuantity = async (productId) => {
    try {
      const product = products.value.find((p) => p.product_id === productId);
      if (!product) return;

      const newQuantity = product.quantity + 1;
      const { data } = await patchCart({
        product_id: productId,
        quantity: newQuantity,
      });

      if (data.status === 'success') {
        product.quantity = newQuantity;
      } else {
        // console.error('更新失敗', data.message);
        Swal.fire({
          icon: 'error',
          title: '更新失敗',
          text: data.message,
        });
      }
    } catch (error) {
      // console.error('增加商品數量錯誤:', error.message || error);
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message || '請稍後再試',
      });
    }
  };

  // 減少商品數量
  const decreaseQuantity = async (productId) => {
    try {
      const product = products.value.find((p) => p.product_id === productId);
      if (!product || product.quantity <= 1) return;

      const newQuantity = product.quantity - 1;
      const { data } = await patchCart({
        product_id: productId,
        quantity: newQuantity,
      });

      if (data.status === 'success') {
        product.quantity = newQuantity;
      } else {
        // console.error('更新失敗', data.message);
        Swal.fire({
          icon: 'error',
          title: '更新失敗',
          text: data.message,
        });
      }
    } catch (error) {
      // console.error('減少商品數量錯誤:', error.message || error);
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message || '請稍後再試',
      });
    }
  };

  // 移除商品
  const removeProduct = async (productId) => {
    try {
      const { data } = await deleteCart({
        product_id: productId,
      });

      if (data.status === 'success') {
        products.value = products.value.filter((p) => p.product_id !== productId);
      } else {
        // console.error('刪除失敗', data.message);
        Swal.fire({
          icon: 'error',
          title: '刪除失敗',
          text: data.message,
        });
      }
    } catch (error) {
      // console.error('刪除商品錯誤:', error.message || error);
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message || '請稍後再試',
      });
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

  const validateCreditCardField = (field) => {
    if (paymentForm.value.paymentMethod !== 'card') {
      // 如果不是信用卡付款，直接清空錯誤並返回 true
      errors.value.payment[field] = '';
      return true;
    }

    const val = paymentForm.value[field];
    switch (field) {
      case 'cardNumber':
        if (!/^\d{16}$/.test(val.replace(/\s|-/g, ''))) {
          errors.value.payment.cardNumber = '請輸入16位數字卡號';
          return false;
        }
        break;
      case 'expMonth':
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) {
          errors.value.payment.expMonth = '請輸入有效年月 (MM/YY)';
          return false;
        }
        break;
      case 'cvv':
        if (!/^\d{3,4}$/.test(val)) {
          errors.value.payment.cvv = '請輸入3到4位數字的CVV';
          return false;
        }
        break;
      case 'cardHolder':
        if (!val.trim()) {
          errors.value.payment.cardHolder = '請輸入持卡人姓名';
          return false;
        }
        break;
    }
    errors.value.payment[field] = '';
    return true;
  };

  // 驗證單一欄位
  const validateRecipientField = (field) => {
    const val = recipientData.value[field] || '';
    switch (field) {
      case 'name':
        if (!val.trim()) {
          errors.value.recipient.name = '請輸入收件人姓名';
          return false;
        }
        break;
      case 'phone':
        if (!/^09\d{8}$/.test(val)) {
          errors.value.recipient.phone = '請輸入有效手機號碼';
          return false;
        }
        break;
      case 'city':
        if (!val) {
          errors.value.recipient.city = '請選擇縣市';
          return false;
        }
        break;
      case 'district':
        if (!val) {
          errors.value.recipient.district = '請選擇鄉鎮市區';
          return false;
        }
        break;
      case 'postal':
        if (!val) {
          errors.value.recipient.postal = '請輸入郵遞區號';
          return false;
        }
        break;
      case 'address':
        if (!val.trim()) {
          errors.value.recipient.address = '請輸入詳細地址';
          return false;
        }
        break;
    }
    errors.value.recipient[field] = '';
    return true;
  };

  const validateCheckoutForm = () => {
    let valid = true;

    // 驗證信用卡
    if (paymentForm.value.paymentMethod === 'card') {
      for (const field of ['cardNumber', 'expMonth', 'cvv', 'cardHolder']) {
        if (!validateCreditCardField(field)) valid = false;
      }
    }

    // 驗證收件人
    for (const field of ['name', 'phone', 'city', 'district', 'postal', 'address']) {
      if (!validateRecipientField(field)) valid = false;
    }

    return valid;
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
    return {
      products: products.value,
      payment: paymentForm.value,
      recipient: recipientData.value,
      subtotal: subtotal.value,
      shippingCost: shippingCost.value,
      total: total.value,
      orderTime: new Date().toISOString(),
    };
  };

  // 清空購物車
  const clearCart = async () => {
    try {
      const { data } = await deleteCarts();

      if (data.status === 'success') {
        products.value = [];
      } else {
        // console.error('清空失敗', data.message);
        Swal.fire({
          icon: 'error',
          title: '清空失敗',
          text: data.message,
        });
      }
    } catch (error) {
      // console.error('清空購物車錯誤:', error.message || error);
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message || '請稍後再試',
      });
    }
  };

  // 重置表單
  const resetForms = () => {
    paymentForm.value = getDefaultPaymentForm();
    recipientForm.value = getDefaultRecipientForm();
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
    errors,

    // 計算屬性
    subtotal,
    shippingCost,
    total,
    productCount,
    recipientData,

    // 商品方法
    increaseQuantity,
    decreaseQuantity,
    removeProduct,
    addProduct,

    // 付款方法
    updatePaymentForm,
    updateCardData,
    validateCreditCardField,
    validateRecipientField,
    validateCheckoutForm,

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
