import { useCore } from '@/composables/useCore';
import { useMousePosition } from "@/composables/useMousePosition";
import { useScale } from '@/composables/useScale';
import { useSchemaHistory } from '@/composables/useSchemaHistory';
import type { NodePathType, PositionElementType, SchemeGraphType } from '@/types/index';
import { CONNECTION_TYPE, SIDE_TYPE } from '@/types/index';
import { generateUUID } from '@/utils';
import type { ModelRef } from 'vue';
import { inject, onMounted, onUnmounted, ref } from 'vue';

// Constant offset applied to computed positions.
const OFFSET = 6;

// Local reactive state for dummy path creation.
const dummyPath = ref<Record<string, string> | null>(null);
const isActiveCreatePath = ref<boolean>(false);
const resetCreatePath = ref<boolean>(false);

/**
 * Composable that manages the creation and manipulation of node paths within a scheme graph.
 * It tracks mouse events and updates the positions of dummy nodes/paths during path creation.
 *
 * @returns {Object} - Methods for starting and ending path creation, retrieving dummy path parameters,
 *                     and initializing event listeners.
 */
export function useNodePath() {
  const { getContainerReference } = useCore();
  const { getMousePosition } = useMousePosition();
  const { getScale } = useScale();
  const { addHistoryEntry } = useSchemaHistory()

  // Inject the shared scheme graph model.
  const sharedSchemeModel = inject<ModelRef<SchemeGraphType>>('sharedSchemeModel');

  // Local variable to store the container element for adding/removing event listeners.
  let container: HTMLDivElement | null = null;

  /**
   * Computes the scaled position based on the container's bounding rectangle, scroll offsets, and current scale.
   *
   * @param pos - The original position (mouse event position).
   * @returns The computed position with scaling and offset adjustments.
   */
  const computeScaledPosition = (pos: PositionElementType): PositionElementType => {
    container = getContainerReference().value;
    if (!container) return pos;
    const scale = getScale() / 100;
    const rect = container.getBoundingClientRect();
    const scrollX = container.scrollLeft;
    const scrollY = container.scrollTop;
    return {
      x: (pos.x - rect.left + scrollX) / scale + OFFSET,
      y: (pos.y - rect.top + scrollY) / scale + OFFSET,
    };
  };

  /**
   * Initializes the node path creation by adding mouse event listeners to the container.
   * Listeners for 'mouseup' and 'mousemove' are registered on component mount
   * and removed on unmount.
   *
   * @returns void
   */
  const initializeNodePath = (): void => {
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
   * Handles the mousemove event to update the position of the dummy node and its associated dummy path.
   * The positions are updated based on the current mouse movement delta.
   *
   * @returns void
   */
  const handleMouseMove = (): void => {
    if (isActiveCreatePath.value && dummyPath.value && sharedSchemeModel?.value) {
      const movementX = getMousePosition().value?.movement?.x || 0;
      const movementY = getMousePosition().value?.movement?.y || 0;

      // Update the dummy node's position.
      const endElementId = dummyPath.value.endElement;
      sharedSchemeModel.value.nodes[endElementId].position.x += movementX;
      sharedSchemeModel.value.nodes[endElementId].position.y += movementY;

      // Update the dummy path's position.
      const endDummyPathId = dummyPath.value.endDummyPath;
      sharedSchemeModel.value.nodes[endElementId].paths[endDummyPathId].position.x += movementX;
      sharedSchemeModel.value.nodes[endElementId].paths[endDummyPathId].position.y += movementY;
    }
  };

  /**
   * Starts the creation of a dummy path. It initializes dummy nodes and paths in the scheme graph.
   * The dummy node is created at a computed scaled position based on the provided position.
   *
   * @param id - The ID of the start element.
   * @param position - The initial position of the connector (mouse event position).
   * @returns void
   */
  const startCreatePath = (id: string, position: PositionElementType): void => {
    isActiveCreatePath.value = true;
    container = getContainerReference().value;

    if (sharedSchemeModel?.value && container) {
      // Generate UUIDs for dummy nodes and paths.
      const startDummyPathId = generateUUID();
      const endElementId = generateUUID();
      const endDummyPathId = generateUUID();

      // Store dummy path parameters.
      dummyPath.value = {
        startElement: id,
        startDummyPath: startDummyPathId,
        endElement: endElementId,
        endDummyPath: endDummyPathId,
      };

      // Create a dummy end node if it doesn't exist.
      if (!sharedSchemeModel.value.nodes[endElementId]) {
        const computedPos = computeScaledPosition(position);
        sharedSchemeModel.value.nodes[endElementId] = {
          position: computedPos,
          paths: {},
          dummy: true,
        };
      }

      // Create dummy path from the end node.
      sharedSchemeModel.value.nodes[endElementId].paths[endDummyPathId] = {
        side: SIDE_TYPE.end,
        position: computeScaledPosition(position),
        connected: {
          node: dummyPath.value.startElement,
          path: startDummyPathId,
        },
      };

      // Create dummy path from the start element.
      sharedSchemeModel.value.nodes[dummyPath.value.startElement].paths[startDummyPathId] = {
        side: SIDE_TYPE.start,
        dummy: true,
        position: computeScaledPosition(position),
        connected: {
          node: endElementId,
          path: endDummyPathId,
        },
      };
    }
  };

  /**
   * Retrieves the current dummy path parameters.
   *
   * @returns The dummy path parameters as a record or null if not set.
   */
  const getDummyPathParams = (): Record<string, string> | null => dummyPath.value;

  /**
   * Ends the dummy path creation process by finalizing the path between nodes.
   * It computes the final scaled position and adds permanent path connections between the start and end nodes.
   *
   * @param id - The ID of the target node to connect with.
   * @param position - The final position of the connector (mouse event position).
   * @returns void
   */
  const endCreatePath = (id: string, position: PositionElementType): void => {
    container = getContainerReference().value;
    if (sharedSchemeModel?.value && container && dummyPath.value) {
      // Generate new UUIDs for the permanent paths.
      const startPathUuid = generateUUID();
      const endPathUuid = generateUUID();

      // Check if a connection already exists between the nodes.
      const startNode = sharedSchemeModel.value.nodes[dummyPath.value.startElement];
      const targetNode = sharedSchemeModel.value.nodes[id];
      const connectionExists =
        Object.values(startNode.paths).some((path: NodePathType) => path.connected.node === id) ||
        Object.values(targetNode.paths).some((path: NodePathType) => path.connected.node === dummyPath.value?.startElement);
      if (connectionExists) return;

      // Determine the new connection value based on the start node's connection type.
      let newValue;
      if (startNode.connectionType === CONNECTION_TYPE.boolean) {
        const pathCount = Object.values(startNode.paths).filter(
          (path: NodePathType) => path.side === SIDE_TYPE.start && !path.dummy
        );
        if (pathCount.length === 2) {
          startNode.connectionDisabled = true;
          return;
        }
        newValue = pathCount.length === 0 ? true : (pathCount.at(0)?.value ? false : true);
      }
      if (startNode.connectionType === CONNECTION_TYPE.empty) {
        const pathCount = Object.values(startNode.paths).filter(
          (path: NodePathType) => path.side === SIDE_TYPE.start && !path.dummy
        );
        if (pathCount.length === 1) {
          startNode.connectionDisabled = true;
          return;
        }
      }

      // Create the permanent start path on the start node.
      startNode.paths[startPathUuid] = {
        side: SIDE_TYPE.start,
        value: newValue,
        position: { ...startNode.paths[dummyPath.value.startDummyPath].position },
        connected: {
          node: id,
          path: endPathUuid,
        },
      };

      // Create the permanent end path on the target node.
      targetNode.paths[endPathUuid] = {
        side: SIDE_TYPE.end,
        position: computeScaledPosition(position),
        connected: {
          node: dummyPath.value.startElement,
          path: startPathUuid,
        },
      };

      resetCreatePath.value = true

      // Additional checks for connection types to disable further connections if needed.
      if (startNode.connectionType === CONNECTION_TYPE.boolean) {
        const pathCount = Object.values(startNode.paths).filter(
          (path: NodePathType) => path.side === SIDE_TYPE.start && !path.dummy
        );
        if (pathCount.length === 2) {
          startNode.connectionDisabled = true;
          return;
        }
      }
      if (startNode.connectionType === CONNECTION_TYPE.empty) {
        const pathCount = Object.values(startNode.paths).filter(
          (path: NodePathType) => path.side === SIDE_TYPE.start && !path.dummy
        );
        if (pathCount.length === 1) {
          startNode.connectionDisabled = true;
          return;
        }
      }
    }
  };

  /**
   * Handles the mouseup event by canceling the active dummy path creation.
   * It removes the temporary dummy node and path from the scheme graph.
   *
   * @returns void
   */
  const handleMouseUp = (): void => {
    isActiveCreatePath.value = false;
    if (dummyPath.value && sharedSchemeModel?.value) {
      if (sharedSchemeModel.value.nodes[dummyPath.value.endElement]) {
        delete sharedSchemeModel.value.nodes[dummyPath.value.endElement];
      }
      if (
        sharedSchemeModel.value.nodes[dummyPath.value.startElement] &&
        sharedSchemeModel.value.nodes[dummyPath.value.startElement].paths[dummyPath.value.startDummyPath]
      ) {
        delete sharedSchemeModel.value.nodes[dummyPath.value.startElement].paths[dummyPath.value.startDummyPath];
      }

      if (resetCreatePath.value) {
        resetCreatePath.value = false
        addHistoryEntry();
      }
      dummyPath.value = null;
    }
  };

  /**
   * Removes a path with the specified unique identifier from the shared scheme model.
   *
   * This function performs the following steps:
   * 1. Checks if the shared scheme model is available.
   * 2. Iterates over each node in the model:
   *    - Deletes the path corresponding to the provided pathUId.
   *    - Resets the node's connectionDisabled flag to false.
   *    - Iterates over the remaining paths of the node, and if any path has its 'connected.path'
   *      property equal to the removed path's ID, that path is also deleted.
   *
   * @param pathUId - The unique identifier of the path to be removed.
   */
  const removePath = (pathUId: string): void => {
    if (sharedSchemeModel?.value) {
      Object.keys(sharedSchemeModel.value.nodes).forEach((node: string) => {
        delete sharedSchemeModel.value.nodes[node].paths[pathUId];
        sharedSchemeModel.value.nodes[node].connectionDisabled = false;

        Object.keys(sharedSchemeModel.value.nodes[node].paths).forEach(
          (pathUuid: string) => {
            if (
              sharedSchemeModel.value.nodes[node].paths[pathUuid].connected.path ===
              pathUId
            ) {
              delete sharedSchemeModel.value.nodes[node].paths[pathUuid];
            }
          },
        );
      });

      addHistoryEntry()
    }
  }

  return {
    removePath,
    endCreatePath,
    startCreatePath,
    getDummyPathParams,
    initializeNodePath,
  };
}
