import type { Ref } from 'vue';
import { ref } from 'vue';

// Shared reactive state across the application.
let containerRef = ref<HTMLDivElement | null>(null);
let schemeGraphRef = ref<HTMLDivElement | null>(null);

/**
 * Core composable providing access to DOM element references used in the application.
 * It allows setting and retrieving references for both the container element and the scheme graph element.
 */
export function useCore() {

  /**
   * Sets the reference to the scheme graph element.
   *
   * @param element - The HTMLDivElement or null representing the scheme graph container.
   */
  const setSchemeGraphReference = (element: Ref<HTMLDivElement | null>): void => {
    schemeGraphRef = element;
  };

  /**
   * Sets the reference to the container element where mouse events are tracked for moving elements.
   *
   * @param element - The HTMLDivElement or null representing the container element.
   */
  const setContainerReference = (element: Ref<HTMLDivElement | null>): void => {
    containerRef = element;
  };

  /**
   * Retrieves the reactive reference to the container element.
   *
   * @returns {Ref<HTMLDivElement | null>} A reactive reference to the container element.
   */
  const getContainerReference = (): Ref<HTMLDivElement | null> => containerRef;

  /**
   * Retrieves the reactive reference to the scheme graph element.
   *
   * @returns {Ref<HTMLDivElement | null>} A reactive reference to the scheme graph element.
   */
  const getSchemeGraphReference = (): Ref<HTMLDivElement | null> => schemeGraphRef;

  return {
    setContainerReference,
    getContainerReference,
    getSchemeGraphReference,
    setSchemeGraphReference,
  };
}
