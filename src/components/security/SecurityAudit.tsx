import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Eye, Lock, Key, Globe, Database } from 'lucide-react';

interface SecurityIssue {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'authentication' | 'data' | 'network' | 'client' | 'privacy';
  title: string;
  description: string;
  recommendation: string;
  fixed?: boolean;
}

interface SecurityMetrics {
  score: number;
  issues: SecurityIssue[];
  lastAudit: Date;
  certificates: {
    https: boolean;
    hsts: boolean;
    csp: boolean;
  };
}

export const SecurityAudit: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    score: 0,
    issues: [],
    lastAudit: new Date(),
    certificates: {
      https: false,
      hsts: false,
      csp: false
    }
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    runSecurityAudit();
  }, []);

  const runSecurityAudit = async () => {
    const issues: SecurityIssue[] = [];

    // Audit HTTPS et certificats
    const auditNetworkSecurity = () => {
      const isHTTPS = window.location.protocol === 'https:';
      const certificates = {
        https: isHTTPS,
        hsts: false,
        csp: false
      };

      if (!isHTTPS) {
        issues.push({
          id: 'no-https',
          type: 'critical',
          category: 'network',
          title: 'HTTPS non activé',
          description: 'Le site n\'utilise pas HTTPS, exposant les données à l\'interception',
          recommendation: 'Configurer HTTPS avec un certificat SSL/TLS valide'
        });
      }

      // Vérifier HSTS
      fetch(window.location.href, { method: 'HEAD' })
        .then(response => {
          const hstsHeader = response.headers.get('Strict-Transport-Security');
          certificates.hsts = !!hstsHeader;
          
          if (!hstsHeader) {
            issues.push({
              id: 'no-hsts',
              type: 'high',
              category: 'network',
              title: 'HSTS non configuré',
              description: 'Header Strict-Transport-Security manquant',
              recommendation: 'Configurer HSTS pour forcer l\'utilisation d\'HTTPS'
            });
          }

          // Vérifier CSP
          const cspHeader = response.headers.get('Content-Security-Policy');
          certificates.csp = !!cspHeader;
          
          if (!cspHeader) {
            issues.push({
              id: 'no-csp',
              type: 'high',
              category: 'client',
              title: 'CSP non configuré',
              description: 'Content Security Policy manquant, risque XSS élevé',
              recommendation: 'Implémenter une politique CSP stricte'
            });
          }
        })
        .catch(() => {
          // Erreur silencieuse pour l'audit
        });

      return certificates;
    };

    // Audit du stockage client
    const auditClientStorage = () => {
      // Vérifier localStorage pour des données sensibles
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key);
            if (value && (
              key.toLowerCase().includes('password') ||
              key.toLowerCase().includes('token') ||
              key.toLowerCase().includes('secret') ||
              value.includes('eyJ') // JWT potential
            )) {
              issues.push({
                id: `sensitive-localstorage-${key}`,
                type: 'high',
                category: 'data',
                title: 'Données sensibles en localStorage',
                description: `Clé "${key}" potentiellement sensible stockée en localStorage`,
                recommendation: 'Utiliser des cookies HTTPOnly ou sessionStorage pour les données sensibles'
              });
            }
          }
        }
      } catch (error) {
        // Erreur d'accès au storage
      }

      // Vérifier sessionStorage
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.toLowerCase().includes('password')) {
            issues.push({
              id: `sensitive-sessionstorage-${key}`,
              type: 'medium',
              category: 'data',
              title: 'Données sensibles en sessionStorage',
              description: `Clé "${key}" potentiellement sensible`,
              recommendation: 'Éviter de stocker des mots de passe côté client'
            });
          }
        }
      } catch (error) {
        // Erreur d'accès au storage
      }
    };

    // Audit des formulaires
    const auditForms = () => {
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      passwordInputs.forEach((input, index) => {
        const form = input.closest('form');
        if (form && !form.hasAttribute('autocomplete')) {
          issues.push({
            id: `form-autocomplete-${index}`,
            type: 'low',
            category: 'privacy',
            title: 'Autocomplete non défini sur les formulaires',
            description: 'Formulaire sans attribut autocomplete approprié',
            recommendation: 'Ajouter autocomplete="off" pour les données sensibles'
          });
        }

        if (!input.hasAttribute('autocomplete') || input.getAttribute('autocomplete') !== 'current-password') {
          issues.push({
            id: `password-autocomplete-${index}`,
            type: 'low',
            category: 'privacy',
            title: 'Autocomplete non optimisé pour les mots de passe',
            description: 'Champ mot de passe sans autocomplete approprié',
            recommendation: 'Utiliser autocomplete="current-password" ou "new-password"'
          });
        }
      });
    };

    // Audit des scripts externes
    const auditExternalScripts = () => {
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach((script, index) => {
        const src = script.getAttribute('src');
        if (src && !src.startsWith('/') && !src.startsWith(window.location.origin)) {
          if (!script.hasAttribute('integrity')) {
            issues.push({
              id: `script-integrity-${index}`,
              type: 'medium',
              category: 'client',
              title: 'Script externe sans intégrité',
              description: `Script ${src} chargé sans vérification d'intégrité`,
              recommendation: 'Ajouter l\'attribut integrity avec un hash SRI'
            });
          }

          if (!script.hasAttribute('crossorigin')) {
            issues.push({
              id: `script-crossorigin-${index}`,
              type: 'low',
              category: 'client',
              title: 'Script externe sans CORS',
              description: `Script ${src} sans attribut crossorigin`,
              recommendation: 'Ajouter crossorigin="anonymous" pour la sécurité CORS'
            });
          }
        }
      });
    };

    // Audit des cookies
    const auditCookies = () => {
      const cookies = document.cookie.split(';');
      cookies.forEach((cookie, index) => {
        const [name] = cookie.trim().split('=');
        if (name && (
          name.toLowerCase().includes('session') ||
          name.toLowerCase().includes('auth') ||
          name.toLowerCase().includes('token')
        )) {
          // Note: Impossible de vérifier HTTPOnly/Secure depuis JS
          issues.push({
            id: `cookie-security-${index}`,
            type: 'info',
            category: 'authentication',
            title: 'Cookie potentiellement sensible détecté',
            description: `Cookie "${name}" devrait être sécurisé`,
            recommendation: 'Vérifier que les cookies sensibles ont les flags HTTPOnly et Secure'
          });
        }
      });
    };

    // Audit de la politique de mot de passe
    const auditPasswordPolicy = () => {
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      if (passwordInputs.length > 0) {
        // Vérifier s'il y a des indications de politique de mot de passe
        const hasPasswordPolicy = document.querySelector('[data-password-policy], .password-requirements, #password-help');
        if (!hasPasswordPolicy) {
          issues.push({
            id: 'no-password-policy',
            type: 'medium',
            category: 'authentication',
            title: 'Politique de mot de passe non visible',
            description: 'Aucune indication visible des exigences de mot de passe',
            recommendation: 'Afficher clairement les critères de sécurité des mots de passe'
          });
        }
      }
    };

    // Exécuter tous les audits
    const certificates = auditNetworkSecurity();
    auditClientStorage();
    auditForms();
    auditExternalScripts();
    auditCookies();
    auditPasswordPolicy();

    // Calculer le score de sécurité
    const totalIssues = issues.length;
    const criticalCount = issues.filter(i => i.type === 'critical').length;
    const highCount = issues.filter(i => i.type === 'high').length;
    const mediumCount = issues.filter(i => i.type === 'medium').length;
    const lowCount = issues.filter(i => i.type === 'low').length;

    const score = Math.max(0, 100 - (
      criticalCount * 25 +
      highCount * 15 +
      mediumCount * 8 +
      lowCount * 3
    ));

    setMetrics({
      score: Math.round(score),
      issues,
      lastAudit: new Date(),
      certificates
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getIssueIcon = (type: SecurityIssue['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <Eye className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: SecurityIssue['category']) => {
    switch (category) {
      case 'authentication':
        return <Key className="h-4 w-4" />;
      case 'data':
        return <Database className="h-4 w-4" />;
      case 'network':
        return <Globe className="h-4 w-4" />;
      case 'client':
        return <Lock className="h-4 w-4" />;
      case 'privacy':
        return <Eye className="h-4 w-4" />;
    }
  };

  const filteredIssues = activeCategory === 'all' 
    ? metrics.issues 
    : metrics.issues.filter(issue => issue.category === activeCategory);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-36 right-4 z-40 p-2 bg-card border rounded-full shadow-lg hover:bg-accent transition-colors"
        title="Audit de sécurité"
      >
        <Shield className="h-4 w-4 text-card-foreground" />
      </button>

      {isVisible && (
        <div className="fixed bottom-48 right-4 z-40 w-96 bg-card border rounded-lg shadow-xl max-h-[600px] overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Audit de Sécurité
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor(metrics.score)}`}>
                  {metrics.score}
                </div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">
                  Dernière analyse: {metrics.lastAudit.toLocaleTimeString()}
                </div>
                <div className="flex gap-1">
                  <div className={`h-2 w-8 rounded ${metrics.certificates.https ? 'bg-green-500' : 'bg-red-500'}`} title="HTTPS" />
                  <div className={`h-2 w-8 rounded ${metrics.certificates.hsts ? 'bg-green-500' : 'bg-yellow-500'}`} title="HSTS" />
                  <div className={`h-2 w-8 rounded ${metrics.certificates.csp ? 'bg-green-500' : 'bg-yellow-500'}`} title="CSP" />
                </div>
              </div>
              
              <button
                onClick={runSecurityAudit}
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
              >
                Réanalyser
              </button>
            </div>
          </div>

          <div className="p-2 border-b">
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2 py-1 rounded ${activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                Tous ({metrics.issues.length})
              </button>
              {['authentication', 'data', 'network', 'client', 'privacy'].map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-2 py-1 rounded flex items-center gap-1 ${
                    activeCategory === category ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`}
                >
                  {getCategoryIcon(category as SecurityIssue['category'])}
                  {metrics.issues.filter(i => i.category === category).length}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {filteredIssues.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                Aucun problème détecté dans cette catégorie
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="p-3 bg-muted/50 rounded border">
                    <div className="flex items-start gap-2 mb-2">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-card-foreground">
                          {issue.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-1">
                          {issue.description}
                        </p>
                      </div>
                      {getCategoryIcon(issue.category)}
                    </div>
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      <strong>Recommandation:</strong> {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SecurityAudit;