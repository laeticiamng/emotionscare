// @ts-nocheck
/**
 * Composant : Galerie/Grimoire des cartes collectées
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CardCollection } from '@/types/card';
import { Book, Star, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CardGalleryProps {
  collection: CardCollection | null;
}

export const CardGallery: React.FC<CardGalleryProps> = ({ collection }) => {
  if (!collection) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Book className="w-4 h-4" />
          Mon grimoire ✨
          {collection.totalWeeks > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
              {collection.totalWeeks}
            </span>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Ton grimoire émotionnel
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {collection.totalWeeks}
            </div>
            <div className="text-xs text-muted-foreground">Semaines</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
              {collection.rareCount}
              <Star className="w-4 h-4 fill-primary text-primary" />
            </div>
            <div className="text-xs text-muted-foreground">Cartes rares</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
              {collection.currentStreak}
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xs text-muted-foreground">Semaines consécutives</div>
          </div>
        </div>

        {/* Collection */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {collection.cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                  {/* Rareté */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(
                      card.rarity === 'legendary' ? 4 :
                      card.rarity === 'epic' ? 3 :
                      card.rarity === 'rare' ? 2 : 1
                    )].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Icône + Badge */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{card.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">
                        {card.badge}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Semaine {card.weekNumber}
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-muted-foreground">
                    {new Date(card.pulledAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>

                  {/* Unlocks badge */}
                  {card.unlocks && card.unlocks.length > 0 && (
                    <div className="absolute top-2 right-2 px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium">
                      +{card.unlocks.length}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {collection.cards.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ton grimoire est vide</p>
              <p className="text-sm mt-1">Tire ta première carte pour commencer</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
