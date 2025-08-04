<script setup>
  import { watch } from 'vue';
  import RecipientInfo from './RecipientInfo.vue';
  import BuyerInfo from './BuyerInfo.vue';

  const props = defineProps({
    recipientForm: {
      type: Object,
      required: true,
    },
    sameAsRecipient: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:recipient-form', 'update:same-as-recipient']);

  const updateForm = (newForm) => {
    emit('update:recipient-form', newForm);
  };

  const toggleSame = () => {
    emit('update:same-as-recipient', !props.sameAsRecipient);
  };
  // 判斷購買人與收件人是否一致
  const isRecipientEqualBuyer = (form) => {
    return (
      form.recipientName === form.buyerName &&
      form.recipientPhone === form.buyerPhone &&
      form.recipientCity === form.buyerCity &&
      form.recipientDistrict === form.buyerDistrict &&
      form.recipientPostal === form.buyerPostal &&
      form.recipientAddress === form.buyerAddress
    );
  };

  // 當 sameAsRecipient 開啟且 buyer 變化時，同步一次到 recipient
  watch(
    () => [
      props.recipientForm.buyerName,
      props.recipientForm.buyerPhone,
      props.recipientForm.buyerCity,
      props.recipientForm.buyerDistrict,
      props.recipientForm.buyerPostal,
      props.recipientForm.buyerAddress,
      props.sameAsRecipient,
    ],
    ([bName, bPhone, bCity, bDistrict, bPostal, bAddress, same]) => {
      if (!same) return;

      const form = props.recipientForm;
      const needUpdate =
        form.recipientName !== bName ||
        form.recipientPhone !== bPhone ||
        form.recipientCity !== bCity ||
        form.recipientDistrict !== bDistrict ||
        form.recipientPostal !== bPostal ||
        form.recipientAddress !== bAddress;

      if (needUpdate) {
        emit('update:recipient-form', {
          ...form,
          recipientName: bName,
          recipientPhone: bPhone,
          recipientCity: bCity,
          recipientDistrict: bDistrict,
          recipientPostal: bPostal,
          recipientAddress: bAddress,
        });
      }
    },
  );

  // 如果 sameAsRecipient 開著，但 user 編輯 recipient（導致 divergence），自動關掉同步
  watch(
    () => [
      props.recipientForm.recipientName,
      props.recipientForm.recipientPhone,
      props.recipientForm.recipientCity,
      props.recipientForm.recipientDistrict,
      props.recipientForm.recipientPostal,
      props.recipientForm.recipientAddress,
      props.recipientForm.buyerName,
      props.recipientForm.buyerPhone,
      props.recipientForm.buyerCity,
      props.recipientForm.buyerDistrict,
      props.recipientForm.buyerPostal,
      props.recipientForm.buyerAddress,
      props.sameAsRecipient,
    ],
    ([
      rName,
      rPhone,
      rCity,
      rDistrict,
      rPostal,
      rAddress,
      bName,
      bPhone,
      bCity,
      bDistrict,
      bPostal,
      bAddress,
      same,
    ]) => {
      if (!same) return;

      const recipient = {
        recipientName: rName,
        recipientPhone: rPhone,
        recipientCity: rCity,
        recipientDistrict: rDistrict,
        recipientPostal: rPostal,
        recipientAddress: rAddress,
      };
      const buyerEquivalent = {
        recipientName: bName,
        recipientPhone: bPhone,
        recipientCity: bCity,
        recipientDistrict: bDistrict,
        recipientPostal: bPostal,
        recipientAddress: bAddress,
      };

      const isSame = JSON.stringify(recipient) === JSON.stringify(buyerEquivalent);
      if (!isSame) {
        emit('update:same-as-recipient', false);
      }
    },
  );
</script>

<template>
  <div>
    <BuyerInfo
      :form="recipientForm"
      @update:form="updateForm"
    />
    <RecipientInfo
      :form="recipientForm"
      :same-as-recipient="sameAsRecipient"
      @update:form="updateForm"
      @toggle-same-as="toggleSame"
    />
  </div>
</template>

<style lang="scss" scoped>
  .recipient-section {
    @include cardBoxShadow;
    background-color: white;
    border-radius: px(20);
    margin-bottom: px(10);
    overflow: hidden;

    &__header {
      padding: px(16) px(20);
      background-color: color(backgroundColor, panel);
      @include fontSet($size: px(24), $lh: 1.2, $color: white, $ls: 0.1em);
    }

    &__list {
      padding: px(30) px(20);
    }
  }
</style>
