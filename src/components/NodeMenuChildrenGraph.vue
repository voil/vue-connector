<template>
  <button
    class="flex items-center justify-between rounded border px-3 py-2 text-sm focus:outline-none"
    :aria-describedby="element.description ? tooltipId : undefined"
    :class="buttonClasses"
    :disabled="disabled"
    @mousedown.prevent.stop="onCreateElement"
    type="button"
  >
    <span class="flex items-center gap-x-1">
      <span
        class="h-5 w-5"
        v-html="safeIcon"
        v-if="element.icon"
      ></span>
      <span>{{ element.label }}</span>
    </span>
    <InfoTooltip
      v-if="element.description"
      :id="tooltipId"
    >
      <HelpIcon class="h-4 w-4" />
      <template #content>
        {{ element.description }}
      </template>
    </InfoTooltip>
  </button>
</template>

<script lang="ts" setup>
  import { useNode } from '@/composables/useNode';
  import type { NodeType } from '@/types/index';
  import { computed } from 'vue';

  import HelpIcon from '@/components/ui/Icons/HelpIcon.vue';
  import InfoTooltip from '@/components/ui/InfoTooltip.vue';

  const props = defineProps<{
    disabled?: boolean;
    element: NodeType;
  }>();

  const { startCreateElement } = useNode();

  const buttonClasses = computed(() => ({
    'cursor-not-allowed bg-gray-300 opacity-50': props.disabled,
  }));

  const safeIcon = computed(() => props.element.icon ?? '');
  const tooltipId = computed(() => `tooltip-${props.element.unique}`);

  const onCreateElement = () => {
    if (!props.disabled) {
      startCreateElement(props.element);
    }
  };
</script>
