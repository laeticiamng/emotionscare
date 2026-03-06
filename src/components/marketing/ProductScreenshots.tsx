/**
 * ProductScreenshots - Showcase des captures d'écran du produit
 * Preuve visuelle pour les prospects avant inscription
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import screenshotDashboard from '@/assets/screenshots/screenshot-dashboard.jpg';
import screenshotScanner from '@/assets/screenshots/screenshot-scanner.jpg';
import screenshotCoach from '@/assets/screenshots/screenshot-coach.jpg';
import screenshotJournal from '@/assets/screenshots/screenshot-journal.jpg';

const SCREENS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    title: 'Suivi émotionnel complet',
    description: 'Visualisez vos tendances, votre score bien-être et vos activités récentes en un coup d\'œil.',
    image: screenshotDashboard,
  },
  {
    id: 'scanner',
    label: 'Scanner IA',
    title: 'Analyse émotionnelle instantanée',
    description: 'Notre IA détecte votre état émotionnel et vous recommande les exercices adaptés.',
    image: screenshotScanner,
  },
  {
    id: 'coach',
    label: 'Coach Nyvée',
    title: 'Accompagnement IA personnalisé',
    description: 'Un coach IA empathique qui vous guide avec des techniques adaptées à votre situation.',
    image: screenshotCoach,
  },
  {
    id: 'journal',
    label: 'Journal',
    title: 'Journal émotionnel enrichi',
    description: 'Documentez vos émotions avec des tags, un éditeur riche et un suivi d\'humeur quotidien.',
    image: screenshotJournal,
  },
] as const;

interface ProductScreenshotsProps {
  /** Compact mode for embedding in other sections */
  compact?: boolean;
}

const ProductScreenshots: React.FC<ProductScreenshotsProps> = ({ compact = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SCREENS[activeIndex];

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
        <div className="flex justify-center gap-2 mb-8 flex-wrap" role="tablist" aria-label="Captures d'écran du produit">
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

        {/* Screenshot display */}
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
              {/* Browser chrome mockup */}
              <div className="w-full max-w-5xl rounded-xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/5 bg-card">
                {/* Browser bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background/80 rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-xs mx-auto">
                      app.emotionscare.com
                    </div>
                  </div>
                </div>

                {/* Screenshot */}
                <img
                  src={active.image}
                  alt={active.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>

              {/* Caption */}
              <div className="text-center mt-6 max-w-lg">
                <h3 className="text-xl font-semibold mb-2">{active.title}</h3>
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
