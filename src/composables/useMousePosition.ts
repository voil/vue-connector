import { useCore } from '@/composables/useCore';
import type { Ref } from 'vue';
import { onMounted, onUnmounted, ref } from 'vue';

import { useScale } from '@/composables/useScale';
import type { PositionElementType } from '@/types/index';

// Initialize mousePosition with default values.
// Ensure the PositionElementType includes the 'movement' property.
const mousePosition = ref<PositionElementType>({
  x: 0,
  y: 0,
  movement: { x: 0, y: 0 }
});

/**
 * Composable that tracks the mouse position relative to a given HTML element.
 * It listens for the 'mousemove' event on the specified element and updates
 * the mouse position based on the element's bounding box, scroll position, and current scale.
 *
 * @returns {Object} An object containing functions to initialize mouse tracking and retrieve the current mouse position.
 */
export function useMousePosition() {
  const { getScale } = useScale();
  const { getContainerReference } = useCore();

  /**
   * Initializes the mouse position tracking by adding a 'mousemove' event listener
   * to the container element when the component is mounted, and removes it upon unmounting.
   *
   * @returns {void}
   */
  const initializeMousePosition = (): void => {
    onMounted(() => {
      const container = getContainerReference().value;
      if (container) {
        container.addEventListener('mousemove', updateMousePosition);
      }
    });

    onUnmounted((): void => {
      const container = getContainerReference().value;
      if (container) {
        container.removeEventListener('mousemove', updateMousePosition);
      }
    });
  };

  /**
   * Returns a reactive reference to the current mouse position.
   *
   * @returns {Ref<PositionElementType>} A reactive reference containing the current mouse position.
   */
  const getMousePosition = (): Ref<PositionElementType> => mousePosition;

  /**
   * Updates the mouse position based on the provided mouse event.
   * The position is calculated relative to the container's bounding rectangle,
   * accounting for its scroll position and current scale.
   *
   * @param {MouseEvent} event - The mouse event triggered by the 'mousemove' event.
   * @returns {void}
   */
  const updateMousePosition = (event: MouseEvent): void => {
    const container = getContainerReference().value;
    if (container) {
      const scale = getScale() / 100;
      const rect = container.getBoundingClientRect();
      const scrollX = container.scrollLeft;
      const scrollY = container.scrollTop;

      mousePosition.value = {
        x: (event.clientX - rect.left + scrollX) / scale,
        y: (event.clientY - rect.top + scrollY) / scale,
        movement: {
          x: event.movementX / scale,
          y: event.movementY / scale,
        },
      };
    }
  };

  return {
    getMousePosition,
    initializeMousePosition,
  };
}
