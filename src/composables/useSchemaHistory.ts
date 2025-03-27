import type { SchemeGraphType } from '@/types/index';
import { deepCopy, truncateArray } from '@/utils';
import type { ModelRef } from 'vue';
import { inject, ref } from 'vue';

// Holds the current index (caret) in the schema history.
const currentHistoryCaret = ref(0);
// Array storing the history of schema states.
const schemaHistory = ref<SchemeGraphType[]>([]);

/**
 * Composable for managing schema history with versioning functionality.
 *
 * This composable provides methods to record the current schema state and to navigate
 * backwards (undo) or forwards (redo) through the history.
 *
 * Functions:
 * - addHistoryEntry: Saves the current state of the shared schema model.
 * - undoSchema: Reverts the schema to the previous state.
 * - redoSchema: Advances the schema to the next state.
 * - undoAll: Resets the schema to its initial state.
 *
 * The shared schema model is injected via Vue's dependency injection.
 */
export function useSchemaHistory() {
  // Inject the shared schema graph model.
  const sharedSchemeModel = inject<ModelRef<SchemeGraphType>>('sharedSchemeModel');

  /**
   * Adds the current state of the shared schema model to the history array.
   */
  const addHistoryEntry = () => {
    if (sharedSchemeModel) {
      schemaHistory.value = truncateArray(schemaHistory.value, currentHistoryCaret.value + 1)
      schemaHistory.value.push(deepCopy<SchemeGraphType>(sharedSchemeModel.value));
      // Optionally, update the currentHistoryCaret to point to the latest entry.
      currentHistoryCaret.value = schemaHistory.value.length - 1;
    }
  };

  /**
   * Reverts the schema to the previous state in the history.
   */
  const undoSchema = () => {
    if (currentHistoryCaret.value === 0 || !sharedSchemeModel) return;

    // Decrement the caret to point to the previous history entry.
    currentHistoryCaret.value--;
    sharedSchemeModel.value = schemaHistory.value[currentHistoryCaret.value];
  };

  /**
   * Advances the schema to the next state in the history (redo).
   */
  const redoSchema = () => {
    if (currentHistoryCaret.value === schemaHistory.value.length - 1 || !sharedSchemeModel) return;

    // Increment the caret to point to the next history entry.
    currentHistoryCaret.value++;
    sharedSchemeModel.value = schemaHistory.value[currentHistoryCaret.value];
  };

  /**
   * Checks if the redo action is available.
   *
   * The redo is considered active if there are newer states available in the history,
   * meaning the current history pointer is less than the last index of the schema history.
   *
   * @returns {boolean} True if redo is possible; otherwise, false.
   */
  const isRendoActive = () => schemaHistory.value.length - 1 > currentHistoryCaret.value

  /**
   * Checks if the undo action is available.
   *
   * The undo action is active when the current history pointer is greater than zero,
   * indicating that there is a previous state to revert to.
   *
   * @returns {boolean} True if undo is possible; otherwise, false.
   */
  const isUndoActive = () => currentHistoryCaret.value > 0

  /**
   * Checks if the "undo all" action is available.
   *
   * "Undo all" is considered active if there is any state before the current state,
   * meaning the current history pointer is greater than zero.
   *
   * @returns {boolean} True if the undo-all action is possible; otherwise, false.
   */
  const isUndoAllActive = () => currentHistoryCaret.value > 0

  /**
   * Resets the schema to the very first recorded state.
   */
  const undoAll = () => {
    if (!sharedSchemeModel) return;

    currentHistoryCaret.value = 0;
    sharedSchemeModel.value = deepCopy<SchemeGraphType>(schemaHistory.value[0]);
  };

  return {
    isUndoAllActive,
    isRendoActive,
    isUndoActive,
    addHistoryEntry,
    undoSchema,
    redoSchema,
    undoAll,
  };
}
