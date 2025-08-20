<script setup>
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useCartStore } from '@/stores/useCartStore';
  import FormGroup from './FormGroup.vue';
  import AddressGroup from './AddressGroup.vue';
  import Icon from '../common/Icon.vue';

  const props = defineProps({
    form: {
      type: Object,
      required: true,
    },
    sameAsRecipient: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:form', 'update:same-as-recipient']);

  const cart = useCartStore();
  const { errors } = storeToRefs(cart);
  const { validateRecipientField } = cart;

  const recipientName = computed({
    get: () => props.form.recipientName,
    set: (val) => {
      const newForm = { ...props.form, recipientName: val };
      emit('update:form', newForm);
    },
  });
  const recipientPhone = computed({
    get: () => props.form.recipientPhone,
    set: (val) => {
      const newForm = { ...props.form, recipientPhone: val };
      emit('update:form', newForm);
    },
  });
  const recipientCity = computed({
    get: () => props.form.recipientCity,
    set: (val) => {
      const newForm = { ...props.form, recipientCity: val };
      emit('update:form', newForm);
    },
  });
  const recipientDistrict = computed({
    get: () => props.form.recipientDistrict,
    set: (val) => {
      const newForm = { ...props.form, recipientDistrict: val };
      emit('update:form', newForm);
    },
  });
  const recipientPostal = computed({
    get: () => props.form.recipientPostal,
    set: (val) => {
      const newForm = { ...props.form, recipientPostal: val };
      emit('update:form', newForm);
    },
  });
  const recipientAddress = computed({
    get: () => props.form.recipientAddress,
    set: (val) => {
      const newForm = { ...props.form, recipientAddress: val };
      emit('update:form', newForm);
    },
  });

  const toggleSameAs = () => {
    emit('update:same-as-recipient', !props.sameAsRecipient);
  };
</script>

<template>
  <section class="recipient-info">
    <header class="recipient-info__header">
      <h2 class="recipient-info__title">收件人資訊</h2>
      <label class="recipient-info__checkbox-wrap">
        <input
          class="recipient-info__checkbox"
          type="checkbox"
          :checked="sameAsRecipient"
          @change="toggleSameAs"
        />
        <div class="recipient-info__customize">
          <Icon
            class="recipient-info__checkbox-icon"
            icon-name="check"
          />
        </div>
        同購買人資料
      </label>
    </header>
    <div class="recipient-info__list">
      <FormGroup
        label="姓名"
        placeholder="請輸入收件人姓名"
        v-model="recipientName"
        :error="errors.recipient.name"
        @blur="validateRecipientField('name')"
      />
      <FormGroup
        label="電話"
        placeholder="請輸入收件人電話"
        v-model="recipientPhone"
        :error="errors.recipient.phone"
        @blur="validateRecipientField('phone')"
      />
      <AddressGroup
        label="收件人地址"
        v-model:city="recipientCity"
        v-model:district="recipientDistrict"
        v-model:postal="recipientPostal"
        v-model:address="recipientAddress"
        :error-city="errors.recipient.city"
        :error-district="errors.recipient.district"
        :error-postal="errors.recipient.postal"
        :error-address="errors.recipient.address"
        @blur-city="validateRecipientField('city')"
        @blur-district="validateRecipientField('district')"
        @blur-postal="validateRecipientField('postal')"
        @blur-address="validateRecipientField('address')"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .recipient-info {
    @include cardBoxShadow;
    background-color: white;
    border-radius: px(20);
    margin-bottom: px(10);
    overflow: hidden;

    &__header {
      @include flex($jc: space-between);
      padding: px(16) px(20);
      background-color: color(backgroundColor, panel);
      @include fontSet($size: px(24), $lh: 1.2, $color: white, $ls: 0.1em);
    }

    &__list {
      padding: px(30) px(20);
    }

    &__checkbox-wrap {
      @include flex();
      gap: 10px;
      cursor: pointer;
    }

    &__customize {
      position: relative;
      @include flex();
      width: px(20);
      height: px(20);
      background-color: white;
      border: px(1) solid color(text, dark);
      border-radius: 50%;
    }

    &__checkbox-icon {
      display: none;
      @include posCenter;
      @include font-size(15);
      color: color(text, dark);
    }

    &__checkbox {
      display: none;

      &:checked ~ .recipient-info__customize > .recipient-info__checkbox-icon {
        display: block;
      }
    }
  }

  @include rwdmax(768) {
    .recipient-info {
      &__header {
        flex-direction: column;
        row-gap: px(15);
      }
    }
  }
</style>
