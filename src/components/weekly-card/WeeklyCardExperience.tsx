import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeeklyCard } from '@/hooks/useWeeklyCard';
import { CardDeck } from './CardDeck';
import { CardReveal } from './CardReveal';
import { CardFloat } from './CardFloat';
import { Loader2 } from 'lucide-react';

export const WeeklyCardExperience = () => {
  const { currentCard: card, canDraw, isDrawing: hookDrawing, drawCard: hookDrawCard } = useWeeklyCard();
  const loading = false;
  const error = null;
  const [isDrawing, setIsDrawing] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [showFloat, setShowFloat] = useState(false);

  useEffect(() => {
    if (card && !canDraw) {
      // Carte déjà tirée cette semaine → afficher directement la version flottante
      setShowFloat(true);
    }
  }, [card, canDraw]);

  const handleDrawCard = async () => {
    if (isDrawing || hookDrawing) return;
    
    setIsDrawing(true);
    
    // Appeler le hook de tirage
    const drawnCard = await hookDrawCard();
    
    if (drawnCard) {
      // Attendre 300ms (animation de tap)
      setTimeout(() => {
        setShowReveal(true);
      }, 300);
    } else {
      setIsDrawing(false);
    }
  };

  const handleRevealComplete = () => {
    setShowReveal(false);
    setShowFloat(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">
          Impossible de charger ta carte hebdomadaire
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {!showReveal && !showFloat && canDraw && (
          <motion.div
            key="deck"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <CardDeck onDrawCard={handleDrawCard} isDrawing={isDrawing} />
          </motion.div>
        )}

        {showReveal && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CardReveal card={card} onComplete={handleRevealComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carte flottante dans le coin */}
      {showFloat && <CardFloat card={card} />}

      {/* Effet ambiance : teinte globale basée sur la carte */}
      {showFloat && card && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5 }}
          style={{
            background: `radial-gradient(circle at 80% 80%, ${card.color}20 0%, transparent 60%)`,
          }}
        />
      )}
    </div>
  );
};
