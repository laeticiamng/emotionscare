
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, Eye, Monitor, Smartphone, RefreshCw } from 'lucide-react';
import { UNIFIED_ROUTES, validateUniqueRoutes } from '@/utils/routeUtils';
import { validateRouteAccess } from '@/utils/routeValidation';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

interface PageAuditResult {
  route: string;
  accessible: boolean;
  hasContent: boolean;
  loadTime: number;
  errors: string[];
  warnings: string[];
  score: number;
}

interface AuditSummary {
  totalPages: number;
  accessiblePages: number;
  pagesWithContent: number;
  averageLoadTime: number;
  totalErrors: number;
  totalWarnings: number;
  overallScore: number;
}

const PageAuditTool: React.FC = () => {
  const [auditResults, setAuditResults] = useState<PageAuditResult[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const { user, isAuthenticated } = useAuth();
  const { userMode } = useUserMode();

  const auditAllPages = async () => {
    setIsAuditing(true);
    const results: PageAuditResult[] = [];
    
    try {
      const routes = Object.values(UNIFIED_ROUTES);
      
      for (const route of routes) {
        const result = await auditSinglePage(route);
        results.push(result);
      }
      
      setAuditResults(results);
      calculateSummary(results);
      
    } catch (error) {
      console.error('Erreur lors de l\'audit:', error);
    } finally {
      setIsAuditing(false);
    }
  };

  const auditSinglePage = async (route: string): Promise<PageAuditResult> => {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Vérification de l'accès à la route
    const routeValidation = validateRouteAccess(route, isAuthenticated, user?.role || userMode);
    
    if (!routeValidation.isValid) {
      errors.push(`Route inaccessible: ${routeValidation.errorMessage}`);
    }
    
    // Simulation de navigation vers la page
    let hasContent = true;
    let accessible = routeValidation.hasAccess;
    
    try {
      // Vérification du contenu (simulation)
      if (route.includes('/dashboard') && !isAuthenticated) {
        hasContent = false;
        errors.push('Page dashboard nécessite une authentification');
      }
      
      // Vérifications spécifiques par type de route
      if (route.includes('/admin') && user?.role !== 'b2b_admin') {
        accessible = false;
        errors.push('Accès administrateur requis');
      }
      
      // Simulation de temps de chargement
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      
    } catch (error) {
      errors.push(`Erreur de chargement: ${error}`);
      hasContent = false;
    }
    
    const loadTime = performance.now() - startTime;
    
    // Calcul du score
    let score = 100;
    if (!accessible) score -= 50;
    if (!hasContent) score -= 30;
    if (loadTime > 200) score -= 10;
    if (errors.length > 0) score -= errors.length * 5;
    if (warnings.length > 0) score -= warnings.length * 2;
    
    return {
      route,
      accessible,
      hasContent,
      loadTime,
      errors,
      warnings,
      score: Math.max(0, score)
    };
  };

  const calculateSummary = (results: PageAuditResult[]) => {
    const totalPages = results.length;
    const accessiblePages = results.filter(r => r.accessible).length;
    const pagesWithContent = results.filter(r => r.hasContent).length;
    const averageLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / totalPages;
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    const overallScore = results.reduce((sum, r) => sum + r.score, 0) / totalPages;
    
    setSummary({
      totalPages,
      accessiblePages,
      pagesWithContent,
      averageLoadTime,
      totalErrors,
      totalWarnings,
      overallScore
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  useEffect(() => {
    // Audit automatique au montage
    auditAllPages();
  }, [isAuthenticated, user, userMode]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <span>Audit Complet des Pages</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex border rounded-lg">
                <Button
                  variant={selectedDevice === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDevice('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedDevice === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDevice('tablet')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={selectedDevice === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={auditAllPages} disabled={isAuditing}>
                {isAuditing ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {isAuditing ? 'Audit en cours...' : 'Lancer l\'audit'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {summary && (
            <div className="space-y-6">
              {/* Résumé global */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{summary.totalPages}</div>
                    <div className="text-sm text-muted-foreground">Pages totales</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{summary.accessiblePages}</div>
                    <div className="text-sm text-muted-foreground">Accessibles</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{summary.pagesWithContent}</div>
                    <div className="text-sm text-muted-foreground">Avec contenu</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(summary.overallScore)}`}>
                      {Math.round(summary.overallScore)}
                    </div>
                    <div className="text-sm text-muted-foreground">Score global</div>
                  </div>
                </Card>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Qualité globale</span>
                  <span>{Math.round(summary.overallScore)}/100</span>
                </div>
                <Progress value={summary.overallScore} className="h-3" />
              </div>

              {/* Alertes globales */}
              {summary.totalErrors > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription>
                    <strong>{summary.totalErrors} erreurs</strong> détectées nécessitant une correction immédiate
                  </AlertDescription>
                </Alert>
              )}
              
              {summary.totalWarnings > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription>
                    <strong>{summary.totalWarnings} avertissements</strong> à prendre en compte
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats détaillés */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes les pages</TabsTrigger>
          <TabsTrigger value="errors">Avec erreurs</TabsTrigger>
          <TabsTrigger value="warnings">Avec avertissements</TabsTrigger>
          <TabsTrigger value="perfect">Parfaites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {auditResults.map((result, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{result.route}</h4>
                      <Badge 
                        variant={getScoreBadgeVariant(result.score)}
                        className="text-xs"
                      >
                        {result.score}/100
                      </Badge>
                      {result.accessible ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span>Temps: {Math.round(result.loadTime)}ms</span>
                      <span>Contenu: {result.hasContent ? '✓' : '✗'}</span>
                      <span>Accès: {result.accessible ? '✓' : '✗'}</span>
                    </div>
                  </div>
                </div>
                
                {(result.errors.length > 0 || result.warnings.length > 0) && (
                  <div className="mt-4 space-y-2">
                    {result.errors.map((error, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm text-red-600">
                        <XCircle className="h-3 w-3" />
                        <span>{error}</span>
                      </div>
                    ))}
                    {result.warnings.map((warning, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm text-yellow-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="errors">
          {auditResults.filter(r => r.errors.length > 0).map((result, index) => (
            <Card key={index} className="border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <h4 className="font-medium">{result.route}</h4>
                </div>
                {result.errors.map((error, i) => (
                  <div key={i} className="text-sm text-red-600 ml-6">• {error}</div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="warnings">
          {auditResults.filter(r => r.warnings.length > 0).map((result, index) => (
            <Card key={index} className="border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <h4 className="font-medium">{result.route}</h4>
                </div>
                {result.warnings.map((warning, i) => (
                  <div key={i} className="text-sm text-yellow-600 ml-6">• {warning}</div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="perfect">
          {auditResults.filter(r => r.score >= 95 && r.errors.length === 0).map((result, index) => (
            <Card key={index} className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium">{result.route}</h4>
                  <Badge variant="default" className="bg-green-500">
                    Parfait
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageAuditTool;
