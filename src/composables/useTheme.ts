import { useCore } from '@/composables/useCore';
import { THEME_TYPE, type ThemeType } from '@/types';
import { ref } from 'vue';

// Define a reactive reference to store the current theme. Default is set to LIGHT_MODE.
const currentTheme = ref<ThemeType>(THEME_TYPE.LIGHT_MODE)

/**
 * Composable function for handling the application's theme.
 * Provides methods to set and get the current theme.
 */
export function useTheme() {
  // Retrieve the function to access the scheme graph element from the core composable.
  const { getSchemeGraphReference } = useCore();

  /**
   * Sets the current theme and updates the UI accordingly.
   * @param theme The theme type to set (LIGHT_MODE or DARK_MODE).
   */
  const setTheme = (theme: ThemeType) => {

    const schemeGraphRef = getSchemeGraphReference()
    if (schemeGraphRef) {
      switch (theme) {
        case THEME_TYPE.LIGHT_MODE: {
          currentTheme.value = THEME_TYPE.LIGHT_MODE;
          schemeGraphRef.value?.classList.remove('dark');
        } break;
        case THEME_TYPE.DARK_MODE: {
          currentTheme.value = THEME_TYPE.DARK_MODE;
          schemeGraphRef.value?.classList.add('dark');
        } break;
      }
    }
  }

  /**
   * Returns the currently set theme.
   * @returns The current theme type.
   */
  const getCurrentTheme = (): ThemeType => currentTheme.value;

  return {
    setTheme,
    getCurrentTheme
  }
}
