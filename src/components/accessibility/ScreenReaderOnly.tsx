
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScreenReaderOnlyProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({
  children,
  as: Component = 'span',
  className
}) => {
  return (
    <Component
      className={cn(
        "sr-only",
        className
      )}
      aria-hidden="false"
    >
      {children}
    </Component>
  );
};

export default ScreenReaderOnly;
