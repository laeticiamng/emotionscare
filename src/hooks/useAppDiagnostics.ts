// @ts-nocheck

import { useState, useEffect } from 'react';

interface DiagnosticResult {
  isHealthy: boolean;
  issues: string[];
  recommendations: string[];
}

export const useAppDiagnostics = () => {
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult>({
    isHealthy: true,
    issues: [],
    recommendations: []
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check for React hydration issues
      if (typeof window !== 'undefined') {
        const root = document.getElementById('root');
        if (!root || root.children.length === 0) {
          issues.push('DOM root element is empty');
          recommendations.push('Vérifier le montage des composants React');
        }
      }

      // Check for routing issues
      try {
        const currentPath = window.location.pathname;
        if (currentPath === '/') {
          // Check if home page components are properly mounted
          const homeIndicators = document.querySelectorAll('[data-testid="page-root"]');
          if (homeIndicators.length === 0) {
            issues.push('Page home components not found');
            recommendations.push('Vérifier les composants de la page d\'accueil');
          }
        }
      } catch (error) {
        issues.push('Router diagnostic failed');
        recommendations.push('Vérifier la configuration du routeur');
      }

      // Check for CSS/styling issues
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
        issues.push('Body element is hidden');
        recommendations.push('Vérifier les styles CSS du body');
      }

      // Check for JavaScript errors
      let jsErrors = 0;
      const originalError = window.onerror;
      window.onerror = (message, source, lineno, colno, error) => {
        jsErrors++;
        if (originalError) originalError(message, source, lineno, colno, error);
        return false;
      };

      setTimeout(() => {
        if (jsErrors > 0) {
          issues.push(`${jsErrors} JavaScript errors detected`);
          recommendations.push('Vérifier la console pour les erreurs JavaScript');
        }
      }, 1000);

      setDiagnostic({
        isHealthy: issues.length === 0,
        issues,
        recommendations
      });
    };

    runDiagnostics();
  }, []);

  return diagnostic;
};
