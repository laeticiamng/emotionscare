
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Search, CheckCircle, AlertTriangle, XCircle, 
  Eye, Shield, Route, Globe 
} from 'lucide-react';
import { UNIFIED_ROUTES } from '@/utils/routeUtils';
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
  status: 'success' | 'warning' | 'error';
}

const PageAuditTool: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { userMode } = useUserMode();
  const [auditResults, setAuditResults] = useState<PageAuditResult[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [progress, setProgress] = useState(0);

  const allRoutes = Object.values(UNIFIED_ROUTES);

  const auditPage = async (route: string): Promise<PageAuditResult> => {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation d'accès
    const accessValidation = validateRouteAccess(
      route,
      isAuthenticated,
      user?.role || userMode
    );

    if (!accessValidation.hasAccess) {
      errors.push('Accès refusé pour ce rôle utilisateur');
    }

    // Simulation de vérification de contenu
    let hasContent = true;
    try {
      // Vérifier si la route existe dans le routeur
      if (!allRoutes.includes(route as any)) {
        errors.push('Route non définie dans le routeur');
        hasContent = false;
      }
    } catch (error) {
      errors.push('Erreur lors du chargement de la page');
      hasContent = false;
    }

    const loadTime = performance.now() - startTime;

    if (loadTime > 2000) {
      warnings.push('Temps de chargement élevé (>2s)');
    }

    const status: PageAuditResult['status'] = 
      errors.length > 0 ? 'error' : 
      warnings.length > 0 ? 'warning' : 'success';

    return {
      route,
      accessible: accessValidation.hasAccess,
      hasContent,
      loadTime,
      errors,
      warnings,
      status
    };
  };

  const runFullAudit = async () => {
    setIsAuditing(true);
    setProgress(0);
    const results: PageAuditResult[] = [];

    for (let i = 0; i < allRoutes.length; i++) {
      const route = allRoutes[i];
      const result = await auditPage(route);
      results.push(result);
      setProgress(((i + 1) / allRoutes.length) * 100);
      
      // Délai pour éviter de surcharger
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setAuditResults(results);
    setIsAuditing(false);
  };

  const getStatusIcon = (status: PageAuditResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: PageAuditResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
    }
  };

  const successCount = auditResults.filter(r => r.status === 'success').length;
  const warningCount = auditResults.filter(r => r.status === 'warning').length;
  const errorCount = auditResults.filter(r => r.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* En-tête d'audit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Audit Complet des Pages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Utilisateur: {user?.role || userMode || 'Non connecté'}
              </p>
              <p className="text-sm text-muted-foreground">
                Pages à vérifier: {allRoutes.length}
              </p>
            </div>
            <Button 
              onClick={runFullAudit} 
              disabled={isAuditing}
            >
              {isAuditing ? 'Audit en cours...' : 'Lancer l\'audit'}
            </Button>
          </div>

          {isAuditing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {Math.round(progress)}% terminé
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats de l'audit */}
      {auditResults.length > 0 && (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">{successCount}</div>
                <div className="text-sm text-green-600">Succès</div>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-700">{warningCount}</div>
                <div className="text-sm text-yellow-600">Avertissements</div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-700">{errorCount}</div>
                <div className="text-sm text-red-600">Erreurs</div>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <Globe className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">{auditResults.length}</div>
                <div className="text-sm text-blue-600">Total</div>
              </CardContent>
            </Card>
          </div>

          {/* Détails des résultats */}
          <Card>
            <CardHeader>
              <CardTitle>Détails de l'Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditResults.map((result, index) => (
                  <motion.div
                    key={result.route}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                            {result.route}
                          </code>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {result.accessible ? 'Accessible' : 'Bloqué'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {result.hasContent ? 'Contenu OK' : 'Vide'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Route className="h-3 w-3" />
                              {result.loadTime.toFixed(0)}ms
                            </span>
                          </div>
                          
                          {result.errors.length > 0 && (
                            <div className="text-red-600">
                              Erreurs: {result.errors.join(', ')}
                            </div>
                          )}
                          
                          {result.warnings.length > 0 && (
                            <div className="text-yellow-600">
                              Avertissements: {result.warnings.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default PageAuditTool;
