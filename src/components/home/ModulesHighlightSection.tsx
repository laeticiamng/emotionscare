/**
 * ModulesHighlightSection - Bento Grid layout inspiré 21st.dev
 * Cards cliquables avec hover effects premium
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Music, Shield, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ModuleHighlight {
  title: string;
  description: string;
  icon: React.ElementType;
  highlight?: string;
  /** Tailwind col/row span classes for bento sizing */
  span: string;
  gradient: string;
  /** Link target when user clicks — /signup for unauthenticated */
  href: string;
}

const modules: ModuleHighlight[] = [
  {
    title: "Scan émotionnel IA",
    description: "Évaluez votre état émotionnel en quelques questions et recevez des recommandations personnalisées.",
    icon: Brain,
    highlight: 'Auto-évaluation',
    span: 'md:col-span-2 md:row-span-2',
    gradient: 'from-primary/15 to-accent/10',
    href: '/signup',
  },
  {
    title: "Protocoles de respiration",
    description: "Cohérence cardiaque, technique 4-7-8, box breathing : retrouvez le calme rapidement.",
    icon: Heart,
    highlight: 'Exercices guidés',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-accent/15 to-primary/10',
    href: '/signup',
  },
  {
    title: "Coach IA",
    description: "Accompagnement bienveillant 24/7, adapté aux professionnels de santé.",
    icon: Sparkles,
    highlight: 'Disponible 24/7',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-primary/10 to-accent/15',
    href: '/signup',
  },
  {
    title: "Musicothérapie",
    description: "Fréquences binaurales et ambiances adaptées à votre état émotionnel.",
    icon: Music,
    highlight: 'Adaptatif',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-accent/10 to-primary/15',
    href: '/signup',
  },
  {
    title: "Protocole Night",
    description: "Sas d'apaisement avant le sommeil avec respiration immersive et ambiance sonore.",
    icon: Clock,
    highlight: 'Sommeil',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-primary/15 to-accent/5',
    href: '/signup',
  },
  {
    title: "Données sécurisées",
    description: "Vos données restent les vôtres. Conforme RGPD, hébergé en France, aucune revente.",
    icon: Shield,
    highlight: 'RGPD',
    span: 'md:col-span-2 md:row-span-1',
    gradient: 'from-muted/50 to-muted/30',
    href: '/legal/privacy',
  },
];

const BentoCard: React.FC<{ module: ModuleHighlight; index: number }> = memo(({ module, index }) => {
  const Icon = module.icon as React.FC<{ className?: string; 'aria-hidden'?: boolean }>;
  const isLarge = module.span.includes('col-span-2') && module.span.includes('row-span-2');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn('group relative', module.span)}
    >
      <Link to={module.href} className="block h-full" aria-label={`${module.title} — ${module.highlight}`}>
        <div className={cn(
          "relative h-full rounded-3xl border border-border/50 p-6 md:p-8 overflow-hidden",
          "bg-gradient-to-br backdrop-blur-sm",
          "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",
          module.gradient,
          isLarge && "md:p-10"
        )}>
          {/* Animated border glow on hover */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none animated-border-glow" />

          <div className={cn("relative z-10 flex flex-col h-full", isLarge && "justify-between")}>
            <div>
              <div className={cn(
                "inline-flex items-center justify-center rounded-2xl mb-4",
                "bg-background/80 shadow-sm",
                isLarge ? "w-16 h-16" : "w-12 h-12"
              )}>
                <Icon className={cn("text-primary", isLarge ? "h-8 w-8" : "h-5 w-5")} aria-hidden />
              </div>

              <h3 className={cn(
                "font-bold text-foreground mb-2",
                isLarge ? "text-2xl md:text-3xl" : "text-lg"
              )}>
                {module.title}
              </h3>

              <p className={cn(
                "text-muted-foreground leading-relaxed",
                isLarge ? "text-base md:text-lg max-w-md" : "text-sm"
              )}>
                {module.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              {module.highlight && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {module.highlight}
                </Badge>
              )}
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

BentoCard.displayName = 'BentoCard';

const ModulesHighlightSection: React.FC = () => {
  return (
    <section
      className="py-24 md:py-32 bg-background"
      aria-labelledby="modules-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-2" aria-hidden="true" />
            Nos modules
          </Badge>
          <h2 id="modules-title" className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Des outils concrets pour{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              votre quotidien
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Cliquez sur un module pour l'essayer.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto"
          role="list"
          aria-label="Modules EmotionsCare"
        >
          {modules.map((module, index) => (
            <BentoCard key={index} module={module} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(ModulesHighlightSection);
