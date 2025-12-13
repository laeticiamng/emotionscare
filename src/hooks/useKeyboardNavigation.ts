// @ts-nocheck

import { useEffect, useCallback, RefObject, useState, useMemo } from 'react';

/** Mode de navigation au clavier */
export type NavigationMode = 'linear' | 'grid' | 'tree' | 'roving';

/** Direction de navigation */
export type NavigationDirection = 'horizontal' | 'vertical' | 'both';

/** Raccourci clavier */
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
  enabled?: boolean;
}

/** Configuration de la grille pour la navigation */
export interface GridConfig {
  columns: number;
  rows?: number;
  wrap?: boolean;
}

/** Résultat de la navigation */
export interface NavigationResult {
  element: HTMLElement | null;
  index: number;
  row?: number;
  column?: number;
}

/** Options avancées */
export interface UseKeyboardNavigationOptions {
  containerRef: RefObject<HTMLElement>;
  onEscape?: () => void;
  onEnter?: () => void;
  onSelect?: (element: HTMLElement, index: number) => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
  mode?: NavigationMode;
  direction?: NavigationDirection;
  gridConfig?: GridConfig;
  shortcuts?: KeyboardShortcut[];
  enabled?: boolean;
  loop?: boolean;
  skipHidden?: boolean;
  onNavigate?: (result: NavigationResult) => void;
  typeahead?: boolean;
  typeaheadTimeout?: number;
}

const DEFAULT_OPTIONS = {
  trapFocus: false,
  autoFocus: false,
  mode: 'linear' as NavigationMode,
  direction: 'vertical' as NavigationDirection,
  enabled: true,
  loop: true,
  skipHidden: true,
  typeahead: false,
  typeaheadTimeout: 500
};

