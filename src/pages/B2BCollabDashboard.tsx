import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  TrendingUp
} from 'lucide-react';

const B2BCollabDashboard: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Espace Personnel</h1>
            <p className="text-muted-foreground">
              Votre bien-être émotionnel au quotidien
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Mode Collaborateur</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Données privées</span>
            </div>
          </div>
        </div>

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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Link to="/app/flash-glow" className="block">
                <Zap className="h-10 w-10 mx-auto text-primary mb-3" />
                <h3 className="font-semibold mb-2">Flash Glow</h3>
                <p className="text-sm text-muted-foreground">
                  Boost énergétique en 2 min
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Link to="/app/journal" className="block">
                <Mic className="h-10 w-10 mx-auto text-primary mb-3" />
                <h3 className="font-semibold mb-2">Journal Vocal</h3>
                <p className="text-sm text-muted-foreground">
                  Exprimez vos ressentis
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Link to="/app/music" className="block">
                <Music className="h-10 w-10 mx-auto text-primary mb-3" />
                <h3 className="font-semibold mb-2">Musicothérapie</h3>
                <p className="text-sm text-muted-foreground">
                  Harmonisez votre humeur
                </p>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Link to="/app/scan" className="block">
                <Camera className="h-10 w-10 mx-auto text-primary mb-3" />
                <h3 className="font-semibold mb-2">Scan Émotionnel</h3>
                <p className="text-sm text-muted-foreground">
                  Analysez votre état
                </p>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress & Personal Stats */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Bars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
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
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Engagement activités</span>
                    <span>Actif</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Gestion du stress</span>
                    <span>Maîtrisé</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objectifs Personnels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Méditation quotidienne</div>
                    <div className="text-sm text-muted-foreground">5 jours cette semaine</div>
                  </div>
                  <div className="text-green-600 font-semibold">Accompli</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">Gestion stress</div>
                    <div className="text-sm text-muted-foreground">3 sessions Flash Glow</div>
                  </div>
                  <div className="text-primary font-semibold">En cours</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
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

        {/* Mini Bubble Beat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Rythme Cardiaque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 border-4 border-primary/30 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary/70 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <div className="text-2xl font-bold">Calme</div>
                  <div className="text-sm text-muted-foreground">État détendu détecté</div>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/app/bubble-beat">Voir détails</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Nudges & Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Suggestions Personnalisées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                <h4 className="font-medium mb-2">💙 Moment de calme</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Votre journée semble chargée. Que diriez-vous d'une pause Screen-Silk ?
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/app/screen-silk">Démarrer</Link>
                </Button>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                <h4 className="font-medium mb-2">🎵 Boost d'énergie</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Un peu de Mood Mixer pour dynamiser cette fin d'après-midi ?
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/app/mood-mixer">Explorer</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BCollabDashboard;