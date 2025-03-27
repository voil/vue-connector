<template>
  <div
    class="relative z-50 w-max"
    @blur="setTooltipVisibility(false)"
    @focus="setTooltipVisibility(true)"
    @mouseenter="setTooltipVisibility(true)"
    @mouseleave="setTooltipVisibility(false)"
    tabindex="0"
  >
    <slot />
    <div
      class="absolute w-max max-w-80"
      v-bind="tooltipAttributes"
      v-if="isTooltipVisible"
      :class="tooltipContainerClasses"
    >
      <div class="relative rounded-lg bg-slate-200 px-3 py-1 pb-2 text-xs">
        <slot name="content" />
        <div
          class="absolute h-0 w-0 border-b-[6.9px] border-l-[6px] border-r-[6px] border-t-0 border-solid border-[transparent_transparent_theme('colors.slate.200')_transparent]"
          :class="tooltipTriangleClasses"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PositionType } from '@/types/index';
  import { POSITION_TYPES } from '@/types/index';
  import { computed, defineProps, ref, useAttrs } from 'vue';

  type TooltipPosition = Extract<
    PositionType,
    'top' | 'bottom' | 'left' | 'right'
  >;

  const tooltipContainerClassMap: Readonly<Record<TooltipPosition, string>> = {
    top: 'bottom-[calc(100%+10px)] left-2/4 -translate-x-2/4 right-0',
    bottom: 'top-[calc(100%+10px)] left-2/4 -translate-x-2/4 right-0',
    left: 'top-2/4 right-[calc(100%+10px)] -translate-y-2/4',
    right: 'top-2/4 left-[calc(100%+10px)] -translate-y-2/4',
  } as const;

  const tooltipTriangleClassMap: Readonly<Record<TooltipPosition, string>> = {
    top: 'top-full m-auto left-0 right-0 rotate-180',
    bottom: 'bottom-full m-auto left-0 right-0',
    left: 'bottom-0 top-0 left-[calc(100%-3px)] m-auto rotate-90',
    right: 'bottom-0 top-0 right-[calc(100%-3px)] m-auto -rotate-90',
  } as const;

  const props = defineProps<{
    id: string;
    position?: TooltipPosition;
  }>();

  const { id, position = POSITION_TYPES.top } = props;

  const additionalAttrs = useAttrs();
  const isTooltipVisible = ref(false);

  const setTooltipVisibility = (visible: boolean): void => {
    isTooltipVisible.value = visible;
  };

  const tooltipContainerClasses = computed<string>(() => {
    return tooltipContainerClassMap[position];
  });

  const tooltipTriangleClasses = computed<string>(() => {
    return tooltipTriangleClassMap[position];
  });

  const tooltipAttributes = computed<Record<string, string | boolean>>(() => ({
    role: 'tooltip',
    id,
    'aria-hidden': !isTooltipVisible.value,
    'data-tooltip-position': position,
    ...additionalAttrs,
  }));
</script>
