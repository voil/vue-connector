<template>
  <div
    class="absolute right-16 top-2 z-50 flex items-center"
    v-bind="attrs"
    :aria-label="TRANSLATIONS.ARIA_LABELS.HISTORY_SCHEME_CONTROLS"
    role="toolbar"
  >
    <!-- UndoAll In Button with Tooltip -->
    <InfoTooltip
      id="undo-all-button"
      :position="POSITION_TYPES.bottom"
    >
      <button
        class="flex h-8 w-8 items-center justify-center rounded-l border-b border-l border-t border-b-slate-300 border-l-slate-300 border-t-slate-300 bg-slate-200 p-1 text-slate-600"
        :aria-label="TRANSLATIONS.ARIA_LABELS.UNDO_ALL_SCHEME"
        :class="{
          'opacity-60': !isUndoAllActive(),
        }"
        @click.prevent="isUndoAllActive() ? undoAll() : null"
        @keyup.enter.prevent="isUndoAllActive() ? undoAll() : null"
        type="button"
      >
        <UndoAll
          class="h-3.5 w-3.5"
          aria-hidden="true"
        />
      </button>
      <template #content>{{ TRANSLATIONS.TOOLTIPS.UNDO_ALL }}</template>
    </InfoTooltip>

    <!-- Undo Button with Tooltip -->
    <InfoTooltip
      id="undo-button"
      :position="POSITION_TYPES.bottom"
    >
      <button
        class="flex h-8 w-8 items-center justify-center border border-slate-300 bg-slate-200 p-2 text-slate-600"
        :aria-label="TRANSLATIONS.ARIA_LABELS.UNDO_SCHEME"
        :class="{
          'opacity-60': !isUndoActive(),
        }"
        @click.prevent="isUndoActive() ? undoSchema() : null"
        @keyup.enter.prevent="isUndoActive() ? undoSchema() : null"
        type="button"
      >
        <UndoArrow
          class="!h-12 !w-12"
          aria-hidden="true"
        />
      </button>
      <template #content>{{ TRANSLATIONS.TOOLTIPS.UNDO }}</template>
    </InfoTooltip>

    <InfoTooltip
      id="rendo-scheme"
      :position="POSITION_TYPES.bottom"
    >
      <button
        class="flex h-8 w-8 items-center justify-center rounded-r border-b border-r border-t border-b-slate-300 border-r-slate-300 border-t-slate-300 bg-slate-200 p-2 text-slate-600"
        :aria-label="TRANSLATIONS.ARIA_LABELS.RENDO_SCHEME"
        :class="{
          'opacity-60': !isRendoActive(),
        }"
        @click.prevent="isRendoActive() ? redoSchema() : null"
        @keyup.enter.prevent="isRendoActive() ? redoSchema() : null"
        type="button"
      >
        <RendoArrow
          class="!h-12 !w-12"
          aria-hidden="true"
        />
      </button>
      <template #content> {{ TRANSLATIONS.TOOLTIPS.RENDO }} </template>
    </InfoTooltip>
  </div>
</template>

<script lang="ts" setup>
  import { useSchemaHistory } from '@/composables/useSchemaHistory';
  import { TRANSLATIONS } from '@/constants';
  import { POSITION_TYPES } from '@/types/index';
  import { useAttrs } from 'vue';

  import RendoArrow from '@/components/ui/Icons/RendoArrow.vue';
  import UndoAll from '@/components/ui/Icons/UndoAll.vue';
  import UndoArrow from '@/components/ui/Icons/UndoArrow.vue';
  import InfoTooltip from '@/components/ui/InfoTooltip.vue';

  const attrs = useAttrs();

  const {
    isUndoAllActive,
    isRendoActive,
    isUndoActive,
    undoSchema,
    redoSchema,
    undoAll,
  } = useSchemaHistory();
</script>
