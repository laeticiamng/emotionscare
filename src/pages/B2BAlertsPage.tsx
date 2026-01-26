// @ts-nocheck
/**
 * B2BAlertsPage - Gestion des alertes RH B2B
 * Alertes anonymisées pour le bien-être des équipes
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Bell, 
  BellOff,
  CheckCircle,
  Clock,
  Settings,
  HelpCircle,
  RefreshCw,
  Loader2,
  Shield,
  Users,
  Building2,
  Filter,
  Eye,
  Archive,
} from 'lucide-react';
import { useB2BAlerts } from '@/hooks/useB2BAlerts';
import { usePageSEO } from '@/hooks/usePageSEO';
import { cn } from '@/lib/utils';

const B2BAlertsPage: React.FC = () => {
  const { data, loading, refetch, resolveAlert, archiveAlert } = useB2BAlerts();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

  usePageSEO({
    title: 'Alertes RH B2B - EmotionsCare',
    description: 'Gérez les alertes de bien-être anonymisées de vos équipes',
    keywords: 'alertes, RH, bien-être, équipes',
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-destructive/50 bg-destructive/5';
      case 'high': return 'border-warning/50 bg-warning/5';
      case 'medium': return 'border-info/50 bg-info/5';
      default: return 'border-muted';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critique</Badge>;
      case 'high': return <Badge className="bg-warning/10 text-warning border-warning/30">Haute</Badge>;
      case 'medium': return <Badge variant="secondary">Moyenne</Badge>;
      default: return <Badge variant="outline">Basse</Badge>;
    }
  };

  const filteredAlerts = data.alerts.filter(alert => {
    if (filter === 'active') return !alert.resolved;
    if (filter === 'resolved') return alert.resolved;
    return true;
  });

  const activeCount = data.alerts.filter(a => !a.resolved).length;
  const resolvedCount = data.alerts.filter(a => a.resolved).length;

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation alertes" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/b2b/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                EmotionsCare
              </Link>
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" aria-hidden="true" />
                Alertes RH
              </Badge>
              {activeCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <Bell className="h-3 w-3" aria-hidden="true" />
                  {activeCount} active{activeCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/settings/general"><Settings className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Paramètres</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/help"><HelpCircle className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Aide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning" aria-hidden="true" />
              Alertes Bien-être
            </h1>
            <p className="text-muted-foreground">
              Signaux anonymisés nécessitant une attention particulière
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading || isRefreshing}>
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Stats Overview */}
        <section aria-labelledby="stats-title" className="mb-8">
          <h2 id="stats-title" className="sr-only">Statistiques des alertes</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className={cn(activeCount > 0 && "border-warning/50")}>
              <CardContent className="p-6 text-center">
                {loading ? <Skeleton className="h-10 w-12 mx-auto mb-2" /> : (
                  <div className={cn("text-3xl font-bold mb-2", activeCount > 0 ? "text-warning" : "text-success")}>{activeCount}</div>
                )}
                <p className="text-sm text-muted-foreground">Alertes actives</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                {loading ? <Skeleton className="h-10 w-12 mx-auto mb-2" /> : (
                  <div className="text-3xl font-bold text-success mb-2">{resolvedCount}</div>
                )}
                <p className="text-sm text-muted-foreground">Résolues ce mois</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                {loading ? <Skeleton className="h-10 w-16 mx-auto mb-2" /> : (
                  <div className="text-3xl font-bold text-info mb-2">{data.avgResolutionTime}h</div>
                )}
                <p className="text-sm text-muted-foreground">Temps moyen résolution</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                {loading ? <Skeleton className="h-10 w-12 mx-auto mb-2" /> : (
                  <div className="text-3xl font-bold mb-2">{data.teamsAffected}</div>
                )}
                <p className="text-sm text-muted-foreground">Équipes concernées</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <div className="flex gap-2" role="tablist" aria-label="Filtrer les alertes">
            <Button 
              variant={filter === 'active' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('active')}
              role="tab"
              aria-selected={filter === 'active'}
            >
              Actives ({activeCount})
            </Button>
            <Button 
              variant={filter === 'resolved' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('resolved')}
              role="tab"
              aria-selected={filter === 'resolved'}
            >
              Résolues ({resolvedCount})
            </Button>
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
              role="tab"
              aria-selected={filter === 'all'}
            >
              Toutes
            </Button>
          </div>
        </div>

        {/* Alerts List */}
        <section aria-labelledby="alerts-title">
          <h2 id="alerts-title" className="sr-only">Liste des alertes</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-64 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Aucune alerte {filter === 'active' ? 'active' : filter === 'resolved' ? 'résolue' : ''}</h3>
                <p className="text-muted-foreground">
                  {filter === 'active' 
                    ? "Excellent ! Aucun signal d'alerte ne nécessite votre attention."
                    : "Aucune alerte dans cette catégorie."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4" role="list" aria-label="Alertes">
              {filteredAlerts.map((alert) => (
                <Card key={alert.id} className={cn("transition-all", getSeverityColor(alert.severity))} role="listitem">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {alert.resolved ? (
                            <CheckCircle className="h-5 w-5 text-success" aria-hidden="true" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
                          )}
                          <h3 className="text-lg font-semibold">{alert.title}</h3>
                          {getSeverityBadge(alert.severity)}
                          {alert.resolved && <Badge className="bg-success/10 text-success border-success/30">Résolu</Badge>}
                        </div>
                        <p className="text-muted-foreground mb-3">{alert.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" aria-hidden="true" />
                            {alert.affectedTeam || 'Plusieurs équipes'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" aria-hidden="true" />
                            {new Date(alert.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                          {alert.category && (
                            <Badge variant="outline">{alert.category}</Badge>
                          )}
                        </div>
                        {alert.recommendation && (
                          <div className="mt-3 p-3 bg-info/10 rounded-lg">
                            <p className="text-sm text-info">
                              <strong>Recommandation :</strong> {alert.recommendation}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!alert.resolved && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              <CheckCircle className="h-4 w-4" aria-hidden="true" />
                              Résoudre
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" aria-hidden="true" />
                              Détails
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => archiveAlert(alert.id)}
                        >
                          <Archive className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Indicateur confidentialité */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-8">
          <Shield className="h-4 w-4 text-success" aria-hidden="true" />
          <span>Alertes anonymisées — Aucune donnée individuelle accessible — Conforme RGPD</span>
        </div>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare B2B</p>
            <nav aria-label="Liens footer">
              <div className="flex gap-4">
                <Link to="/legal/privacy" className="hover:text-foreground">Confidentialité</Link>
                <Link to="/b2b/security" className="hover:text-foreground">Sécurité</Link>
                <Link to="/help" className="hover:text-foreground">Support</Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default B2BAlertsPage;
