<script lang="ts" setup>
  import type { PositionElementType, PositionType } from '@/types/index';
  import { POSITION_TYPES } from '@/types/index';
  import { computed, useTemplateRef } from 'vue';

  import { useLockScheme } from '@/composables/useLockScheme';
  import { useNode } from '@/composables/useNode';
  import { useNodePath } from '@/composables/useNodePath';

  type Position = Extract<PositionType, 'top' | 'left' | 'right' | 'bottom'>;

  const { position = POSITION_TYPES.top, id } = defineProps<{
    id: string;
    position: Position;
  }>();

  const positionClassMap: Record<Position, string> = {
    [POSITION_TYPES.top]:
      '-top-0 m-auto left-0 right-0 opacity-0 group-hover:opacity-100 group-hover:-top-5',
    [POSITION_TYPES.bottom]:
      '-bottom-0 m-auto left-0 right-0 opacity-0 group-hover:opacity-100 group-hover:-bottom-5 delay-150',
    [POSITION_TYPES.left]:
      '-left-0 m-auto top-0 bottom-0 opacity-0 group-hover:opacity-100 group-hover:-left-5 delay-200',
    [POSITION_TYPES.right]:
      '-right-0 m-auto top-0 bottom-0 opacity-0 group-hover:opacity-100 group-hover:-right-5 delay-100',
  };

  const { startCreatePath, endCreatePath, getDummyPathParams } = useNodePath();
  const { getStateLockScheme } = useLockScheme();
  const { toggleMenuState } = useNode();
  const nodeConnectorRef = useTemplateRef<HTMLElement>('nodeConnector');

  const positionClassScheme = computed(() => positionClassMap[position]);

  const isConnectorVisible = computed(() => {
    const dummyPathParams = getDummyPathParams();
    return dummyPathParams ? dummyPathParams.startElement !== id : true;
  });

  const handleStartCreatePath = () => {
    if (getStateLockScheme()) {
      return;
    }

    toggleMenuState(false);
    if (nodeConnectorRef.value) {
      const position: PositionElementType = {
        x: nodeConnectorRef.value.getBoundingClientRect().left,
        y: nodeConnectorRef.value.getBoundingClientRect().top,
      };
      startCreatePath(id, position);
    }
  };

  const handleEndCreatePath = () => {
    if (getStateLockScheme()) {
      return;
    }
    toggleMenuState(false);
    if (nodeConnectorRef.value) {
      const position: PositionElementType = {
        x: nodeConnectorRef.value.getBoundingClientRect().left,
        y: nodeConnectorRef.value.getBoundingClientRect().top,
      };
      endCreatePath(id, position);
    }
  };
</script>

<template>
  <button
    class="absolute h-3 w-3 rounded-full bg-blue-200 transition-all hover:bg-blue-500"
    v-if="isConnectorVisible"
    :aria-label="`connector position ${position}`"
    :class="positionClassScheme"
    @mousedown.prevent.stop="handleStartCreatePath"
    @mouseup.prevent="handleEndCreatePath"
    ref="nodeConnector"
  >
    &nbsp;
  </button>
</template>
