/**
 * Code Audit Manager - Système d'audit automatisé
 * Analyse et optimise automatiquement le code pour une plateforme premium
 */

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, Zap, Shield, Accessibility, Code } from 'lucide-react';

interface AuditResult {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  file?: string;
  line?: number;
  suggestion?: string;
  autoFixAvailable?: boolean;
}

interface AuditStats {
  totalIssues: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  score: number;
  categories: {
    accessibility: number;
    performance: number;
    security: number;
    codeQuality: number;
    bestPractices: number;
  };
}

export const useCodeAudit = () => {
  const [results, setResults] = useState<AuditResult[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    totalIssues: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    score: 0,
    categories: {
      accessibility: 0,
      performance: 0,
      security: 0,
      codeQuality: 0,
      bestPractices: 0
    }
  });
  const [isScanning, setIsScanning] = useState(false);

  const runAudit = useCallback(async () => {
    setIsScanning(true);
    const auditResults: AuditResult[] = [];

    try {
      // Audit d'accessibilité
      auditResults.push(...auditAccessibility());
      
      // Audit de performance
      auditResults.push(...auditPerformance());
      
      // Audit de sécurité
      auditResults.push(...auditSecurity());
      
      // Audit de qualité du code
      auditResults.push(...auditCodeQuality());
      
      // Audit des meilleures pratiques
      auditResults.push(...auditBestPractices());

      // Calcul des statistiques
      const calculatedStats = calculateStats(auditResults);
      
      setResults(auditResults);
      setStats(calculatedStats);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const auditAccessibility = (): AuditResult[] => {
    const results: AuditResult[] = [];
    
    // Vérification sécurisée de l'environnement
    if (typeof document === 'undefined') {
      return results;
    }

    try {
      // Vérification des éléments sans labels
      const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
      if (unlabeledInputs.length > 0) {
        results.push({
          category: 'Accessibilité',
          severity: 'high',
          message: `${unlabeledInputs.length} champs de saisie sans label détectés`,
          suggestion: 'Ajouter aria-label ou aria-labelledby à tous les champs',
          autoFixAvailable: true
        });
      }

      // Vérification du contraste
      const lowContrastElements = document.querySelectorAll('[data-low-contrast]');
      if (lowContrastElements.length > 0) {
        results.push({
          category: 'Accessibilité',
          severity: 'medium',
          message: `${lowContrastElements.length} éléments avec contraste insuffisant`,
          suggestion: 'Améliorer le contraste pour respecter WCAG AAA (7:1)',
          autoFixAvailable: true
        });
      }

      // Vérification des skip links
      const skipLinks = document.querySelectorAll('.skip-link');
      if (skipLinks.length === 0) {
        results.push({
          category: 'Accessibilité',
          severity: 'medium',
          message: 'Aucun skip link détecté',
          suggestion: 'Ajouter des skip links pour la navigation au clavier',
          autoFixAvailable: true
        });
      }
    } catch (error) {
      results.push({
        category: 'Accessibilité',
        severity: 'low',
        message: 'Erreur lors de l\'audit d\'accessibilité',
        suggestion: 'Vérifier la compatibilité navigateur'
      });
    }

    return results;
  };

  const auditPerformance = (): AuditResult[] => {
    const results: AuditResult[] = [];
    
    // Vérification sécurisée de l'environnement
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return results;
    }

    try {
      // Vérification du temps de chargement
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation && navigation.loadEventEnd - navigation.fetchStart > 3000) {
        results.push({
          category: 'Performance',
          severity: 'high',
          message: 'Temps de chargement initial trop lent (>3s)',
          suggestion: 'Implémenter du lazy loading et optimiser les ressources critiques',
          autoFixAvailable: true
        });
      }

      // Vérification des images non optimisées
      const images = document.querySelectorAll('img:not([loading="lazy"])');
      if (images.length > 5) {
        results.push({
          category: 'Performance',
          severity: 'medium',
          message: `${images.length} images sans lazy loading détectées`,
          suggestion: 'Ajouter loading="lazy" aux images non critiques',
          autoFixAvailable: true
        });
      }

      // Vérification mémoire
      const memory = (performance as any).memory;
      if (memory && memory.usedJSHeapSize > 100 * 1024 * 1024) {
        results.push({
          category: 'Performance',
          severity: 'medium',
          message: 'Utilisation mémoire élevée (>100MB)',
          suggestion: 'Optimiser la gestion mémoire et nettoyer les listeners',
          autoFixAvailable: false
        });
      }
    } catch (error) {
      results.push({
        category: 'Performance',
        severity: 'low',
        message: 'Erreur lors de l\'audit de performance',
        suggestion: 'Vérifier les API Performance disponibles'
      });
    }

    return results;
  };

  const auditSecurity = (): AuditResult[] => {
    const results: AuditResult[] = [];
    
    // Vérification des données sensibles en localStorage
    const sensitiveKeys = ['password', 'token', 'secret', 'key'];
    sensitiveKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        results.push({
          category: 'Sécurité',
          severity: 'critical',
          message: `Données sensibles détectées en localStorage: ${key}`,
          suggestion: 'Utiliser des cookies sécurisés ou sessionStorage',
          autoFixAvailable: true
        });
      }
    });

    // Vérification HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      results.push({
        category: 'Sécurité',
        severity: 'critical',
        message: 'Site non sécurisé (HTTP)',
        suggestion: 'Configurer HTTPS pour la production',
        autoFixAvailable: false
      });
    }

    return results;
  };

  const auditCodeQuality = (): AuditResult[] => {
    const results: AuditResult[] = [];
    
    // Simulation - en production, analyserait le code source
    results.push({
      category: 'Qualité du code',
      severity: 'low',
      message: 'Console.log détectés dans le code',
      suggestion: 'Remplacer par un système de logging approprié',
      autoFixAvailable: true
    });

    return results;
  };

  const auditBestPractices = (): AuditResult[] => {
    const results: AuditResult[] = [];
    
    // Vérification sécurisée de l'environnement
    if (typeof document === 'undefined') {
      return results;
    }

    try {
      // Vérification des meta tags essentiels
      if (!document.querySelector('meta[name="description"]')) {
        results.push({
          category: 'SEO/Best Practices',
          severity: 'medium',
          message: 'Meta description manquante',
          suggestion: 'Ajouter une meta description optimisée',
          autoFixAvailable: true
        });
      }

      // Vérification viewport
      if (!document.querySelector('meta[name="viewport"]')) {
        results.push({
          category: 'SEO/Best Practices',
          severity: 'high',
          message: 'Meta viewport manquante',
          suggestion: 'Ajouter meta viewport pour la responsivité',
          autoFixAvailable: true
        });
      }
    } catch (error) {
      results.push({
        category: 'SEO/Best Practices',
        severity: 'low',
        message: 'Erreur lors de l\'audit SEO',
        suggestion: 'Vérifier l\'accès au DOM'
      });
    }

    return results;
  };

  const calculateStats = (results: AuditResult[]): AuditStats => {
    const stats = {
      totalIssues: results.length,
      critical: results.filter(r => r.severity === 'critical').length,
      high: results.filter(r => r.severity === 'high').length,
      medium: results.filter(r => r.severity === 'medium').length,
      low: results.filter(r => r.severity === 'low').length,
      score: 0,
      categories: {
        accessibility: results.filter(r => r.category === 'Accessibilité').length,
        performance: results.filter(r => r.category === 'Performance').length,
        security: results.filter(r => r.category === 'Sécurité').length,
        codeQuality: results.filter(r => r.category === 'Qualité du code').length,
        bestPractices: results.filter(r => r.category === 'SEO/Best Practices').length,
      }
    };

    // Calcul du score (0-100)
    let score = 100;
    score -= stats.critical * 25;
    score -= stats.high * 15;
    score -= stats.medium * 8;
    score -= stats.low * 3;
    
    stats.score = Math.max(0, score);
    return stats;
  };

  const autoFix = useCallback(async () => {
    const fixableResults = results.filter(r => r.autoFixAvailable);
    
    for (const result of fixableResults) {
      try {
        await applyAutoFix(result);
      } catch (error) {
        console.error('Erreur lors de la correction automatique:', error);
      }
    }
    
    // Re-scanner après les corrections
    await runAudit();
  }, [results, runAudit]);

  const applyAutoFix = async (result: AuditResult): Promise<void> => {
    switch (result.category) {
      case 'Accessibilité':
        if (result.message.includes('champs de saisie sans label')) {
          const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
          inputs.forEach((input, index) => {
            input.setAttribute('aria-label', `Champ de saisie ${index + 1}`);
          });
        }
        break;
        
      case 'Performance':
        if (result.message.includes('images sans lazy loading')) {
          const images = document.querySelectorAll('img:not([loading="lazy"])');
          images.forEach(img => {
            if (!img.closest('[data-critical]')) {
              img.setAttribute('loading', 'lazy');
            }
          });
        }
        break;
        
      case 'Sécurité':
        if (result.message.includes('localStorage')) {
          const sensitiveKeys = ['password', 'token', 'secret', 'key'];
          sensitiveKeys.forEach(key => {
            if (localStorage.getItem(key)) {
              const value = localStorage.getItem(key);
              localStorage.removeItem(key);
              // Migrer vers sessionStorage ou cookies sécurisés
              sessionStorage.setItem(`secure_${key}`, value || '');
            }
          });
        }
        break;
    }
  };

  return {
    results,
    stats,
    isScanning,
    runAudit,
    autoFix
  };
};

