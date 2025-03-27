<template>
  <div
    class="absolute z-50 h-8 w-8 cursor-grabbing rounded-full border border-slate-200 bg-slate-200 shadow-md"
    :style="dummyNodePosition"
  ></div>
</template>

<script lang="ts" setup>
  import { useNode } from '@/composables/useNode';
  import { computed } from 'vue';

  const { getDummyNode } = useNode();

  const dummyNodePosition = computed(() => {
    const node = getDummyNode().value;
    return node?.position
      ? {
          top: `${node.position.y}px`,
          left: `${node.position.x}px`,
        }
      : {};
  });
</script>
