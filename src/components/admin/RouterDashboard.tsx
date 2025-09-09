import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ROUTES_REGISTRY } from '@/routerV2/registry';
import { 
  FileText, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  ExternalLink,
  Route,
  Component,
  Wrench
} from 'lucide-react';

export default function RouterDashboard() {
  const totalRoutes = ROUTES_REGISTRY.length;
  const publicRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'public').length;
  const protectedRoutes = ROUTES_REGISTRY.filter(r => r.guard === true).length;
  const deprecatedRoutes = ROUTES_REGISTRY.filter(r => r.deprecated === true).length;
  const b2cRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'consumer').length;
  const b2bRoutes = ROUTES_REGISTRY.filter(r => r.segment === 'employee' || r.segment === 'manager').length;

  const uniqueComponents = new Set(ROUTES_REGISTRY.map(r => r.component)).size;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Router</h1>
          <p className="text-muted-foreground">
            Tableau de bord centralisé pour l'audit et la gestion du routage
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          RouterV2 Active
        </Badge>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Route className="h-4 w-4" />
              Total Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoutes}</div>
            <p className="text-xs text-muted-foreground">
              Routes configurées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Component className="h-4 w-4" />
              Composants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueComponents}</div>
            <p className="text-xs text-muted-foreground">
              Composants uniques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Protégées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{protectedRoutes}</div>
            <p className="text-xs text-muted-foreground">
              Routes avec authentification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Dépréciées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deprecatedRoutes}</div>
            <p className="text-xs text-muted-foreground">
              Routes obsolètes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par segment */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par segment</CardTitle>
          <CardDescription>
            Distribution des routes par type d'utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{publicRoutes}</div>
              <p className="text-sm text-muted-foreground">Routes publiques</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{b2cRoutes}</div>
              <p className="text-sm text-muted-foreground">Routes B2C</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{b2bRoutes}</div>
              <p className="text-sm text-muted-foreground">Routes B2B</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{totalRoutes - publicRoutes - b2cRoutes - b2bRoutes}</div>
              <p className="text-sm text-muted-foreground">Autres</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outils d'audit */}
      <Card>
        <CardHeader>
          <CardTitle>Outils d'audit et vérification</CardTitle>
          <CardDescription>
            Accès aux différents audits du système de routage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Audit Router
                </CardTitle>
                <CardDescription>
                  Vérification de l'intégrité et configuration des routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/dev/router-audit">
                    Accéder à l'audit
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  • Configuration des routes<br/>
                  • Vérification des guards<br/>
                  • Détection des doublons
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Component className="h-4 w-4" />
                  Audit Composants
                </CardTitle>
                <CardDescription>
                  Vérification de l'existence des composants référencés
                </CardDescription>
              </CardHeader>
              <CardContent>
              <Button asChild className="w-full">
                <Link to="/dev/complete-audit">
                  Audit Complet des 90 Composants
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                • Vérification exhaustive<br/>
                • Détection des manquants<br/>
                • Rapport détaillé avec export
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Rapport Final
              </CardTitle>
              <CardDescription>
                Résumé complet de la vérification des composants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" variant="outline">
                <Link to="/dev/final-report">
                  Voir le Rapport Final
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Routes par layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Routes par layout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['marketing', 'app', 'simple'].map(layout => {
                const count = ROUTES_REGISTRY.filter(r => r.layout === layout).length;
                return (
                  <div key={layout} className="flex justify-between items-center">
                    <span className="capitalize">{layout}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Exporter la configuration
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Rapport de performance
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Wrench className="h-4 w-4 mr-2" />
                Validation des routes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes importantes */}
      {deprecatedRoutes > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Attention: Routes dépréciées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 text-sm">
              {deprecatedRoutes} route(s) sont marquées comme dépréciées et devraient être supprimées ou redirigées.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}