// @ts-nocheck
/**
 * Defusion Haiku Card Component
 * Displays therapeutic haikus from the Grimoire collection
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Sparkles, Heart, RefreshCw } from 'lucide-react';
import { DefusionHaiku } from '@/data/defusionHaikus';
import { cn } from '@/lib/utils';

interface DefusionHaikuCardProps {
  haiku: DefusionHaiku;
  onNext?: () => void;
  onSave?: (haiku: DefusionHaiku) => void;
  showControls?: boolean;
  variant?: 'compact' | 'full';
}

const themeColors = {
  observation: {
    bg: 'from-sky-50 to-blue-100 dark:from-sky-950 dark:to-blue-900',
    border: 'border-sky-300 dark:border-sky-700',
    text: 'text-sky-900 dark:text-sky-100',
    badge: 'bg-sky-200 text-sky-900 dark:bg-sky-800 dark:text-sky-100',
  },
  acceptance: {
    bg: 'from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900',
    border: 'border-emerald-300 dark:border-emerald-700',
    text: 'text-emerald-900 dark:text-emerald-100',
    badge: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100',
  },
  presence: {
    bg: 'from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-900 dark:text-amber-100',
    badge: 'bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100',
  },
  letting_go: {
    bg: 'from-violet-50 to-purple-100 dark:from-violet-950 dark:to-purple-900',
    border: 'border-violet-300 dark:border-violet-700',
    text: 'text-violet-900 dark:text-violet-100',
    badge: 'bg-violet-200 text-violet-900 dark:bg-violet-800 dark:text-violet-100',
  },
  values: {
    bg: 'from-rose-50 to-pink-100 dark:from-rose-950 dark:to-pink-900',
    border: 'border-rose-300 dark:border-rose-700',
    text: 'text-rose-900 dark:text-rose-100',
    badge: 'bg-rose-200 text-rose-900 dark:bg-rose-800 dark:text-rose-100',
  },
};

const themeTitles = {
  observation: 'Observer',
  acceptance: 'Accepter',
  presence: 'Présence',
  letting_go: 'Lâcher prise',
  values: 'Valeurs',
};

export const DefusionHaikuCard: React.FC<DefusionHaikuCardProps> = ({
  haiku,
  onNext,
  onSave,
  showControls = true,
  variant = 'full',
}) => {
  const [saved, setSaved] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const colors = themeColors[haiku.theme];

  const handleSave = () => {
    if (onSave) {
      onSave(haiku);
      setSaved(true);
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
    }
  };

  if (variant === 'compact') {
    return (
      <Card className={cn('border-2', colors.border)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{haiku.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm">{haiku.title}</h4>
                <Badge className={cn('text-xs', colors.badge)}>
                  {themeTitles[haiku.theme]}
                </Badge>
              </div>
              <div className={cn('text-sm whitespace-pre-line font-serif italic', colors.text)}>
                {haiku.haiku.fr}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn('border-2 overflow-hidden relative', colors.border)}>
        {/* Sparkle animation when saved */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: Math.cos((i * Math.PI) / 6) * 100,
                    y: Math.sin((i * Math.PI) / 6) * 100,
                    opacity: 0,
                    scale: 1,
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn('bg-gradient-to-br p-8', colors.bg)}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-5xl">{haiku.icon}</div>
              <div>
                <h3 className={cn('text-xl font-bold', colors.text)}>{haiku.title}</h3>
                <Badge className={cn('mt-1', colors.badge)}>
                  <Book className="w-3 h-3 mr-1" />
                  {themeTitles[haiku.theme]}
                </Badge>
              </div>
            </div>
          </div>

          {/* Haiku content */}
          <div className="my-8 text-center">
            <motion.div
              className={cn(
                'text-xl md:text-2xl font-serif leading-relaxed whitespace-pre-line',
                colors.text
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {haiku.haiku.fr}
            </motion.div>

            {/* Decorative separator */}
            <div className="flex items-center justify-center gap-2 my-6">
              <div className={cn('h-px w-12', `bg-${colors.text.split('-')[1]}-400`)} />
              <Sparkles className="w-4 h-4 opacity-40" />
              <div className={cn('h-px w-12', `bg-${colors.text.split('-')[1]}-400`)} />
            </div>
          </div>

          {/* Description */}
          <motion.p
            className={cn('text-sm text-center mb-6 italic', colors.text, 'opacity-80')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {haiku.description}
          </motion.p>

          {/* Controls */}
          {showControls && (
            <div className="flex items-center justify-center gap-3">
              {onSave && (
                <Button
                  variant={saved ? 'secondary' : 'default'}
                  size="sm"
                  onClick={handleSave}
                  disabled={saved}
                  className="gap-2"
                >
                  <Heart className={cn('w-4 h-4', saved && 'fill-current')} />
                  {saved ? 'Sauvegardé' : 'Sauvegarder'}
                </Button>
              )}
              {onNext && (
                <Button variant="outline" size="sm" onClick={onNext} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Autre haiku
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Grimoire watermark */}
        <div className="absolute bottom-2 right-2 opacity-20">
          <Book className="w-6 h-6" />
        </div>
      </Card>
    </motion.div>
  );
};

/**
 * Haiku Dialog - For displaying haiku in a modal
 */
interface DefusionHaikuDialogProps {
  haiku: DefusionHaiku | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (haiku: DefusionHaiku) => void;
  onNext?: () => void;
}

export const DefusionHaikuDialog: React.FC<DefusionHaikuDialogProps> = ({
  haiku,
  open,
  onOpenChange,
  onSave,
  onNext,
}) => {
  if (!haiku) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className="w-full max-w-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <DefusionHaikuCard haiku={haiku} onSave={onSave} onNext={onNext} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
