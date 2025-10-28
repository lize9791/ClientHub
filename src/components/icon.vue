<template>
  <svg
    v-if="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    :color="color"
    v-bind="$attrs">
    <path :d="icon.path" stroke-linecap="round" stroke-linejoin="round" />
    <!-- 如果 SVG 有多条 path，可在 icon.paths 数组中循环 -->
    <template v-for="(p, index) in icon.paths" :key="index">
      <path :d="p" stroke-linecap="round" stroke-linejoin="round" />
    </template>
  </svg>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    name: { type: String, required: true },
    size: { type: [Number, String], default: 24 }, // 默认 24x24
    color: { type: String },
  })
  // 这里示例几个图标，实际可以扩展更多
  const icons = {
    arrowLeft: { path: 'M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18', paths: [] },
    arrowRight: { path: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3', paths: [] },
    check: { path: 'M5 13l4 4L19 7', paths: [] },
    address: {
      paths: [
        'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
        'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
      ],
    },
    globeAlt: {
      path: 'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
    },
    date: {
      path: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
    },
  }

  const icon = computed(() => icons[props.name] || null)
</script>
