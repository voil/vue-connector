<script lang="ts" setup>
  import CloseIcon from '@/components/ui/Icons/CloseIcon.vue';
  import HamburgerIcon from '@/components/ui/Icons/HamburgerIcon.vue';
  import { useNode } from '@/composables/useNode';
  import { TRANSLATIONS } from '@/constants';
  import { computed } from 'vue';

  const { toggleMenuState, getMenuState } = useNode();
  const isMenuOpen = computed(() => getMenuState());

  const menuClass = computed(() => ({
    'bottom-8 right-8 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-slate-200':
      !isMenuOpen.value,
    'bottom-8 right-8 h-[560px] w-[400px] rounded bg-white p-4':
      isMenuOpen.value,
  }));

  const menuTriggerAttributes = computed(() => {
    if (!isMenuOpen.value) {
      return {
        role: 'button',
        tabindex: 0,
        'aria-label': 'Open menu',
      };
    }
    return {};
  });
</script>

<template>
  <div
    class="custom-scrollbar absolute z-40 overflow-y-auto border border-slate-300 shadow-md transition-all"
    v-bind="menuTriggerAttributes"
    :class="menuClass"
    @click.prevent="toggleMenuState(true)"
  >
    <HamburgerIcon
      class="h-6 w-6 text-slate-600"
      v-if="!isMenuOpen"
    />
    <div
      class="relative select-none"
      v-if="isMenuOpen"
    >
      <h4 class="font-medium text-slate-600">
        {{ TRANSLATIONS.LABELS.ADD_ELEMENT_TO_SCHEME }}
      </h4>
      <button
        class="absolute right-0 top-0 h-5 w-5 text-red-600"
        @click.prevent.stop="toggleMenuState(false)"
        @keyup.enter.prevent.stop="toggleMenuState(false)"
        aria-label="Close menu"
      >
        <CloseIcon />
      </button>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>
