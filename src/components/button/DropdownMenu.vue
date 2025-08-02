<script setup>
  import { ref } from 'vue';
  import Icon from '@/components/common/Icon.vue';

  const options = ['當季熱門', '最多收藏'];
  const selected = ref(options[0]);
  const isOpen = ref(false);

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  function select(option) {
    selected.value = option;
    isOpen.value = false;
  }
</script>

<template>
  <div class="dropdown">
    <!-- 點擊區塊（永遠顯示） -->
    <div
      class="dropdown-selected"
      @click="toggle"
    >
      {{ selected }}
      <span
        class="arrow"
        :class="{ open: isOpen }"
      >
        <Icon
          icon-name="rightA"
          id="rightA"
        />
      </span>
    </div>

    <!-- 外框＋選項，一起動畫 -->
    <transition name="dropdown-expand">
      <div
        v-if="isOpen"
        class="dropdown-box"
      >
        <ul class="dropdown-options">
          <li
            v-for="(option, index) in options"
            :key="index"
            @click.stop="select(option)"
          >
            {{ option }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<style lang="scss" scoped>
  .dropdown-box {
    background: #fff;
    border-radius: 16px;
    margin-top: 6px;
    overflow: hidden;
  }

  /* 選項樣式 */
  .dropdown-options {
    // list-style: none;
    // margin: 0;
  }
  .dropdown-options li {
    // padding: 6px 0;
  }
  .dropdown-options li:hover {
    border-radius: 20px;
  }
  .dropdown-expand-enter-from,
  .dropdown-expand-leave-to {
    opacity: 0;
    transform: scaleY(0.95);
    transform-origin: top;
    max-height: 0;
  }
  .dropdown-expand-enter-to,
  .dropdown-expand-leave-from {
    opacity: 1;
    transform: scaleY(1);
    max-height: 500px;
  }
  .dropdown-expand-enter-active,
  .dropdown-expand-leave-active {
    transition: all 0.4s ease;
  }
  //////
  .dropdown {
    display: inline-block;
    position: relative;
    border-radius: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    padding: 10px 20px;
    font-size: 20px;
    cursor: pointer;
    letter-spacing: 0.2rem;
    border: 1px solid #aaa;
  }

  .dropdown-selected {
    display: flex;
    align-items: center;
    gap: 60px;
    padding: 0 0 0 10px;
  }
  #rightA {
    transform: rotate(90deg);
    font-size: 30px;
  }
  .arrow {
    transition: transform 0.4s ease;
  }
  .arrow.open {
    transform: rotate(180deg);
  }
  .dropdown-options li {
    padding: 10px 10px;
  }
  .dropdown-options li:hover {
    /* background-color: #f3f3f3; */
    background-color: color(button, main);
    color: color(text, light);
    border-radius: 20px;
  }
</style>
