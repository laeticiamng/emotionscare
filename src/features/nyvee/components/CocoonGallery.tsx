/**
 * CocoonGallery - Galerie des cocons débloqués avec thèmes sémantiques
 */

import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCocoonStore } from '@/features/nyvee/stores/cocoonStore';

interface CocoonType {
  id: string;
  name: string;
  description: string;
  gradient: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const COCOONS: CocoonType[] = [
  {
    id: 'crystal',
    name: 'Cristal',
    description: 'Transparence apaisante',
    gradient: 'from-cyan-400/40 via-blue-400/30 to-primary/40',
    rarity: 'common',
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    description: 'Profondeur infinie',
    gradient: 'from-primary/40 via-purple-500/30 to-violet-600/40',
    rarity: 'rare',
  },
  {
    id: 'water',
    name: 'Eau',
    description: 'Fluidité sereine',
    gradient: 'from-teal-400/40 via-cyan-300/30 to-blue-400/40',
    rarity: 'rare',
  },
  {
    id: 'foliage',
    name: 'Feuillage',
    description: 'Nature vivante',
    gradient: 'from-emerald-400/40 via-green-400/30 to-lime-400/40',
    rarity: 'epic',
  },
  {
    id: 'aurora',
    name: 'Aurore',
    description: 'Lumière dansante',
    gradient: 'from-pink-400/40 via-purple-400/30 to-blue-400/40',
    rarity: 'legendary',
  },
  {
    id: 'ember',
    name: 'Braise',
    description: 'Chaleur douce',
    gradient: 'from-orange-400/40 via-red-400/30 to-rose-400/40',
    rarity: 'epic',
  },
];

const RARITY_COLORS = {
  common: 'border-muted-foreground/30',
  rare: 'border-cyan-400/50',
  epic: 'border-purple-400/50',
  legendary: 'border-amber-400/50',
};

const RARITY_LABELS = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

interface CocoonGalleryProps {
  className?: string;
}

export const CocoonGallery = memo(({ className }: CocoonGalleryProps) => {
  const { unlockedCocoons } = useCocoonStore();
  const [selectedCocoon, setSelectedCocoon] = useState<string | null>(null);

  return (
    <Card className={cn('border-primary/20 bg-card/60 backdrop-blur-xl', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Collection de Cocons
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {unlockedCocoons.length} / {COCOONS.length} cocons découverts
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {COCOONS.map((cocoon) => {
            const isUnlocked = unlockedCocoons.includes(cocoon.id);
            const isSelected = selectedCocoon === cocoon.id;

            return (
              <motion.button
                key={cocoon.id}
                onClick={() => setSelectedCocoon(isSelected ? null : cocoon.id)}
                whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                aria-label={isUnlocked ? `Cocon ${cocoon.name} - ${cocoon.description}` : `Cocon verrouillé`}
                aria-pressed={isSelected}
                className={cn(
                  'relative aspect-square overflow-hidden rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50',
                  isUnlocked ? RARITY_COLORS[cocoon.rarity] : 'border-border/50',
                  isSelected && 'ring-2 ring-primary/50'
                )}
              >
                {isUnlocked ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      'h-full w-full bg-gradient-to-br backdrop-blur-xl',
                      cocoon.gradient
                    )}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted/30">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                {/* Cocoon name overlay */}
                {isUnlocked && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent p-2">
                    <p className="text-xs font-semibold text-foreground">{cocoon.name}</p>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selected cocoon details */}
        <AnimatePresence>
          {selectedCocoon && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              {(() => {
                const cocoon = COCOONS.find((c) => c.id === selectedCocoon);
                if (!cocoon) return null;
                const isUnlocked = unlockedCocoons.includes(cocoon.id);

                return (
                  <div className="rounded-xl bg-muted/30 p-4">
                    <h4 className="font-semibold text-foreground">{cocoon.name}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {isUnlocked ? cocoon.description : 'Continue tes sessions pour débloquer ce cocon !'}
                    </p>
                    <span className={cn(
                      'mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium',
                      cocoon.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400' :
                      cocoon.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                      cocoon.rarity === 'rare' ? 'bg-cyan-500/20 text-cyan-400' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {RARITY_LABELS[cocoon.rarity]}
                    </span>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

CocoonGallery.displayName = 'CocoonGallery';

export default CocoonGallery;
