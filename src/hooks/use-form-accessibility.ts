
import { useEffect } from 'react';

interface FormAccessibilityOptions {
  // Le sélecteur du formulaire à surveiller
  formSelector: string;
  
  // Callback appelé lorsqu'une erreur est détectée dans les champs
  onError?: (element: HTMLElement) => void;
  
  // Activer la navigation au clavier (Tab/Shift+Tab)
  enableKeyboardNavigation?: boolean;
  
  // Activer le focus automatique sur le premier champ d'erreur
  focusFirstError?: boolean;
  
  // Activer la soumission du formulaire avec Ctrl+Enter
  enableCtrlEnterSubmit?: boolean;
  
  // Vocaliser les erreurs pour les lecteurs d'écran
  announceErrors?: boolean;
}

export function useFormAccessibility({
  formSelector,
  onError,
  enableKeyboardNavigation = true,
  focusFirstError = true,
  enableCtrlEnterSubmit = true,
  announceErrors = true
}: FormAccessibilityOptions): void {
  useEffect(() => {
    const form = document.querySelector(formSelector) as HTMLFormElement;
    if (!form) return;
    
    // Gestionnaire pour la soumission avec Ctrl+Enter
    const handleKeyDown = (e: KeyboardEvent) => {
      if (enableCtrlEnterSubmit && e.ctrlKey && e.key === 'Enter') {
        form.requestSubmit();
      }
    };
    
    // Focus le premier élément en erreur
    const focusFirstErrorElement = () => {
      if (!focusFirstError) return;
      
      const firstErrorInput = form.querySelector('[aria-invalid="true"]') as HTMLElement;
      if (firstErrorInput) {
        firstErrorInput.focus();
        if (onError) onError(firstErrorInput);
        
        // Annoncer l'erreur aux lecteurs d'écran
        if (announceErrors) {
          const errorId = firstErrorInput.getAttribute('aria-describedby');
          if (errorId) {
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
              const liveRegion = document.createElement('div');
              liveRegion.setAttribute('role', 'alert');
              liveRegion.setAttribute('aria-live', 'assertive');
              liveRegion.className = 'sr-only';
              liveRegion.textContent = errorElement.textContent;
              
              document.body.appendChild(liveRegion);
              setTimeout(() => {
                document.body.removeChild(liveRegion);
              }, 1000);
            }
          }
        }
      }
    };
    
    // Améliorer la navigation au clavier
    const setupKeyboardNavigation = () => {
      if (!enableKeyboardNavigation) return;
      
      const focusableElements = form.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      focusableElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          // S'assurer que tous les éléments focusables ont un bon contraste de focus
          el.style.outlineOffset = '2px';
        }
      });
    };
    
    // Appliquer les améliorations d'accessibilité
    setupKeyboardNavigation();
    
    // Valider le formulaire et focus sur le premier élément en erreur
    form.addEventListener('submit', () => {
      setTimeout(() => {
        focusFirstErrorElement();
      }, 100);
    });
    
    // Support pour Ctrl+Enter
    form.addEventListener('keydown', handleKeyDown);
    
    return () => {
      form.removeEventListener('keydown', handleKeyDown);
    };
  }, [formSelector, onError, enableKeyboardNavigation, focusFirstError, enableCtrlEnterSubmit, announceErrors]);
}

export default useFormAccessibility;
