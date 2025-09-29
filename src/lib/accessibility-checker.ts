/**
 * Vérificateur d'accessibilité automatisé
 * Valide la conformité WCAG 2.1 AA des pages
 */

export interface AccessibilityReport {
  score: number;
  level: 'fail' | 'partial' | 'pass';
  issues: AccessibilityIssue[];
  recommendations: string[];
}

export interface AccessibilityIssue {
  type: 'critical' | 'important' | 'minor';
  element: string;
  description: string;
  fix: string;
}

/**
 * Vérifie la conformité d'accessibilité d'un élément DOM
 */
export function checkPageAccessibility(container: Element): AccessibilityReport {
  const issues: AccessibilityIssue[] = [];
  let score = 100;

  // 1. Vérifier la structure sémantique
  const semanticIssues = checkSemanticStructure(container);
  issues.push(...semanticIssues);
  score -= semanticIssues.length * 10;

  // 2. Vérifier les attributs ARIA
  const ariaIssues = checkAriaAttributes(container);
  issues.push(...ariaIssues);
  score -= ariaIssues.length * 5;

  // 3. Vérifier la navigation clavier
  const keyboardIssues = checkKeyboardNavigation(container);
  issues.push(...keyboardIssues);
  score -= keyboardIssues.length * 8;

  // 4. Vérifier les formulaires
  const formIssues = checkFormAccessibility(container);
  issues.push(...formIssues);
  score -= formIssues.length * 7;

  // 5. Vérifier les images
  const imageIssues = checkImageAccessibility(container);
  issues.push(...imageIssues);
  score -= imageIssues.length * 3;

  score = Math.max(0, score);

  return {
    score,
    level: score >= 90 ? 'pass' : score >= 70 ? 'partial' : 'fail',
    issues,
    recommendations: generateRecommendations(issues)
  };
}

function checkSemanticStructure(container: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Vérifier la présence de <main>
  const main = container.querySelector('main');
  if (!main) {
    issues.push({
      type: 'critical',
      element: 'page',
      description: 'Aucun élément <main> trouvé',
      fix: 'Ajouter <main role="main"> pour le contenu principal'
    });
  }

  // Vérifier la hiérarchie des titres
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  if (headings.length === 0) {
    issues.push({
      type: 'critical',
      element: 'headings',
      description: 'Aucun titre trouvé sur la page',
      fix: 'Ajouter au moins un <h1> pour le titre principal'
    });
  } else {
    const h1Count = container.querySelectorAll('h1').length;
    if (h1Count === 0) {
      issues.push({
        type: 'critical',
        element: 'h1',
        description: 'Aucun <h1> trouvé sur la page',
        fix: 'Ajouter exactement un <h1> pour le titre principal'
      });
    } else if (h1Count > 1) {
      issues.push({
        type: 'important',
        element: 'h1',
        description: `${h1Count} éléments <h1> trouvés (maximum 1)`,
        fix: 'Utiliser un seul <h1> par page'
      });
    }
  }

  // Vérifier les landmarks
  const nav = container.querySelector('nav');
  if (!nav) {
    issues.push({
      type: 'important',
      element: 'navigation',
      description: 'Aucun élément <nav> trouvé',
      fix: 'Ajouter <nav role="navigation"> pour la navigation'
    });
  }

  return issues;
}

function checkAriaAttributes(container: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Vérifier les boutons sans aria-label
  const buttons = container.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
  buttons.forEach((button, index) => {
    const text = button.textContent?.trim();
    if (!text || text.length < 2) {
      issues.push({
        type: 'important',
        element: `button[${index}]`,
        description: 'Bouton sans texte ni aria-label',
        fix: 'Ajouter aria-label="Description du bouton"'
      });
    }
  });

  // Vérifier les liens sans aria-label approprié
  const links = container.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
  links.forEach((link, index) => {
    const text = link.textContent?.trim();
    if (!text || ['cliquez ici', 'lire plus', 'voir'].includes(text.toLowerCase())) {
      issues.push({
        type: 'important',
        element: `link[${index}]`,
        description: 'Lien avec texte non descriptif',
        fix: 'Ajouter aria-label avec description claire'
      });
    }
  });

  // Vérifier les éléments décoratifs
  const images = container.querySelectorAll('img, svg');
  images.forEach((img, index) => {
    const isDecorative = img.getAttribute('alt') === '' || img.hasAttribute('aria-hidden');
    const hasAlt = img.hasAttribute('alt');
    
    if (!hasAlt && !isDecorative) {
      issues.push({
        type: 'important',
        element: `image[${index}]`,
        description: 'Image sans attribut alt',
        fix: 'Ajouter alt="description" ou alt="" si décorative'
      });
    }
  });

  return issues;
}

