import { useMousePosition } from '@/composables/useMousePosition';
import { useMoveScroll } from '@/composables/useMoveScroll';
import { useNode } from '@/composables/useNode';
import { useNodePath } from '@/composables/useNodePath';
import { useScale } from '@/composables/useScale';
import { useSelectionArea } from '@/composables/useSelectionArea';

/**
 * Composable that aggregates and initializes various plugins used across the application.
 *
 * This composable imports and invokes initialization functions from several sub-composables,
 * such as those for managing mouse position, scrolling, node handling, scaling, node paths,
 * and selection area functionality.
 *
 * @returns An object with an `initializePlugins` function that triggers the initialization of all plugins.
 */
export function usePlugins() {
  const { initializeNode } = useNode();
  const { initializeScale } = useScale();
  const { initializeNodePath } = useNodePath();
  const { initializeMoveScroll } = useMoveScroll();
  const { initializeMousePosition } = useMousePosition();
  const { initializeSelectionArea } = useSelectionArea();

  /**
   * Initializes all plugins by calling the respective initialization functions.
   *
   * This function sets up the necessary environment for node management, scaling,
   * node paths, scrolling, mouse position tracking, and selection area functionalities.
   */
  const initializePlugins = (): void => {
    initializeNode();
    initializeScale();
    initializeNodePath();
    initializeMoveScroll();
    initializeMousePosition();
    initializeSelectionArea();
  }

  return {
    initializePlugins
  }
}