// @ts-nocheck

import { useState, useEffect, useCallback, useMemo } from 'react';

/** Breakpoints pour différentes tailles d'écran */
export const BREAKPOINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536
} as const;

/** Type de device détecté */
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'tv';

/** Orientation de l'écran */
export type ScreenOrientation = 'portrait' | 'landscape';

/** Informations complètes sur le device */
export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  orientation: ScreenOrientation;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  pixelRatio: number;
  isRetina: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  breakpoint: keyof typeof BREAKPOINTS;
  userAgent: string;
  platform: string;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isPWA: boolean;
  hasNotch: boolean;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/** Configuration du hook */
export interface UseMobileConfig {
  mobileBreakpoint?: number;
  tabletBreakpoint?: number;
  debounceMs?: number;
  trackOrientation?: boolean;
  trackSafeAreas?: boolean;
}

/** Résultat du hook */
export interface UseMobileResult extends DeviceInfo {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isXxl: boolean;
  isAtLeast: (breakpoint: keyof typeof BREAKPOINTS) => boolean;
  isAtMost: (breakpoint: keyof typeof BREAKPOINTS) => boolean;
  isBetween: (min: keyof typeof BREAKPOINTS, max: keyof typeof BREAKPOINTS) => boolean;
}

const DEFAULT_CONFIG: UseMobileConfig = {
  mobileBreakpoint: BREAKPOINTS.md,
  tabletBreakpoint: BREAKPOINTS.lg,
  debounceMs: 100,
  trackOrientation: true,
  trackSafeAreas: true
};

/** Détecte si l'appareil a un écran tactile */
const detectTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/** Détecte le type de plateforme */
const detectPlatform = (): { isIOS: boolean; isAndroid: boolean; isSafari: boolean; isChrome: boolean; isFirefox: boolean } => {
  if (typeof navigator === 'undefined') {
    return { isIOS: false, isAndroid: false, isSafari: false, isChrome: false, isFirefox: false };
  }
  const ua = navigator.userAgent.toLowerCase();
  return {
    isIOS: /iphone|ipad|ipod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
    isAndroid: /android/.test(ua),
    isSafari: /safari/.test(ua) && !/chrome/.test(ua),
    isChrome: /chrome/.test(ua) && !/edg/.test(ua),
    isFirefox: /firefox/.test(ua)
  };
};

/** Détecte si l'app tourne en mode PWA */
const detectPWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

/** Détecte si l'appareil a un notch */
const detectNotch = (): boolean => {
  if (typeof window === 'undefined') return false;
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const safeTop = parseInt(style.getPropertyValue('--sat') || '0', 10);
  return safeTop > 20;
};

/** Récupère les safe area insets */
const getSafeAreaInsets = () => {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }
  const root = document.documentElement;
  const style = getComputedStyle(root);
  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0', 10),
    bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0', 10),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0', 10),
    right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0', 10)
  };
};

/** Détermine le breakpoint actuel */
const getCurrentBreakpoint = (width: number): keyof typeof BREAKPOINTS => {
  if (width < BREAKPOINTS.xs) return 'xs';
  if (width < BREAKPOINTS.sm) return 'xs';
  if (width < BREAKPOINTS.md) return 'sm';
  if (width < BREAKPOINTS.lg) return 'md';
  if (width < BREAKPOINTS.xl) return 'lg';
  if (width < BREAKPOINTS.xxl) return 'xl';
  return 'xxl';
};

/** Détermine le type de device */
const getDeviceType = (width: number, config: UseMobileConfig): DeviceType => {
  if (width < (config.mobileBreakpoint || BREAKPOINTS.md)) return 'mobile';
  if (width < (config.tabletBreakpoint || BREAKPOINTS.lg)) return 'tablet';
  if (width >= 1920) return 'tv';
  return 'desktop';
};