function checkKeyboardNavigation(container: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Vérifier les éléments focusables
  const focusableElements = container.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    issues.push({
      type: 'important',
      element: 'page',
      description: 'Aucun élément focusable trouvé',
      fix: 'Ajouter des éléments interactifs focusables'
    });
  }

  // Vérifier les tabindex négatifs sur éléments interactifs
  const negativeTabIndex = container.querySelectorAll('button[tabindex="-1"], a[tabindex="-1"]');
  if (negativeTabIndex.length > 0) {
    issues.push({
      type: 'minor',
      element: 'tabindex',
      description: `${negativeTabIndex.length} éléments avec tabindex="-1"`,
      fix: 'Vérifier si ces éléments doivent être focusables'
    });
  }

  // Vérifier les skip links
  const skipLinks = container.querySelectorAll('a[href^="#"]:first-child');
  if (skipLinks.length === 0) {
    issues.push({
      type: 'minor',
      element: 'skip-links',
      description: 'Aucun lien de navigation rapide trouvé',
      fix: 'Ajouter des skip-links en début de page'
    });
  }

  return issues;
}

function checkFormAccessibility(container: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  // Vérifier les inputs sans label
  const inputs = container.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputs.forEach((input, index) => {
    const inputId = input.getAttribute('id');
    const hasLabel = inputId && container.querySelector(`label[for="${inputId}"]`);
    
    if (!hasLabel) {
      issues.push({
        type: 'critical',
        element: `input[${index}]`,
        description: 'Input sans label associé',
        fix: 'Ajouter <label for="input-id"> ou aria-label'
      });
    }
  });

  // Vérifier les messages d'erreur
  const errorMessages = container.querySelectorAll('[role="alert"], .error-message');
  const forms = container.querySelectorAll('form');
  
  if (forms.length > 0 && errorMessages.length === 0) {
    issues.push({
      type: 'minor',
      element: 'form-errors',
      description: 'Aucun système de message d\'erreur détecté',
      fix: 'Ajouter des zones pour les messages d\'erreur avec role="alert"'
    });
  }

  return issues;
}

function checkImageAccessibility(container: Element): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];

  const images = container.querySelectorAll('img');
  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');
    const ariaHidden = img.hasAttribute('aria-hidden');
    
    if (alt === null && !ariaHidden) {
      issues.push({
        type: 'important',
        element: `img[${index}]`,
        description: 'Image sans attribut alt',
        fix: 'Ajouter alt="description" ou aria-hidden="true" si décorative'
      });
    } else if (alt && alt.length > 150) {
      issues.push({
        type: 'minor',
        element: `img[${index}]`,
        description: 'Texte alt trop long (>150 caractères)',
        fix: 'Raccourcir le texte alt ou utiliser aria-describedby'
      });
    }
  });

  return issues;
}

function generateRecommendations(issues: AccessibilityIssue[]): string[] {
  const recommendations: string[] = [];
  
  const criticalCount = issues.filter(i => i.type === 'critical').length;
  const importantCount = issues.filter(i => i.type === 'important').length;
  
  if (criticalCount > 0) {
    recommendations.push('🚨 Corriger d\'abord les problèmes critiques de structure sémantique');
  }
  
  if (importantCount > 3) {
    recommendations.push('⚠️ Ajouter des aria-labels sur tous les éléments interactifs');
  }
  
  if (issues.some(i => i.element.includes('button'))) {
    recommendations.push('🔲 Vérifier que tous les boutons sont accessibles au clavier');
  }
  
  if (issues.some(i => i.element.includes('form'))) {
    recommendations.push('📝 Associer tous les champs de formulaire à leurs labels');
  }
  
  if (issues.length > 10) {
    recommendations.push('📚 Consulter la checklist WCAG 2.1 complète');
  }
  
  return recommendations;
}

/**
 * Teste l'accessibilité d'une page complète
 */
export function auditPageAccessibility(): AccessibilityReport {
  const container = document.querySelector('[data-testid="page-root"]') || document.body;
  return checkPageAccessibility(container);
}

/**
 * Hook React pour l'audit en temps réel
 */
export function useAccessibilityAudit() {
  const runAudit = () => {
    const report = auditPageAccessibility();
    
    if (import.meta.env.DEV && report.level === 'fail') {
      console.group('🔍 Audit Accessibilité');
      console.warn(`Score: ${report.score}/100 - Niveau: ${report.level}`);
      report.issues.forEach(issue => {
        console.warn(`${issue.type.toUpperCase()}: ${issue.description} (${issue.fix})`);
      });
      console.groupEnd();
    }
    
    return report;
  };

  return { runAudit };
}