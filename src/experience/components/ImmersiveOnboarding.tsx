// @ts-nocheck
/**
 * Experience Layer — Immersive Onboarding
 * Exploratory 5-step onboarding replacing the flat 3-step card flow.
 *
 * Steps:
 *   1. Welcome — ambient scene, no text wall, emotional tone
 *   2. Who are you? — quick emotion scan (30s)
 *   3. Your space — dashboard illuminates progressively
 *   4. Your tools — coach, journal, music revealed one by one
 *   5. First step — free choice of what to explore
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, LayoutDashboard, Wrench, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExperienceStore } from '../store/experience.store';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
}

const STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue',
    subtitle: 'Votre espace de bien-être vous attend',
    icon: <Sparkles className="w-8 h-8" />,
    description: 'Prenez un instant. Respirez. Cet espace est conçu pour vous.',
  },
  {
    id: 'discover',
    title: 'Comment allez-vous ?',
    subtitle: '30 secondes pour faire connaissance',
    icon: <Brain className="w-8 h-8" />,
    description: 'Un scan rapide pour personnaliser votre expérience dès le premier instant.',
  },
  {
    id: 'space',
    title: 'Votre espace',
    subtitle: 'Il s\'adapte à vous',
    icon: <LayoutDashboard className="w-8 h-8" />,
    description: 'Votre tableau de bord évolue avec vos émotions, votre rythme, vos objectifs.',
  },
  {
    id: 'tools',
    title: 'Vos outils',
    subtitle: 'Coach · Journal · Musique',
    icon: <Wrench className="w-8 h-8" />,
    description: 'Trois compagnons qui vous accompagnent au quotidien, à votre rythme.',
  },
  {
    id: 'first-step',
    title: 'Premier pas',
    subtitle: 'Par où commencer ?',
    icon: <Compass className="w-8 h-8" />,
    description: 'Choisissez librement ce qui vous attire. Il n\'y a pas de mauvais choix.',
  },
];

interface ImmersiveOnboardingProps {
  onComplete: (firstChoice?: string) => void;
  onScanStart?: () => void;
  className?: string;
}

export function ImmersiveOnboarding({ onComplete, onScanStart, className }: ImmersiveOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);
  const palette = useExperienceStore((s) => s.ambient.palette);

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const next = useCallback(() => {
    if (currentStep === 1 && onScanStart) {
      onScanStart();
    }
    if (isLast) {
      onComplete();
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [currentStep, isLast, onComplete, onScanStart]);

  const firstStepChoices = [
    { id: 'scan', label: 'Scanner mes émotions', icon: '🔍' },
    { id: 'coach', label: 'Parler au coach IA', icon: '💬' },
    { id: 'journal', label: 'Écrire dans mon journal', icon: '📝' },
    { id: 'music', label: 'Écouter de la musique', icon: '🎵' },
  ];

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden',
        className
      )}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 -z-10 transition-all duration-[1200ms]"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at 50% 40%,
              ${palette.primary}${Math.round((0.05 + currentStep * 0.02) * 255).toString(16).padStart(2, '0')},
              transparent 60%
            )
          `,
        }}
      />

      {/* Progress dots */}
      <div className="flex gap-2 mb-12">
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full transition-colors duration-500',
              i <= currentStep ? 'bg-primary' : 'bg-muted-foreground/20'
            )}
            animate={
              i === currentStep && !reducedMotion
                ? { scale: [1, 1.3, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          className="text-center max-w-md mx-auto space-y-6"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(2px)' }}
          transition={{ duration: reducedMotion ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto"
            animate={
              reducedMotion
                ? {}
                : { scale: [1, 1.05, 1] }
            }
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {step.icon}
          </motion.div>

          {/* Title */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {step.title}
            </h1>
            <p className="text-muted-foreground mt-1">{step.subtitle}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-xs mx-auto">
            {step.description}
          </p>

          {/* First step choices */}
          {isLast ? (
            <div className="grid grid-cols-2 gap-3 pt-4">
              {firstStepChoices.map((choice) => (
                <motion.button
                  key={choice.id}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50',
                    'bg-card hover:bg-muted/50 transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  )}
                  whileHover={reducedMotion ? {} : { scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onComplete(choice.id)}
                >
                  <span className="text-2xl">{choice.icon}</span>
                  <span className="text-xs font-medium text-center">{choice.label}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.button
              className={cn(
                'px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium',
                'hover:bg-primary/90 transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              whileHover={reducedMotion ? {} : { scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={next}
            >
              {currentStep === 0 ? 'Commencer' : 'Continuer'}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
