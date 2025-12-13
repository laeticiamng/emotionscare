// @ts-nocheck
import { type MutableRefObject, useEffect, useRef, useState, useCallback, useMemo } from 'react';

/** Options pour le hook useLazyRender */
export interface UseLazyRenderOptions {
  /** Marge autour de la racine pour déclencher plus tôt */
  rootMargin?: string;
  /** Seuil de visibilité (0-1) */
  threshold?: number | number[];
  /** Élément racine pour l'observation */
  root?: Element | null;
  /** Désactiver l'observation (toujours visible) */
  disabled?: boolean;
  /** Callback appelé lors de l'intersection */
  onIntersect?: (entry: IntersectionObserverEntry) => void;
  /** Callback appelé lorsque l'élément quitte le viewport */
  onLeave?: (entry: IntersectionObserverEntry) => void;
  /** Réobserver après avoir quitté le viewport */
  reobserve?: boolean;
  /** Délai avant de considérer comme visible (ms) */
  delay?: number;
  /** Activer le mode debug */
  debug?: boolean;
}

/** Résultat du hook useLazyRender */
export interface UseLazyRenderResult<T extends HTMLElement> {
  /** Ref à attacher à l'élément */
  ref: MutableRefObject<T | null>;
  /** L'élément est-il visible ? */
  isVisible: boolean;
  /** L'élément a-t-il été visible au moins une fois ? */
  hasBeenVisible: boolean;
  /** Ratio de visibilité actuel (0-1) */
  visibilityRatio: number;
  /** Forcer la visibilité */
  forceVisible: () => void;
  /** Réinitialiser l'état */
  reset: () => void;
  /** L'observer est-il supporté ? */
  isSupported: boolean;
  /** Position de l'élément */
  boundingRect: DOMRectReadOnly | null;
}

/** Options pour le hook useLazyImage */
export interface UseLazyImageOptions extends UseLazyRenderOptions {
  /** URL de l'image placeholder */
  placeholder?: string;
  /** URL de l'image basse résolution */
  lowResSrc?: string;
  /** Qualité de l'image (pour srcset) */
  quality?: 'low' | 'medium' | 'high';
}

/** Résultat du hook useLazyImage */
export interface UseLazyImageResult {
  /** Ref à attacher à l'élément img */
  ref: MutableRefObject<HTMLImageElement | null>;
  /** L'image est-elle chargée ? */
  isLoaded: boolean;
  /** L'image est-elle en cours de chargement ? */
  isLoading: boolean;
  /** Erreur de chargement */
  error: Error | null;
  /** Source actuelle à utiliser */
  currentSrc: string;
}

/** Vérifie si IntersectionObserver est supporté */
const isIntersectionObserverSupported = (): boolean => {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
};

/**
 * Hook pour le rendu différé basé sur la visibilité
 * Permet de charger les composants lourds uniquement lorsqu'ils sont proches du viewport
 */
