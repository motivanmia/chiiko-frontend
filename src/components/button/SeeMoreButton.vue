<script setup>
  import Icon from '../common/Icon.vue';

  const props = defineProps({
    text: {
      type: String,
      default: '查看更多',
    },
    path: {
      type: String,
      default: '/',
    },
  });

  // const emit = defineEmits(['seeMoreButtonclick']);

  // function handleClick() {
  //   emit('seeMoreButtonclick');
  // }
</script>

<template>
  <RouterLink :to="props.path"
    class="see-more__button"
    @click="handleClick"
  >
    <div class="text">
      {{ text }}
    </div>

    <div class="icon">
      <Icon
        icon-name="btnArrow"
        class="see-more__icon"
      />
    </div>
  </RouterLink>
</template>

<style lang="scss" scoped>
  .see-more__button {
    display: flex;
    font-size: 14px;
    background-color: transparent;
    color: color(text, dark);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    align-items: center;
    letter-spacing: 0.2em;
    transition: 0.5s;
    justify-content: center;
    width: max-content;
    text-decoration: none;
  }
  .icon {
    display: flex;
    height: 50px;
    width: 50px;
    background-color: color(button, main);
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    margin-left: 70px;
    transition: transform 0.6s ease;
  }
  .see-more__icon {
    font-size: 1.2em;
    color: color(text, light);
    letter-spacing: 0.1em;
    transform: rotate(90deg);
  }
  .text {
    position: relative;
    color: color(text, base);
  }
  .text::after {
    position: absolute;
    content: '';
    width: 190px;
    border-bottom: 1px solid color(text, base);
    bottom: 0;
    left: 0;
    margin-bottom: -10px;
    z-index: 1;
  }
  .see-more__button:hover .icon {
    // margin-left: 90px;
    transform: translateX(30px);
    background-color: color(backgroundColor, recipe);
  }
</style>
