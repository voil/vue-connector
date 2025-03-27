<template>
  <div
    class="absolute right-[11.25rem] top-2 z-50 flex items-center gap-x-2"
    v-bind="attrs"
    :aria-label="TRANSLATIONS.ARIA_LABELS.ACTIONS_SCHEME_CONTROLS"
    role="toolbar"
  >
    <!-- Save draft In Button with Tooltip -->
    <button
      class="flex h-8 items-center justify-center rounded border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:bg-slate-200"
      v-if="actions.includes(ACTIONS_TYPE.SAVE_DRAFT)"
      :aria-label="TRANSLATIONS.ARIA_LABELS.SAVE_DRAFT"
      @click.prevent="emit('on:save', ACTIONS_TYPE.SAVE_DRAFT)"
      @keyup.enter.prevent="emit('on:save', ACTIONS_TYPE.SAVE_DRAFT)"
      type="button"
    >
      Save draft
    </button>
    <!-- Save scheme In Button with Tooltip -->
    <button
      class="flex h-8 items-center justify-center rounded border border-blue-600 bg-blue-600 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-700"
      v-if="actions.includes(ACTIONS_TYPE.SAVE_SCHEME)"
      :aria-label="TRANSLATIONS.ARIA_LABELS.SAVE_SCHEME"
      @click.prevent="emit('on:save', ACTIONS_TYPE.SAVE_SCHEME)"
      @keyup.enter.prevent="emit('on:save', ACTIONS_TYPE.SAVE_SCHEME)"
      type="button"
    >
      Save scheme
    </button>
  </div>
</template>

<script lang="ts" setup>
  import { TRANSLATIONS } from '@/constants';
  import { ACTIONS_TYPE, type ActionsType } from '@/types';
  import { useAttrs } from 'vue';

  const attrs = useAttrs();

  const { actions = [ACTIONS_TYPE.SAVE_SCHEME, ACTIONS_TYPE.SAVE_DRAFT] } =
    defineProps<{
      actions?: ActionsType[];
    }>();

  const emit = defineEmits<{
    (e: 'on:save', type: ActionsType): void;
  }>();
</script>