export function useMobile(config?: Partial<UseMobileConfig>): UseMobileResult {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        type: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        orientation: 'landscape',
        screenWidth: 1920,
        screenHeight: 1080,
        viewportWidth: 1920,
        viewportHeight: 1080,
        pixelRatio: 1,
        isRetina: false,
        isLandscape: true,
        isPortrait: false,
        breakpoint: 'xxl',
        userAgent: '',
        platform: '',
        isIOS: false,
        isAndroid: false,
        isSafari: false,
        isChrome: false,
        isFirefox: false,
        isPWA: false,
        hasNotch: false,
        safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const type = getDeviceType(width, mergedConfig);
    const platformInfo = detectPlatform();

    return {
      type,
      isMobile: type === 'mobile',
      isTablet: type === 'tablet',
      isDesktop: type === 'desktop' || type === 'tv',
      isTouchDevice: detectTouchDevice(),
      orientation: width > height ? 'landscape' : 'portrait',
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: width,
      viewportHeight: height,
      pixelRatio: window.devicePixelRatio || 1,
      isRetina: (window.devicePixelRatio || 1) > 1,
      isLandscape: width > height,
      isPortrait: height >= width,
      breakpoint: getCurrentBreakpoint(width),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      ...platformInfo,
      isPWA: detectPWA(),
      hasNotch: detectNotch(),
      safeAreaInsets: mergedConfig.trackSafeAreas ? getSafeAreaInsets() : { top: 0, bottom: 0, left: 0, right: 0 }
    };
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const type = getDeviceType(width, mergedConfig);
      const platformInfo = detectPlatform();

      setDeviceInfo({
        type,
        isMobile: type === 'mobile',
        isTablet: type === 'tablet',
        isDesktop: type === 'desktop' || type === 'tv',
        isTouchDevice: detectTouchDevice(),
        orientation: width > height ? 'landscape' : 'portrait',
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: width,
        viewportHeight: height,
        pixelRatio: window.devicePixelRatio || 1,
        isRetina: (window.devicePixelRatio || 1) > 1,
        isLandscape: width > height,
        isPortrait: height >= width,
        breakpoint: getCurrentBreakpoint(width),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        ...platformInfo,
        isPWA: detectPWA(),
        hasNotch: detectNotch(),
        safeAreaInsets: mergedConfig.trackSafeAreas ? getSafeAreaInsets() : { top: 0, bottom: 0, left: 0, right: 0 }
      });
    };

    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDeviceInfo, mergedConfig.debounceMs);
    };

    window.addEventListener('resize', debouncedUpdate);

    if (mergedConfig.trackOrientation) {
      window.addEventListener('orientationchange', debouncedUpdate);
    }

    // Visual viewport API for mobile keyboards
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', debouncedUpdate);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedUpdate);
      if (mergedConfig.trackOrientation) {
        window.removeEventListener('orientationchange', debouncedUpdate);
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', debouncedUpdate);
      }
    };
  }, [mergedConfig.mobileBreakpoint, mergedConfig.tabletBreakpoint, mergedConfig.debounceMs, mergedConfig.trackOrientation, mergedConfig.trackSafeAreas]);

  const isAtLeast = useCallback((breakpoint: keyof typeof BREAKPOINTS): boolean => {
    return deviceInfo.viewportWidth >= BREAKPOINTS[breakpoint];
  }, [deviceInfo.viewportWidth]);

  const isAtMost = useCallback((breakpoint: keyof typeof BREAKPOINTS): boolean => {
    return deviceInfo.viewportWidth < BREAKPOINTS[breakpoint];
  }, [deviceInfo.viewportWidth]);

  const isBetween = useCallback((min: keyof typeof BREAKPOINTS, max: keyof typeof BREAKPOINTS): boolean => {
    return deviceInfo.viewportWidth >= BREAKPOINTS[min] && deviceInfo.viewportWidth < BREAKPOINTS[max];
  }, [deviceInfo.viewportWidth]);

  const breakpointFlags = useMemo(() => ({
    isXs: deviceInfo.breakpoint === 'xs',
    isSm: deviceInfo.breakpoint === 'sm',
    isMd: deviceInfo.breakpoint === 'md',
    isLg: deviceInfo.breakpoint === 'lg',
    isXl: deviceInfo.breakpoint === 'xl',
    isXxl: deviceInfo.breakpoint === 'xxl'
  }), [deviceInfo.breakpoint]);

  return {
    ...deviceInfo,
    ...breakpointFlags,
    isAtLeast,
    isAtMost,
    isBetween
  };
}

/** Hook simplifié pour juste le boolean mobile */
export function useIsMobile(): boolean {
  const { isMobile } = useMobile();
  return isMobile;
}

/** Hook pour détecter le type de device */
export function useDeviceType(): DeviceType {
  const { type } = useMobile();
  return type;
}

/** Hook pour l'orientation */
export function useOrientation(): ScreenOrientation {
  const { orientation } = useMobile();
  return orientation;
}

/** Hook pour les safe area insets */
export function useSafeAreaInsets() {
  const { safeAreaInsets } = useMobile({ trackSafeAreas: true });
  return safeAreaInsets;
}

export default useMobile;
