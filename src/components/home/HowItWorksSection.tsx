/**
 * HowItWorksSection - Section "Comment ça marche" en 3 étapes
 * Parcours simplifié pour un novice total
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlus, Compass, Smile, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

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
    title: 'Retrouvez le calme',
    description: 'En 2 à 5 minutes : respiration plus lente, esprit plus clair, stress réduit.',
  },
];

const HowItWorksSection: React.FC = () => {
  const { isAuthenticated } = useAuth();

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
              className="relative flex flex-col items-center text-center group"
            >
              {/* Number circle */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:scale-105">
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

              {/* Connector arrow on desktop — visual flow indicator */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-muted-foreground/30" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA after steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-10 sm:mt-14"
        >
          <Link to={isAuthenticated ? '/app/home' : '/signup'}>
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold gap-2"
            >
              {isAuthenticated ? 'Accéder à mes exercices' : 'Essayer gratuitement'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(HowItWorksSection);
