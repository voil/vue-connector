import { useCore } from '@/composables/useCore';
import type { Ref } from 'vue';
import { onMounted, onUnmounted, ref } from 'vue';

import { useMousePosition } from '@/composables/useMousePosition';
import { useNode } from '@/composables/useNode';
import { useScale } from '@/composables/useScale';
import type { PositionElementType } from '@/types/index';

// Reactive state to track if the `Ctrl` key is pressed.
const isCtrlPressed = ref<boolean>(false);

// Reactive state to track if multi-select (selection area) functionality is active.
const isMultiSelectActive = ref<boolean>(true);
// Reactive state to track if the selection box is being drawn.
const isDrawing = ref<boolean>(false);
// Reactive reference for the selection box element.
const selectionBox = ref<HTMLElement | null>(null);
// Coordinates where the selection drawing started.
const selectionStart = ref<PositionElementType>({ x: 0, y: 0 });
// Array of selected element IDs.
const selectedElements = ref<string[]>([]);

/**
 * Composable that enables drawing a selection rectangle when the `Ctrl` key is held down.
 * Only elements with the `data-node-graph` attribute are considered for selection within the drawn box.
 *
 * It sets up key and mouse event listeners on a container element (provided via useCore)
 * and updates a reactive array with the IDs of selected elements.
 *
 * @returns {Object} An object with functions to initialize the selection area,
 *                   toggle multi-select mode, and get the selection state and selected elements.
 */
