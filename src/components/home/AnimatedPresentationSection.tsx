// @ts-nocheck
/**
 * AnimatedPresentationSection — Cinematic motion-graphics showcase
 * Scroll-driven reveal of EmotionsCare's key features with smooth framer-motion animations
 */

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Wind, Brain, HeartPulse, Shield, Sparkles, BarChart3 } from 'lucide-react';

/* ─── Feature data ─── */
const features = [
  {
    icon: Wind,
    title: 'Respiration guidée',
    description: 'Exercices de cohérence cardiaque en 3 minutes pour retrouver le calme entre deux consultations.',
    color: 'hsl(var(--primary))',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: Brain,
    title: 'Coaching IA',
    description: 'Un accompagnement émotionnel personnalisé, disponible 24/7, adapté à votre rythme.',
    color: 'hsl(var(--accent))',
    gradient: 'from-accent/20 to-accent/5',
  },
  {
    icon: HeartPulse,
    title: 'Suivi émotionnel',
    description: 'Visualisez vos tendances, identifiez vos patterns, progressez en conscience.',
    color: 'hsl(210 80% 60%)',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  {
    icon: Shield,
    title: 'Espace sécurisé',
    description: 'Vos données sont chiffrées et protégées. RGPD natif. Zéro exploitation commerciale.',
    color: 'hsl(150 60% 45%)',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    icon: Sparkles,
    title: 'Expérience immersive',
    description: 'Musique adaptative, ambiance sonore et visuels apaisants pour un moment rien qu\'à vous.',
    color: 'hsl(280 70% 60%)',
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
  {
    icon: BarChart3,
    title: 'Tableau de bord',
    description: 'Un panorama clair de votre bien-être avec des recommandations personnalisées.',
    color: 'hsl(30 80% 55%)',
    gradient: 'from-orange-500/20 to-orange-500/5',
  },
];

/* ─── Animated feature card ─── */
const FeatureCard: React.FC<{
  feature: (typeof features)[number];
  index: number;
}> = ({ feature, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 lg:p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        {/* Gradient background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${feature.color}15` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <Icon className="h-6 w-6" style={{ color: feature.color }} />
          </motion.div>

          {/* Title */}
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Animated circle decoration ─── */
const FloatingOrb: React.FC<{
  className: string;
  delay?: number;
}> = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  />
);

/* ─── Main section ─── */
const AnimatedPresentationSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 lg:py-32 bg-background"
      aria-labelledby="presentation-heading"
    >
      {/* Decorative orbs */}
      <FloatingOrb className="h-96 w-96 bg-primary -top-48 -left-48" delay={0} />
      <FloatingOrb className="h-64 w-64 bg-accent top-1/3 -right-32" delay={2} />
      <FloatingOrb className="h-80 w-80 bg-blue-500 -bottom-40 left-1/3" delay={4} />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section header */}
        <div className="mx-auto max-w-3xl text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Découvrez la plateforme
            </span>
          </motion.div>

          <motion.h2
            id="presentation-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Tout ce dont vous avez besoin,{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              en un seul endroit
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Des outils pensés par et pour les soignants, pour transformer
            3 minutes en un vrai moment de récupération.
          </motion.p>
        </div>

        {/* Feature grid with animated phone mockup in center */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Animated breathing preview — pas de fausses statistiques utilisateur */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 lg:mt-24 mx-auto max-w-3xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm shadow-2xl shadow-primary/5">
            {/* Browser chrome mockup */}
            <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                <div className="h-3 w-3 rounded-full bg-green-400/60" />
              </div>
              <div className="mx-auto flex-1 max-w-xs">
                <div className="rounded-md bg-muted/30 px-3 py-1 text-center text-xs text-muted-foreground">
                  emotionscare.com — Respiration guidée
                </div>
              </div>
            </div>

            {/* Aperçu illustratif d'un exercice — sans données fictives */}
            <div className="relative p-8 lg:p-12 flex flex-col items-center justify-center min-h-[280px]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Aperçu d'un exercice</p>
              <motion.div
                className="h-32 w-32 rounded-full border-4 border-primary/40 flex items-center justify-center bg-primary/5"
                animate={{
                  scale: [1, 1.25, 1],
                  borderColor: ['hsl(var(--primary) / 0.3)', 'hsl(var(--primary))', 'hsl(var(--primary) / 0.3)'],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-sm font-medium text-primary">Respirez</span>
              </motion.div>
              <p className="mt-6 text-sm text-muted-foreground">Inspire 4s · Retient 4s · Expire 6s</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedPresentationSection;
