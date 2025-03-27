<template>
  <div
    class="absolute z-30 h-full w-full overflow-hidden whitespace-nowrap outline-none"
    ref="graphContainer"
  >
    <div
      class="absolute origin-top-left"
      :style="containerStyle"
    >
      <NodeDummy v-if="getDummyNode().value" />
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, useTemplateRef } from 'vue';

  import { useCore } from '@/composables/useCore';
  import { useNode } from '@/composables/useNode';
  import { usePlugins } from '@/composables/usePlugins';
  import { useScale } from '@/composables/useScale';
  import { useSchemaHistory } from '@/composables/useSchemaHistory';
  import { useSelectionArea } from '@/composables/useSelectionArea';

  import NodeDummy from '@/components/NodeDummy.vue';

  const { multiSelect = true } = defineProps<{
    multiSelect: boolean;
  }>();

  const { setContainerReference } = useCore();
  const { getSizeContent, getScale } = useScale();
  const { getDummyNode } = useNode();
  const { toggleActiveMultiSelect } = useSelectionArea();
  const { initializePlugins } = usePlugins();
  const { addHistoryEntry } = useSchemaHistory();

  setContainerReference(useTemplateRef<HTMLDivElement>('graphContainer'));
  initializePlugins();
  addHistoryEntry();

  toggleActiveMultiSelect(multiSelect);

  const containerStyle = computed(() => ({
    width: `${getSizeContent().width}px`,
    height: `${getSizeContent().height}px`,
    transform: `scale(calc(${getScale()} / 100), calc(${getScale()} / 100))`,
  }));
</script>
