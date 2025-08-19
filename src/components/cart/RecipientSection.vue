<script setup>
  import { useCartStore } from '@/stores/useCartStore';
  import { storeToRefs } from 'pinia';
  import RecipientInfo from './RecipientInfo.vue';
  import BuyerInfo from './BuyerInfo.vue';

  const cart = useCartStore();
  const { recipientForm, sameAsRecipient } = storeToRefs(cart);
  const { updateRecipientForm, toggleSameAsRecipient } = cart;

  const updateForm = (newForm) => {
    Object.entries(newForm).forEach(([key, value]) => {
      updateRecipientForm(key, value);
    });
  };

  const toggleSame = (val) => {
    toggleSameAsRecipient(val);
  };
</script>

<template>
  <div>
    <BuyerInfo :form="recipientForm" />
    <RecipientInfo
      :form="recipientForm"
      :same-as-recipient="sameAsRecipient"
      @update:form="updateForm"
      @update:same-as-recipient="toggleSame"
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
