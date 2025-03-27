<template>
  <div
    class="group absolute z-20 origin-center select-none p-4"
    v-bind="bindings"
    :style="nodePosition"
  >
    <div
      class="relative rounded border bg-slate-100 p-2 text-gray-800 dark:bg-slate-500 dark:text-white"
      :class="nodeClass"
      @mousedown.prevent.stop="handleStartMoveElement"
    >
      <div class="flex items-center gap-x-4">
        <div>
          <slot />
          <template v-for="position in directionConnectorsDictionary">
            <NodeGraphConnector
              v-if="
                nodeModel?.connections?.includes(position) &&
                !nodeModel.connectionDisabled &&
                !getSelectedElements().includes(id) &&
                !getStateLockScheme()
              "
              :id
              :key="`${id}-${position}`"
              :position
            />
          </template>
        </div>
        <button
          class="h-4 w-4 text-slate-600 transition-colors hover:text-red-600 dark:text-slate-100"
          v-if="shouldShowRemoveButton"
          :aria-label="TRANSLATIONS.ARIA_LABELS.REMOVE_NODE_SCHEME"
          :class="{
            'opacity-60': getStateLockScheme(),
          }"
          @click.prevent="getStateLockScheme() ? null : removeElement(id)"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { TRANSLATIONS } from '@/constants';
  import type { NodeGraphType } from '@/types/index';
  import { POSITION_TYPES } from '@/types/index';
  import { computed, useAttrs } from 'vue';

  import NodeGraphConnector from '@/components/NodeGraphConnector.vue';
  import TrashIcon from '@/components/ui/Icons/TrashIcon.vue';
  import { useLockScheme } from '@/composables/useLockScheme';
  import { useNode } from '@/composables/useNode';

  const { id } = defineProps<{
    id: string;
  }>();

  const attrs: Record<string, unknown> = useAttrs();
  const nodeModel = defineModel<NodeGraphType>('node', { required: true });

  const directionConnectorsDictionary = [
    POSITION_TYPES.top,
    POSITION_TYPES.bottom,
    POSITION_TYPES.left,
    POSITION_TYPES.right,
  ];

  const {
    setSelectedElements,
    toggleMovementState,
    getSelectedElements,
    removeElement,
  } = useNode();
  const { getStateLockScheme } = useLockScheme();

  const nodePosition = computed(() => ({
    top: `${nodeModel.value.position?.y}px`,
    left: `${nodeModel.value.position?.x}px`,
  }));

  const nodeClass = computed(() => ({
    'cursor-grabbing border-[#3b82f6] shadow-md':
      getSelectedElements().includes(id),
    'cursor-grab border-slate-300 shadow': !getSelectedElements().includes(id),
  }));

  const shouldShowRemoveButton = computed(() => nodeModel.value.canRemove);

  const bindings = computed(() => ({
    'data-node-graph': id,
    ...attrs,
  }));

  const handleStartMoveElement = () => {
    if (!nodeModel.value.canMove || getStateLockScheme()) return;

    toggleMovementState(true);
    const updatedSelectedElements = getSelectedElements().includes(id)
      ? getSelectedElements()
      : [...getSelectedElements(), id];
    setSelectedElements(updatedSelectedElements);
  };
</script>
