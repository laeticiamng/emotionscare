
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Rocket } from 'lucide-react';
import { validateProduction, type ProductionCheckResult } from '@/utils/productionValidator';

const ProductionAudit: React.FC = () => {
  const [auditResults, setAuditResults] = useState<{
    results: ProductionCheckResult[];
    overallScore: number;
    readyForProduction: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const results = await validateProduction();
      setAuditResults(results);
    } catch (error) {
      console.error('Erreur lors de l\'audit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAudit();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'success';
      case 'almost-ready':
        return 'warning';
      case 'not-ready':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Audit de production en cours...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Vérification de tous les systèmes critiques
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {/* En-tête de l'audit */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-2xl">Audit de Production EmotionsCare</CardTitle>
                <p className="text-muted-foreground">
                  Vérification complète de la préparation au lancement
                </p>
              </div>
            </div>
            <Button onClick={runAudit} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Relancer l'audit
            </Button>
          </div>
        </CardHeader>
        
        {auditResults && (
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">{auditResults.overallScore}/100</div>
                <div>
                  <Badge 
                    variant={auditResults.readyForProduction ? 'default' : 'destructive'}
                    className="mb-2"
                  >
                    {auditResults.readyForProduction ? '✅ PRÊT POUR PRODUCTION' : '⚠️ CORRECTIONS REQUISES'}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Score global de préparation
                  </p>
                </div>
              </div>
              <Progress value={auditResults.overallScore} className="w-48" />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Résultats détaillés par catégorie */}
      {auditResults?.results.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {category.category}
                <Badge variant={getStatusColor(category.overallStatus)}>
                  {category.score}/100
                </Badge>
              </CardTitle>
              <Progress value={category.score} className="w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {category.checks.map((check, checkIndex) => (
                <div 
                  key={checkIndex}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    check.status === 'error' ? 'border-red-200 bg-red-50' :
                    check.status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {check.name}
                        {check.critical && (
                          <Badge variant="outline" className="text-xs">
                            CRITIQUE
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {check.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Recommandations finales */}
      {auditResults && (
        <Card>
          <CardHeader>
            <CardTitle>Recommandations pour le lancement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditResults.readyForProduction ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-green-800">Application prête pour la production !</span>
                  </div>
                  <p className="text-green-700 text-sm">
                    Tous les systèmes critiques sont opérationnels. L'application peut être lancée en production.
                  </p>
                  <div className="mt-3 text-sm text-green-600">
                    <p><strong>✅ Processus d'inscription complet</strong> - De la création de compte à la confirmation email</p>
                    <p><strong>✅ Toutes les fonctionnalités métier</strong> - Scan, journal, coach, musique, gamification</p>
                    <p><strong>✅ Sécurité et authentification</strong> - RLS, protection des routes, gestion des rôles</p>
                    <p><strong>✅ Backend complet</strong> - 13 Edge Functions, base de données, APIs</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold text-yellow-800">Corrections requises avant le lancement</span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Quelques ajustements sont nécessaires avant la mise en production.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Actions avant lancement</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Configurer les URLs de redirection Supabase</li>
                    <li>• Tester le processus complet d'inscription</li>
                    <li>• Valider les emails de confirmation</li>
                    <li>• Test des 3 types de comptes</li>
                  </ul>
                </div>
                
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Optimisations post-lancement</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Monitoring et métriques avancées</li>
                    <li>• Tests automatisés E2E</li>
                    <li>• Documentation utilisateur</li>
                    <li>• Stratégie de backup</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionAudit;
