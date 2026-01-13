/**
 * Shared Hooks - Hooks génériques réutilisables partout
 * Ces hooks ne sont pas liés à une feature métier spécifique
 */

// ===== ÉTAT & STOCKAGE =====
export { useLocalStorage } from '@/hooks/useLocalStorage';
export { useDebounce } from '@/hooks/useDebounce';

// ===== UI & LAYOUT =====
export { useMediaQuery } from '@/hooks/useMediaQuery';
export { useMobile } from '@/hooks/useMobile';
export { useIsMobile } from '@/hooks/useIsMobile';
export { useReducedMotion } from '@/hooks/useReducedMotion';
export { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

// ===== PERFORMANCE =====
export { useLazyRender } from '@/hooks/useLazyRender';
export { usePrefetchOnHover } from '@/hooks/usePrefetchOnHover';
export { useOptimizedQuery } from '@/hooks/useOptimizedQuery';

// ===== AUDIO =====
export { default as useSound } from '@/hooks/useSound';
export { useHaptics } from '@/hooks/useHaptics';

// ===== UTILS =====
export { usePagination } from '@/hooks/usePagination';
export { useLogger } from '@/hooks/useLogger';
export { useErrorHandler } from '@/hooks/useErrorHandler';
