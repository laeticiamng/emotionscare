import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagCriterion: string;
  description: string;
  element?: HTMLElement;
  recommendation: string;
  fixable: boolean;
}

interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  passedChecks: number;
  totalChecks: number;
  wcagLevel: string;
  timestamp: Date;
}

interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
}

/**
 * Hook pour vérifier l'accessibilité en temps réel
 */
export function useAccessibilityChecker() {
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
  });
  
  const location = useLocation();
  const checkTimeoutRef = useRef<NodeJS.Timeout>();

  // Détecter les préférences utilisateur
  useEffect(() => {
    const detectPreferences = () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const highContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const largeText = window.matchMedia('(min-resolution: 1.5dppx)').matches; // Approximation
      
      // Détecter les lecteurs d'écran (approximatif)
      const screenReader = !!(
        window.speechSynthesis ||
        window.navigator.userAgent.includes('NVDA') ||
        window.navigator.userAgent.includes('JAWS') ||
        window.navigator.userAgent.includes('VoiceOver')
      );

      setPreferences({
        reducedMotion,
        highContrast,
        largeText,
        screenReader,
      });
    };

    detectPreferences();

    // Écouter les changements de préférences
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
    ];

    const handleChange = () => detectPreferences();
    
    mediaQueries.forEach(mq => {
      mq.addEventListener('change', handleChange);
    });

    return () => {
      mediaQueries.forEach(mq => {
        mq.removeEventListener('change', handleChange);
      });
    };
  }, []);

  // Vérifier l'accessibilité automatiquement lors du changement de route
  useEffect(() => {
    // Délai pour laisser le temps au DOM de se construire
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }
    
    checkTimeoutRef.current = setTimeout(() => {
      checkAccessibility();
    }, 1000);

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  // Fonction principale de vérification d'accessibilité
  const checkAccessibility = useCallback(async (): Promise<AccessibilityReport> => {
    setIsChecking(true);
    
    try {
      const issues: AccessibilityIssue[] = [];
      let passedChecks = 0;
      let totalChecks = 0;

      // Vérifications automatisées
      const checks = [
        checkPageTitle,
        checkHeadingStructure,
        checkColorContrast,
        checkAltText,
        checkFormLabels,
        checkFocusManagement,
        checkKeyboardNavigation,
        checkLanguageAttribute,
        checkLandmarks,
        checkSkipLinks,
        checkMediaControls,
        checkMotionSensitivity,
        checkTextSpacing,
        checkErrorIdentification,
        checkStatusMessages,
      ];

      for (const check of checks) {
        totalChecks++;
        try {
          const result = await check();
          if (result.passed) {
            passedChecks++;
          } else {
            issues.push(result.issue!);
          }
        } catch (error) {
          console.warn('Erreur lors de la vérification d\'accessibilité:', error);
        }
      }

      // Calculer le score
      const score = Math.round((passedChecks / totalChecks) * 100);
      
      // Déterminer le niveau WCAG
      const criticalIssues = issues.filter(i => i.impact === 'critical').length;
      const seriousIssues = issues.filter(i => i.impact === 'serious').length;
      
      let wcagLevel = 'AA Conforme';
      if (criticalIssues > 0) wcagLevel = 'Non conforme';
      else if (seriousIssues > 2) wcagLevel = 'A Partiel';
      else if (seriousIssues > 0) wcagLevel = 'AA Partiel';

      const newReport: AccessibilityReport = {
        score,
        issues,
        passedChecks,
        totalChecks,
        wcagLevel,
        timestamp: new Date(),
      };

      setReport(newReport);
      return newReport;
      
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Vérifications individuelles

  const checkPageTitle = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const title = document.title;
    const passed = title && title.length > 0 && title.length <= 60;
    
    return {
      passed,
      issue: !passed ? {
        id: 'page-title',
        type: 'error',
        impact: 'serious',
        wcagCriterion: '2.4.2',
        description: 'La page doit avoir un titre descriptif et unique',
        recommendation: 'Ajouter un titre de page descriptif de moins de 60 caractères',
        fixable: true,
      } : undefined,
    };
  };

  const checkHeadingStructure = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const h1Count = document.querySelectorAll('h1').length;
    
    // Vérifier qu'il y a exactement un H1
    const hasOneH1 = h1Count === 1;
    
    // Vérifier la hiérarchie
    let properHierarchy = true;
    let previousLevel = 0;
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      if (level > previousLevel + 1) {
        properHierarchy = false;
      }
      previousLevel = level;
    });

    const passed = hasOneH1 && properHierarchy && headings.length > 0;
    
    return {
      passed,
      issue: !passed ? {
        id: 'heading-structure',
        type: 'error',
        impact: 'moderate',
        wcagCriterion: '1.3.1',
        description: 'Structure des titres incorrecte',
        recommendation: 'Utiliser un seul H1 et respecter la hiérarchie H1 > H2 > H3...',
        fixable: true,
      } : undefined,
    };
  };

  const checkColorContrast = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    // Vérification simplifiée - en production, utiliser une bibliothèque spécialisée
    const textElements = document.querySelectorAll('p, span, div, a, button, input, label');
    let contrastIssues = 0;
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const bgColor = styles.backgroundColor;
      
      // Vérification basique (à améliorer avec un calcul de contraste réel)
      if (color === bgColor || (color.includes('rgb(255, 255, 255)') && bgColor.includes('rgb(255, 255, 255)'))) {
        contrastIssues++;
      }
    });

    const passed = contrastIssues === 0;
    
    return {
      passed,
      issue: !passed ? {
        id: 'color-contrast',
        type: 'error',
        impact: 'serious',
        wcagCriterion: '1.4.3',
        description: `Contraste insuffisant détecté sur ${contrastIssues} élément(s)`,
        recommendation: 'Assurer un contraste d\'au moins 4.5:1 pour le texte normal',
        fixable: true,
      } : undefined,
    };
  };

  const checkAltText = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => 
      !img.hasAttribute('alt') || img.getAttribute('alt')?.trim() === ''
    );

    const passed = imagesWithoutAlt.length === 0;
    
    return {
      passed,
      issue: !passed ? {
        id: 'alt-text',
        type: 'error',
        impact: 'critical',
        wcagCriterion: '1.1.1',
        description: `${imagesWithoutAlt.length} image(s) sans texte alternatif`,
        element: imagesWithoutAlt[0],
        recommendation: 'Ajouter un attribut alt descriptif à toutes les images',
        fixable: true,
      } : undefined,
    };
  };

  const checkFormLabels = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const inputs = document.querySelectorAll('input, select, textarea');
    const inputsWithoutLabels = Array.from(inputs).filter(input => {
      const id = input.getAttribute('id');
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
      return !hasLabel && !hasAriaLabel;
    });

    const passed = inputsWithoutLabels.length === 0;
    
    return {
      passed,
      issue: !passed ? {
        id: 'form-labels',
        type: 'error',
        impact: 'critical',
        wcagCriterion: '3.3.2',
        description: `${inputsWithoutLabels.length} champ(s) sans étiquette`,
        element: inputsWithoutLabels[0] as HTMLElement,
        recommendation: 'Associer chaque champ à une étiquette avec label ou aria-label',
        fixable: true,
      } : undefined,
    };
  };

  const checkFocusManagement = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const focusableElements = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let focusIssues = 0;
    focusableElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      // Vérification basique de la visibilité du focus
      if (styles.outline === 'none' && !styles.boxShadow.includes('inset')) {
        focusIssues++;
      }
    });

    const passed = focusIssues < focusableElements.length * 0.5; // Tolérance de 50%
    
    return {
      passed,
      issue: !passed ? {
        id: 'focus-management',
        type: 'warning',
        impact: 'serious',
        wcagCriterion: '2.4.7',
        description: 'Indicateurs de focus insuffisants ou invisibles',
        recommendation: 'Assurer que tous les éléments focusables ont un indicateur visible',
        fixable: true,
      } : undefined,
    };
  };

  const checkKeyboardNavigation = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    // Vérification des éléments interactifs sans tabindex approprié
    const interactiveElements = document.querySelectorAll('div[onclick], span[onclick]');
    const nonKeyboardAccessible = Array.from(interactiveElements).filter(element => {
      return !element.hasAttribute('tabindex') && !element.hasAttribute('role');
    });

    const passed = nonKeyboardAccessible.length === 0;
    
    return {
      passed,
      issue: !passed ? {
        id: 'keyboard-navigation',
        type: 'error',
        impact: 'critical',
        wcagCriterion: '2.1.1',
        description: `${nonKeyboardAccessible.length} élément(s) interactif(s) non accessible(s) au clavier`,
        recommendation: 'Utiliser des éléments sémantiques ou ajouter tabindex et gestionnaires clavier',
        fixable: true,
      } : undefined,
    };
  };

  const checkLanguageAttribute = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const html = document.documentElement;
    const hasLang = html.hasAttribute('lang') && html.getAttribute('lang')?.trim() !== '';

    return {
      passed: hasLang,
      issue: !hasLang ? {
        id: 'language-attribute',
        type: 'error',
        impact: 'serious',
        wcagCriterion: '3.1.1',
        description: 'Langue de la page non spécifiée',
        recommendation: 'Ajouter l\'attribut lang="fr" à l\'élément html',
        fixable: true,
      } : undefined,
    };
  };

  const checkLandmarks = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[aria-label]');
    const hasMain = document.querySelector('main') !== null;

    const passed = landmarks.length >= 2 && hasMain; // Au minimum main + un autre
    
    return {
      passed,
      issue: !passed ? {
        id: 'landmarks',
        type: 'warning',
        impact: 'moderate',
        wcagCriterion: '1.3.6',
        description: 'Structure de landmarks insuffisante',
        recommendation: 'Utiliser les éléments sémantiques main, nav, header, footer, aside',
        fixable: true,
      } : undefined,
    };
  };

  const checkSkipLinks = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const skipLinks = document.querySelectorAll('a[href^="#"]:first-child');
    const hasSkipLink = skipLinks.length > 0;

    return {
      passed: hasSkipLink,
      issue: !hasSkipLink ? {
        id: 'skip-links',
        type: 'warning',
        impact: 'moderate',
        wcagCriterion: '2.4.1',
        description: 'Aucun lien d\'évitement détecté',
        recommendation: 'Ajouter un lien "Aller au contenu principal" en début de page',
        fixable: true,
      } : undefined,
    };
  };

  const checkMediaControls = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const mediaElements = document.querySelectorAll('audio, video');
    const autoplayMedia = Array.from(mediaElements).filter(media => 
      media.hasAttribute('autoplay') && !media.hasAttribute('muted')
    );

    const passed = autoplayMedia.length === 0;
    
    return {
      passed,
      issue: !passed ? {
        id: 'media-controls',
        type: 'error',
        impact: 'serious',
        wcagCriterion: '2.2.2',
        description: 'Média en lecture automatique sans contrôles',
        recommendation: 'Éviter l\'autoplay ou fournir des contrôles d\'arrêt',
        fixable: true,
      } : undefined,
    };
  };

  const checkMotionSensitivity = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    // Vérifier si prefers-reduced-motion est respecté
    const hasAnimations = document.querySelectorAll('[class*="animate"], [style*="animation"]').length > 0;
    const respectsPreference = preferences.reducedMotion ? 
      !hasAnimations || document.documentElement.style.getPropertyValue('--animation-duration') === '0s' :
      true;

    return {
      passed: respectsPreference,
      issue: !respectsPreference ? {
        id: 'motion-sensitivity',
        type: 'error',
        impact: 'critical',
        wcagCriterion: '2.3.3',
        description: 'Animations non respectueuses des préférences de mouvement réduit',
        recommendation: 'Implémenter @media (prefers-reduced-motion: reduce) pour désactiver les animations',
        fixable: true,
      } : undefined,
    };
  };

  const checkTextSpacing = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    // Vérification basique de l'espacement du texte
    const textElements = document.querySelectorAll('p, div, span');
    let spacingIssues = 0;

    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const lineHeight = parseFloat(styles.lineHeight);
      const fontSize = parseFloat(styles.fontSize);
      
      if (lineHeight && fontSize && lineHeight / fontSize < 1.5) {
        spacingIssues++;
      }
    });

    const passed = spacingIssues < textElements.length * 0.2; // Tolérance de 20%
    
    return {
      passed,
      issue: !passed ? {
        id: 'text-spacing',
        type: 'warning',
        impact: 'moderate',
        wcagCriterion: '1.4.12',
        description: 'Espacement du texte insuffisant sur certains éléments',
        recommendation: 'Assurer une hauteur de ligne d\'au moins 1.5 fois la taille de police',
        fixable: true,
      } : undefined,
    };
  };

  const checkErrorIdentification = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    const errorElements = document.querySelectorAll('[aria-invalid="true"], .error, .invalid');
    const errorsWithMessages = Array.from(errorElements).filter(element => {
      return element.hasAttribute('aria-describedby') || 
             element.nextElementSibling?.textContent?.includes('error') ||
             element.nextElementSibling?.textContent?.includes('erreur');
    });

    const passed = errorElements.length === 0 || errorsWithMessages.length === errorElements.length;
    
    return {
      passed,
      issue: !passed ? {
        id: 'error-identification',
        type: 'error',
        impact: 'serious',
        wcagCriterion: '3.3.1',
        description: 'Erreurs non clairement identifiées',
        recommendation: 'Associer des messages d\'erreur clairs à chaque champ en erreur',
        fixable: true,
      } : undefined,
    };
  };

  const checkStatusMessages = async (): Promise<{ passed: boolean; issue?: AccessibilityIssue }> => {
    // Vérifier la présence de zones de statut pour les messages dynamiques
    const statusRegions = document.querySelectorAll('[role="status"], [role="alert"], [aria-live]');
    
    // Pour cette vérification, on considère que c'est correct si au moins une zone existe
    // ou s'il n'y a pas de contenu dynamique apparent
    const passed = statusRegions.length > 0;
    
    return {
      passed,
      issue: !passed ? {
        id: 'status-messages',
        type: 'warning',
        impact: 'moderate',
        wcagCriterion: '4.1.3',
        description: 'Aucune zone de statut pour les messages dynamiques',
        recommendation: 'Utiliser role="status" ou aria-live pour les messages dynamiques',
        fixable: true,
      } : undefined,
    };
  };

  // Fonction pour appliquer des corrections automatiques
  const autoFix = useCallback((issueId: string): boolean => {
    try {
      switch (issueId) {
        case 'alt-text':
          const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
          imagesWithoutAlt.forEach(img => {
            img.setAttribute('alt', 'Image decorative');
          });
          return true;

        case 'language-attribute':
          document.documentElement.setAttribute('lang', 'fr');
          return true;

        case 'focus-management':
          // Ajouter des styles de focus basiques
          const style = document.createElement('style');
          style.textContent = `
            *:focus {
              outline: 2px solid #0066cc !important;
              outline-offset: 2px !important;
            }
          `;
          document.head.appendChild(style);
          return true;

        default:
          return false;
      }
    } catch (error) {
      console.error('Erreur lors de la correction automatique:', error);
      return false;
    }
  }, []);

  return {
    report,
    isChecking,
    preferences,
    checkAccessibility,
    autoFix,
    
    // Utilitaires
    getScoreColor: (score: number) => {
      if (score >= 90) return 'green';
      if (score >= 70) return 'yellow'; 
      return 'red';
    },
    
    getImpactColor: (impact: string) => {
      switch (impact) {
        case 'critical': return 'red';
        case 'serious': return 'orange';
        case 'moderate': return 'yellow';
        case 'minor': return 'blue';
        default: return 'gray';
      }
    },
  };
}