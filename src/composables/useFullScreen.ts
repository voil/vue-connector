import { useCore } from '@/composables/useCore';
import { onUnmounted, ref } from 'vue';

/**
 * This composable provides functionality to control the fullscreen mode
 * of a specified container element. It returns methods to toggle fullscreen
 * mode and to check if fullscreen mode is active.
 */
export function useFullScreen() {
  /**
   * Composable for controlling fullscreen mode.
   * It manages the fullscreen state of a container element using the Composition API.
   */

  // Reactive variable indicating whether fullscreen mode is active.
  const isFullScreenActive = ref<boolean>(false);
  const { getSchemeGraphReference } = useCore();

  // Event handler to update the fullscreen active state.
  const handleFullScreenChange = (): void => {
    isFullScreenActive.value = !!document.fullscreenElement;
  };

  // Add event listener for fullscreen changes.
  document.addEventListener('fullscreenchange', handleFullScreenChange);

  // Remove the event listener when the component using this composable is unmounted.
  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullScreenChange);
  });

  /**
   * Toggles the fullscreen mode for the specified container.
   * If the container is not in fullscreen, it enters fullscreen mode;
   * otherwise, it exits fullscreen.
   *
   * @returns {Promise<void>} A promise that resolves when the operation completes.
   */
  const toggleFullScreen = async (): Promise<void> => {
    const container = getSchemeGraphReference().value;
    if (!container) {
      console.warn('Container reference is not available.');
      return;
    }

    !document.fullscreenElement ? await container.requestFullscreen() : await document.exitFullscreen();
  };

  /**
   * Returns whether fullscreen mode is active.
   *
   * @returns {boolean} True if fullscreen is active, false otherwise.
   */
  const isFullScreen = (): boolean => isFullScreenActive.value;

  return {
    isFullScreen,
    toggleFullScreen,
  };
}