export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions) => {
  const {
    containerRef,
    onEscape,
    onEnter,
    onSelect,
    trapFocus = false,
    autoFocus = false,
    mode = 'linear',
    direction = 'vertical',
    gridConfig,
    shortcuts = [],
    enabled = true,
    loop = true,
    skipHidden = true,
    onNavigate,
    typeahead = false,
    typeaheadTimeout = 500
  } = options;

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [typeaheadBuffer, setTypeaheadBuffer] = useState('');
  const typeaheadTimeoutRef = useState<NodeJS.Timeout | null>(null);

  // Sélecteurs d'éléments focusables
  const focusableSelectors = useMemo(() => [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
    '[role="button"]:not([disabled])',
    '[role="menuitem"]:not([disabled])',
    '[role="option"]:not([disabled])',
    '[role="tab"]:not([disabled])'
  ].join(', '), []);

  // Obtenir les éléments focusables
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    if (skipHidden) {
      return elements.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               el.offsetParent !== null;
      });
    }

    return elements;
  }, [containerRef, focusableSelectors, skipHidden]);

  // Calculer la position dans la grille
  const getGridPosition = useCallback((index: number): { row: number; column: number } => {
    if (!gridConfig) return { row: 0, column: index };
    return {
      row: Math.floor(index / gridConfig.columns),
      column: index % gridConfig.columns
    };
  }, [gridConfig]);

  // Calculer l'index depuis la position de grille
  const getIndexFromGrid = useCallback((row: number, column: number): number => {
    if (!gridConfig) return column;
    return row * gridConfig.columns + column;
  }, [gridConfig]);

  // Navigation vers l'élément suivant/précédent
  const navigateTo = useCallback((targetIndex: number) => {
    const elements = getFocusableElements();
    if (elements.length === 0) return null;

    let finalIndex = targetIndex;

    if (loop) {
      finalIndex = ((targetIndex % elements.length) + elements.length) % elements.length;
    } else {
      finalIndex = Math.max(0, Math.min(targetIndex, elements.length - 1));
    }

    const element = elements[finalIndex];
    if (element) {
      element.focus();
      setFocusedIndex(finalIndex);

      const result: NavigationResult = {
        element,
        index: finalIndex,
        ...getGridPosition(finalIndex)
      };

      onNavigate?.(result);
      return result;
    }

    return null;
  }, [getFocusableElements, loop, getGridPosition, onNavigate]);

  // Naviguer par direction
  const navigateByDirection = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    const elements = getFocusableElements();
    const currentIndex = elements.findIndex(el => el === document.activeElement);

    if (currentIndex === -1) {
      navigateTo(0);
      return;
    }

    if (mode === 'grid' && gridConfig) {
      const { row, column } = getGridPosition(currentIndex);
      let newRow = row;
      let newColumn = column;

      switch (dir) {
        case 'up': newRow--; break;
        case 'down': newRow++; break;
        case 'left': newColumn--; break;
        case 'right': newColumn++; break;
      }

      const maxRow = Math.ceil(elements.length / gridConfig.columns) - 1;
      const maxCol = gridConfig.columns - 1;

      if (gridConfig.wrap) {
        newRow = ((newRow % (maxRow + 1)) + maxRow + 1) % (maxRow + 1);
        newColumn = ((newColumn % (maxCol + 1)) + maxCol + 1) % (maxCol + 1);
      } else {
        newRow = Math.max(0, Math.min(newRow, maxRow));
        newColumn = Math.max(0, Math.min(newColumn, maxCol));
      }

      const newIndex = getIndexFromGrid(newRow, newColumn);
      if (newIndex < elements.length) {
        navigateTo(newIndex);
      }
    } else {
      // Navigation linéaire
      const delta = (dir === 'up' || dir === 'left') ? -1 : 1;
      navigateTo(currentIndex + delta);
    }
  }, [getFocusableElements, mode, gridConfig, getGridPosition, getIndexFromGrid, navigateTo]);

  // Typeahead search
  const handleTypeahead = useCallback((char: string) => {
    if (!typeahead) return;

    const newBuffer = typeaheadBuffer + char.toLowerCase();
    setTypeaheadBuffer(newBuffer);

    const elements = getFocusableElements();
    const match = elements.find(el => {
      const text = el.textContent?.toLowerCase() || '';
      return text.startsWith(newBuffer);
    });

    if (match) {
      const index = elements.indexOf(match);
      navigateTo(index);
    }

    // Reset le buffer après le timeout
    if (typeaheadTimeoutRef[0]) {
      clearTimeout(typeaheadTimeoutRef[0]);
    }
    typeaheadTimeoutRef[0] = setTimeout(() => {
      setTypeaheadBuffer('');
    }, typeaheadTimeout);
  }, [typeahead, typeaheadBuffer, getFocusableElements, navigateTo, typeaheadTimeout]);

  // Vérifier si un raccourci correspond
  const matchShortcut = useCallback((event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
    if (shortcut.enabled === false) return false;

    const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
    const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
    const altMatch = shortcut.alt ? event.altKey : !event.altKey;
    const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
    const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;

    return keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch;
  }, []);

  // Gestionnaire de touches
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const { key, shiftKey, ctrlKey, altKey } = event;

    // Vérifier les raccourcis personnalisés d'abord
    for (const shortcut of shortcuts) {
      if (matchShortcut(event, shortcut)) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }

    // Typeahead pour les caractères alphanumériques
    if (typeahead && key.length === 1 && !ctrlKey && !altKey) {
      handleTypeahead(key);
      return;
    }

    switch (key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;

      case 'Enter':
      case ' ':
        if (onEnter || onSelect) {
          const elements = getFocusableElements();
          const currentIndex = elements.findIndex(el => el === document.activeElement);
          if (currentIndex !== -1) {
            event.preventDefault();
            onEnter?.();
            onSelect?.(elements[currentIndex], currentIndex);
          }
        }
        break;

      case 'Tab':
        if (trapFocus) {
          const elements = getFocusableElements();
          if (elements.length === 0) return;

          const firstElement = elements[0];
          const lastElement = elements[elements.length - 1];

          if (shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
        break;

      case 'ArrowDown':
        if (direction === 'vertical' || direction === 'both' || mode === 'grid') {
          event.preventDefault();
          navigateByDirection('down');
        }
        break;

      case 'ArrowUp':
        if (direction === 'vertical' || direction === 'both' || mode === 'grid') {
          event.preventDefault();
          navigateByDirection('up');
        }
        break;

      case 'ArrowRight':
        if (direction === 'horizontal' || direction === 'both' || mode === 'grid') {
          event.preventDefault();
          navigateByDirection('right');
        }
        break;

      case 'ArrowLeft':
        if (direction === 'horizontal' || direction === 'both' || mode === 'grid') {
          event.preventDefault();
          navigateByDirection('left');
        }
        break;

      case 'Home':
        if (ctrlKey || mode === 'linear') {
          event.preventDefault();
          navigateTo(0);
        }
        break;

      case 'End':
        if (ctrlKey || mode === 'linear') {
          event.preventDefault();
          navigateTo(getFocusableElements().length - 1);
        }
        break;

      case 'PageDown':
        if (mode === 'grid' && gridConfig) {
          event.preventDefault();
          const elements = getFocusableElements();
          const currentIndex = elements.findIndex(el => el === document.activeElement);
          navigateTo(currentIndex + gridConfig.columns);
        }
        break;

      case 'PageUp':
        if (mode === 'grid' && gridConfig) {
          event.preventDefault();
          const elements = getFocusableElements();
          const currentIndex = elements.findIndex(el => el === document.activeElement);
          navigateTo(currentIndex - gridConfig.columns);
        }
        break;
    }
  }, [
    enabled, shortcuts, matchShortcut, typeahead, handleTypeahead, onEscape, onEnter, onSelect,
    getFocusableElements, trapFocus, direction, mode, navigateByDirection, navigateTo, gridConfig
  ]);

  // Effet pour gérer les événements et l'auto-focus
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    if (autoFocus) {
      const elements = getFocusableElements();
      if (elements.length > 0) {
        elements[0].focus();
        setFocusedIndex(0);
      } else {
        container.focus();
      }
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, handleKeyDown, autoFocus, enabled, getFocusableElements]);

  // Actions de navigation
  const focusFirst = useCallback(() => {
    navigateTo(0);
  }, [navigateTo]);

  const focusLast = useCallback(() => {
    const elements = getFocusableElements();
    navigateTo(elements.length - 1);
  }, [getFocusableElements, navigateTo]);

  const focusNext = useCallback(() => {
    const elements = getFocusableElements();
    const currentIndex = elements.findIndex(el => el === document.activeElement);
    navigateTo(currentIndex + 1);
  }, [getFocusableElements, navigateTo]);

  const focusPrevious = useCallback(() => {
    const elements = getFocusableElements();
    const currentIndex = elements.findIndex(el => el === document.activeElement);
    navigateTo(currentIndex - 1);
  }, [getFocusableElements, navigateTo]);

  const focusByIndex = useCallback((index: number) => {
    return navigateTo(index);
  }, [navigateTo]);

  const focusBySelector = useCallback((selector: string) => {
    const elements = getFocusableElements();
    const index = elements.findIndex(el => el.matches(selector));
    if (index !== -1) {
      return navigateTo(index);
    }
    return null;
  }, [getFocusableElements, navigateTo]);

  // Raccourcis actifs
  const activeShortcuts = useMemo(() => {
    return shortcuts.filter(s => s.enabled !== false);
  }, [shortcuts]);

  return {
    // Éléments
    getFocusableElements,
    focusedIndex,

    // Navigation
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    focusByIndex,
    focusBySelector,
    navigateTo,
    navigateByDirection,

    // Grille
    getGridPosition,
    getIndexFromGrid,

    // Raccourcis
    shortcuts: activeShortcuts,

    // État
    enabled,
    mode,
    direction
  };
};

/** Hook simplifié pour les listes */
export function useListNavigation(
  containerRef: RefObject<HTMLElement>,
  onSelect?: (element: HTMLElement, index: number) => void
) {
  return useKeyboardNavigation({
    containerRef,
    mode: 'linear',
    direction: 'vertical',
    onSelect,
    loop: true
  });
}

/** Hook simplifié pour les grilles */
export function useGridNavigation(
  containerRef: RefObject<HTMLElement>,
  columns: number,
  onSelect?: (element: HTMLElement, index: number) => void
) {
  return useKeyboardNavigation({
    containerRef,
    mode: 'grid',
    gridConfig: { columns, wrap: true },
    onSelect,
    loop: true
  });
}

/** Hook pour les modales */
export function useModalNavigation(
  containerRef: RefObject<HTMLElement>,
  onClose: () => void
) {
  return useKeyboardNavigation({
    containerRef,
    trapFocus: true,
    autoFocus: true,
    onEscape: onClose
  });
}

export default useKeyboardNavigation;
