// @ts-nocheck
import { useMemo, useRef } from "react";
export function useThrottle<T extends (...args: any[]) => void>(fn: T, interval = 300) {
  const last = useRef(0);
  return useMemo(() => (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last.current >= interval) {
      last.current = now;
      fn(...args);
    }
  }, [fn, interval]);
}
