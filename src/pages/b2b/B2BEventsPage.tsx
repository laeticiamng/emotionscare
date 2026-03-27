// @ts-nocheck
/**
 * B2BEventsPage - Gestion des événements B2B
 * Enrichi avec données dynamiques, navigation sticky, accessibilité
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Plus, 
  Eye,
  Building2,
  Bell,
  Settings,
  HelpCircle,
  RefreshCw,
  Loader2,
  Shield,
  CheckCircle,
  Star,
} from 'lucide-react';
import { useB2BEvents } from '@/hooks/useB2BEvents';
import { usePageSEO } from '@/hooks/usePageSEO';

const B2BEventsPage: React.FC = () => {
  const { data, loading, refetch } = useB2BEvents();
  const [isRefreshing, setIsRefreshing] = useState(false);

  usePageSEO({
    title: 'Événements Bien-être B2B',
    description: 'Planifiez et gérez les événements bien-être de votre entreprise',
    keywords: 'événements, bien-être, entreprise, RH',
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const upcomingEvents = data.events.filter(e => e.status === 'upcoming');
  const completedEvents = data.events.filter(e => e.status === 'completed');

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Aller au contenu principal
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation événements" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/b2b/dashboard" className="text-lg font-semibold hover:text-primary transition-colors">
                EmotionsCare
              </Link>
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" aria-hidden="true" />
                Événements
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
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" aria-hidden="true" />
              Gestion des Événements
            </h1>
            <p className="text-muted-foreground">
              Planifiez et gérez les événements bien-être de votre entreprise
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading || isRefreshing}>
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Nouvel Événement
            </Button>
          </div>
        </header>

        {/* Événements à venir */}
        <section aria-labelledby="upcoming-title" className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle id="upcoming-title" className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                Événements à Venir
              </CardTitle>
              <CardDescription>Prochains événements programmés</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-6 w-64 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun événement à venir</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="h-4 w-4 mr-1" />
                    Créer un événement
                  </Button>
                </div>
              ) : (
                <div className="space-y-4" role="list" aria-label="Événements à venir">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors" role="listitem">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" aria-hidden="true" />
                              {new Date(event.date).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" aria-hidden="true" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" aria-hidden="true" />
                              {event.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" aria-hidden="true" />
                              {event.participants}/{event.maxParticipants}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            Voir
                          </Button>
                          <Button size="sm">Modifier</Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress 
                          value={(event.participants / event.maxParticipants) * 100} 
                          className="flex-1 h-2"
                          aria-label={`${event.participants} sur ${event.maxParticipants} participants`}
                        />
                        <span className="text-sm text-muted-foreground">
                          {Math.round((event.participants / event.maxParticipants) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Statistiques */}
        <section aria-labelledby="stats-title" className="mb-8">
          <h2 id="stats-title" className="sr-only">Statistiques des événements</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                {loading ? <Skeleton className="h-10 w-12 mx-auto mb-2" /> : (
                  <div className="text-3xl font-bold text-primary mb-2">{data.upcomingCount}</div>
                )}
                <p className="text-sm text-muted-foreground">Événements à venir</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                {loading ? <Skeleton className="h-10 w-16 mx-auto mb-2" /> : (
                  <div className="text-3xl font-bold text-success mb-2">{data.totalParticipants}</div>
                )}
                <p className="text-sm text-muted-foreground">Participants total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                {loading ? <Skeleton className="h-10 w-16 mx-auto mb-2" /> : (
                  <div className="text-3xl font-bold text-info mb-2">{data.avgSatisfaction}%</div>
                )}
                <p className="text-sm text-muted-foreground">Taux de satisfaction</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-warning mb-2 flex items-center justify-center gap-1">
                  4.8 <Star className="h-5 w-5 fill-warning" aria-hidden="true" />
                </div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Événements terminés */}
        <section aria-labelledby="completed-title">
          <Card>
            <CardHeader>
              <CardTitle id="completed-title" className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" aria-hidden="true" />
                Événements Terminés
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : completedEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Aucun événement terminé</p>
              ) : (
                <div className="space-y-3" role="list" aria-label="Événements terminés">
                  {completedEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 bg-success/5" role="listitem">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('fr-FR')} • {event.participants} participants
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-success/10 text-success border-success/30">Terminé</Badge>
                          <Button variant="outline" size="sm">Rapport</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Indicateur confidentialité */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-8">
          <Shield className="h-4 w-4 text-success" aria-hidden="true" />
          <span>Gestion des événements sécurisée — Conforme RGPD</span>
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

export default B2BEventsPage;
