<script setup>
  import { computed, watch } from 'vue';
  import BaseSelect from './BaseSelect.vue';
  import BaseInput from './BaseInput.vue';

  const props = defineProps({
    label: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: [String, null],
      required: true,
    },
    postal: {
      type: [String, null],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:city', 'update:district', 'update:postal', 'update:address']);

  const cityLocal = computed({
    get: () => props.city,
    set: (val) => emit('update:city', val),
  });
  const districtLocal = computed({
    get: () => props.district,
    set: (val) => emit('update:district', val),
  });
  const postalLocal = computed({
    get: () => props.postal,
    set: (val) => emit('update:postal', val),
  });
  const addressLocal = computed({
    get: () => props.address,
    set: (val) => emit('update:address', val),
  });

  // options (示意，可以抽出去共用)
  const cityOptions = [
    { value: '桃園市', label: '桃園市' },
    { value: '台北市', label: '台北市' },
    { value: '新北市', label: '新北市' },
  ];

  const districtMapping = {
    桃園市: [
      { value: '中壢區', label: '中壢區' },
      { value: '桃園區', label: '桃園區' },
    ],
    台北市: [
      { value: '中正區', label: '中正區' },
      { value: '大安區', label: '大安區' },
    ],
  };

  const postalMapping = {
    中壢區: [{ value: '320', label: '320' }],
    桃園區: [{ value: '330', label: '330' }],
    中正區: [{ value: '100', label: '100' }],
    大安區: [{ value: '106', label: '106' }],
  };

  const districtOptions = computed(() => districtMapping[cityLocal.value] || []);
  const postalOptions = computed(() => postalMapping[districtLocal.value] || []);

  // 記錄上一個 city 值，避免不必要的重置
  let previousCity = props.city;
  let previousDistrict = props.district;

  watch(
    () => props.city,
    (newCity, oldCity) => {
      // 只有在城市真的改變時才重置
      if (oldCity && newCity !== oldCity && newCity !== previousCity) {
        // 檢查新的城市是否有當前的區域選項
        const hasCurrentDistrict = districtMapping[newCity]?.some(
          (option) => option.value === props.district,
        );

        if (!hasCurrentDistrict) {
          emit('update:district', null);
          emit('update:postal', null);
        }
      }
      previousCity = newCity;
    },
  );

  watch(
    () => props.district,
    (newDistrict, oldDistrict) => {
      // 只有在區域真的改變時才重置郵遞區號
      if (oldDistrict && newDistrict !== oldDistrict && newDistrict !== previousDistrict) {
        // 檢查新的區域是否有當前的郵遞區號選項
        const hasCurrentPostal = postalMapping[newDistrict]?.some(
          (option) => option.value === props.postal,
        );

        if (!hasCurrentPostal) {
          emit('update:postal', null);
        }
      }
      previousDistrict = newDistrict;
    },
  );
</script>

<template>
  <div class="address-group">
    <label class="address-group__title">{{ label }}</label>
    <div class="address-group__city">
      <BaseSelect
        v-model="cityLocal"
        :options="cityOptions"
        placeholder="縣市"
        :disabled="disabled"
      />
      <BaseSelect
        v-model="districtLocal"
        :options="districtOptions"
        placeholder="鄉鎮市區"
        :disabled="disabled || !cityLocal"
      />
      <BaseSelect
        v-model="postalLocal"
        :options="postalOptions"
        placeholder="郵遞區號"
        :disabled="disabled || !districtLocal"
      />
    </div>
    <BaseInput
      v-model="addressLocal"
      placeholder="請輸入詳細地址"
      :readonly="disabled"
    />
  </div>
</template>

<style lang="scss" scoped>
  .address-group {
    padding: px(20) 0 px(30) 0;

    &__title {
      @include fontSet($size: px(24), $lh: 1.2, $color: color(text, dark), $ls: 0.1em);
    }

    &__city {
      @include flex($wrap: wrap, $jc: space-between);
      gap: px(40) px(20);
      margin-top: px(20);
      margin-bottom: px(30);
    }
  }
</style>
