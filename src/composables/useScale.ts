import { useCore } from '@/composables/useCore';
import type { SchemeGraphType } from '@/types/index';
import type { ModelRef } from 'vue';
import { inject, onMounted, onUnmounted, ref } from 'vue';

// Shared reactive state across all components using this composable.
const currentScale = ref<number>(100);
const sizeContent = ref<{ width: number; height: number }>({
  width: 0,
  height: 0,
});

/**
 * Composable that handles scale (zoom) functionality.
 * Provides functions to increase/decrease scale, retrieve the current scale value,
 * and calculate the scaled dimensions of a container element.
 *
 * The state (current scale and container size) is shared across all components that use this composable.
 * A reference counting mechanism is implemented to attach the wheel event listener on mount and
 * remove it when no component uses the composable anymore.
 */
export function useScale() {
  const { getContainerReference } = useCore();
  const sharedSchemeModel = inject<ModelRef<SchemeGraphType>>('sharedSchemeModel');

  /**
   * Calculates and updates the scaled dimensions of the container element
   * based on its original size and the current scale percentage.
   */
  const setSizeContent = (): void => {
    const container = getContainerReference().value;
    if (container) {
      const rect = container.getBoundingClientRect();
      sizeContent.value.width = rect.width * 100 * (currentScale.value / 100);
      sizeContent.value.height = rect.height * 100 * (currentScale.value / 100);
      if (sharedSchemeModel && sharedSchemeModel.value) {
        sharedSchemeModel.value.scale = currentScale.value;
      }
    }
  };

  /**
   * Increases the scale by 10%, up to a maximum of 200%.
   */
  const increaseScale = (): void => {
    if (currentScale.value < 200) {
      currentScale.value += 10;
      setSizeContent();
    }
  };

  /**
   * Decreases the scale by 10%, down to a minimum of 10%.
   */
  const decreaseScale = (): void => {
    if (currentScale.value > 10) {
      currentScale.value -= 10;
      setSizeContent();
    }
  };

  /**
   * Returns the current scaled dimensions of the container element.
   *
   * @returns {{width: number, height: number}} - The scaled width and height.
   */
  const getSizeContent = (): { width: number; height: number } => sizeContent.value;

  /**
   * Returns the current scale value (percentage).
   *
   * @returns {number} - The current scale value.
   */
  const getScale = (): number => currentScale.value;

  /**
   * Handles the wheel event to adjust the scale.
   * If scrolling down, decreases the scale; if scrolling up, increases the scale.
   *
   * @param {WheelEvent} event - The wheel event object.
   */
  const handleWheel = (event: WheelEvent): void => {
    event.preventDefault();
    event.deltaY > 0 ? decreaseScale() : increaseScale();
  };

  /**
   * Initializes the composable by setting up the wheel event listener on the container element
   * and calculating the initial scaled dimensions. A reference counting mechanism is used
   * to ensure that the event listener is added only once and removed when no component uses the composable.
   */
  const initializeScale = (): void => {
    currentScale.value = sharedSchemeModel?.value?.scale || 100;

    onMounted(() => {
      getContainerReference().value?.addEventListener('wheel', handleWheel, { passive: false });
      setSizeContent();
    });

    onUnmounted(() => {
      getContainerReference().value?.removeEventListener('wheel', handleWheel);
    });
  };

  return {
    initializeScale,
    getSizeContent,
    increaseScale,
    decreaseScale,
    getScale,
  };
}
