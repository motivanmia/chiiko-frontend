<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
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
    errorCity: {
      type: String,
      default: '',
    },
    errorDistrict: {
      type: String,
      default: '',
    },
    errorPostal: {
      type: String,
      default: '',
    },
    errorAddress: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits([
    'update:city',
    'update:district',
    'update:postal',
    'update:address',
    'blur-city',
    'blur-district',
    'blur-postal',
    'blur-address',
  ]);

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

  const cityOptions = ref([]);
  const districtMapping = ref({});
  const postalMapping = ref({});

  const loadTaiwanDistricts = async () => {
    try {
      const { VITE_TAIWAN_DISTRICTS } = import.meta.env;
      const res = await fetch(VITE_TAIWAN_DISTRICTS);
      const data = await res.json();

      console.log('data', data);
      // 初始化縣市、區域、郵遞區號
      data.forEach((city) => {
        cityOptions.value.push({ value: city.name, label: city.name });
        districtMapping.value[city.name] = city.districts.map((d) => ({
          value: d.name,
          label: d.name,
          zip: d.zip,
        }));
        city.districts.forEach((d) => {
          postalMapping.value[d.name] = d.zip;
        });
      });
    } catch (error) {
      console.log('載入台灣縣市資料失敗', error);
    }
  };

  const districtOptions = computed(() => districtMapping.value[cityLocal.value] || []);
  const postalOptions = computed(() => {
    const zip = postalMapping.value[districtLocal.value];
    return zip ? [{ value: zip, label: zip }] : [];
  });

  watch(cityLocal, (newCity, oldCity) => {
    if (newCity !== oldCity) {
      districtLocal.value = null;
      postalLocal.value = null;
    }
  });

  watch(districtLocal, (newDistrict, oldDistrict) => {
    if (newDistrict !== oldDistrict) {
      postalLocal.value = newDistrict ? postalMapping.value[newDistrict] : null;
    }
  });

  onMounted(() => {
    loadTaiwanDistricts();
  });
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
        :error="errorCity"
        @blur="$emit('blur-city')"
      />
      <BaseSelect
        v-model="districtLocal"
        :options="districtOptions"
        placeholder="鄉鎮市區"
        :disabled="disabled || !cityLocal"
        :error="errorDistrict"
        @blur="$emit('blur-district')"
      />
      <BaseSelect
        v-model="postalLocal"
        :options="postalOptions"
        placeholder="郵遞區號"
        :disabled="disabled || !districtLocal"
        :error="errorPostal"
        @blur="$emit('blur-postal')"
      />
    </div>
    <BaseInput
      v-model="addressLocal"
      placeholder="請輸入詳細收件人地址:路/巷/弄/號/樓"
      :readonly="disabled"
      :error="errorAddress"
      @blur="$emit('blur-address')"
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
