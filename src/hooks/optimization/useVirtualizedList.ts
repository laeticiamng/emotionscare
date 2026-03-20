import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

interface VirtualizedListConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Nombre d'éléments à rendre en plus
  estimatedItemHeight?: number;
}

/**
 * Hook pour la virtualisation de listes longues - Améliore drastiquement les performances
 */
export function useVirtualizedList<T>(
  items: T[],
  config: VirtualizedListConfig
) {
  const { 
    itemHeight, 
    containerHeight, 
    overscan = 5,
    estimatedItemHeight = itemHeight 
  } = config;
  
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Calculer les indices visibles
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length
    );
    
    // Ajouter l'overscan
    const paddedStart = Math.max(0, startIndex - overscan);
    const paddedEnd = Math.min(items.length, endIndex + overscan);
    
    return {
      startIndex: paddedStart,
      endIndex: paddedEnd,
      visibleStartIndex: startIndex,
      visibleEndIndex: endIndex
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  
  // Éléments à rendre
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index,
      style: {
        position: 'absolute' as const,
        top: (visibleRange.startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, visibleRange, itemHeight]);
  
  // Gestionnaire de scroll optimisé
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    
    if (!isScrolling) {
      setIsScrolling(true);
    }
    
    // Détecter la fin du scroll
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, [isScrolling]);
  
  // Scroll vers un élément
  const scrollToIndex = useCallback((index: number) => {
    const targetScrollTop = index * itemHeight;
    setScrollTop(targetScrollTop);
  }, [itemHeight]);
  
  // Nettoyage
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    handleScroll,
    scrollToIndex,
    isScrolling,
    visibleRange,
    // Props pour le conteneur
    containerProps: {
      style: {
        height: containerHeight,
        overflow: 'auto' as const,
        position: 'relative' as const
      },
      onScroll: handleScroll
    },
    // Props pour le wrapper des éléments
    wrapperProps: {
      style: {
        height: items.length * itemHeight,
        position: 'relative' as const
      }
    }
  };
}