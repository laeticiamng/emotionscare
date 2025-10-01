// @ts-nocheck
/**
 * HomePage — La Salle des Cartes Vivantes
 * Dashboard immersif avec tirage de carte hebdomadaire
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageSEO from '@/components/seo/PageSEO';
import { ZeroNumberBoundary } from '@/features/dashboard/ZeroNumberBoundary';
import { useWeeklyCard } from '@/hooks/useWeeklyCard';
import { CardDeck } from '@/components/dashboard/CardDeck';
import { CardReveal } from '@/components/dashboard/CardReveal';
import { CardGallery } from '@/components/dashboard/CardGallery';
import { DashboardCards } from '@/features/dashboard/DashboardCards';
import { PrimaryCTA } from '@/features/dashboard/PrimaryCTA';
import { WeeklyCard } from '@/types/card';
import { CARD_THEMES } from '@/types/card';

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
                    kind="primary"
                    tone={currentCard.theme}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : null}

          {/* Modules du dashboard (adaptés au thème) */}
          {currentCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <DashboardCards 
                order={['breathe', 'journal', 'music', 'community']}
                tone={currentCard.theme}
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
