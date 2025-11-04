/**
 * HomePage — La Salle des Cartes Vivantes
 * Dashboard immersif avec tirage de carte hebdomadaire
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import PageSEO from '@/components/seo/PageSEO';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { ZeroNumberBoundary } from '@/features/dashboard/ZeroNumberBoundary';
import { useWeeklyCard } from '@/hooks/useWeeklyCard';
import { CardDeck } from '@/components/dashboard/CardDeck';
import { CardReveal } from '@/components/dashboard/CardReveal';
import { CardGallery } from '@/components/dashboard/CardGallery';
import { DashboardCards } from '@/features/dashboard/DashboardCards';
import { PrimaryCTA } from '@/features/dashboard/PrimaryCTA';
import { WeeklyCard } from '@/types/card';
import { CARD_THEMES } from '@/types/card';
import { GamificationStats } from '@/components/dashboard/GamificationStats';

const HomePage: React.FC = () => {
  const { currentCard, collection, canDraw, isDrawing, drawCard } = useWeeklyCard();
  const [showReveal, setShowReveal] = useState(false);
  const [revealCard, setRevealCard] = useState<WeeklyCard | null>(null);

  // Adapter le thème visuel selon la carte actuelle
  useEffect(() => {
    if (currentCard) {
      applyCardTheme(currentCard);
    }
  }, [currentCard]);

  const handleDraw = async () => {
    const card = await drawCard();
    if (card) {
      setRevealCard(card);
      setShowReveal(true);
    }
  };

  const handleCloseReveal = () => {
    setShowReveal(false);
    setRevealCard(null);
  };

  const applyCardTheme = (card: WeeklyCard) => {
    // Appliquer la couleur dominante aux CSS variables
    document.documentElement.style.setProperty('--card-theme-color', card.color);
  };

  const currentTheme = currentCard ? CARD_THEMES[currentCard.theme] : null;

  return (
    <ZeroNumberBoundary>
      <div 
        className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background transition-colors duration-1000"
        style={{
          backgroundImage: currentCard 
            ? `radial-gradient(ellipse at top, ${currentCard.color}15, transparent 50%)`
            : undefined
        }}
      >
        <PageSEO 
          title="La Salle des Cartes Vivantes" 
          description="Tire ta carte hebdomadaire et découvre ton mantra émotionnel" 
        />
        
        {/* Header unifié */}
        <GlobalHeader />
        
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Header avec galerie */}
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground">
                La Salle des Cartes Vivantes
              </h1>
              <p className="text-muted-foreground">
                {currentCard 
                  ? `Ta carte de la semaine : ${currentCard.badge}`
                  : 'Découvre ton mantra émotionnel hebdomadaire'
                }
              </p>
            </div>
            <CardGallery collection={collection} />
          </header>

          {/* Stats de gamification */}
          <GamificationStats />

          {/* Zone principale : Deck ou Carte actuelle */}
          {canDraw ? (
            <CardDeck onDraw={handleDraw} isDrawing={isDrawing} />
          ) : currentCard ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              {/* Carte flottante */}
              <div className="relative w-80 h-[480px] mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-card/80 border-2 border-primary/50 backdrop-blur-md p-8 flex flex-col items-center justify-between shadow-2xl"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {/* Halo d'aura */}
                  <motion.div
                    className="absolute -inset-4 rounded-2xl opacity-30 blur-xl"
                    style={{ background: currentCard.color }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center gap-6 text-center">
                    <div className="text-7xl animate-pulse">
                      {currentCard.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {currentCard.badge}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xs">
                      {currentCard.mantra}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Nouvelle carte lundi prochain
                  </div>
                </motion.div>
              </div>

              {/* CTA contextualisé */}
              {currentTheme && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 text-center"
                >
                  <PrimaryCTA 
                    kind="scan"
                    tone="neutral"
                  />
                </motion.div>
              )}
            </motion.div>
          ) : null}

          {/* Section Boutique Premium */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-background">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <CardTitle className="text-2xl">Boutique Premium EmotionsCare</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Découvrez notre collection exclusive de produits thérapeutiques et formations digitales. 
                  Chaque achat débloque un module premium sur la plateforme.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Formations premium</p>
                      <p className="text-xs text-muted-foreground">Masterclass & coaching</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Accès digitaux</p>
                      <p className="text-xs text-muted-foreground">Abonnements & VIP</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Services pro</p>
                      <p className="text-xs text-muted-foreground">Bilans & analyses</p>
                    </div>
                  </div>
                </div>
                
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/store">
                    Découvrir la boutique
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.section>

          {/* Modules du dashboard (adaptés au thème) */}
          {currentCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <DashboardCards 
                order={['breathe', 'journal', 'music', 'community']}
                tone="neutral"
              />
            </motion.div>
          )}
        </main>

        {/* Modal de révélation */}
        <AnimatePresence>
          {showReveal && (
            <CardReveal 
              card={revealCard} 
              onClose={handleCloseReveal}
            />
          )}
        </AnimatePresence>
      </div>
    </ZeroNumberBoundary>
  );
};

export default HomePage;
