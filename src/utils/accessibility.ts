/**
 * ♿ ACCESSIBILITY UTILITIES
 * Utilitaires d'accessibilité pour EmotionsCare
 */

export const announceToScreenReader = (
  message: string, 
  priority: 'polite' | 'assertive' = 'polite'
) => {
  const announcer = document.getElementById(
    priority === 'assertive' 
      ? 'accessibility-announcements-assertive' 
      : 'accessibility-announcements'
  );
  
  if (announcer) {
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
};

export const generateUniqueId = (prefix: string = 'element'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const trapFocusInContainer = (container: HTMLElement): (() => void) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    }
  };

  document.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    document.removeEventListener('keydown', handleTabKey);
  };
};