export function useLazyRender<T extends HTMLElement = HTMLElement>(
  options: UseLazyRenderOptions = {}
): UseLazyRenderResult<T> {
  const {
    rootMargin = '200px',
    threshold = 0,
    root = null,
    disabled = false,
    onIntersect,
    onLeave,
    reobserve = false,
    delay = 0,
    debug = false
  } = options;

  const elementRef = useRef<T | null>(null);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [isCurrentlyVisible, setIsCurrentlyVisible] = useState(false);
  const [visibilityRatio, setVisibilityRatio] = useState(0);
  const [boundingRect, setBoundingRect] = useState<DOMRectReadOnly | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const isSupported = useMemo(() => isIntersectionObserverSupported(), []);

  /** Forcer l'état visible */
  const forceVisible = useCallback(() => {
    setHasIntersected(true);
    setIsCurrentlyVisible(true);
    setVisibilityRatio(1);
    if (debug) {
      console.log('[useLazyRender] Forced visible');
    }
  }, [debug]);

  /** Réinitialiser l'état */
  const reset = useCallback(() => {
    setHasIntersected(false);
    setIsCurrentlyVisible(false);
    setVisibilityRatio(0);
    setBoundingRect(null);
    if (debug) {
      console.log('[useLazyRender] Reset');
    }
  }, [debug]);

  useEffect(() => {
    // Si désactivé, toujours visible
    if (disabled) {
      forceVisible();
      return;
    }

    // Si déjà intersecté et pas de réobservation, ne rien faire
    if (hasIntersected && !reobserve) {
      return;
    }

    // Si non supporté, considérer comme visible
    if (!isSupported) {
      forceVisible();
      return;
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        setBoundingRect(entry.boundingClientRect);
        setVisibilityRatio(entry.intersectionRatio);

        if (entry.isIntersecting) {
          if (debug) {
            console.log('[useLazyRender] Intersecting', {
              ratio: entry.intersectionRatio,
              rect: entry.boundingClientRect
            });
          }

          // Appliquer le délai si spécifié
          if (delay > 0) {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              setHasIntersected(true);
              setIsCurrentlyVisible(true);
              onIntersect?.(entry);
            }, delay);
          } else {
            setHasIntersected(true);
            setIsCurrentlyVisible(true);
            onIntersect?.(entry);
          }

          // Déconnecter si pas de réobservation
          if (!reobserve && observerRef.current) {
            observerRef.current.disconnect();
          }
        } else if (reobserve) {
          // Élément a quitté le viewport
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          setIsCurrentlyVisible(false);
          onLeave?.(entry);

          if (debug) {
            console.log('[useLazyRender] Left viewport');
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root,
      rootMargin,
      threshold
    });

    const current = elementRef.current;
    if (current) {
      observerRef.current.observe(current);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (observerRef.current) {
        if (current) {
          observerRef.current.unobserve(current);
        }
        observerRef.current.disconnect();
      }
    };
  }, [hasIntersected, rootMargin, threshold, root, disabled, reobserve, delay, debug, isSupported, forceVisible, onIntersect, onLeave]);

  return {
    ref: elementRef,
    isVisible: isCurrentlyVisible || hasIntersected,
    hasBeenVisible: hasIntersected,
    visibilityRatio,
    forceVisible,
    reset,
    isSupported,
    boundingRect
  };
}

/**
 * Hook pour le chargement différé d'images
 */
export function useLazyImage(
  src: string,
  options: UseLazyImageOptions = {}
): UseLazyImageResult {
  const { placeholder = '', lowResSrc, ...lazyOptions } = options;

  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { isVisible } = useLazyRender<HTMLImageElement>({
    ...lazyOptions,
    ref: imgRef
  } as any);

  const currentSrc = useMemo(() => {
    if (!isVisible) return placeholder;
    if (!isLoaded && lowResSrc) return lowResSrc;
    return src;
  }, [isVisible, isLoaded, placeholder, lowResSrc, src]);

  useEffect(() => {
    if (!isVisible || isLoaded) return;

    setIsLoading(true);
    const img = new Image();

    img.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    img.onerror = (e) => {
      setError(new Error('Failed to load image'));
      setIsLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [isVisible, src, isLoaded]);

  return {
    ref: imgRef,
    isLoaded,
    isLoading,
    error,
    currentSrc
  };
}

/**
 * Hook pour observer plusieurs éléments
 */
export function useLazyRenderMultiple<T extends HTMLElement = HTMLElement>(
  count: number,
  options: UseLazyRenderOptions = {}
): Array<UseLazyRenderResult<T>> {
  const results = Array.from({ length: count }, () => useLazyRender<T>(options));
  return results;
}

/**
 * Hook pour détecter si un composant est dans la zone "above the fold"
 */
export function useAboveFold<T extends HTMLElement = HTMLElement>(): {
  ref: MutableRefObject<T | null>;
  isAboveFold: boolean;
} {
  const ref = useRef<T | null>(null);
  const [isAboveFold, setIsAboveFold] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    setIsAboveFold(rect.top < window.innerHeight);
  }, []);

  return { ref, isAboveFold };
}

export default useLazyRender;
