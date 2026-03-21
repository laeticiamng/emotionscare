/**
 * ReducedMotionWrapper - Wraps 3D/immersive components with prefers-reduced-motion support
 * Falls back to a static placeholder when reduced motion is preferred
 * Improves accessibility without removing immersive features for capable users
 */

import React, { memo } from 'react';

const useReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
};

interface ReducedMotionWrapperProps {
  children: React.ReactNode;
  /** Static fallback shown when user prefers reduced motion */
  fallback?: React.ReactNode;
  /** Custom className for the fallback container */
  fallbackClassName?: string;
}

const DefaultFallback: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={className || 'absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent'}
    aria-hidden="true"
  />
);

const ReducedMotionWrapper: React.FC<ReducedMotionWrapperProps> = ({
  children,
  fallback,
  fallbackClassName,
}) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <>{fallback || <DefaultFallback className={fallbackClassName} />}</>;
  }

  return <>{children}</>;
};

export default memo(ReducedMotionWrapper);
export { useReducedMotion };
