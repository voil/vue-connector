import { useCore } from '@/composables/useCore';
import { useSelectionArea } from '@/composables/useSelectionArea';
import { onMounted, onUnmounted, ref } from 'vue';

/**
 * Custom composable that enables horizontal and vertical scrolling of an element
 * by clicking the left mouse button while holding the spacebar.
 * It changes the cursor style to indicate when the element is draggable.
 */
export function useMoveScroll() {
  const { getContainerReference } = useCore();
  const { getStateActiveSelectionArea } = useSelectionArea();

  // State indicating if the move scroll functionality is active.
  const isMoveScrollActive = ref<boolean>(true);

  // State to track if the left mouse button is pressed.
  const isMousePressed = ref<boolean>(false);

  // Bound event listener functions to ensure they can be properly removed.
  let boundMouseDown: (event: MouseEvent) => void;
  let boundMouseUp: (event: MouseEvent) => void;

  /**
   * Initializes the move scroll functionality by setting up the container element
   * and adding event listeners for 'mousedown', 'mouseup', and 'mousemove' events.
   * Event listeners are added when the component is mounted and removed upon unmounting.
   */
  const initializeMoveScroll = (): void => {
    onMounted(() => {
      const container = getContainerReference().value;
      if (container) {
        container.style.cursor = 'grab';
        container.tabIndex = 0;
        container.focus();

        // Bind the mouse event handlers so they can be removed later.
        boundMouseDown = handleMouseEvent.bind(null, true);
        boundMouseUp = handleMouseEvent.bind(null, false);

        container.addEventListener('mousedown', boundMouseDown);
        container.addEventListener('mouseup', boundMouseUp);
        container.addEventListener('mousemove', handleMouseMove);
      }
    });

    onUnmounted(() => {
      const container = getContainerReference().value;
      if (container) {
        container.removeEventListener('mousedown', boundMouseDown);
        container.removeEventListener('mouseup', boundMouseUp);
        container.removeEventListener('mousemove', handleMouseMove);
      }
    });
  };


  /**
   * Returns the current state of the move scroll functionality.
   *
   * @returns A boolean indicating if move scroll is active.
   */
  const getStateMoveScroll = (): boolean => isMoveScrollActive.value;

  /**
   * Handles the 'mousedown' and 'mouseup' events to update the cursor style and track
   * whether the left mouse button is pressed.
   *
   * @param state - True if the mouse button is pressed, false if released.
   * @param event - The MouseEvent object.
   */
  const handleMouseEvent = (state: boolean, event: MouseEvent): void => {
    const container = getContainerReference().value;
    if (container) {
      container.style.cursor = state ? 'grabbing' : 'grab';
    }
    isMousePressed.value = state;
  };

  /**
   * Handles the 'mousemove' event to update the scroll position of the container element.
   * When the left mouse button is pressed and no selection area is active,
   * it scrolls the container based on the mouse movement.
   *
   * @param event - The MouseEvent object.
   */
  const handleMouseMove = (event: MouseEvent): void => {
    const container = getContainerReference().value;

    if (isMousePressed.value && !getStateActiveSelectionArea()) {
      if (container) {
        container.scrollLeft -= event.movementX;
        container.scrollTop -= event.movementY;
      }
    }
  };

  return {
    initializeMoveScroll,
    getStateMoveScroll,
  };
}
