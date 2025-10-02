import type { FC, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';

interface ZeroNumberBoundaryProps {
  children: ReactNode;
  /**
   * When false, the boundary behaves as a passthrough container without monitoring.
   */
  enabled?: boolean;
  className?: string;
}

const DIGIT_PATTERN = /\d/;

export const ZeroNumberBoundary: FC<ZeroNumberBoundaryProps> = ({
  children,
  enabled = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const warningIssuedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const element = containerRef.current;
    if (!element) {
      return undefined;
    }

    const emitWarning = () => {
      if (warningIssuedRef.current || !enabled) {
        return;
      }
      const textContent = element.textContent ?? '';
      if (DIGIT_PATTERN.test(textContent)) {
        warningIssuedRef.current = true;
        if (process.env.NODE_ENV !== 'production') {
          logger.warn('ZeroNumberBoundary: Numeric characters detected within zero-number zone', {}, 'UI');
        }
      }
    };

    emitWarning();

    const observer = new MutationObserver(emitWarning);
    observer.observe(element, { subtree: true, childList: true, characterData: true });

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  return (
    <div ref={containerRef} data-zero-number-boundary={enabled ? 'enabled' : 'disabled'} className={className}>
      {children}
    </div>
  );
};

export default ZeroNumberBoundary;
