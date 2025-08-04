<script setup>
  import FormGroup from './FormGroup.vue';

  const props = defineProps({
    cardNumber: {
      type: String,
      required: true,
    },
    expMonth: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
    cardHolder: {
      type: String,
      required: true,
    },
  });

  const emit = defineEmits([
    'update:cardNumber',
    'update:expMonth',
    'update:cvv',
    'update:cardHolder',
  ]);

  const updateField = (field, value) => {
    emit(`update:${field}`, value);
  };
</script>

<template>
  <div class="credit-card-form">
    <FormGroup
      label="卡號"
      placeholder="＊＊＊＊-＊＊＊＊-＊＊＊＊-＊＊＊＊"
      :model-value="cardNumber"
      @update:modelValue="(val) => updateField('cardNumber', val)"
    />

    <div class="credit-card-form__wrap">
      <FormGroup
        label="卡片有效年月"
        placeholder="MM/YY"
        :model-value="expMonth"
        @update:modelValue="(val) => updateField('expMonth', val)"
        class="credit-card-form__wrap-item"
      />
      <FormGroup
        label="CVV/CVC"
        placeholder="卡片背面檢查碼"
        :model-value="cvv"
        @update:modelValue="(val) => updateField('cvv', val)"
        class="credit-card-form__wrap-item"
      />
    </div>

    <FormGroup
      label="持卡人姓名"
      placeholder="請輸入卡片上的姓名"
      :model-value="cardHolder"
      @update:modelValue="(val) => updateField('cardHolder', val)"
    />
  </div>
</template>

<style lang="scss" scoped>
  .credit-card-form {
    &__wrap {
      @include flex($jc: space-between);
      column-gap: px(40);

      &-item {
        flex: 1;
      }
    }
  }

  @include rwdmax(768) {
    .credit-card-form {
      &__wrap {
        flex-direction: column;

        &-item {
          width: 100%;
        }
      }
    }
  }
</style>