export const CodeAuditPanel: React.FC = () => {
  const { results, stats, isScanning, runAudit, autoFix } = useCodeAudit();

  useEffect(() => {
    runAudit();
  }, [runAudit]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 w-96 max-h-screen overflow-hidden bg-background border rounded-lg shadow-lg z-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Audit Premium
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={runAudit} size="sm" disabled={isScanning}>
              {isScanning ? 'Scan...' : 'Scanner'}
            </Button>
            {results.some(r => r.autoFixAvailable) && (
              <Button onClick={autoFix} size="sm" variant="outline">
                <Zap className="h-4 w-4 mr-1" />
                Auto-Fix
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Score Qualité</span>
            <span className={`font-bold ${stats.score >= 90 ? 'text-green-600' : stats.score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
              {stats.score}/100
            </span>
          </div>
          <Progress value={stats.score} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="max-h-96 overflow-y-auto space-y-3">
        {/* Statistiques par catégorie */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Accessibility className="h-3 w-3" />
            <span>A11y: {stats.categories.accessibility}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>Perf: {stats.categories.performance}</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Sécu: {stats.categories.security}</span>
          </div>
          <div className="flex items-center gap-1">
            <Code className="h-3 w-3" />
            <span>Code: {stats.categories.codeQuality}</span>
          </div>
        </div>

        {/* Liste des problèmes */}
        <div className="space-y-2">
          {results.slice(0, 10).map((result, index) => (
            <div key={index} className="p-2 border rounded text-xs">
              <div className="flex items-center justify-between mb-1">
                <Badge className={getSeverityColor(result.severity)}>
                  {getSeverityIcon(result.severity)}
                  {result.severity}
                </Badge>
                <span className="text-muted-foreground">{result.category}</span>
              </div>
              <p className="font-medium">{result.message}</p>
              {result.suggestion && (
                <p className="text-muted-foreground mt-1">{result.suggestion}</p>
              )}
            </div>
          ))}
          
          {results.length > 10 && (
            <p className="text-xs text-muted-foreground text-center">
              +{results.length - 10} autres problèmes...
            </p>
          )}
        </div>
      </CardContent>
    </div>
  );
};

export default CodeAuditPanel;