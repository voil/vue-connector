<template>
  <svg
    class="absolute z-10"
    :style="svgStyle"
  >
    <slot />
  </svg>
</template>

<script lang="ts" setup>
  import { useScale } from '@/composables/useScale';
  import { computed } from 'vue';

  const { getSizeContent } = useScale();

  const svgStyle = computed(() => {
    const size = getSizeContent();
    return {
      width: `${size.width}px`,
      height: `${size.height}px`,
    };
  });
</script>
