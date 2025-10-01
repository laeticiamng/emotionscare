// @ts-nocheck

import { useEffect, useCallback, RefObject } from 'react';

interface UseKeyboardNavigationOptions {
  containerRef: RefObject<HTMLElement>;
  onEscape?: () => void;
  onEnter?: () => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

export const useKeyboardNavigation = ({
  containerRef,
  onEscape,
  onEnter,
  trapFocus = false,
  autoFocus = false
}: UseKeyboardNavigationOptions) => {
  
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');
    
    return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, [containerRef]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, shiftKey } = event;
    
    switch (key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
        
      case 'Enter':
        if (onEnter && document.activeElement === containerRef.current) {
          event.preventDefault();
          onEnter();
        }
        break;
        
      case 'Tab':
        if (trapFocus) {
          const focusableElements = getFocusableElements();
          if (focusableElements.length === 0) return;
          
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
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
      case 'ArrowUp':
        const focusableElements = getFocusableElements();
        const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
        
        if (currentIndex !== -1) {
          event.preventDefault();
          const nextIndex = key === 'ArrowDown' 
            ? (currentIndex + 1) % focusableElements.length
            : currentIndex === 0 
              ? focusableElements.length - 1 
              : currentIndex - 1;
          
          focusableElements[nextIndex]?.focus();
        }
        break;
    }
  }, [containerRef, onEscape, onEnter, trapFocus, getFocusableElements]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Auto-focus si demandé
    if (autoFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        container.focus();
      }
    }

    // Ajouter l'écouteur d'événements
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [containerRef, handleKeyDown, autoFocus, getFocusableElements]);

  return {
    getFocusableElements,
    focusFirst: () => {
      const elements = getFocusableElements();
      elements[0]?.focus();
    },
    focusLast: () => {
      const elements = getFocusableElements();
      elements[elements.length - 1]?.focus();
    }
  };
};

export default useKeyboardNavigation;
