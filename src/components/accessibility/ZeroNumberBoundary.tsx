import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';

type ZeroNumberBoundaryProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'ref'>;

const hasDigits = (value: string | null | undefined) => /\d/.test(value ?? '');

export function ZeroNumberBoundary<T extends ElementType = 'div'>(
  props: ZeroNumberBoundaryProps<T>,
) {
  const { as, children, ...rest } = props;
  const Element = (as ?? 'div') as ElementType;
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const node = containerRef.current;
    if (!node || typeof window === 'undefined') return;

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (hasDigits(walker.currentNode.nodeValue)) {
        logger.warn('ZeroNumberBoundary detected numeric characters', {
          snippet: walker.currentNode.nodeValue,
        }, 'UI');
        break;
      }
    }
  }, [children]);

  const ElementComponent = Element as React.ComponentType<any>;
  return (
    <ElementComponent ref={containerRef as never} data-zero-number-boundary="true" {...rest}>
      {children}
    </ElementComponent>
  );
}

export default ZeroNumberBoundary;
