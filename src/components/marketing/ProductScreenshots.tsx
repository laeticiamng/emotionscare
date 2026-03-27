// @ts-nocheck
/**
 * ProductScreenshots - Aperçu visuel des fonctionnalités
 * Utilise des illustrations stylisées au lieu d'images statiques
 * qui risquent d'être cassées ou obsolètes
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Brain, Sparkles, BookOpen, BarChart3, Heart, Shield, Zap } from 'lucide-react';

const SCREENS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    title: 'Suivi émotionnel complet',
    description: 'Visualisez vos tendances, votre score bien-être et vos activités récentes en un coup d\'œil.',
    icon: BarChart3,
    color: 'from-primary to-accent',
    features: ['Score bien-être', 'Historique', 'Recommandations'],
  },
  {
    id: 'scanner',
    label: 'Scanner IA',
    title: 'Analyse émotionnelle instantanée',
    description: 'Notre IA détecte votre état émotionnel et vous recommande les exercices adaptés.',
    icon: Brain,
    color: 'from-accent to-primary',
    features: ['Détection IA', 'Recommandations', 'Suivi'],
  },
  {
    id: 'coach',
    label: 'Coach IA',
    title: 'Accompagnement IA personnalisé',
    description: 'Un coach IA empathique qui vous guide avec des techniques adaptées à votre situation.',
    icon: Sparkles,
    color: 'from-primary/80 to-accent/80',
    features: ['Chat 24/7', 'Techniques guidées', 'Suivi personnalisé'],
  },
  {
    id: 'journal',
    label: 'Journal',
    title: 'Journal émotionnel enrichi',
    description: 'Documentez vos émotions avec des tags, un éditeur riche et un suivi d\'humeur quotidien.',
    icon: BookOpen,
    color: 'from-accent/80 to-primary/80',
    features: ['Tags émotions', 'Éditeur riche', 'Historique'],
  },
] as const;

interface ProductScreenshotsProps {
  compact?: boolean;
}

const ProductScreenshots: React.FC<ProductScreenshotsProps> = ({ compact = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SCREENS[activeIndex];
  const Icon = active.icon;

  return (
    <section className={cn('py-16 md:py-24', !compact && 'bg-muted/20')}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        {!compact && (
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-3 block">
              Aperçu du produit
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Découvrez l'interface
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une expérience conçue pour les soignants — claire, rapide et accessible.
            </p>
          </div>
        )}

        {/* Tab selector */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap" role="tablist" aria-label="Fonctionnalités du produit">
          {SCREENS.map((screen, i) => (
            <button
              key={screen.id}
              role="tab"
              aria-selected={i === activeIndex}
              aria-controls={`panel-${screen.id}`}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                i === activeIndex
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              {screen.label}
            </button>
          ))}
        </div>

        {/* Feature display */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              id={`panel-${active.id}`}
              role="tabpanel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              {/* Stylized mockup */}
              <div className="w-full max-w-5xl rounded-xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/5 bg-card">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                    <div className="w-3 h-3 rounded-full bg-primary/40" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background/80 rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-xs mx-auto">
                      app.emotionscare.com
                    </div>
                  </div>
                </div>

                {/* Illustrated content instead of static image */}
                <div className={cn(
                  "aspect-[16/10] bg-gradient-to-br flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden",
                  active.color
                )}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
                  
                  <div className="relative z-10 text-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Icon className="h-10 w-10 md:h-12 md:w-12 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">{active.title}</h3>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {active.features.map((feat) => (
                        <span key={feat} className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="text-center mt-6 max-w-lg">
                <p className="text-muted-foreground text-sm">{active.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProductScreenshots;
