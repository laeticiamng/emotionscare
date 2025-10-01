// @ts-nocheck
import { useEffect, useMemo, useRef } from "react";
export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  const t = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => () => { if (t.current) clearTimeout(t.current); }, []);
  return useMemo(() => (...args: Parameters<T>) => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}
