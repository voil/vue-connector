<script lang="ts" setup>
  import { TRANSLATIONS } from '@/constants';
  import { THEME_TYPE } from '@/types';
  import { POSITION_TYPES } from '@/types/index';
  import { useAttrs } from 'vue';

  import { useTheme } from '@/composables/useTheme';

  const attrs = useAttrs();
  const { setTheme, getCurrentTheme } = useTheme();

  import MoonIcon from '@/components/ui/Icons/MoonIcon.vue';
  import SunIcon from '@/components/ui/Icons/SunIcon.vue';
  import InfoTooltip from '@/components/ui/InfoTooltip.vue';
</script>

<template>
  <div
    class="absolute right-6 top-[12.063rem] z-50"
    v-bind="attrs"
    :aria-label="TRANSLATIONS.ARIA_LABELS.THEME_SCHEME_CONTROLS"
    role="toolbar"
  >
    <InfoTooltip
      id="zoom-out-button"
      :position="POSITION_TYPES.left"
    >
      <button
        class="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-slate-200 p-2"
        :aria-label="
          getCurrentTheme() === THEME_TYPE.LIGHT_MODE
            ? TRANSLATIONS.ARIA_LABELS.SET_DARK_MODE
            : TRANSLATIONS.ARIA_LABELS.SET_LIGHT_MODE
        "
        @click.prevent="
          setTheme(
            getCurrentTheme() === THEME_TYPE.LIGHT_MODE
              ? THEME_TYPE.DARK_MODE
              : THEME_TYPE.LIGHT_MODE,
          )
        "
        @keyup.enter.prevent="
          setTheme(
            getCurrentTheme() === THEME_TYPE.LIGHT_MODE
              ? THEME_TYPE.DARK_MODE
              : THEME_TYPE.LIGHT_MODE,
          )
        "
        type="button"
      >
        <SunIcon
          v-if="getCurrentTheme() === THEME_TYPE.LIGHT_MODE"
          aria-hidden="true"
        />
        <MoonIcon
          v-else
          aria-hidden="true"
        />
      </button>
      <template #content>{{
        getCurrentTheme() === THEME_TYPE.LIGHT_MODE
          ? TRANSLATIONS.TOOLTIPS.SET_DARK_MODE
          : TRANSLATIONS.TOOLTIPS.SET_LIGHT_MODE
      }}</template>
    </InfoTooltip>
  </div>
</template>
