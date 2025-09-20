import React, { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface ZeroNumberBoundaryProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const sanitizeText = (input: string | null | undefined) => {
  if (!input) return '';
  return input.replace(/\d+/g, '').replace(/\s{2,}/g, ' ').trim();
};

export const ZeroNumberBoundary: React.FC<ZeroNumberBoundaryProps> = ({
  children,
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const textContent = node.textContent;
    if (textContent && /\d/.test(textContent)) {
      console.warn('[ZeroNumberBoundary] detected numerical characters, sanitizing output');
      node.querySelectorAll('[data-zero-number-check="true"]').forEach((element) => {
        if (element instanceof HTMLElement) {
          const sanitized = sanitizeText(element.textContent);
          if (sanitized !== element.textContent) {
            element.setAttribute('data-sanitized', 'true');
            element.textContent = sanitized;
          }
        }
      });
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={cn('zero-number-boundary', className)}
      data-zero-number-check="true"
      {...props}
    >
      {children}
    </div>
  );
};

export default ZeroNumberBoundary;
