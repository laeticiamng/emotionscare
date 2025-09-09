/**
 * Dashboard Complet - Page principale post-connexion avec toutes les fonctionnalités
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, Home, Settings, User, ArrowRight, Brain, Music, BookOpen, 
  Headphones, Target, TrendingUp, Calendar, Scan, Eye, Star, Zap, 
  Wind, Camera, Palette, Trophy, RefreshCw, Medal, Activity, Monitor,
  MessageCircle, PenTool, Sparkles, Plus, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSimpleAuth } from '@/contexts/SimpleAuth';
import EmotionScanButton from '@/components/features/EmotionScanButton';
import GritChallengeButton from '@/components/features/GritChallengeButton';
import AmbitionButton from '@/components/features/AmbitionButton';
import StorySynthButton from '@/components/features/StorySynthButton';
import InstantGlowButton from '@/components/features/InstantGlowButton';

const DashboardSimple: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSimpleAuth();

  // Rediriger si pas authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div 
      data-testid="page-root"
      className="min-h-screen bg-background"
    >
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 left-40 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md"
        tabIndex={2}
      >
        Aller aux actions rapides
      </a>

      {/* Navigation principale */}
      <nav role="navigation" aria-label="Navigation du tableau de bord" className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold">EmotionsCare</h2>
              </div>
              <Badge variant="secondary" aria-label="Mode utilisateur particulier">
                {user?.role === 'consumer' ? 'Particulier' : user?.role}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden md:inline">
                {user?.name || user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                aria-label="Accéder aux paramètres"
              >
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Paramètres</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main id="main-content" role="main" className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* En-tête de bienvenue */}
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue {user?.name ? user.name : 'sur votre espace bien-être'} !
            </h1>
            <p className="text-muted-foreground text-lg">
              Découvrez vos outils d'intelligence émotionnelle personnalisés
            </p>
          </header>

          {/* Statistiques rapides */}
          <section aria-labelledby="stats-title" className="mb-8">
            <h2 id="stats-title" className="text-xl font-semibold mb-4">
              Votre progression aujourd'hui
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="relative">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Sessions d'analyse
                  </CardTitle>
                  <CardDescription className="sr-only">
                    Nombre de sessions d'analyse émotionnelle effectuées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">3</div>
                    <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
                  </div>
                  <Progress value={60} className="mt-2" aria-label="Progression 60%" />
                  <p className="text-xs text-muted-foreground mt-1">
                    +20% par rapport à hier
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Temps de méditation
                  </CardTitle>
                  <CardDescription className="sr-only">
                    Durée totale de méditation aujourd'hui
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">25min</div>
                    <Calendar className="h-4 w-4 text-blue-500" aria-hidden="true" />
                  </div>
                  <Progress value={83} className="mt-2" aria-label="Progression 83%" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Objectif: 30min
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Humeur générale
                  </CardTitle>
                  <CardDescription className="sr-only">
                    Évaluation de votre humeur générale
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">😊</div>
                    <Target className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Positive
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tendance stable
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Fonctionnalités principales avec composants intégrés */}
          <section aria-labelledby="features-title" className="mb-8">
            <h2 id="features-title" className="text-xl font-semibold mb-4">
              Outils disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <EmotionScanButton />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <InstantGlowButton />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <GritChallengeButton />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <AmbitionButton />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <StorySynthButton />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Accès rapide aux autres modules */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent 
                    className="p-6 flex flex-col items-center text-center space-y-4"
                    onClick={() => navigate('/b2c')}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Voir tous les modules
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        <ArrowRight className="w-4 h-4 inline mr-1" />
                        Découvrir 15+ fonctionnalités
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          {/* Actions rapides classiques */}
          <section id="quick-actions" aria-labelledby="actions-title" className="mb-8">
            <h2 id="actions-title" className="text-xl font-semibold mb-4">
              Accès rapide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                <div 
                  className="block p-6" 
                  onClick={() => navigate('/app/scan')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/app/scan')}
                  aria-describedby="scan-desc"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium">Scanner émotions</h3>
                      <p id="scan-desc" className="text-sm text-muted-foreground">
                        Analyse faciale temps réel
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </div>
              </Card>

              <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                <div 
                  className="block p-6" 
                  onClick={() => navigate('/app/music')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/app/music')}
                  aria-describedby="music-desc"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Music className="h-5 w-5 text-blue-500" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium">Musique thérapeutique</h3>
                      <p id="music-desc" className="text-sm text-muted-foreground">
                        Sons adaptatifs personnalisés
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </div>
              </Card>

              <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                <div 
                  className="block p-6" 
                  onClick={() => navigate('/app/journal')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/app/journal')}
                  aria-describedby="journal-desc"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-500" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium">Journal émotionnel</h3>
                      <p id="journal-desc" className="text-sm text-muted-foreground">
                        Consignez vos ressentis
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </div>
              </Card>

              <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                <div 
                  className="block p-6" 
                  onClick={() => navigate('/app/coach')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/app/coach')}
                  aria-describedby="coach-desc"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Headphones className="h-5 w-5 text-purple-500" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-medium">Coach IA</h3>
                      <p id="coach-desc" className="text-sm text-muted-foreground">
                        Conseils personnalisés
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Recommandations personnalisées */}
          <section aria-labelledby="recommendations-title">
            <h2 id="recommendations-title" className="text-xl font-semibold mb-4">
              Recommandé pour vous
            </h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-500/10 rounded">
                    <Target className="h-4 w-4 text-orange-500" aria-hidden="true" />
                  </div>
                  <span>Session de respiration guidée</span>
                </CardTitle>
                <CardDescription>
                  Basé sur votre niveau de stress détecté ce matin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Une session de 10 minutes pour réduire le stress et améliorer votre concentration.
                </p>
                <Button 
                  onClick={() => navigate('/app/breath')}
                  aria-describedby="breath-session-desc"
                >
                  Commencer la session
                </Button>
                <p id="breath-session-desc" className="sr-only">
                  Démarre une session de respiration guidée de 10 minutes
                </p>
              </CardContent>
            </Card>
          </section>
        </motion.div>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <p>© 2025 EmotionsCare - Votre bien-être, notre priorité</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardSimple;