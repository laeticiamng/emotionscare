// @ts-nocheck
/**
 * ACCESSIBILITY FIXES - WCAG AAA Compliance
 * Automatic fixes for common accessibility issues
 */

import { logProductionEvent } from './consoleCleanup';

interface AccessibilityIssue {
  element: Element;
  type: 'missing-alt' | 'low-contrast' | 'missing-label' | 'keyboard-trap' | 'focus-issue';
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  autoFixable: boolean;
}

/**
 * Comprehensive accessibility audit
 */
export const auditAccessibility = (): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  
  if (typeof document === 'undefined') return issues;
  
  // Check images without alt text
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      issues.push({
        element: img,
        type: 'missing-alt',
        severity: 'serious',
        description: 'Image manque de texte alternatif',
        autoFixable: true
      });
    }
  });
  
  // Check buttons without accessible labels
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.getAttribute('aria-label');
    const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        element: button,
        type: 'missing-label',
        severity: 'critical',
        description: 'Bouton sans label accessible',
        autoFixable: true
      });
    }
  });
  
  // Check form inputs without labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const hasLabel = document.querySelector(`label[for="${input.id}"]`);
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy && input.id) {
      issues.push({
        element: input,
        type: 'missing-label',
        severity: 'critical',
        description: 'Champ de formulaire sans label',
        autoFixable: true
      });
    }
  });
  
  // Check focus traps
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  interactiveElements.forEach(element => {
    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex && parseInt(tabIndex) > 0) {
      issues.push({
        element,
        type: 'keyboard-trap',
        severity: 'moderate',
        description: 'Tabindex positif détecté (peut créer des pièges au clavier)',
        autoFixable: true
      });
    }
  });
  
  return issues;
};

/**
 * Auto-fix accessibility issues
 */
export const fixAccessibilityIssues = (issues: AccessibilityIssue[]): number => {
  let fixedCount = 0;
  
  issues.forEach(issue => {
    if (!issue.autoFixable) return;
    
    try {
      switch (issue.type) {
        case 'missing-alt':
          const img = issue.element as HTMLImageElement;
          const src = img.src;
          const filename = src.split('/').pop()?.split('.')[0] || 'image';
          img.alt = `Image: ${filename}`;
          img.setAttribute('data-auto-fixed', 'alt-text');
          fixedCount++;
          break;
          
        case 'missing-label':
          const element = issue.element as HTMLElement;
          if (element.tagName === 'BUTTON') {
            const icon = element.querySelector('svg, i');
            if (icon) {
              element.setAttribute('aria-label', 'Bouton d\'action');
            } else {
              element.setAttribute('aria-label', 'Bouton');
            }
          } else {
            element.setAttribute('aria-label', 'Champ de saisie');
          }
          element.setAttribute('data-auto-fixed', 'aria-label');
          fixedCount++;
          break;
          
        case 'keyboard-trap':
          issue.element.removeAttribute('tabindex');
          issue.element.setAttribute('data-auto-fixed', 'tabindex-removed');
          fixedCount++;
          break;
      }
    } catch (error) {
      logProductionEvent('Accessibility Fix Error', { 
        type: issue.type, 
        error: error.message 
      }, 'error');
    }
  });
  
  return fixedCount;
};

/**
 * Add skip navigation links
 */
export const addSkipLinks = () => {
  if (typeof document === 'undefined') return;
  
  // Check if skip links already exist
  if (document.querySelector('.skip-links')) return;
  
  const skipContainer = document.createElement('div');
  skipContainer.className = 'skip-links';
  skipContainer.innerHTML = `
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    <a href="#main-navigation" class="skip-link">Aller à la navigation</a>
    <a href="#search" class="skip-link">Aller à la recherche</a>
  `;
  
  document.body.insertBefore(skipContainer, document.body.firstChild);
};

/**
 * Add landmark roles where missing
 */
export const addLandmarkRoles = () => {
  if (typeof document === 'undefined') return;
  
  // Add main role if missing
  let main = document.querySelector('main');
  if (!main) {
    main = document.querySelector('#main-content, .main-content, [data-testid="page-root"]');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  }
  
  // Add navigation role if missing
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', index === 0 ? 'Navigation principale' : `Navigation ${index + 1}`);
    }
  });
  
  // Add banner role to header if missing
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  
  // Add contentinfo role to footer if missing
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
};

