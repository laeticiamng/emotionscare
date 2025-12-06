// @ts-nocheck
import { useState } from 'react';
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
    gradient: 'from-cyan-400/40 via-blue-400/30 to-indigo-400/40',
    rarity: 'common',
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    description: 'Profondeur infinie',
    gradient: 'from-indigo-600/40 via-purple-500/30 to-violet-600/40',
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
  common: 'border-slate-400/30',
  rare: 'border-cyan-400/50',
  epic: 'border-purple-400/50',
  legendary: 'border-amber-400/50',
};

export const CocoonGallery = ({ className }: { className?: string }) => {
  const { unlockedCocoons } = useCocoonStore();
  const [selectedCocoon, setSelectedCocoon] = useState<string | null>(null);

  return (
    <Card className={cn('border-indigo-400/20 bg-indigo-950/40 backdrop-blur-xl', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-50">
          <Sparkles className="h-5 w-5 text-indigo-300" />
          Collection de Cocons
        </CardTitle>
        <p className="text-sm text-indigo-200/80">
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
                className={cn(
                  'relative aspect-square overflow-hidden rounded-2xl border-2 transition-all',
                  isUnlocked ? RARITY_COLORS[cocoon.rarity] : 'border-slate-700/50',
                  isSelected && 'ring-2 ring-white/50'
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
                  <div className="flex h-full w-full items-center justify-center bg-slate-900/60">
                    <Lock className="h-8 w-8 text-slate-500" />
                  </div>
                )}

                {/* Cocoon name overlay */}
                {isUnlocked && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xs font-semibold text-white">{cocoon.name}</p>
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

                return (
                  <div className="rounded-xl bg-indigo-900/40 p-4">
                    <h4 className="font-semibold text-indigo-50">{cocoon.name}</h4>
                    <p className="mt-1 text-sm text-indigo-200/80">{cocoon.description}</p>
                    <span className="mt-2 inline-block rounded-full bg-indigo-800/50 px-3 py-1 text-xs font-medium text-indigo-200">
                      {cocoon.rarity}
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
};

export default CocoonGallery;
