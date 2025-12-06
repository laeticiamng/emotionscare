import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number | number[];
  rootMargin?: string;
  enabled?: boolean;
  triggerOnce?: boolean;
}

/**
 * Hook optimisé pour l'Intersection Observer avec gestion mémoire
 */
export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '0px',
  enabled = true,
  triggerOnce = false
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setTarget = useCallback((element: HTMLElement | null) => {
    // Nettoyer l'ancien observer si nécessaire
    if (targetRef.current && observerRef.current) {
      observerRef.current.unobserve(targetRef.current);
    }
    
    targetRef.current = element;
    
    // Observer le nouvel élément
    if (element && observerRef.current && enabled) {
      observerRef.current.observe(element);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') {
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        
        setIsIntersecting(isElementIntersecting);
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
          
          // Si triggerOnce est activé, arrêter d'observer après la première intersection
          if (triggerOnce && observerRef.current && targetRef.current) {
            observerRef.current.unobserve(targetRef.current);
          }
        }
      },
      { 
        threshold, 
        rootMargin 
      }
    );

    // Observer l'élément cible s'il existe déjà
    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, enabled, triggerOnce, hasIntersected]);

  return {
    isIntersecting,
    hasIntersected,
    setTarget
  };
}