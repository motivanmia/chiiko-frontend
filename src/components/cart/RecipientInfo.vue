<script setup>
  import FormGroup from './FormGroup.vue';
  import AddressGroup from './AddressGroup.vue';
  import { computed } from 'vue';

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

  const emit = defineEmits(['update:form', 'toggle-same-as']);

  const recipientName = computed({
    get: () => props.form.recipientName,
    set: (val) => {
      props.form.recipientName = val;
      emit('update:form', props.form);
    },
  });
  const recipientPhone = computed({
    get: () => props.form.recipientPhone,
    set: (val) => {
      props.form.recipientPhone = val;
      emit('update:form', props.form);
    },
  });
  const recipientCity = computed({
    get: () => props.form.recipientCity,
    set: (val) => {
      props.form.recipientCity = val;
      emit('update:form', props.form);
    },
  });
  const recipientDistrict = computed({
    get: () => props.form.recipientDistrict,
    set: (val) => {
      props.form.recipientDistrict = val;
      emit('update:form', props.form);
    },
  });
  const recipientPostal = computed({
    get: () => props.form.recipientPostal,
    set: (val) => {
      props.form.recipientPostal = val;
      emit('update:form', props.form);
    },
  });
  const recipientAddress = computed({
    get: () => props.form.recipientAddress,
    set: (val) => {
      props.form.recipientAddress = val;
      emit('update:form', props.form);
    },
  });
</script>

<template>
  <section class="recipient-info">
    <header class="recipient-info__header">
      <h2 class="recipient-info__title">收件人資訊</h2>
      <label>
        <input
          type="checkbox"
          :checked="sameAsRecipient"
          @change="$emit('toggle-same-as')"
        />
        同購買人資料
      </label>
    </header>
    <div class="recipient-info__list">
      <FormGroup
        label="姓名"
        placeholder="請輸入收件人姓名"
        v-model="recipientName"
      />
      <FormGroup
        label="電話"
        placeholder="請輸入收件人電話"
        v-model="recipientPhone"
      />
      <AddressGroup
        label="收件人地址"
        v-model:city="recipientCity"
        v-model:district="recipientDistrict"
        v-model:postal="recipientPostal"
        v-model:address="recipientAddress"
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
  }
</style>
