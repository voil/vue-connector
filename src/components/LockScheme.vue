<template>
  <div
    class="absolute right-6 top-[152px] z-50"
    v-bind="attrs"
    :aria-label="TRANSLATIONS.ARIA_LABELS.LOCK_SCHEME_CONTROLS"
    role="toolbar"
  >
    <InfoTooltip
      id="zoom-out-button"
      :position="POSITION_TYPES.left"
    >
      <button
        class="flex h-8 w-8 items-center justify-center rounded border border-slate-300 bg-slate-200 p-2"
        :aria-label="
          getStateLockScheme()
            ? TRANSLATIONS.ARIA_LABELS.LOCK_UP
            : TRANSLATIONS.ARIA_LABELS.LOCK_DOWN
        "
        :class="{
          'text-slate-600': !getStateLockScheme(),
          'text-green-600': getStateLockScheme(),
        }"
        @click.prevent="handleChangeStateLockScheme(!getStateLockScheme())"
        @keyup.enter.prevent="
          handleChangeStateLockScheme(!getStateLockScheme())
        "
        type="button"
      >
        <LockUp
          v-if="!getStateLockScheme()"
          aria-hidden="true"
        />
        <LockDown
          v-else
          aria-hidden="true"
        />
      </button>
      <template #content>{{
        !getStateLockScheme()
          ? TRANSLATIONS.TOOLTIPS.LOCK_DOWN
          : TRANSLATIONS.TOOLTIPS.LOCK_UP
      }}</template>
    </InfoTooltip>
  </div>
</template>

<script lang="ts" setup>
  import { TRANSLATIONS } from '@/constants';
  import { POSITION_TYPES } from '@/types/index';
  import { useAttrs } from 'vue';

  import { useLockScheme } from '@/composables/useLockScheme';

  const attrs = useAttrs();
  const { getStateLockScheme, handleChangeStateLockScheme } = useLockScheme();

  import LockDown from '@/components/ui/Icons/LockDown.vue';
  import LockUp from '@/components/ui/Icons/LockUp.vue';
  import InfoTooltip from '@/components/ui/InfoTooltip.vue';
</script>
