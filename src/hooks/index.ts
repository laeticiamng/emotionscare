// @ts-nocheck
/**
 * HOOKS UNIFIÉS - Index central pour tous les hooks
 * Architecture premium avec accessibilité WCAG AAA
 */

// Export du store unifié
export {
  useUnifiedStore, 
  useUnifiedContext,
  useAuth,
  useMusic,
  useEmotions,
  useAccessibility 
} from '@/core/UnifiedStateManager';

// Export des hooks natifs optimisés
export { usePerformanceOptimization, useConditionalLazyLoad } from './performance/useOptimizedPerformance';

// Toast system - compatible shadcn
export { useToast, toast } from './use-toast';
export { useClinicalHints } from './useClinicalHints';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { logger } from '@/lib/logger';

// ==================== HOOK MOBILE OPTIMISÉ ====================
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

// ==================== HOOK MEDIA QUERY AVANCÉ ====================
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatch = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(media.matches);
    
    media.addEventListener('change', updateMatch);
    return () => media.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
};

// ==================== HOOK LOCAL STORAGE SÉCURISÉ ====================
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.warn(`Error reading localStorage key "${key}"`, { error }, 'SYSTEM');
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      logger.warn(`Error setting localStorage key "${key}"`, { error }, 'SYSTEM');
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
};

// ==================== HOOK DEBOUNCE PREMIUM ====================
export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// ==================== HOOK THÈME PREMIUM ====================
export const useTheme = () => {
  const { user, updateUserPreferences } = useUnifiedStore();
  
  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    updateUserPreferences({ theme });
    
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [updateUserPreferences]);

  return {
    theme: user?.preferences.theme || 'light',
    setTheme,
  };
};

// ==================== HOOK ACCESSIBILITÉ AVANCÉE ====================
export const useAccessibilityEnhanced = () => {
  const { user, updateUserPreferences } = useUnifiedStore();
  const { announceToScreenReader } = useUnifiedContext();
  
  const toggleHighContrast = useCallback(() => {
    const newValue = !user?.preferences.accessibility.highContrast;
    updateUserPreferences({
      accessibility: { ...user?.preferences.accessibility, highContrast: newValue }
    });
    
    document.documentElement.classList.toggle('high-contrast', newValue);
    announceToScreenReader(`Contraste élevé ${newValue ? 'activé' : 'désactivé'}`);
  }, [user, updateUserPreferences, announceToScreenReader]);
  
  const toggleReducedMotion = useCallback(() => {
    const newValue = !user?.preferences.accessibility.reducedMotion;
    updateUserPreferences({
      accessibility: { ...user?.preferences.accessibility, reducedMotion: newValue }
    });
    
    document.documentElement.classList.toggle('reduced-motion', newValue);
    announceToScreenReader(`Mouvements réduits ${newValue ? 'activé' : 'désactivé'}`);
  }, [user, updateUserPreferences, announceToScreenReader]);
  
  const setFontScale = useCallback((scale: number) => {
    updateUserPreferences({
      accessibility: { ...user?.preferences.accessibility, largeText: scale > 1 }
    });
    
    document.documentElement.style.setProperty('--font-scale', scale.toString());
    announceToScreenReader(`Taille de police définie à ${Math.round(scale * 100)}%`);
  }, [user, updateUserPreferences, announceToScreenReader]);

  return {
    settings: user?.preferences.accessibility,
    toggleHighContrast,
    toggleReducedMotion,
    setFontScale,
    announce: announceToScreenReader,
  };
};

// ==================== HOOK PERFORMANCE MONITORING ====================
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (import.meta.env.DEV) {
      const renderTime = Date.now() - startTime.current;
      if (renderTime > 16) { // > 1 frame at 60fps
        logger.warn(`⚡ Slow render in ${componentName}: ${renderTime}ms (render #${renderCount.current})`, {}, 'SYSTEM');
      }
    }
    
    startTime.current = Date.now();
  });
  
  return {
    renderCount: renderCount.current,
    logSlowRender: (threshold = 16) => {
      const renderTime = Date.now() - startTime.current;
      if (renderTime > threshold) {
        logger.warn(`⚡ Slow render detected: ${renderTime}ms`, {}, 'SYSTEM');
      }
    }
  };
};

