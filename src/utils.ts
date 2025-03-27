/**
 * Adds an element to an array if it does not already exist,
 * or removes it if it does.
 *
 * @param array - The array to modify.
 * @param element - The element to add or remove.
 * @returns A new array with the element either added or removed.
 */
export function xorElement(array: string[], element: string): string[] {
  const index = array.indexOf(element);

  if (index === -1) {
    return [...array, element];
  } else {
    return array.filter((_, i) => i !== index);
  }
}

/**
 * Generates a pseudo-random UUID (version 4) in the standard 8-4-4-4-12 format.
 * It uses a template string where each 'x' or 'y' is replaced with a random hexadecimal digit.
 * For the 'y' placeholder, the function ensures that the correct variant is set (i.e., the first
 * bit is always 1 and the second bit is random, complying with the UUID version 4 specification).
 *
 * Note: This implementation uses Math.random() which is not cryptographically secure.
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * A debounce function that limits the number of calls to a given function within a specified time.
 * @param func - the function to be called
 * @param wait - waiting time in milliseconds
 * @returns - the function that will be called after the waiting time has elapsed
 */
export function debounce<
  T extends (...args: unknown[] | boolean[] | string[]) => void,
>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (...args: Parameters<T>): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Formats a number of seconds into a string in mm:ss format.
 *
 * @param seconds - The number of seconds to format.
 * @returns A string formatted as mm:ss.
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

/**
 * Creates a deep copy of the provided object.
 *
 * This function serializes the object into a JSON string and then parses it back into a new object.
 * It is a simple way to clone objects with nested properties, but note that it has some limitations:
 * - Functions, symbols, and undefined values will not be preserved.
 * - Special objects like Date, RegExp, Map, Set, etc. may not be copied correctly.
 * - Objects with circular references will cause an error.
 *
 * @param obj - The object to be deeply copied.
 * @returns A new object that is a deep copy of the input.
 */
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Truncates the array by keeping only the first `count` entries and removing the rest.
 * If `count` is greater than the array's length, the array remains unchanged.
 *
 * @param arr - The array to be truncated.
 * @param count - The number of entries to keep from the beginning of the array.
 * @returns The truncated array.
 */
export function truncateArray<T>(arr: T[], count: number): T[] {
  if (count < arr.length) {
    arr.length = count;
  }
  return arr;
}