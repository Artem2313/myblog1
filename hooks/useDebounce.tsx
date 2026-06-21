import { useRef, useCallback } from "react";

export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // useCallback ensures we don't recreate this function on every render
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}
