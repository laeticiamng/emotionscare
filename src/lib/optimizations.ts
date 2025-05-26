
// Bundle optimization utilities
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  return React.lazy(importFunc);
};

// Memoization helpers
export const createMemoizedComponent = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return React.memo(Component);
};

// Dynamic imports for heavy dependencies
export const loadChartJS = () => import('chart.js');
export const loadThree = () => import('three');
export const loadFramerMotion = () => import('framer-motion');
export const loadConfetti = () => import('canvas-confetti');

// Preload critical resources
export const preloadCriticalAssets = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = '/index.css';
  document.head.appendChild(link);
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};
