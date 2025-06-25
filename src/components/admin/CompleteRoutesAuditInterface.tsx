
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw,
  Play,
  Zap,
  Clock,
  Users,
  Shield,
  Gamepad2,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { completeRoutesAuditor, RouteAuditItem, OFFICIAL_ROUTES_LIST } from '@/utils/completeRoutesAudit';
import { motion } from 'framer-motion';

const CompleteRoutesAuditInterface: React.FC = () => {
  const [auditResults, setAuditResults] = useState<RouteAuditItem[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  const runCompleteAudit = async () => {
    setIsAuditing(true);
    try {
      const results = await completeRoutesAuditor.auditAllRoutes();
      setAuditResults(results);
    } catch (error) {
      console.error('Erreur lors de l\'audit:', error);
    } finally {
      setIsAuditing(false);
    }
  };

  const testSingleRoute = async (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error(`Erreur navigation vers ${path}:`, error);
    }
  };

  const getStatusIcon = (status: RouteAuditItem['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'public': return <ExternalLink className="h-4 w-4" />;
      case 'b2c': return <Users className="h-4 w-4" />;
      case 'b2b_user': return <Users className="h-4 w-4" />;
      case 'b2b_admin': return <Shield className="h-4 w-4" />;
      case 'feature': return <Zap className="h-4 w-4" />;
      case 'gamification': return <Gamepad2 className="h-4 w-4" />;
      case 'privacy': return <Settings className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  const summary = auditResults.length > 0 ? completeRoutesAuditor.getAuditSummary() : null;
  const routesByCategory = auditResults.length > 0 ? completeRoutesAuditor.getRoutesByCategory() : {};

  const filteredRoutes = selectedCategory === 'all' 
    ? auditResults 
    : routesByCategory[selectedCategory] || [];

  return (
    <div className="space-y-6">
      {/* Header avec actions principales */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Audit Complet des 52 Routes Officielles
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Vérification complète de toutes les routes, pages et accessibilité
              </p>
            </div>
            <Button 
              onClick={runCompleteAudit} 
              disabled={isAuditing}
              className="flex items-center gap-2"
            >
              {isAuditing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isAuditing ? 'Audit en cours...' : 'Lancer l\'audit complet'}
            </Button>
          </div>
        </CardHeader>
        
        {/* Résumé global */}
        {summary && (
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.success}</div>
                <div className="text-xs text-muted-foreground">Succès</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{summary.warnings}</div>
                <div className="text-xs text-muted-foreground">Avertissements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.errors}</div>
                <div className="text-xs text-muted-foreground">Erreurs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.successRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Taux de succès</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.avgLoadTime.toFixed(0)}ms</div>
                <div className="text-xs text-muted-foreground">Temps moyen</div>
              </div>
            </div>
            
            <Progress value={summary.successRate} className="h-2" />
            
            <div className="flex justify-center mt-4">
              <Badge 
                variant={summary.overallStatus === 'excellent' ? 'default' : 
                        summary.overallStatus === 'good' ? 'secondary' : 'destructive'}
                className="text-sm"
              >
                {summary.overallStatus === 'excellent' ? '🎉 Excellent' :
                 summary.overallStatus === 'good' ? '✅ Bon' : '⚠️ Attention requise'}
              </Badge>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Interface de test des routes */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="public">Publiques</TabsTrigger>
          <TabsTrigger value="b2c">B2C</TabsTrigger>
          <TabsTrigger value="b2b_user">B2B User</TabsTrigger>
          <TabsTrigger value="b2b_admin">B2B Admin</TabsTrigger>
          <TabsTrigger value="feature">Features</TabsTrigger>
          <TabsTrigger value="gamification">Games</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {auditResults.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Aucun audit n'a encore été effectué
                </p>
                <Button onClick={runCompleteAudit} variant="outline">
                  Lancer le premier audit
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {filteredRoutes.map((route) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: route.id * 0.02 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(route.status)}
                          {getCategoryIcon(route.category)}
                          <div>
                            <div className="font-medium">{route.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {route.path}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {route.loadTime.toFixed(0)}ms
                          </Badge>
                          
                          {route.requiresAuth && (
                            <Badge variant="secondary" className="text-xs">
                              🔒 Auth
                            </Badge>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => testSingleRoute(route.path)}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Tester
                          </Button>
                        </div>
                      </div>
                      
                      {route.errorMessage && (
                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                          {route.errorMessage}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Actions Rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Accueil
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/b2c/dashboard')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Dashboard B2C
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/b2b/admin/dashboard')}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Dashboard Admin
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/gamification')}
              className="flex items-center gap-2"
            >
              <Gamepad2 className="h-4 w-4" />
              Gamification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteRoutesAuditInterface;
