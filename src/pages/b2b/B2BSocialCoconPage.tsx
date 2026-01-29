// @ts-nocheck
/**
 * B2BSocialCoconPage - Cocon Social B2B
 * Enrichi avec navigation sticky, accessibilité, design system
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Settings, 
  Plus,
  Building2,
  Bell,
  HelpCircle,
  RefreshCw,
  Loader2,
  Shield,
  Heart,
  Target,
} from 'lucide-react';
import { useB2BTeamStats } from '@/hooks/useB2BTeamStats';
import { usePageSEO } from '@/hooks/usePageSEO';

const B2BSocialCoconPage: React.FC = () => {
  const { stats, loading, refetch } = useB2BTeamStats();
  const [isRefreshing, setIsRefreshing] = useState(false);

  usePageSEO({
    title: 'Cocon Social B2B',
    description: 'Plateforme collaborative pour le bien-être en entreprise',
    keywords: 'cocon social, bien-être, collaboration, équipe',
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const teamActivities = [
    {
      id: 1,
      team: 'Équipe Développement',
      activity: 'Session de méditation collective',
      participants: 8,
      timestamp: 'Il y a 2h',
      type: 'wellness',
    },
    {
      id: 2,
      team: 'Équipe Marketing',
      activity: 'Atelier gestion du stress',
      participants: 12,
      timestamp: 'Il y a 4h',
      type: 'workshop',
    },
    {
      id: 3,
      team: 'Équipe Ventes',
      activity: 'Challenge bien-être hebdomadaire',
      participants: 15,
      timestamp: 'Il y a 6h',
      type: 'challenge',
    },
  ];

  const wellnessPrograms = [
    { title: 'Programme Anti-Stress', description: '8 semaines pour gérer le stress', participants: 45, progress: 65, status: 'active' },
    { title: 'Équilibre Vie Pro/Perso', description: 'Techniques d\'équilibre personnel', participants: 32, progress: 80, status: 'active' },
    { title: 'Communication Bienveillante', description: 'Améliorer les relations', participants: 28, progress: 45, status: 'planning' },
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation cocon social" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/b2b/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                EmotionsCare
              </Link>
              <Badge variant="secondary" className="gap-1">
                <Heart className="h-3 w-3" aria-hidden="true" />
                Cocon Social
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/notifications"><Bell className="h-4 w-4" /></Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
      <main id="main-content" role="main" className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" aria-hidden="true" />
              Cocon Social B2B
            </h1>
            <p className="text-muted-foreground">
              Plateforme collaborative pour le bien-être en entreprise
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading || isRefreshing}>
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" aria-hidden="true" />
              Paramètres
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Nouveau Programme
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activités récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
                  Activités des Équipes
                </CardTitle>
                <CardDescription>Dernières activités de bien-être</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
                  </div>
                ) : (
                  <div className="space-y-4" role="list" aria-label="Activités récentes">
                    {teamActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors" role="listitem">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {activity.team.split(' ')[1][0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{activity.team}</h3>
                          <p className="text-sm text-muted-foreground">{activity.activity}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{activity.participants} participants</span>
                            <span>{activity.timestamp}</span>
                            <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Voir détails</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Programmes de bien-être */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-success" aria-hidden="true" />
                  Programmes de Bien-être
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4" role="list" aria-label="Programmes">
                  {wellnessPrograms.map((program, index) => (
                    <div key={index} className="border rounded-lg p-4" role="listitem">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{program.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{program.participants} participants</span>
                            <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                              {program.status === 'active' ? 'Actif' : 'Planifié'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {program.status === 'active' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span className="font-medium">{program.progress}%</span>
                          </div>
                          <Progress value={program.progress} className="h-2" aria-label={`Progression ${program.progress}%`} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Équipes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-info" aria-hidden="true" />
                  Performance Équipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Bien-être moyen</h4>
                        <span className="font-bold text-primary">{stats.avgWellbeing}%</span>
                      </div>
                      <Progress value={stats.avgWellbeing} className="h-1.5" />
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Engagement</h4>
                        <span className="font-bold text-success">{stats.avgEngagement}%</span>
                      </div>
                      <Progress value={stats.avgEngagement} className="h-1.5" />
                    </div>
                    <div className="p-3 border rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Membres actifs</h4>
                        <span className="font-bold">{stats.activeThisWeek}/{stats.totalMembers}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link to="/b2b/events">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    Planifier un événement
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Envoyer message global
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link to="/b2b/reports">
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    Voir rapports détaillés
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Stats globales */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-4 w-4" aria-hidden="true" />
                  Entreprise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.totalMembers}</div>
                    <p className="text-sm text-muted-foreground">Employés participants</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {stats.totalMembers > 0 ? Math.round((stats.activeThisWeek / stats.totalMembers) * 100) : 0}%
                    </div>
                    <p className="text-sm text-muted-foreground">Taux de participation</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-info">4.6/5</div>
                    <p className="text-sm text-muted-foreground">Satisfaction générale</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Indicateur confidentialité */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-8">
          <Shield className="h-4 w-4 text-success" aria-hidden="true" />
          <span>Données anonymisées — Conforme RGPD</span>
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

export default B2BSocialCoconPage;