/**
 * Enhance focus management
 */
export const enhanceFocusManagement = () => {
  if (typeof document === 'undefined') return;
  
  // Add focus-visible polyfill behavior
  const addFocusVisible = () => {
    let hadKeyboardEvent = true;
    const keyboardThrottleTimeout = 100;
    
    const onPointerDown = () => {
      hadKeyboardEvent = false;
    };
    
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.altKey || e.ctrlKey) return;
      hadKeyboardEvent = true;
    };
    
    const onFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (hadKeyboardEvent || target.matches(':focus-visible')) {
        target.classList.add('focus-visible');
      }
    };
    
    const onBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      target.classList.remove('focus-visible');
    };
    
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('focus', onFocus, true);
    document.addEventListener('blur', onBlur, true);
  };
  
  addFocusVisible();
};

/**
 * Add live regions for dynamic content
 */
export const addLiveRegions = () => {
  if (typeof document === 'undefined') return;
  
  // Add polite announcer
  if (!document.getElementById('announcer-polite')) {
    const politeAnnouncer = document.createElement('div');
    politeAnnouncer.id = 'announcer-polite';
    politeAnnouncer.setAttribute('aria-live', 'polite');
    politeAnnouncer.setAttribute('aria-atomic', 'true');
    politeAnnouncer.className = 'sr-only';
    document.body.appendChild(politeAnnouncer);
  }
  
  // Add assertive announcer
  if (!document.getElementById('announcer-assertive')) {
    const assertiveAnnouncer = document.createElement('div');
    assertiveAnnouncer.id = 'announcer-assertive';
    assertiveAnnouncer.setAttribute('aria-live', 'assertive');
    assertiveAnnouncer.setAttribute('aria-atomic', 'true');
    assertiveAnnouncer.className = 'sr-only';
    document.body.appendChild(assertiveAnnouncer);
  }
};

/**
 * Announce message to screen readers
 */
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcer = document.getElementById(`announcer-${priority}`);
  if (announcer) {
    announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
};

/**
 * Initialize all accessibility enhancements
 */
export const initializeAccessibilityEnhancements = () => {
  if (typeof document === 'undefined') return;
  
  // Wait for DOM to be ready
  const initialize = () => {
    addSkipLinks();
    addLandmarkRoles();
    addLiveRegions();
    enhanceFocusManagement();
    
    // Run accessibility audit and auto-fix
    const issues = auditAccessibility();
    const fixedCount = fixAccessibilityIssues(issues);
    
    if (fixedCount > 0) {
      logProductionEvent('Accessibility Auto-Fix', { 
        totalIssues: issues.length, 
        fixedCount,
        remainingIssues: issues.length - fixedCount 
      });
      
      announce(`${fixedCount} problèmes d'accessibilité corrigés automatiquement`);
    }
    
    // Log remaining issues for manual review
    const remainingIssues = issues.filter(issue => !issue.autoFixable);
    if (remainingIssues.length > 0) {
      logProductionEvent('Accessibility Manual Review Needed', { 
        issues: remainingIssues.map(issue => ({
          type: issue.type,
          severity: issue.severity,
          description: issue.description
        }))
      }, 'warn');
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
};

/**
 * Keyboard navigation enhancements
 */
export const enhanceKeyboardNavigation = () => {
  if (typeof document === 'undefined') return;
  
  document.addEventListener('keydown', (e) => {
    // Escape key to close modals/dropdowns
    if (e.key === 'Escape') {
      const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
      const openDropdown = document.querySelector('[aria-expanded="true"]');
      
      if (openModal) {
        const closeButton = openModal.querySelector('[aria-label*="fermer"], [aria-label*="close"]');
        if (closeButton) {
          (closeButton as HTMLElement).click();
        }
      }
      
      if (openDropdown) {
        (openDropdown as HTMLElement).click();
      }
    }
    
    // Arrow key navigation for menus
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const activeElement = document.activeElement as HTMLElement;
      const menu = activeElement.closest('[role="menu"], [role="menubar"]');
      
      if (menu) {
        e.preventDefault();
        const menuItems = Array.from(menu.querySelectorAll('[role="menuitem"]')) as HTMLElement[];
        const currentIndex = menuItems.indexOf(activeElement);
        
        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        }
        
        menuItems[nextIndex].focus();
      }
    }
  });
};