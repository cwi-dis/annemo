import { useEffect, useRef, ForwardedRef } from "react";

/**
 * Allows for using a forwarded ref within the component that the ref is
 * forwarded to. This is achieved by passing the forwarded ref to this function,
 * upon which a new ref is returned, which can be used within the component.
 * This returned ref should also be the one that is passed down the tree by
 * assigning it to `ref` props;
 *
 * @param ref Ref received by the second param of the function passed to `forwardRef()`
 * @returns A ref object which can be accessed inside the component receiving the forwarded ref
 */
function useForwardedRef<T>(ref: ForwardedRef<T>) {
  // Internal ref that will be returned for use
  const innerRef = useRef<T>(null);

  // Assign refs once the component is mounted
  useEffect(() => {
    // Make sure ref is defined
    if (ref) {
      if (typeof ref == "object") {
        // Simply assign `current` property if `ref` is an object
        ref.current = innerRef.current;
      } else {
        // Pass `current` property of `innerRef` as param if `ref` is a function
        ref(innerRef.current);
      }
    }
  }, []);

  // Return `innerRef` for use
  return innerRef;
}

export default useForwardedRef;
