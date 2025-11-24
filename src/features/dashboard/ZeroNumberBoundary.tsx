import React, { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';

interface ZeroNumberBoundaryProps {
  children: React.ReactNode;
}

export const ZeroNumberBoundary: React.FC<ZeroNumberBoundaryProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const textContent = container.textContent ?? '';
    if (/\d/.test(textContent)) {
      logger.warn('[ZeroNumberBoundary] Numeric characters detected in rendered content.', {}, 'UI');
    }
  }, [children]);

  return (
    <div ref={containerRef} data-zero-number-boundary>
      {children}
    </div>
  );
};

export default ZeroNumberBoundary;
