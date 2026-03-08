/**
 * SocialProofSection - Crédibilité authentique et trust badges
 * Pas de faux témoignages, pas de faux logos partenaires
 * Basé sur la politique de transparence EmotionsCare
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Award, Heart, GraduationCap, Sparkles, Quote, Brain, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Principes vérifiables — pas de témoignages inventés */
const principles = [
  {
    icon: Brain,
    title: "Fondée sur les neurosciences",
    description: "Chaque exercice repose sur des techniques scientifiquement validées : respiration contrôlée, relaxation guidée, pleine conscience.",
  },
  {
    icon: Heart,
    title: "Conçue par une médecin",
    description: "Créée par une médecin qui connaît la réalité du terrain : gardes, stress, charge émotionnelle quotidienne.",
  },
  {
    icon: Clock,
    title: "Adaptée à votre rythme",
    description: "Des exercices de 2 à 5 minutes, utilisables entre deux consultations ou pendant une pause.",
  },
];

const trustBadges = [
  { icon: Shield, label: 'Conforme RGPD' },
  { icon: Award, label: 'Hébergé en France' },
  { icon: GraduationCap, label: 'Validé scientifiquement' },
  { icon: Heart, label: 'Créé par une médecin' },
];

const SocialProofSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-muted/20 overflow-hidden" aria-labelledby="social-proof-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Pourquoi nous faire confiance
          </span>
          <h2 id="social-proof-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Construite avec{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              exigence
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Pas de promesses vides. Une plateforme pensée pour le terrain, par une professionnelle de santé.
          </p>
        </motion.div>

        {/* Principles grid — remplace les faux témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative bg-card border border-border/50 rounded-2xl p-6 md:p-8 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <principle.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {principle.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {principle.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16"
        >
          {trustBadges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border/50 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Founder card — seule preuve sociale authentique */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-card border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl mx-auto mb-4">
            LM
          </div>
          <blockquote className="text-muted-foreground italic mb-4 max-w-lg mx-auto">
            <Quote className="h-4 w-4 text-primary inline mr-1" aria-hidden="true" />
            J'ai créé EmotionsCare parce que les soignants méritent des outils à la hauteur de ce qu'ils donnent chaque jour. Le stress ne devrait pas être le prix du soin.
          </blockquote>
          <p className="text-lg font-display font-semibold text-foreground">Laeticia Motongane</p>
          <p className="text-muted-foreground text-sm mb-4">
            Médecin · Fondatrice d&apos;EmotionsCare
          </p>
          <Link to="/about" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
            Découvrir notre histoire
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(SocialProofSection);
