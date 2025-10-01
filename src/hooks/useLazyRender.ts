// @ts-nocheck
import { type MutableRefObject, useEffect, useRef, useState } from 'react';

interface UseLazyRenderOptions {
  /**
   * Root margin passed to the IntersectionObserver. Use this to trigger the
   * rendering slightly before the element enters the viewport.
   */
  rootMargin?: string;
}

interface UseLazyRenderResult<T extends HTMLElement> {
  /**
   * Mutable ref that must be attached to the element that should trigger the
   * deferred rendering once it becomes visible.
   */
  ref: MutableRefObject<T | null>;
  /**
   * Boolean indicating whether the element entered the viewport at least once.
   */
  isVisible: boolean;
}

/**
 * Small helper hook built around IntersectionObserver allowing components to
 * render their heavy content only once they are close to the viewport. This
 * improves the initial payload and reduces the amount of DOM nodes rendered on
 * first paint – useful to reach Lighthouse performance targets.
 */
export function useLazyRender<T extends HTMLElement = HTMLElement>(
  options: UseLazyRenderOptions = {}
): UseLazyRenderResult<T> {
  const { rootMargin = '200px' } = options;
  const elementRef = useRef<T | null>(null);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (hasIntersected) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setHasIntersected(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    const current = elementRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
      observer.disconnect();
    };
  }, [hasIntersected, rootMargin]);

  return { ref: elementRef, isVisible: hasIntersected };
}
