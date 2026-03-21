/**
 * ModulesHighlightSection - Bento Grid layout inspiré 21st.dev
 * Cards cliquables avec hover effects premium
 * Auth-aware: redirige vers le module ou vers /signup
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Music, Shield, Clock, Sparkles, ArrowRight, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ModuleHighlight {
  title: string;
  description: string;
  icon: React.ElementType;
  highlight?: string;
  span: string;
  gradient: string;
  /** Route for authenticated users */
  authHref: string;
  /** Route for anonymous users */
  anonHref: string;
}

const modules: ModuleHighlight[] = [
  {
    title: "Bilan de stress",
    description: "Répondez à quelques questions simples pour évaluer votre niveau de stress et recevoir un exercice adapté à votre état.",
    icon: Brain,
    highlight: '1 minute',
    span: 'md:col-span-2 md:row-span-2',
    gradient: 'from-primary/15 to-accent/10',
    authHref: '/app/scan',
    anonHref: '/signup',
  },
  {
    title: "Respiration guidée",
    description: "Exercices de respiration animés, avec guide visuel et sonore. Retrouvez le calme en 2 à 5 minutes.",
    icon: Heart,
    highlight: '2–5 min',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-accent/15 to-primary/10',
    authHref: '/app/breathing',
    anonHref: '/signup',
  },
  {
    title: "Coach IA",
    description: "Un assistant bienveillant disponible 24h/24 pour vous écouter et vous guider.",
    icon: Sparkles,
    highlight: 'Disponible 24/7',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-primary/10 to-accent/15',
    authHref: '/app/coach',
    anonHref: '/signup',
  },
  {
    title: "Musique apaisante",
    description: "Sons et ambiances sonores pour vous détendre, vous concentrer ou vous endormir.",
    icon: Music,
    highlight: 'Adaptatif',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-accent/10 to-primary/15',
    authHref: '/app/music',
    anonHref: '/signup',
  },
  {
    title: "Exercice sommeil",
    description: "Un sas d'apaisement avant le coucher avec respiration lente et sons relaxants.",
    icon: Clock,
    highlight: 'Avant le coucher',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-primary/15 to-accent/5',
    authHref: '/app/breathing',
    anonHref: '/signup',
  },
  {
    title: "Évaluation Burnout",
    description: "Questionnaire MBI-HSS validé : 22 items, 3 sous-échelles, radar chart et comparaison aux normes soignantes.",
    icon: ClipboardCheck,
    highlight: 'MBI-HSS',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-primary/10 to-accent/10',
    authHref: '/app/assess/burnout',
    anonHref: '/signup',
  },
  {
    title: "Données sécurisées",
    description: "Vos données restent les vôtres. Conforme RGPD, hébergé en Europe (UE), aucune revente.",
    icon: Shield,
    highlight: 'RGPD',
    span: 'md:col-span-1 md:row-span-1',
    gradient: 'from-muted/50 to-muted/30',
    authHref: '/legal/privacy',
    anonHref: '/legal/privacy',
  },
];

const BentoCard: React.FC<{ module: ModuleHighlight; index: number; isAuthenticated: boolean }> = memo(({ module, index, isAuthenticated }) => {
  const Icon = module.icon as React.FC<{ className?: string; 'aria-hidden'?: boolean }>;
  const isLarge = module.span.includes('col-span-2') && module.span.includes('row-span-2');
  const href = isAuthenticated ? module.authHref : module.anonHref;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={cn('group relative', module.span)}
    >
      <Link to={href} className="block h-full" aria-label={`${module.title} — ${module.highlight}`}>
        <div className={cn(
          "relative h-full rounded-3xl border border-border/50 p-6 md:p-8 overflow-hidden",
          "bg-gradient-to-br backdrop-blur-sm",
          "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500",
          module.gradient,
          isLarge && "md:p-10"
        )}>
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
              <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                {isAuthenticated ? 'Ouvrir' : 'Essayer'}
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

BentoCard.displayName = 'BentoCard';

const ModulesHighlightSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

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
            {isAuthenticated
              ? 'Retrouvez vos modules favoris en un clic.'
              : 'Découvrez chaque module — créez un compte gratuit pour commencer.'}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto"
          role="list"
          aria-label="Modules EmotionsCare"
        >
          {modules.map((module, index) => (
            <BentoCard key={index} module={module} index={index} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(ModulesHighlightSection);
