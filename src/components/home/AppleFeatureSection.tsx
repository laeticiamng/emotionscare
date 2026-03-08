/**
 * AppleFeatureSection - Section produit style Apple avec scroll reveal
 * Chaque feature se révèle progressivement au scroll
 */

import React, { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  Shield, 
  Zap, 
  Heart, 
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  stat?: { value: string; label: string };
}

const features: Feature[] = [
  {
    icon: <Zap className="h-12 w-12" />,
    title: "Agit immédiatement.",
    subtitle: "Pas de préparation, pas de matériel.",
    description: "Ouvrez l'app, choisissez un exercice et suivez le guide. Pensé pour s'intégrer entre deux consultations, sans perturber votre rythme.",
    gradient: "from-primary to-accent",
    stat: { value: "2–5", label: "minutes par exercice" }
  },
  {
    icon: <Brain className="h-12 w-12" />,
    title: "Personnalisé par l'IA.",
    subtitle: "Chaque recommandation est adaptée.",
    description: "Le scanner émotionnel analyse votre état et vous oriente vers l'exercice le plus pertinent. Plus vous l'utilisez, plus il vous connaît.",
    gradient: "from-accent to-primary",
    stat: { value: "24/7", label: "coach IA disponible" }
  },
  {
    icon: <Shield className="h-12 w-12" />,
    title: "Vos données restent chez vous.",
    subtitle: "Rien ne quitte votre appareil.",
    description: "Les analyses émotionnelles tournent directement sur votre téléphone. Aucune vidéo, aucune photo n'est envoyée ni stockée. Conforme RGPD.",
    gradient: "from-primary/80 to-primary",
    stat: { value: "100%", label: "des données restent sur votre appareil" }
  },
  {
    icon: <Heart className="h-12 w-12" />,
    title: "Pensé pour le terrain.",
    subtitle: "Pas une appli de méditation de plus.",
    description: "Gardes de nuit, stress post-consultation, charge émotionnelle : chaque exercice répond à un moment précis de votre quotidien de soignant.",
    gradient: "from-accent/80 to-accent",
    stat: { value: "3", label: "modes : urgence, récupération, sommeil" }
  },
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.4 });
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group relative"
    >
      <div className="relative bg-card/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-border/50 hover:border-border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
        {/* Icon with gradient background */}
        <div className={cn(
          "inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8",
          "bg-gradient-to-br", feature.gradient,
          "text-white shadow-lg shadow-primary/20"
        )}>
          {feature.icon}
        </div>

        {/* Title */}
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
          {feature.title}
        </h3>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-light">
          {feature.subtitle}
        </p>
        
        {/* Description */}
        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
          {feature.description}
        </p>

        {/* Stat */}
        {feature.stat && (
          <div className="mt-8 pt-8 border-t border-border/50">
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-5xl md:text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                feature.gradient
              )}>
                {feature.stat.value}
              </span>
              <span className="text-muted-foreground text-sm">
                {feature.stat.label}
              </span>
            </div>
          </div>
        )}

        {/* Hover glow effect */}
        <div className={cn(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500",
          "bg-gradient-to-br pointer-events-none",
          feature.gradient,
          "blur-3xl -z-10"
        )} />
      </div>
    </motion.div>
  );
};

const AppleFeatureSection: React.FC = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });

  return (
    <section 
      id="features"
      className="relative py-32 md:py-40 bg-background overflow-hidden"
    >
      {/* Section title */}
      <div ref={titleRef} className="container px-4 sm:px-6 lg:px-8 mb-20 md:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Ce qui rend EmotionsCare{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              différent
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Conçu par une médecin qui connaît la réalité du terrain.
          </p>
        </motion.div>
      </div>

      {/* Features grid */}
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(AppleFeatureSection);
