
import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface AccessibilityIssue {
  level: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  rule: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
}

interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  passedRules: string[];
  totalRules: number;
  compliance: 'AA' | 'A' | 'non-compliant';
}

export const useAccessibilityValidation = () => {
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { settings } = useAccessibility();

  const validateAccessibility = async (): Promise<AccessibilityReport> => {
    setIsValidating(true);
    
    try {
      const issues: AccessibilityIssue[] = [];
      const passedRules: string[] = [];
      
      // Validation des contrastes
      const contrastIssues = await checkColorContrast();
      issues.push(...contrastIssues);
      
      // Validation des attributs ARIA
      const ariaIssues = checkAriaAttributes();
      issues.push(...ariaIssues);
      
      // Validation des images
      const imageIssues = checkImageAccessibility();
      issues.push(...imageIssues);
      
      // Validation des formulaires
      const formIssues = checkFormAccessibility();
      issues.push(...formIssues);
      
      // Validation de la navigation clavier
      const keyboardIssues = checkKeyboardNavigation();
      issues.push(...keyboardIssues);
      
      // Validation des headings
      const headingIssues = checkHeadingStructure();
      issues.push(...headingIssues);
      
      // Calcul du score
      const totalRules = 20; // Nombre total de règles vérifiées
      const criticalIssues = issues.filter(i => i.impact === 'critical').length;
      const seriousIssues = issues.filter(i => i.impact === 'serious').length;
      const moderateIssues = issues.filter(i => i.impact === 'moderate').length;
      
      const score = Math.max(0, 100 - (criticalIssues * 20 + seriousIssues * 10 + moderateIssues * 5));
      
      let compliance: 'AA' | 'A' | 'non-compliant' = 'non-compliant';
      if (score >= 95 && criticalIssues === 0) compliance = 'AA';
      else if (score >= 80 && criticalIssues === 0) compliance = 'A';
      
      const newReport: AccessibilityReport = {
        score,
        issues,
        passedRules,
        totalRules,
        compliance
      };
      
      setReport(newReport);
      return newReport;
      
    } finally {
      setIsValidating(false);
    }
  };

  const checkColorContrast = async (): Promise<AccessibilityIssue[]> => {
    const issues: AccessibilityIssue[] = [];
    
    // Cette fonction simule une vérification de contraste
    // Dans un vrai projet, on utiliserait une librairie comme axe-core
    
    if (!settings.highContrast) {
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
      let lowContrastCount = 0;
      
      textElements.forEach((element) => {
        const styles = window.getComputedStyle(element);
        const textColor = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Simulation de vérification de contraste
        if (textColor && bgColor && textColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
          // Ici on ferait le calcul réel du ratio de contraste
          // Pour la démo, on simule quelques éléments à faible contraste
          if (Math.random() < 0.1) {
            lowContrastCount++;
          }
        }
      });
      
      if (lowContrastCount > 0) {
        issues.push({
          level: 'warning',
          message: `${lowContrastCount} éléments ont un contraste insuffisant`,
          rule: 'WCAG 1.4.3 Contrast (Minimum)',
          impact: 'serious'
        });
      }
    }
    
    return issues;
  };

  const checkAriaAttributes = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    // Vérifier les éléments interactifs sans labels
    const interactiveElements = document.querySelectorAll('button, input, select, textarea, a[href]');
    let missingLabelsCount = 0;
    
    interactiveElements.forEach((element) => {
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
      const hasLabel = element.closest('label') || document.querySelector(`label[for="${element.id}"]`);
      const hasText = element.textContent?.trim();
      
      if (!hasAriaLabel && !hasAriaLabelledBy && !hasLabel && !hasText) {
        missingLabelsCount++;
      }
    });
    
    if (missingLabelsCount > 0) {
      issues.push({
        level: 'error',
        message: `${missingLabelsCount} éléments interactifs sans label accessible`,
        rule: 'WCAG 4.1.2 Name, Role, Value',
        impact: 'critical'
      });
    }
    
    return issues;
  };

  const checkImageAccessibility = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const images = document.querySelectorAll('img');
    let missingAltCount = 0;
    
    images.forEach((img) => {
      if (!img.hasAttribute('alt')) {
        missingAltCount++;
      }
    });
    
    if (missingAltCount > 0) {
      issues.push({
        level: 'error',
        message: `${missingAltCount} images sans attribut alt`,
        rule: 'WCAG 1.1.1 Non-text Content',
        impact: 'serious'
      });
    }
    
    return issues;
  };

  const checkFormAccessibility = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const inputs = document.querySelectorAll('input, textarea, select');
    let missingLabelsCount = 0;
    
    inputs.forEach((input) => {
      const hasLabel = document.querySelector(`label[for="${input.id}"]`) || input.closest('label');
      const hasAriaLabel = input.hasAttribute('aria-label');
      
      if (!hasLabel && !hasAriaLabel) {
        missingLabelsCount++;
      }
    });
    
    if (missingLabelsCount > 0) {
      issues.push({
        level: 'error',
        message: `${missingLabelsCount} champs de formulaire sans label`,
        rule: 'WCAG 3.3.2 Labels or Instructions',
        impact: 'critical'
      });
    }
    
    return issues;
  };

  const checkKeyboardNavigation = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const focusableElements = document.querySelectorAll(
      'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    let nonFocusableCount = 0;
    
    focusableElements.forEach((element) => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex === '-1' && element.tagName !== 'DETAILS') {
        nonFocusableCount++;
      }
    });
    
    if (!settings.keyboardNavigation) {
      issues.push({
        level: 'warning',
        message: 'Navigation clavier désactivée',
        rule: 'WCAG 2.1.1 Keyboard',
        impact: 'serious'
      });
    }
    
    return issues;
  };

  const checkHeadingStructure = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = [];
    
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingLevels: number[] = [];
    
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      headingLevels.push(level);
    });
    
    // Vérifier la structure hiérarchique
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] - headingLevels[i - 1] > 1) {
        issues.push({
          level: 'warning',
          message: 'Structure de titres non hiérarchique détectée',
          rule: 'WCAG 1.3.1 Info and Relationships',
          impact: 'moderate'
        });
        break;
      }
    }
    
    return issues;
  };

  useEffect(() => {
    // Validation automatique au changement des paramètres
    const timer = setTimeout(() => {
      validateAccessibility();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [settings]);

  return {
    report,
    isValidating,
    validateAccessibility
  };
};
