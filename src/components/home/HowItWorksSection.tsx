// @ts-nocheck
/**
 * HowItWorksSection - Section "Comment ça marche" en 3 étapes
 * Parcours simplifié pour un novice total
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Compass, Smile } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    number: '1',
    title: 'Créez votre compte',
    description: 'Gratuit, en 30 secondes. Pas de carte bancaire.',
  },
  {
    icon: Compass,
    number: '2',
    title: 'Choisissez un exercice',
    description: 'Respiration, relaxation, musique… selon votre besoin du moment.',
  },
  {
    icon: Smile,
    number: '3',
    title: 'Ressentez la différence',
    description: 'En 2 à 5 minutes, retrouvez calme et clarté pour continuer votre journée.',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 md:py-28 bg-background" aria-labelledby="how-it-works-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-16"
        >
          <h2
            id="how-it-works-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Comment ça marche
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Trois étapes pour aller mieux, dès maintenant.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              {/* Number circle */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                  {step.number}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {step.description}
              </p>

              {/* Connector line on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(HowItWorksSection);
