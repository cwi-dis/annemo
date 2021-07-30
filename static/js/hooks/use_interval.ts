import { useEffect, useRef } from "react";

/**
 * Allows for the use of `setInterval()` as a React hook. Works analogous to
 * `setInterval()` with the exception that if `delay` is set to `null`, the
 * interval is cleared.
 *
 * @param callback Callback function to be called repeatedly
 * @param delay Delay between invocations of `callback` in ms
 */
function useInterval(callback: () => void, delay: number | null) {
  // Ref to callback function
  const currentCallback = useRef<() => void>();

  useEffect(() => {
    // Update callback ref everytime `callback` changes
    currentCallback.current = callback;
  }, [callback]);

  // Set up the interval every time `delay` changes
  useEffect(() => {
    // Only start interval if `delay` is not `null`
    if (delay) {
      // Start interval and invoke the function in `currentCallback`
      const interval = setInterval(() => {
        currentCallback.current?.();
      }, delay);

      // Clear the interval on unmount
      return () => {
        clearInterval(interval);
      };
    }
  }, [delay]);
}

export default useInterval;