export function useSelectionArea() {
  const { getContainerReference } = useCore();
  const { getMousePosition } = useMousePosition();
  const { getScale } = useScale();
  const { setSelectedElements } = useNode();

  // Local variable to store the container element for adding/removing event listeners.
  let container: HTMLDivElement | null = null;

  /**
   * Initializes the selection area by setting up event listeners on the container element.
   * Event listeners are added on mount and removed on unmount.
   *
   * @returns {void}
   */
  const initializeSelectionArea = (): void => {
    onMounted(() => {
      container = getContainerReference().value;
      if (container) {
        // Ensure the container can receive focus and keyboard events.
        container.tabIndex = 0;
        container.focus();

        container.addEventListener('keydown', handleCtrlKeyDown);
        container.addEventListener('keyup', handleCtrlKeyUp);
        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseup', handleMouseUp);
      }
    });

    onUnmounted(() => {
      if (container) {
        container.removeEventListener('keydown', handleCtrlKeyDown);
        container.removeEventListener('keyup', handleCtrlKeyUp);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseup', handleMouseUp);
      }
    });
  };

  /**
   * Toggles the multi-select (selection area) functionality.
   *
   * @param state - True to enable multi-select, false to disable.
   * @returns {void}
   */
  const toggleActiveMultiSelect = (state: boolean): void => {
    isMultiSelectActive.value = state;
  };

  /**
   * Returns a reactive reference to the array of selected element IDs.
   *
   * @returns {Ref<string[]>} Reactive reference to selected element IDs.
   */
  const getSelectedElements = (): Ref<string[]> => selectedElements;

  /**
   * Returns the current state of the multi-select functionality.
   *
   * @returns {boolean} True if multi-select is active, otherwise false.
   */
  const getStateSelectionArea = (): boolean => isMultiSelectActive.value;

  /**
   * Returns whether the selection area is currently active (i.e. the Ctrl key is pressed).
   *
   * @returns {boolean} True if the Ctrl key is pressed, otherwise false.
   */
  const getStateActiveSelectionArea = (): boolean => isCtrlPressed.value

  /**
   * Creates the selection box element and appends it to the container.
   *
   * @returns {void}
   */
  const createSelectionBox = (): void => {
    const currentContainer = getContainerReference().value;
    if (currentContainer) {
      selectionBox.value = document.createElement('div');
      selectionBox.value.style.position = 'absolute';
      selectionBox.value.style.zIndex = '70';
      selectionBox.value.style.border = '1px dashed rgba(203, 213, 225, 1)';
      selectionBox.value.style.backgroundColor = 'rgba(226, 232, 240, 0.4)';
      currentContainer.appendChild(selectionBox.value);
    }
  };

  /**
   * Updates the selection box's position and size based on the current mouse position.
   *
   * @returns {void}
   */
  const updateSelectionBox = (): void => {
    if (selectionBox.value) {
      const scale = getScale() / 100;
      const mousePos = getMousePosition().value;
      const x = Math.min(selectionStart.value.x, mousePos.x);
      const y = Math.min(selectionStart.value.y, mousePos.y);
      const width = Math.abs(mousePos.x - selectionStart.value.x);
      const height = Math.abs(mousePos.y - selectionStart.value.y);

      selectionBox.value.style.left = `${x * scale}px`;
      selectionBox.value.style.top = `${y * scale}px`;
      selectionBox.value.style.width = `${width * scale}px`;
      selectionBox.value.style.height = `${height * scale}px`;
    }
  };

  /**
   * Finalizes the selection by determining which elements are inside the selection box.
   * Only elements with the `data-node-graph` attribute are considered.
   * Selected element IDs are then passed to the move node functionality.
   *
   * @returns {void}
   */
  const finalizeSelection = (): void => {
    const currentContainer = getContainerReference().value;
    if (selectionBox.value && currentContainer) {
      const boxRect = selectionBox.value.getBoundingClientRect();

      selectedElements.value = Array.from(
        currentContainer.querySelectorAll('[data-node-graph]')
      )
        .map((element) => element as HTMLElement)
        .filter((element: HTMLElement) => {
          const elRect = element.getBoundingClientRect();
          // Check if element is completely inside the selection box.
          return (
            elRect.top >= boxRect.top &&
            elRect.left >= boxRect.left &&
            elRect.bottom <= boxRect.bottom &&
            elRect.right <= boxRect.right
          );
        })
        .map((element: HTMLElement) => element.dataset.nodeGraph)
        .filter((id): id is string => id !== undefined);

      setSelectedElements(selectedElements.value);

      // Remove the selection box from the container.
      selectionBox.value.remove();
      selectionBox.value = null;
      isDrawing.value = false;
    }
  };

  /**
   * Handles the keydown event to detect when the `Ctrl` key is pressed.
   * Enables selection drawing mode and updates the cursor style.
   *
   * @param event - KeyboardEvent triggered when a key is pressed.
   * @returns {void}
   */
  const handleCtrlKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Control' && isMultiSelectActive.value) {
      isCtrlPressed.value = true;

      const currentContainer = getContainerReference().value;
      if (currentContainer) {
        currentContainer.style.cursor = 'move';
      }
    }
  };

  /**
   * Handles the keyup event to detect when the `Ctrl` key is released.
   * Disables selection drawing mode, removes the selection box, and resets the drawing state.
   *
   * @param event - KeyboardEvent triggered when a key is released.
   * @returns {void}
   */
  const handleCtrlKeyUp = (event: KeyboardEvent): void => {
    if (event.key === 'Control' && isMultiSelectActive.value) {
      const currentContainer = getContainerReference().value;
      isCtrlPressed.value = false;
      if (currentContainer) {
        currentContainer.style.cursor = 'grab';
      }

      if (selectionBox.value) {
        selectionBox.value.remove();
        selectionBox.value = null;
        isDrawing.value = false;
      }
    }
  };

  /**
   * Handles the mousedown event to start drawing the selection box.
   * Begins drawing only if the left mouse button is clicked, the `Ctrl` key is pressed,
   * and multi-select mode is active.
   *
   * @param event - MouseEvent triggered when the mouse button is pressed.
   * @returns {void}
   */
  const handleMouseDown = (event: MouseEvent): void => {
    const currentContainer = getContainerReference().value;
    if (
      isCtrlPressed.value &&
      event.button === 0 &&
      currentContainer &&
      isMultiSelectActive.value
    ) {
      isDrawing.value = true;
      // Record the starting mouse position for selection.
      selectionStart.value = getMousePosition().value;
      createSelectionBox();
    }
  };

  /**
   * Handles the mousemove event to update the selection box while drawing.
   *
   * @param event - MouseEvent triggered when the mouse moves.
   * @returns {void}
   */
  const handleMouseMove = (_event: MouseEvent): void => {
    if (isDrawing.value && isMultiSelectActive.value) {
      updateSelectionBox();
    }
  };

  /**
   * Handles the mouseup event to finalize the selection when the mouse button is released.
   *
   * @param event - MouseEvent triggered when the mouse button is released.
   * @returns {void}
   */
  const handleMouseUp = (_event: MouseEvent): void => {
    if (isDrawing.value && isMultiSelectActive.value) {
      finalizeSelection();
    }
  };

  return {
    getSelectedElements,
    getStateSelectionArea,
    toggleActiveMultiSelect,
    initializeSelectionArea,
    getStateActiveSelectionArea,
  };
}
