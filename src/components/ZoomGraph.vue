<script lang="ts" setup>
  import { useAttrs } from 'vue';

  import { useFullScreen } from '@/composables/useFullScreen';
  import { useScale } from '@/composables/useScale';
  import { TRANSLATIONS } from '@/constants';
  import { POSITION_TYPES } from '@/types/index';

  import FullScreenClose from '@/components/ui/Icons/FullScreenClose.vue';
  import FullScreenOpen from '@/components/ui/Icons/FullScreenOpen.vue';
  import MinusIcon from '@/components/ui/Icons/MinusIcon.vue';
  import PlusIcon from '@/components/ui/Icons/PlusIcon.vue';
  import InfoTooltip from '@/components/ui/InfoTooltip.vue';

  const attrs = useAttrs();

  const { toggleFullScreen, isFullScreen } = useFullScreen();
  const { increaseScale, decreaseScale, getScale } = useScale();
</script>

<template>
  <div
    class="absolute right-6 top-2 z-50"
    v-bind="attrs"
    :aria-label="TRANSLATIONS.ARIA_LABELS.ZOOM_SCHEME_CONTROLS"
    role="toolbar"
  >
    <!-- Zoom In Button with Tooltip -->
    <InfoTooltip
      id="zoom-in-button"
      :position="POSITION_TYPES.left"
    >
      <button
        class="flex h-8 w-8 items-center justify-center rounded-t border-l border-r border-t border-l-slate-300 border-r-slate-300 border-t-slate-300 bg-slate-200 p-1 text-slate-600"
        :aria-label="TRANSLATIONS.ARIA_LABELS.ZOOM_IN"
        @click.prevent="increaseScale"
        @keyup.enter.prevent="increaseScale"
        type="button"
      >
        <PlusIcon aria-hidden="true" />
      </button>
      <template #content>
        {{ TRANSLATIONS.TOOLTIPS.SCALE_UP }}
      </template>
    </InfoTooltip>

    <!-- Display current scale value -->
    <div
      class="flex h-8 w-8 select-none items-center justify-center border border-slate-300 bg-slate-200 text-[10px] text-slate-600"
      aria-live="polite"
    >
      {{ getScale() }}%
    </div>

    <!-- Zoom Out Button with Tooltip -->
    <InfoTooltip
      id="zoom-out-button"
      :position="POSITION_TYPES.left"
    >
      <button
        class="flex h-8 w-8 items-center justify-center rounded-b border-b border-l border-r border-b-slate-300 border-l-slate-300 border-r-slate-300 bg-slate-200 p-2 text-slate-600"
        :aria-label="TRANSLATIONS.ARIA_LABELS.ZOOM_OUT"
        @click.prevent="decreaseScale"
        @keyup.enter.prevent="decreaseScale"
        type="button"
      >
        <MinusIcon aria-hidden="true" />
      </button>
      <template #content>{{ TRANSLATIONS.TOOLTIPS.SCALE_DOWN }}</template>
    </InfoTooltip>

    <!-- Fullscreen Toggle Button with Tooltip -->
    <InfoTooltip
      id="fullscreen-toggle"
      :position="POSITION_TYPES.left"
    >
      <button
        class="mt-2 flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-slate-200 p-2 text-slate-600"
        :aria-label="
          isFullScreen()
            ? TRANSLATIONS.ARIA_LABELS.EXIT_FULLSCREEN
            : TRANSLATIONS.ARIA_LABELS.ENTER_FULLSCREEN
        "
        @click.prevent="toggleFullScreen"
        @keyup.enter.prevent="toggleFullScreen"
        type="button"
      >
        <FullScreenOpen
          v-if="!isFullScreen()"
          aria-hidden="true"
        />
        <FullScreenClose
          v-else
          aria-hidden="true"
        />
      </button>
      <template #content>
        {{ !isFullScreen() ? 'Open' : 'Close' }}
        {{ TRANSLATIONS.TOOLTIPS.FULLSCREEN }}
      </template>
    </InfoTooltip>
  </div>
</template>
