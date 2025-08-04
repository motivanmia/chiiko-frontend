<script setup>
  import FormGroup from './FormGroup.vue';
  import AddressGroup from './AddressGroup.vue';

  defineProps({
    form: {
      type: Object,
      required: true,
    },
  });
</script>

<template>
  <section class="buyer-info">
    <header class="buyer-info__header">
      <h2 class="buyer-info__title">購買人資訊</h2>
    </header>
    <div class="buyer-info__list">
      <FormGroup
        label="姓名"
        v-model="form.buyerName"
        readonly
      />
      <FormGroup
        label="電話"
        readonly
        v-model="form.buyerPhone"
      />
      <AddressGroup
        label="購買人地址"
        :city="form.buyerCity"
        :district="form.buyerDistrict"
        :postal="form.buyerPostal"
        :address="form.buyerAddress"
        :disabled="true"
        :is-text-disabled="true"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .buyer-info {
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
