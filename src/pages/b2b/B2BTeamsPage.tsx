// @ts-nocheck
/**
 * B2BTeamsPage - Gestion d'équipes B2B
 * Enrichi avec données dynamiques, navigation sticky, accessibilité
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Settings, 
  BarChart3, 
  Mail,
  Calendar,
  Activity,
  Building2,
  Bell,
  HelpCircle,
  RefreshCw,
  Loader2,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useB2BTeams } from '@/hooks/useB2BTeams';
import { usePageSEO } from '@/hooks/usePageSEO';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { CreateTeamDialog, InviteMemberDialog } from '@/features/b2b/components';

const B2BTeamsPage: React.FC = () => {
  const { user } = useAuth();
  const orgId = user?.user_metadata?.org_id as string || 'demo';
  const { data, loading, refetch } = useB2BTeams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);

  usePageSEO({
    title: 'Gestion des Équipes B2B',
    description: 'Suivez le bien-être et la performance de vos équipes avec EmotionsCare',
    keywords: 'équipes, bien-être, RH, management',
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getStatusBadge = (status: string, wellness: number) => {
    if (status === 'needs-attention' || wellness < 75) {
      return <Badge variant="destructive">Attention requise</Badge>;
    }
    return <Badge className="bg-success/10 text-success border-success/30">Actif</Badge>;
  };

  const getWellnessColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation gestion équipes" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/b2b/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                EmotionsCare
              </Link>
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" aria-hidden="true" />
                Gestion RH
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
      <main id="main-content" role="main" className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des Équipes</h1>
            <p className="text-muted-foreground">
              Suivez le bien-être et la performance de vos équipes
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading || isRefreshing}>
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button className="gap-2" onClick={() => setShowCreateTeam(true)}>
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Nouvelle équipe
            </Button>
          </div>
        </header>

        {/* Dialogs */}
        <CreateTeamDialog 
          open={showCreateTeam} 
          onOpenChange={setShowCreateTeam} 
          orgId={orgId}
          onSuccess={() => refetch()}
        />
        <InviteMemberDialog 
          open={showInviteMember} 
          onOpenChange={setShowInviteMember} 
          orgId={orgId}
          teams={data.teams as any}
          onSuccess={() => refetch()}
        />

        {/* Stats Overview */}
        <section aria-labelledby="stats-title" className="mb-8">
          <h2 id="stats-title" className="sr-only">Statistiques des équipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Équipes</p>
                    {loading ? <Skeleton className="h-8 w-12" /> : (
                      <p className="text-2xl font-bold">{data.teams.length}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Activity className="h-8 w-8 text-success" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-muted-foreground">Membres Total</p>
                    {loading ? <Skeleton className="h-8 w-12" /> : (
                      <p className="text-2xl font-bold">{data.totalMembers}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-info" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bien-être Moyen</p>
                    {loading ? <Skeleton className="h-8 w-12" /> : (
                      <p className="text-2xl font-bold">{data.avgWellness}%</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Settings className="h-8 w-8 text-warning" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-muted-foreground">Équipes Actives</p>
                    {loading ? <Skeleton className="h-8 w-12" /> : (
                      <p className="text-2xl font-bold">{data.activeTeams}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Teams List */}
        <section aria-labelledby="teams-title" className="mb-8">
          <h2 id="teams-title" className="text-xl font-semibold mb-4">Vos équipes</h2>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader><Skeleton className="h-6 w-40" /></CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="list" aria-label="Liste des équipes">
              {data.teams.map((team) => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow" role="listitem">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{team.name}</CardTitle>
                        <p className="text-muted-foreground mt-1">{team.members} membres</p>
                      </div>
                      {getStatusBadge(team.status, team.avgWellness)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Team Lead */}
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium">{team.lead}</p>
                        <p className="text-sm text-muted-foreground">Chef d'équipe</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        <span>{team.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <span>Dernière activité: {new Date(team.lastActivity).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* Wellness Score */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Bien-être de l'équipe</span>
                        <span className={cn("text-lg font-bold", getWellnessColor(team.avgWellness))}>
                          {team.avgWellness}%
                        </span>
                      </div>
                      <Progress 
                        value={team.avgWellness} 
                        className="h-2" 
                        aria-label={`Bien-être ${team.avgWellness}%`}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <BarChart3 className="h-4 w-4" aria-hidden="true" />
                        Voir détails
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Settings className="h-4 w-4" aria-hidden="true" />
                        Gérer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section aria-labelledby="actions-title">
          <Card>
            <CardHeader>
              <CardTitle id="actions-title">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start gap-2" asChild>
                  <Link to="/b2b/reports">
                    <BarChart3 className="h-4 w-4" aria-hidden="true" />
                    Voir les rapports
                    <ChevronRight className="h-4 w-4 ml-auto" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start gap-2" asChild>
                  <Link to="/b2b/events">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    Organiser un événement
                    <ChevronRight className="h-4 w-4 ml-auto" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start gap-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Envoyer un message
                  <ChevronRight className="h-4 w-4 ml-auto" aria-hidden="true" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Indicateur confidentialité */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-8">
          <Shield className="h-4 w-4 text-success" aria-hidden="true" />
          <span>Données agrégées et anonymisées — Conforme RGPD</span>
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

export default B2BTeamsPage;
