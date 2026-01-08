// @ts-nocheck

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  /** Taille maximale du container */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Ajoute un padding vertical adaptatif */
  padded?: boolean;
}

const sizeClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

/**
 * Container responsive avec padding adaptatif selon l'appareil
 */
const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '',
  size = 'xl',
  padded = true,
}) => {
  return (
    <div 
      className={cn(
        'w-full mx-auto',
        // Padding horizontal responsive
        'px-3 sm:px-4 md:px-6 lg:px-8',
        // Padding vertical responsive si activé
        padded && 'py-4 sm:py-5 md:py-6 lg:py-8',
        // Taille maximale
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
export { Container };
