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
export { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

// ===== AUDIO =====
export { default as useSound } from '@/hooks/useSound';
export { useHaptics } from '@/hooks/useHaptics';

// ===== UTILS =====
export { usePagination } from '@/hooks/usePagination';
export { useLogger } from '@/hooks/useLogger';
export { useErrorHandler } from '@/hooks/useErrorHandler';

// ===== TOAST & NOTIFICATIONS =====
export { useToast, toast } from '@/hooks/use-toast';

// ===== AUTH =====
export { useAuth } from '@/hooks/useAuth';

// ===== ANALYTICS =====
export { useAnalytics } from '@/hooks/useAnalytics';
export { useAnalyticsConsent } from '@/hooks/useAnalyticsConsent';

// ===== FORMS =====
export { useFormAccessibility } from '@/hooks/use-form-accessibility';

// ===== FEATURE FLAGS =====
export { useFeatureFlags } from '@/hooks/useFeatureFlags';
export { useFlags } from '@/hooks/useFlags';
