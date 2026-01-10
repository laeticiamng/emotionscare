/**
 * B2C BREATHWORK PAGE - EMOTIONSCARE
 * Page de respiration avancée accessible WCAG 2.1 AA
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, Settings, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { AdvancedBreathwork } from '@/components/breath/AdvancedBreathwork';
import { useAuth } from '@/hooks/useAuth';
import { useBreathworkStats } from '@/hooks/useBreathworkStats';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function B2CBreathworkPage() {
  const { user } = useAuth();
  const { stats, isLoading, saveSession } = useBreathworkStats();

  useEffect(() => {
    document.title = "Breathwork Avancé | EmotionsCare";
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Breathwork Avancé - EmotionsCare',
          text: 'Découvrez les techniques de respiration avancées pour votre bien-être',
          url: window.location.href
        });
      } catch (err) {
        // User cancelled share
      }
    }
  };

  return (
    <ConsentGate>
      <>
        {/* Skip Links pour l'accessibilité */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
          tabIndex={0}
        >
          Aller au contenu principal
        </a>

        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background" data-testid="page-root">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-4">
                  <Link to="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Retour au tableau de bord"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                      Retour
                    </Button>
                  </Link>

                  <div>
                    <h1 className="text-xl font-semibold text-foreground">
                      Breathwork Avancé
                    </h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">
                      Techniques de respiration guidées
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Informations sur la respiration"
                        >
                          <Info className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Techniques validées scientifiquement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    aria-label="Partager la page"
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                  </Button>

                  <Link to="/settings">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Paramètres"
                    >
                      <Settings className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content" role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Welcome Card for new users */}
              {!user && (
                <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">
                        Bienvenue dans le Breathwork
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Créez un compte pour sauvegarder votre progression et débloquer toutes les techniques.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/login">
                        <Button variant="outline" size="sm">
                          Connexion
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button size="sm">
                          Créer un compte
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )}

              {/* Quick Stats for logged users */}
              {user && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : stats.totalSessions}
                    </div>
                    <div className="text-xs text-muted-foreground">Sessions totales</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-success">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `${stats.averageCompletionRate}%`}
                    </div>
                    <div className="text-xs text-muted-foreground">Taux de complétion</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-warning">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : stats.currentStreak}
                    </div>
                    <div className="text-xs text-muted-foreground">Jours de streak</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-info">
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : stats.masteredPatterns}
                    </div>
                    <div className="text-xs text-muted-foreground">Techniques maîtrisées</div>
                  </Card>
                </div>
              )}

              {/* Main Breathwork Component */}
              <AdvancedBreathwork />

              {/* Tips Section */}
              <section aria-labelledby="tips-title" className="mt-12">
                <h2 id="tips-title" className="text-xl font-semibold mb-4">
                  Conseils pour une meilleure pratique
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">🧘 Posture</h3>
                    <p className="text-sm text-muted-foreground">
                      Asseyez-vous confortablement, dos droit, épaules relâchées.
                      La position debout est aussi possible.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">⏰ Moment idéal</h3>
                    <p className="text-sm text-muted-foreground">
                      Le matin au réveil ou le soir avant de dormir sont les moments optimaux
                      pour la pratique.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">🎧 Environnement</h3>
                    <p className="text-sm text-muted-foreground">
                      Choisissez un endroit calme. Les écouteurs peuvent aider à vous isoler
                      des distractions.
                    </p>
                  </Card>
                </div>
              </section>

              {/* Related Modules */}
              <section aria-labelledby="related-title" className="mt-12">
                <h2 id="related-title" className="text-xl font-semibold mb-4">
                  À découvrir aussi
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link to="/vr-breath">
                    <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h3 className="font-medium mb-1">🌌 VR Breath</h3>
                      <p className="text-sm text-muted-foreground">
                        Respiration guidée en réalité virtuelle immersive
                      </p>
                    </Card>
                  </Link>
                  <Link to="/flash-glow">
                    <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h3 className="font-medium mb-1">✨ Flash Glow</h3>
                      <p className="text-sm text-muted-foreground">
                        Sessions courtes de 2 minutes avec gamification
                      </p>
                    </Card>
                  </Link>
                  <Link to="/meditation">
                    <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <h3 className="font-medium mb-1">🧠 Méditation</h3>
                      <p className="text-sm text-muted-foreground">
                        Combinez respiration et méditation guidée
                      </p>
                    </Card>
                  </Link>
                </div>
              </section>
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="border-t mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>
                  Les techniques de respiration présentées sont basées sur des études scientifiques.
                </p>
                <div className="flex gap-4">
                  <Link to="/terms" className="hover:text-foreground">
                    Conditions
                  </Link>
                  <Link to="/privacy" className="hover:text-foreground">
                    Confidentialité
                  </Link>
                  <Link to="/help" className="hover:text-foreground">
                    Aide
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </>
    </ConsentGate>
  );
}
