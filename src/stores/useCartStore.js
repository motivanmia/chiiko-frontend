import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import {
  getCarts,
  postCart,
  patchCart,
  deleteCart,
  deleteCarts,
  getUserProfile,
  postOrder,
  getOrderItem,
  getOrders,
  patchOrder,
} from '@/api/fetch';
import twZipcodes from '@/assets/taiwan_districts.json';
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
    buyerName: '',
    buyerPhone: '',
    buyerCity: '',
    buyerDistrict: '',
    buyerPostal: '',
    buyerAddress: '',
    recipientName: '',
    recipientPhone: '',
    recipientCity: '',
    recipientDistrict: '',
    recipientPostal: '',
    recipientAddress: '',
  };
}

export const useCartStore = defineStore('cart', () => {
  /* 購物車 */
  // 購物車商品
  const products = ref([]);

  // 小計
  const subtotal = computed(() => {
    return products.value.reduce((sum, product) => {
      return sum + product.unit_price * product.quantity;
    }, 0);
  });

  // 商品數量
  const productCount = computed(() => {
    return products.value.reduce((count, product) => count + product.quantity, 0);
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
  const removeCart = async (productId) => {
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
  const addCart = async (product) => {
    try {
      // 傳 product_id 與 quantity 給後端
      const { data } = await postCart({
        product_id: product.id,
        quantity: product.quantity,
      });

      if (data.status === 'success') {
        // 成功後在前端更新 cart 狀態
        const cartItem = data.data; // 後端回傳的購物車項目
        const productId = Number(cartItem.product_id);

        // 檢查購物車裡是否已存在該商品
        const existingProduct = products.value.find((p) => p.product_id == productId);

        if (existingProduct) {
          // 直接更新數量（後端回傳已經是最新數量）
          existingProduct.quantity = Number(cartItem.quantity);
        } else {
          // 沒有的話新增
          products.value.push({
            product_id: productId,
            product_name: cartItem.product_name,
            unit_price: Number(cartItem.unit_price),
            preview_image: cartItem.preview_image,
            quantity: Number(cartItem.quantity),
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: '加入購物車失敗',
          text: data.message || '',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message,
      });
    }
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

  const loadCart = async () => {
    try {
      const { data } = await getCarts();

      if (data.status === 'success') {
        products.value = data.data.map((item) => ({
          ...item,
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        }));
      } else {
        Swal.fire({
          icon: 'error',
          title: '取得購物車失敗',
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message,
      });
    }
  };

  /* 付款 */
  // 付款表單
  const paymentForm = ref(getDefaultPaymentForm());

  // 運費
  const shippingCost = computed(() => {
    if (subtotal.value >= 1000) return 0;
    return paymentForm.value.location === 'mainIsland' ? 100 : 200;
  });

  // 總價
  const total = computed(() => {
    return subtotal.value + shippingCost.value;
  });

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

  /* 收件人 */
  // 收貨人表單
  const recipientForm = ref(getDefaultRecipientForm());

  // 收件人同購買人
  const sameAsRecipient = ref(false);

  // 內部標記，防止循環更新
  let isUpdatingFromBuyer = false;

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

    // // 驗證信用卡
    // if (paymentForm.value.paymentMethod === 'card') {
    //   for (const field of ['cardNumber', 'expMonth', 'cvv', 'cardHolder']) {
    //     if (!validateCreditCardField(field)) valid = false;
    //   }
    // }

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

  // 解析地址
  function parseTaiwanAddress(address) {
    if (!address) return { city: '', district: '', postal: '', detail: '' };

    // escape regex helper
    function escapeRegex(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    let rawOriginal = address.trim();
    let postal = '';
    let raw = rawOriginal;

    // 1) 郵遞區號
    const postalMatch = raw.match(/^(\d{3})\s*/);
    if (postalMatch) {
      postal = postalMatch[1];
      raw = raw.slice(postalMatch[0].length);
    }

    let foundCity = null;
    let foundDistrict = null;

    // 2) 用郵遞區號優先鎖定 city + district
    if (postal) {
      for (const c of twZipcodes) {
        const d = c.districts.find((dd) => dd.zip === postal);
        if (d) {
          foundCity = c;
          foundDistrict = d;
          break;
        }
      }
    }

    // 3) 如果沒郵遞區號，再用市名比對（台/臺 通用）
    if (!foundCity) {
      for (const c of twZipcodes) {
        const cityPattern = new RegExp('^' + escapeRegex(c.name).replace(/臺/g, '[台臺]'));
        if (cityPattern.test(raw)) {
          foundCity = c;
          break;
        }
      }
    }

    // 4) 如果有 city，嘗試找 district
    if (foundCity && !foundDistrict) {
      for (const d of foundCity.districts) {
        const districtPattern = new RegExp(escapeRegex(d.name).replace(/臺/g, '[台臺]'));
        if (districtPattern.test(raw)) {
          foundDistrict = d;
          break;
        }
      }
    }

    // 5) detail：從原始地址刪掉 cityName & districtName（台/臺 regex）
    let detail = rawOriginal;
    if (foundCity) {
      const cityPattern = new RegExp(escapeRegex(foundCity.name).replace(/臺/g, '[台臺]'), 'g');
      detail = detail.replace(cityPattern, '');
    }
    if (foundDistrict) {
      const districtPattern = new RegExp(
        escapeRegex(foundDistrict.name).replace(/臺/g, '[台臺]'),
        'g',
      );
      detail = detail.replace(districtPattern, '');
    }
    if (postal) {
      detail = detail.replace(new RegExp('^' + postal), '');
    }

    detail = detail.trim();

    return {
      city: foundCity ? foundCity.name : '',
      district: foundDistrict ? foundDistrict.name : '',
      postal: foundDistrict ? foundDistrict.zip : postal,
      detail,
    };
  }

  // 將購買人寫入
  function setRecipientForm(profile) {
    const { city, district, postal, detail } = parseTaiwanAddress(profile.address || '');

    recipientForm.value.buyerName = profile.name || '';
    recipientForm.value.buyerPhone = profile.phone || '';
    recipientForm.value.buyerCity = city;
    recipientForm.value.buyerDistrict = district;
    recipientForm.value.buyerPostal = postal;
    recipientForm.value.buyerAddress = detail;
  }

  // 抓購買人資訊
  const loadUserProfile = async () => {
    try {
      const { data } = await getUserProfile();
      if (data.status === 'success') {
        setRecipientForm(data.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: '取得會員資料失敗',
          text: data.message || '',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message || '',
      });
    }
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

  /* 步驟 */
  // 步驟
  const currentStep = ref(1);

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

  /* 訂單 */
  // 訂單提交
  const orderDetail = ref({ order: null, items: [] });
  const orders = ref(null);

  // API 需要的 payload
  const orderPayload = computed(() => {
    return {
      recipient: recipientData.value.name,
      recipient_phone: recipientData.value.phone,
      shopping_address: `${recipientData.value.postal} ${recipientData.value.city}${recipientData.value.district}${recipientData.value.address}`,
      payment_type: paymentForm.value.paymentMethod,
      payment_location: paymentForm.value.location,
    };
  });

  // 打 API
  const createOrder = async () => {
    try {
      const { data } = await postOrder(orderPayload.value);
      if (data.status !== 'success') {
        Swal.fire({
          icon: 'error',
          title: '建立訂單失敗',
          text: data.message,
        });
        return null;
      }

      const orderData = data.data;

      // 串接綠界
      if (orderData.payment_url && orderData.params) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = orderData.payment_url;

        Object.keys(orderData.params).forEach((key) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = orderData.params[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

        return;
      } else if (orderData.redirect_url) {
        // Line Pay
        window.location.href = orderData.redirect_url;
        return;
      } else {
        Swal.fire({
          icon: 'success',
          title: '訂單建立成功',
        });
        clearCart();
        return orderData.order_id;
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message,
      });
      return null;
    }
  };

  const loadOrderItem = async (orderId) => {
    if (!orderId) return false;
    try {
      const { data } = await getOrderItem({ order_id: orderId });
      if (data.status === 'success') {
        orderDetail.value = data.data;
        return true;
      } else {
        Swal.fire({
          icon: 'error',
          title: '取得訂單失敗',
          text: data.message,
        });
        return false;
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message,
      });
      return false;
    }
  };

  const loadOrders = async () => {
    try {
      const { data } = await getOrders();
      if (data.status === 'success') {
        orders.value = data.data;
      } else {
        Swal.fire({
          icon: 'error',
          title: '取得訂單失敗',
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message,
      });
    }
  };

  const changeOrder = async (payload) => {
    try {
      const { data } = await patchOrder(payload); // payload 帶 order_id, order_status

      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: '更新成功',
          text: data.message || '訂單已更新',
        });
        // 更新訂單列表（確保畫面同步）
        await loadOrders();
        await loadOrderItem(payload.order_id);
      } else {
        Swal.fire({
          icon: 'error',
          title: '更新失敗',
          text: data.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '系統錯誤',
        text: error.response?.data?.message || error.message,
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
    // 購物車
    products,
    subtotal,
    productCount,
    increaseQuantity,
    decreaseQuantity,
    removeCart,
    addCart,
    clearCart,
    loadCart,

    // 付款
    paymentForm,
    shippingCost,
    total,
    updatePaymentForm,
    updateCardData,
    validateCreditCardField,

    // 收件人
    recipientForm,
    sameAsRecipient,
    errors,
    recipientData,
    toggleSameAsRecipient,
    validateRecipientField,
    validateCheckoutForm,
    updateRecipientForm,
    loadUserProfile,

    // 步驟
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,

    // 訂單
    orderDetail,
    orders,
    loadOrderItem,
    loadOrders,
    createOrder,
    changeOrder,
    resetForms,
  };
});
