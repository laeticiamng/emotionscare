/**
 * HomeAppPage - Dashboard principal B2C (/app/home)
 * Espace personnel des particuliers avec Social B2C exclusif
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Music, 
  Mic, 
  Camera, 
  Sparkles, 
  Users,
  MessageCircle,
  ThumbsUp,
  Share2,
  Plus,
  Zap,
  TrendingUp,
  User,
  Calendar,
  Target
} from 'lucide-react';

const HomeAppPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">EmotionsCare</h1>
              <Badge variant="default" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Particulier
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/profile">Profil</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/settings">Paramètres</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4">
            Bonjour ! Prêt(e) pour une journée épanouie ?
          </h2>
          <p className="text-muted-foreground mb-6">
            Découvrez vos émotions, connectez-vous à la communauté et cultivez votre bien-être
          </p>
        </section>

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
                  <p className="text-muted-foreground">Votre état émotionnel actuel</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">Optimiste</div>
                <div className="text-sm text-muted-foreground">Énergie positive détectée</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Modules personnels */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <section>
              <h3 className="text-xl font-semibold mb-4">Mes outils bien-être</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Link to="/app/scan" className="block">
                      <Camera className="h-10 w-10 mx-auto text-primary mb-3" />
                      <h4 className="font-semibold mb-2">Scan Émotionnel</h4>
                      <p className="text-sm text-muted-foreground">
                        Analysez vos émotions en temps réel
                      </p>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Link to="/app/music" className="block">
                      <Music className="h-10 w-10 mx-auto text-primary mb-3" />
                      <h4 className="font-semibold mb-2">Musicothérapie</h4>
                      <p className="text-sm text-muted-foreground">
                        Sons adaptatifs pour votre humeur
                      </p>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Link to="/app/journal" className="block">
                      <Mic className="h-10 w-10 mx-auto text-primary mb-3" />
                      <h4 className="font-semibold mb-2">Journal Vocal</h4>
                      <p className="text-sm text-muted-foreground">
                        Exprimez vos ressentis librement
                      </p>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Link to="/app/flash-glow" className="block">
                      <Zap className="h-10 w-10 mx-auto text-primary mb-3" />
                      <h4 className="font-semibold mb-2">Flash Glow</h4>
                      <p className="text-sm text-muted-foreground">
                        Boost énergétique en 2 minutes
                      </p>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Personal Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Mes Objectifs Personnels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Méditation quotidienne</span>
                      <span>5/7 jours</span>
                    </div>
                    <Progress value={71} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Gestion du stress</span>
                      <span>En cours</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Expression émotionnelle</span>
                      <span>Excellente progression</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social B2C - Réseau social exclusif aux particuliers */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Social B2C
                  </div>
                  <Badge variant="outline">Particuliers</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Post input */}
                <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Partagez votre ressenti...
                    </Button>
                  </div>
                </div>

                {/* Social feed */}
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Sarah M.</div>
                        <div className="text-xs text-muted-foreground">Il y a 2h</div>
                      </div>
                    </div>
                    <p className="text-sm mb-3">
                      Excellente séance de méditation ce matin ! Flash Glow m'a vraiment aidée à commencer la journée du bon pied 🌟
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        12
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <MessageCircle className="h-3 w-3" />
                        3
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Marc L.</div>
                        <div className="text-xs text-muted-foreground">Il y a 4h</div>
                      </div>
                    </div>
                    <p className="text-sm mb-3">
                      Question du jour : Comment gérez-vous les moments de stress au quotidien ? Personnellement, les techniques de respiration d'EmotionsCare m'aident énormément 🧘‍♂️
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        8
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <MessageCircle className="h-3 w-3" />
                        7
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link to="/app/social-b2c">
                    Voir plus de posts
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ma Semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sessions cette semaine</span>
                    <span className="font-semibold">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Humeur moyenne</span>
                    <span className="font-semibold text-green-600">Positive</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Streak méditation</span>
                    <span className="font-semibold">5 jours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Posts partagés</span>
                    <span className="font-semibold">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Suggestions personnalisées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                <h4 className="font-medium mb-2">💙 Moment détente</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Votre niveau de stress semble un peu élevé. Une pause Screen-Silk vous ferait du bien !
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/app/screen-silk">Démarrer</Link>
                </Button>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                <h4 className="font-medium mb-2">🎵 Boost créatif</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Votre créativité est au top ! Explorez le Mood Mixer pour de nouvelles inspirations.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/app/mood-mixer">Explorer</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HomeAppPage;