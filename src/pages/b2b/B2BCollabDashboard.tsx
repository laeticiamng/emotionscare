// @ts-nocheck
/**
 * B2B Collaborateur Dashboard - Espace personnel du collaborateur
 * Données individuelles confidentielles, non accessibles aux RH
 */
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Music, 
  Mic, 
  Camera, 
  Sparkles, 
  Target,
  Zap,
  TrendingUp,
  Settings,
  HelpCircle,
  Briefcase,
  Bell,
  User,
  Shield,
  RefreshCw,
  Loader2,
  Flame,
} from 'lucide-react';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';
import { useAuth } from '@/contexts/AuthContext';
import { useB2BCollabStats } from '@/hooks/useB2BCollabStats';
import { cn } from '@/lib/utils';

const B2BCollabDashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading, refetch } = useB2BCollabStats();
  const { runAudit } = useAccessibilityAudit();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const firstName = user?.user_metadata?.first_name || 'Collaborateur';

  useEffect(() => {
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getMoodEmoji = () => {
    switch (stats.currentMood) {
      case 'calm': return '😌';
      case 'energized': return '⚡';
      case 'stressed': return '😰';
      default: return '😊';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in_progress': return 'text-primary';
      case 'pending': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Accompli';
      case 'in_progress': return 'En cours';
      case 'pending': return 'À commencer';
      default: return status;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller au contenu principal
      </a>
      <a 
        href="#quick-actions" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Aller aux actions rapides
      </a>

      {/* Navigation sticky */}
      <nav role="navigation" aria-label="Navigation de l'espace collaborateur" className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary" className="gap-1">
                <Briefcase className="h-3 w-3" aria-hidden="true" />
                Collaborateur
              </Badge>
              <div className="hidden md:flex items-center text-xs text-muted-foreground gap-1">
                <Shield className="h-3 w-3 text-success" aria-hidden="true" />
                <span>Données privées</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/notifications">
                        <Bell className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/settings/profile">
                        <User className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Mon profil</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/settings/general">
                        <Settings className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Paramètres</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/help">
                        <HelpCircle className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Aide</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main id="main-content" role="main" className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Bonjour, {firstName} 👋</h1>
              <p className="text-muted-foreground">
                Votre bien-être émotionnel au quotidien
              </p>
            </div>
            <div className="flex items-center gap-3">
              {stats.streak > 0 && (
                <Badge variant="outline" className="gap-1 px-3 py-1">
                  <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
                  {stats.streak} jours
                </Badge>
              )}
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading || isRefreshing}>
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </header>

          {/* Instant Glow Widget */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Instant Glow</h3>
                    <p className="text-muted-foreground">Votre état émotionnel du jour</p>
                  </div>
                </div>
                <div className="text-right">
                  {loading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-primary flex items-center gap-2">
                        <span>{getMoodEmoji()}</span>
                        {stats.moodLabel}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stats.currentMood === 'calm' ? 'Équilibre trouvé' : 
                         stats.currentMood === 'energized' ? 'Plein d\'énergie' :
                         stats.currentMood === 'stressed' ? 'Besoin de pause' : 'État stable'}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <section id="quick-actions" aria-labelledby="actions-title">
            <h2 id="actions-title" className="text-xl font-semibold mb-4">
              Actions rapides
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Link to="/app/flash-glow" className="block" aria-describedby="flash-glow-desc">
                    <Zap className="h-10 w-10 mx-auto text-primary mb-3" aria-hidden="true" />
                    <h3 className="font-semibold mb-2">Flash Glow</h3>
                    <p id="flash-glow-desc" className="text-sm text-muted-foreground">
                      Boost énergétique en 2 min
                    </p>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Link to="/app/journal" className="block" aria-describedby="journal-desc">
                    <Mic className="h-10 w-10 mx-auto text-primary mb-3" aria-hidden="true" />
                    <h3 className="font-semibold mb-2">Journal Vocal</h3>
                    <p id="journal-desc" className="text-sm text-muted-foreground">
                      Exprimez vos ressentis en toute confidentialité
                    </p>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Link to="/app/music" className="block" aria-describedby="music-desc">
                    <Music className="h-10 w-10 mx-auto text-primary mb-3" aria-hidden="true" />
                    <h3 className="font-semibold mb-2">Musicothérapie</h3>
                    <p id="music-desc" className="text-sm text-muted-foreground">
                      Harmonisez votre humeur avec des sons adaptatifs
                    </p>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <Link to="/app/scan" className="block" aria-describedby="scan-desc">
                    <Camera className="h-10 w-10 mx-auto text-primary mb-3" aria-hidden="true" />
                    <h3 className="font-semibold mb-2">Scan Émotionnel</h3>
                    <p id="scan-desc" className="text-sm text-muted-foreground">
                      Analysez votre état émotionnel en temps réel
                    </p>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Weekly Progress & Personal Stats */}
          <section aria-labelledby="progress-title">
            <h2 id="progress-title" className="text-xl font-semibold mb-4">
              Suivi et objectifs personnels
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Weekly Bars */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" aria-hidden="true" />
                    Tendance Hebdomadaire
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Équilibre émotionnel</span>
                          <span>{stats.weeklyProgress.emotionalBalance >= 70 ? 'Excellent' : stats.weeklyProgress.emotionalBalance >= 50 ? 'Stable' : 'À améliorer'}</span>
                        </div>
                        <Progress value={stats.weeklyProgress.emotionalBalance} className="h-2" aria-label={`Équilibre émotionnel ${stats.weeklyProgress.emotionalBalance}%`} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Engagement activités</span>
                          <span>{stats.weeklyProgress.activityEngagement >= 60 ? 'Actif' : stats.weeklyProgress.activityEngagement >= 30 ? 'Modéré' : 'Faible'}</span>
                        </div>
                        <Progress value={stats.weeklyProgress.activityEngagement} className="h-2" aria-label={`Engagement activités ${stats.weeklyProgress.activityEngagement}%`} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Gestion du stress</span>
                          <span>{stats.weeklyProgress.stressManagement >= 80 ? 'Maîtrisé' : stats.weeklyProgress.stressManagement >= 50 ? 'Correct' : 'À travailler'}</span>
                        </div>
                        <Progress value={stats.weeklyProgress.stressManagement} className="h-2" aria-label={`Gestion du stress ${stats.weeklyProgress.stressManagement}%`} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Personal Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" aria-hidden="true" />
                    Objectifs Personnels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-4" role="list" aria-label="Liste des objectifs personnels">
                      {stats.goals.map((goal) => (
                        <div key={goal.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" role="listitem">
                          <div>
                            <div className="font-medium">{goal.title}</div>
                            <div className="text-sm text-muted-foreground">{goal.description}</div>
                          </div>
                          <div className={cn("font-semibold", getStatusColor(goal.status))}>
                            {getStatusLabel(goal.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Mini Bubble Beat */}
          <section aria-labelledby="heartrate-title">
            <h2 id="heartrate-title" className="text-xl font-semibold mb-4">
              Monitoring physiologique
            </h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" aria-hidden="true" />
                  Rythme Cardiaque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary/30 rounded-full flex items-center justify-center" aria-hidden="true">
                      <div className="w-8 h-8 bg-primary/70 rounded-full animate-pulse" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.currentMood === 'calm' ? 'Calme' : 
                         stats.currentMood === 'stressed' ? 'Élevé' : 'Normal'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stats.currentMood === 'calm' ? 'État détendu détecté' :
                         stats.currentMood === 'stressed' ? 'Tension détectée' : 'Rythme régulier'}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link to="/app/bubble-beat">Voir détails</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Nudges & Suggestions */}
          <section aria-labelledby="suggestions-title">
            <h2 id="suggestions-title" className="text-xl font-semibold mb-4">
              Suggestions personnalisées
            </h2>
            <Card>
              <CardHeader>
                <CardTitle>Recommandations basées sur votre activité</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4" role="list" aria-label="Liste des suggestions personnalisées">
                    {stats.suggestions.map((suggestion) => (
                      <div 
                        key={suggestion.id} 
                        className={cn(
                          "p-4 rounded-lg",
                          suggestion.variant === 'info' && "bg-info/10",
                          suggestion.variant === 'success' && "bg-success/10",
                          suggestion.variant === 'warning' && "bg-warning/10"
                        )} 
                        role="listitem"
                      >
                        <h4 className="font-medium mb-2">{suggestion.emoji} {suggestion.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {suggestion.description}
                        </p>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={suggestion.link}>Démarrer</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Indicateur confidentialité */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-4">
            <Shield className="h-4 w-4 text-success" aria-hidden="true" />
            <span>Vos données personnelles restent confidentielles et ne sont jamais partagées avec votre employeur</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
            <p>© 2025 EmotionsCare — Votre bien-être au travail en toute confidentialité</p>
            <nav aria-label="Liens footer collaborateur">
              <div className="flex space-x-4">
                <Link to="/legal/privacy" className="hover:text-foreground">
                  Confidentialité
                </Link>
                <Link to="/legal/terms" className="hover:text-foreground">
                  Conditions
                </Link>
                <Link to="/help" className="hover:text-foreground">
                  Support
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default B2BCollabDashboard;
