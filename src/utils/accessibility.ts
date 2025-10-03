
// Utilitaires pour l'accessibilité WCAG 2.1

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Nettoyer après 1 seconde
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

export const getContrastRatio = (foreground: string, background: string): number => {
  // Fonction simplifiée pour calculer le contraste
  // Dans un vrai projet, utiliser une librairie comme 'color'
  
  const getLuminance = (color: string): number => {
    // Conversion RGB vers luminance (simplifiée)
    const rgb = color.match(/\d+/g);
    if (!rgb) return 0;
    
    const [r, g, b] = rgb.map(x => {
      const val = parseInt(x) / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

export const checkAccessibilityCompliance = (element: HTMLElement) => {
  const issues: string[] = [];
  
  // Vérifier les images sans alt
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    if (!img.getAttribute('alt') && !img.getAttribute('aria-label')) {
      issues.push(`Image sans attribut alt: ${img.src}`);
    }
  });
  
  // Vérifier les boutons sans label
  const buttons = element.querySelectorAll('button');
  buttons.forEach(button => {
    const hasLabel = button.textContent?.trim() || 
                    button.getAttribute('aria-label') || 
                    button.getAttribute('aria-labelledby');
    if (!hasLabel) {
      issues.push('Bouton sans label accessible');
    }
  });
  
  // Vérifier les liens sans texte
  const links = element.querySelectorAll('a');
  links.forEach(link => {
    const hasText = link.textContent?.trim() || 
                   link.getAttribute('aria-label') || 
                   link.getAttribute('aria-labelledby');
    if (!hasText) {
      issues.push('Lien sans texte accessible');
    }
  });
  
  // Vérifier les formulaires
  const inputs = element.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const hasLabel = input.getAttribute('aria-label') || 
                    input.getAttribute('aria-labelledby') ||
                    element.querySelector(`label[for="${input.id}"]`);
    if (!hasLabel) {
      issues.push(`Champ de formulaire sans label: ${input.tagName}`);
    }
  });
  
  return issues;
};

export const addKeyboardSupport = (element: HTMLElement, callback: () => void) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  element.setAttribute('tabindex', '0');
  element.setAttribute('role', 'button');
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

export const createAccessibleId = (prefix: string = 'element'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const manageFocusFlow = (
  containers: HTMLElement[],
  options: {
    wrap?: boolean;
    skipDisabled?: boolean;
  } = {}
) => {
  const { wrap = true, skipDisabled = true } = options;
  
  let currentIndex = 0;
  
  const moveToNext = () => {
    const nextIndex = wrap 
      ? (currentIndex + 1) % containers.length
      : Math.min(currentIndex + 1, containers.length - 1);
    
    const nextElement = containers[nextIndex];
    if (skipDisabled && nextElement.hasAttribute('disabled')) {
      currentIndex = nextIndex;
      moveToNext();
      return;
    }
    
    nextElement.focus();
    currentIndex = nextIndex;
  };
  
  const moveToPrevious = () => {
    const prevIndex = wrap 
      ? currentIndex === 0 ? containers.length - 1 : currentIndex - 1
      : Math.max(currentIndex - 1, 0);
    
    const prevElement = containers[prevIndex];
    if (skipDisabled && prevElement.hasAttribute('disabled')) {
      currentIndex = prevIndex;
      moveToPrevious();
      return;
    }
    
    prevElement.focus();
    currentIndex = prevIndex;
  };
  
  return { moveToNext, moveToPrevious };
};
