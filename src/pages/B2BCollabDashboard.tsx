// @ts-nocheck
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Music, 
  Mic, 
  Camera, 
  Sparkles, 
  Target,
  Calendar,
  Zap,
  TrendingUp,
  Settings,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { useAccessibilityAudit } from '@/lib/accessibility-checker';

const B2BCollabDashboard: React.FC = () => {
  const { runAudit } = useAccessibilityAudit();

  useEffect(() => {
    // Audit d'accessibilité en développement
    if (import.meta.env.DEV) {
      setTimeout(runAudit, 1000);
    }
  }, [runAudit]);

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Skip Links pour l'accessibilité */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={1}
      >
        Aller au contenu principal
      </a>
      <a 
        href="#quick-actions" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={2}
      >
        Aller aux actions rapides
      </a>

      {/* Navigation principale */}
      <nav role="navigation" aria-label="Navigation de l'espace collaborateur" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold">EmotionsCare</h2>
              <Badge variant="secondary" aria-label="Mode collaborateur">
                <Briefcase className="h-3 w-3 mr-1" aria-hidden="true" />
                Collaborateur
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-success rounded-full mr-1" aria-hidden="true"></div>
                <span>Données privées</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Accéder aux paramètres"
              >
                <Link to="/settings/general">
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Paramètres</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                aria-label="Accéder à l'aide"
              >
                <Link to="/help">
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Aide</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main id="main-content" role="main" className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Espace Personnel</h1>
              <p className="text-muted-foreground">
                Votre bien-être émotionnel au quotidien
              </p>
            </div>
          </header>

        {/* Instant Glow Widget */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Instant Glow</h3>
                  <p className="text-muted-foreground">Votre état émotionnel du jour</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">Serein(e)</div>
                <div className="text-sm text-muted-foreground">Équilibre trouvé</div>
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
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Équilibre émotionnel</span>
                      <span>Stable</span>
                    </div>
                    <Progress value={75} className="h-2" aria-label="Équilibre émotionnel 75%" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement activités</span>
                      <span>Actif</span>
                    </div>
                    <Progress value={60} className="h-2" aria-label="Engagement activités 60%" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Gestion du stress</span>
                      <span>Maîtrisé</span>
                    </div>
                    <Progress value={85} className="h-2" aria-label="Gestion du stress 85%" />
                  </div>
                </div>
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
                <div className="space-y-4" role="list" aria-label="Liste des objectifs personnels">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" role="listitem">
                    <div>
                      <div className="font-medium">Méditation quotidienne</div>
                      <div className="text-sm text-muted-foreground">5 jours cette semaine</div>
                    </div>
                    <div className="text-green-600 font-semibold">Accompli</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" role="listitem">
                    <div>
                      <div className="font-medium">Gestion stress</div>
                      <div className="text-sm text-muted-foreground">3 sessions Flash Glow</div>
                    </div>
                    <div className="text-primary font-semibold">En cours</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg" role="listitem">
                    <div>
                      <div className="font-medium">Journal émotionnel</div>
                      <div className="text-sm text-muted-foreground">Quotidien ce mois</div>
                    </div>
                    <div className="text-orange-600 font-semibold">À commencer</div>
                  </div>
                </div>
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
                    <div className="w-8 h-8 bg-primary/70 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">Calme</div>
                    <div className="text-sm text-muted-foreground">État détendu détecté</div>
                  </div>
                </div>
                <Button variant="outline" asChild aria-describedby="bubble-beat-desc">
                  <Link to="/app/bubble-beat">Voir détails</Link>
                </Button>
              </div>
              <p id="bubble-beat-desc" className="sr-only">
                Accéder à l'analyse complète de votre rythme cardiaque
              </p>
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
              <div className="grid md:grid-cols-2 gap-4" role="list" aria-label="Liste des suggestions personnalisées">
                <div className="p-4 bg-info/10 rounded-lg" role="listitem">
                  <h4 className="font-medium mb-2">💙 Moment de calme</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Votre journée semble chargée. Que diriez-vous d'une pause Screen-Silk ?
                  </p>
                  <Button size="sm" variant="outline" asChild aria-describedby="screen-silk-desc">
                    <Link to="/app/screen-silk">Démarrer</Link>
                  </Button>
                  <p id="screen-silk-desc" className="sr-only">
                    Démarre une session Screen-Silk pour une pause relaxante
                  </p>
                </div>
                
                <div className="p-4 bg-success/10 rounded-lg" role="listitem">
                  <h4 className="font-medium mb-2">🎵 Boost d'énergie</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Un peu de Mood Mixer pour dynamiser cette fin d'après-midi ?
                  </p>
                  <Button size="sm" variant="outline" asChild aria-describedby="mood-mixer-desc">
                    <Link to="/app/mood-mixer">Explorer</Link>
                  </Button>
                  <p id="mood-mixer-desc" className="sr-only">
                    Explore les options Mood Mixer pour booster votre énergie
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        </div>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
            <p>© 2025 EmotionsCare - Votre bien-être au travail en toute confidentialité</p>
            <nav aria-label="Liens footer collaborateur">
              <div className="flex space-x-4">
                <Link to="/privacy" className="hover:text-foreground">
                  Confidentialité
                </Link>
                <Link to="/terms" className="hover:text-foreground">
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