// ==================== HOOK NAVIGATION SÉCURISÉE ====================
export const useSecureNavigation = () => {
  const { validateSecureAction, logSecurityEvent } = useUnifiedContext();
  
  const navigateSecurely = useCallback((path: string, options?: { replace?: boolean }) => {
    if (!validateSecureAction('navigation')) {
      logSecurityEvent('Blocked navigation attempt', { path });
      return false;
    }
    
    try {
      if (options?.replace) {
        window.history.replaceState(null, '', path);
      } else {
        window.history.pushState(null, '', path);
      }
      
      // Dispatch custom navigation event
      window.dispatchEvent(new CustomEvent('secureNavigation', { detail: { path } }));
      return true;
    } catch (error) {
      logSecurityEvent('Navigation error', { path, error });
      return false;
    }
  }, [validateSecureAction, logSecurityEvent]);

  return { navigateSecurely };
};

// ==================== HOOK NOTIFICATIONS AVANCÉES ====================
export const useNotifications = () => {
  const { user } = useUnifiedStore();
  const { toast } = useToast();
  const { announceToScreenReader } = useUnifiedContext();
  
  const notify = useCallback((
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    options: { 
      duration?: number;
      action?: { label: string; onClick: () => void };
      persistent?: boolean;
    } = {}
  ) => {
    // Vérifier les préférences de notification
    if (!user?.preferences.notifications.inApp) return;
    
    // Annoncer aux lecteurs d'écran
    announceToScreenReader(`${type}: ${message}`);
    
    // Afficher le toast
    toast({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      variant: type === 'error' ? 'destructive' : 'default',
      duration: options.persistent ? Infinity : (options.duration || 5000),
      action: options.action ? {
        altText: options.action.label,
        onClick: options.action.onClick,
        children: options.action.label
      } : undefined
    });
    
    // Vibration sur mobile si supportée
    if ('vibrate' in navigator && user?.preferences.notifications.sound) {
      const pattern = type === 'error' ? [100, 50, 100] : [100];
      navigator.vibrate(pattern);
    }
  }, [user, toast, announceToScreenReader]);

  return { notify };
};

// ==================== HOOK KEYBOARD NAVIGATION ====================
export const useKeyboardNavigation = () => {
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);
  
  const handleEscapeKey = useCallback((callback: () => void) => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return { trapFocus, handleEscapeKey };
};

// ==================== HOOK PRÉFÉRENCES AVANCÉES ====================
export const usePreferences = () => {
  const { user, updateUserPreferences } = useUnifiedStore();
  
  const updateAccessibility = useCallback((settings: Partial<typeof user.preferences.accessibility>) => {
    updateUserPreferences({
      accessibility: { ...user?.preferences.accessibility, ...settings }
    });
  }, [user, updateUserPreferences]);
  
  const updateNotifications = useCallback((settings: Partial<typeof user.preferences.notifications>) => {
    updateUserPreferences({
      notifications: { ...user?.preferences.notifications, ...settings }
    });
  }, [user, updateUserPreferences]);
  
  const updatePrivacy = useCallback((settings: Partial<typeof user.preferences.privacy>) => {
    updateUserPreferences({
      privacy: { ...user?.preferences.privacy, ...settings }
    });
  }, [user, updateUserPreferences]);

  return {
    preferences: user?.preferences,
    updatePreferences: updateUserPreferences,
    updateAccessibility,
    updateNotifications,
    updatePrivacy,
  };
};

// ==================== HOOK OPTIMISATION AUTOMATIQUE ====================
export const useAutoOptimization = () => {
  const isMobile = useMobile();
  const isSlowConnection = useMediaQuery('(max-width: 768px) and (prefers-reduced-data: reduce)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  const optimizationSettings = useMemo(() => ({
    reduceAnimations: prefersReducedMotion || isSlowConnection,
    lazyLoadImages: isMobile || isSlowConnection,
    reducedQuality: isSlowConnection,
    enablePreload: !isMobile && !isSlowConnection,
    batchUpdates: isMobile,
  }), [isMobile, isSlowConnection, prefersReducedMotion]);
  
  return optimizationSettings;
};