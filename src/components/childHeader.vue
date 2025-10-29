<template>
  <header class="child-header-box">
    <span class="text">{{ props.title }}</span>
    <span class="back" @click="backList">
      <Icon name="arrowLeft" size="20" />
      返回列表
    </span>
  </header>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import Icon from './icon.vue'
  const props = defineProps({
    title: String,
  })
  const router = useRouter()

  const backList = () => {
    router.back()
  }
</script>

<style lang="scss" scoped>
  .child-header-box {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    z-index: 9;
    .text {
      flex: 1;
      font-size: 30px;
      font-weight: bold;
      line-height: 36px;
      letter-spacing: 0;
    }
    .back {
      border-radius: 4px;
      opacity: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px 16px;
      gap: 5px;
      flex-wrap: wrap;
      align-content: center;
      background: #e5e7eb;
      color: #1f2937;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease; /* 平滑过渡 */
      &:hover {
        background-color: #d1d5db; /* 悬停时颜色，可修改 */
      }
    }
  }
</style>
