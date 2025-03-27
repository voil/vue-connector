import type { NodeGraphType, NodeType, SchemeGraphType } from '@/types/index';
import { CONNECTION_TYPE, POSITION_TYPES } from '@/types/index';
import { generateUUID } from '@/utils';
import type { ModelRef, Ref } from 'vue';
import { inject, onMounted, onUnmounted, ref } from 'vue';

import { useCore } from '@/composables/useCore';
import { useMousePosition } from "@/composables/useMousePosition";
import { useSchemaHistory } from '@/composables/useSchemaHistory';

// Local reactive state for selected element IDs used during movement.
const selectedElements = ref<string[]>([]);
// Reactive state tracking whether movement is enabled.
const stateMovement = ref(false);
// Reactive state for the node creation menu visibility.
const isMenuOpen = ref<boolean>(false);
// Reactive state for the dummy node data during node creation.
const dummyNode = ref<NodeType | null>(null);


/**
 * Composable that handles node creation and movement within a scheme graph.
 * It manages a dummy node for new node creation, selected elements for movement,
 * and provides methods for updating positions based on mouse events.
 *
 * @returns {Object} Methods for controlling node creation, movement, and menu state.
 */
export function useNode() {
  const { addHistoryEntry } = useSchemaHistory()

  // Get a reference to the container element from the core composable.
  const { getContainerReference } = useCore();
  // Get the current mouse position from the mouse position composable.
  const { getMousePosition } = useMousePosition();
  // Inject the shared scheme graph model.
  const sharedSchemeModel = inject<ModelRef<SchemeGraphType>>('sharedSchemeModel');

  // Local variable to store the container element for adding/removing event listeners.
  let container: HTMLDivElement | null = null;

  /**
   * Returns the current state of the node creation menu.
   *
   * @returns {boolean} True if the menu is open, false otherwise.
   */
  const getMenuState = (): boolean => isMenuOpen.value;

  /**
   * Toggles the state of the node creation menu.
   *
   * @param {boolean} state - Desired state of the menu (true for open, false for closed).
   * @returns {void}
   */
  const toggleMenuState = (state: boolean): void => {
    isMenuOpen.value = state;
  };

  /**
   * Starts the process of creating a new node by setting the dummy node's initial data.
   * The dummy node's position is initialized based on the current mouse coordinates.
   *
   * @param {NodeType} node - The node data template to be created.
   * @returns {void}
   */
  const startCreateElement = (node: NodeType): void => {
    dummyNode.value = {
      ...node,
      position: { ...getMousePosition().value },
    };
  };

  /**
   * Returns a reactive reference to the dummy node being created.
   *
   * @returns {Ref<NodeType | null>} Reactive reference containing the dummy node data.
   */
  const getDummyNode = (): Ref<NodeType | null> => dummyNode;

  /**
   * Toggles the movement state, enabling or disabling element movement.
   *
   * @param {boolean} state - The state to set for movement (true to enable, false to disable).
   * @returns {void}
   */
  const toggleMovementState = (state: boolean): void => {
    stateMovement.value = state;
  };

  /**
   * Initializes the node functionality by setting up mouse event listeners on the container element.
   * The listeners track 'mouseup' and 'mousemove' events to update positions of selected elements
   * and the dummy node.
   *
   * @returns {void}
   */
  const initializeNode = (): void => {
    // Add event listeners when the component is mounted.
    onMounted(() => {
      container = getContainerReference().value;
      if (container) {
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('mousemove', handleMouseMove);
      }
    });

    // Remove event listeners when the component is unmounted.
    onUnmounted(() => {
      container = getContainerReference().value;
      if (container) {
        container.removeEventListener('mouseup', handleMouseUp);
        container.removeEventListener('mousemove', handleMouseMove);
      }
    });
  };

  /**
   * Sets the selected elements for movement.
   * This function updates the array of selected element IDs.
   *
   * @param {string[]} elements - The list of selected element IDs.
   * @returns {void}
   */
  const setSelectedElements = (elements: string[]): void => {
    selectedElements.value = elements;
  };

  /**
   * Retrieves the list of currently selected element IDs.
   *
   * @returns {string[]} - The list of selected element IDs.
   */
  const getSelectedElements = (): string[] => selectedElements.value;

  /**
   * Removes a node and its associated paths from the scheme graph.
   * It checks if the node with the given ID exists and, if so, deletes the node along with
   * any paths connected to it, then resets the connection state.
   *
   * @param {string} id - The ID of the node to be removed from the graph.
   * @returns {void}
   */
  const removeElement = (id: string): void => {
    if (sharedSchemeModel?.value?.nodes[id]) {
      // Remove the node from the scheme graph.
      delete sharedSchemeModel.value.nodes[id];

      // Iterate over all nodes to remove connected paths.
      Object.keys(sharedSchemeModel.value.nodes).forEach((nodeId) => {
        const node = sharedSchemeModel.value.nodes[nodeId];
        if (node.paths) {
          Object.keys(node.paths).forEach((pathId) => {
            if (node.paths[pathId].connected.node === id) {
              delete node.paths[pathId];
              node.connectionDisabled = false;
            }
          });
        }
      });
      addHistoryEntry();
    }
  };

  /**
   * Resets the movement state by clearing selected elements and disabling movement.
   *
   * @returns {void}
   */
  const resetMovementState = (): void => {
    selectedElements.value = [];
    if (stateMovement.value)
      addHistoryEntry();
    stateMovement.value = false;
  };

  /**
   * Assigns the dummy node to the scheme graph.
   * It finalizes the node creation by adding the dummy node to the shared scheme model
   * and then clears the dummy node state.
   *
   * @returns {void}
   */
  const assignElementToGraph = (): void => {
    isMenuOpen.value = false;
    if (dummyNode.value && sharedSchemeModel?.value) {
      const newNodeId = generateUUID();
      sharedSchemeModel.value.nodes[newNodeId] = {
        paths: {},
        ...dummyNode.value,
        position: { ...getMousePosition().value },
        dummyPosition: { ...getMousePosition().value },
        connectionDisabled: false,
        connections: dummyNode.value.connections ?? [
          POSITION_TYPES.top,
          POSITION_TYPES.bottom,
          POSITION_TYPES.left,
          POSITION_TYPES.right,
        ],
        connectionType: dummyNode.value.connectionType ?? CONNECTION_TYPE.empty,
        canMove: dummyNode.value.canMove !== false,
        canRemove: dummyNode.value.canRemove !== false,
      } as NodeGraphType;

      addHistoryEntry();
    }
    dummyNode.value = null;
  };

  /**
   * Handles the mouseup event to finalize movement and assign the dummy node to the graph.
   *
   * @returns {void}
   */
  const handleMouseUp = (): void => {
    resetMovementState();
    assignElementToGraph();
  };

  /**
   * Handles the mousemove event to update the position of selected elements.
   * It moves selected elements based on the mouse movement delta.
   *
   * @returns {void}
   */
  const handleMoveElement = (): void => {
    if (selectedElements.value.length > 0 && stateMovement.value && sharedSchemeModel?.value) {
      const movement = getMousePosition().value.movement;
      const deltaX = movement?.x || 0;
      const deltaY = movement?.y || 0;
      selectedElements.value.forEach((uid: string) => {
        if (sharedSchemeModel.value.nodes[uid]) {
          sharedSchemeModel.value.nodes[uid].position.x += deltaX;
          sharedSchemeModel.value.nodes[uid].position.y += deltaY;

          // Update positions for each path associated with the node.
          if (sharedSchemeModel.value.nodes[uid].paths) {
            Object.keys(sharedSchemeModel.value.nodes[uid].paths).forEach((pathId) => {
              sharedSchemeModel.value.nodes[uid].paths[pathId].position.x += deltaX;
              sharedSchemeModel.value.nodes[uid].paths[pathId].position.y += deltaY;
            });
          }
        }
      });
    }
  };

  /**
   * Handles the mousemove event to update the position of the dummy node.
   * The dummy node's position is adjusted based on the current mouse coordinates,
   * with an offset to center the dummy node.
   *
   * @returns {void}
   */
  const handleMoveDummyElement = (): void => {
    if (dummyNode.value && dummyNode.value.position) {
      const mousePos = getMousePosition().value;
      // Offset value for centering the dummy node (e.g., 16 pixels).
      const OFFSET = 16;
      dummyNode.value.position.x = (mousePos?.x ?? 0) - OFFSET;
      dummyNode.value.position.y = (mousePos?.y ?? 0) - OFFSET;
    }
  };

  /**
   * Handles the mousemove event to update the positions of both selected elements and the dummy node.
   *
   * @returns {void}
   */
  const handleMouseMove = (): void => {
    handleMoveElement();
    handleMoveDummyElement();
  };

  return {
    getMenuState,
    getDummyNode,
    removeElement,
    initializeNode,
    toggleMenuState,
    startCreateElement,
    getSelectedElements,
    setSelectedElements,
    toggleMovementState,
  };
}
