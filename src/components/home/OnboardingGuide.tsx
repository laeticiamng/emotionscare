/**
 * OnboardingGuide - Guide de démarrage interactif pour nouveaux utilisateurs
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  action: {
    label: string;
    href: string;
  };
  color: string;
  gradient: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Découvrez votre profil émotionnel',
    description: 'Commencez par un scan émotionnel rapide pour comprendre votre état actuel',
    icon: '👁️',
    features: ['Analyse en 30 secondes', 'Résultats détaillés', 'Recommandations personnalisées'],
    action: { label: 'Faire mon scan', href: '/app/scan' },
    color: 'text-green-500',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 2,
    title: 'Écoutez votre musique émotionnelle',
    description: 'Recevez une composition musicale générée par IA adaptée à votre état',
    icon: '🎵',
    features: ['Musique en temps réel', 'Binaural beats', 'Sessions guidées'],
    action: { label: 'Explorer la musique', href: '/app/music' },
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    title: 'Parlez avec Nyvée',
    description: 'Votre coach IA personnel qui comprend vos émotions et vos besoins',
    icon: '🧠',
    features: ['Conversation 24/7', 'Conseils personnalisés', 'Suivi émotionnel'],
    action: { label: 'Rencontrer Nyvée', href: '/app/coach' },
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 4,
    title: 'Suivez vos progrès',
    description: 'Visualisez votre évolution émotionnelle avec des graphiques détaillés',
    icon: '📊',
    features: ['Tableaux de bord', 'Tendances long-terme', 'Rapports hebdomadaires'],
    action: { label: 'Voir mon dashboard', href: '/app/analytics' },
    color: 'text-orange-500',
    gradient: 'from-orange-500 to-red-500',
  },
];

const OnboardingGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const currentStep = steps[activeStep];
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mb-2">
              <Sparkles className="h-3 w-3 mr-2" />
              Bien démarrer
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold">
              Votre parcours en 4 étapes simples
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez progressivement toutes les fonctionnalités d'EmotionsCare
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Étape {activeStep + 1} sur {steps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complété</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Steps Navigation */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <motion.button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    activeStep === index
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50 bg-card'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{step.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm line-clamp-1">{step.title}</h3>
                        {completedSteps.includes(step.id) && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Step Details */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`border-2 bg-gradient-to-br ${currentStep.gradient} bg-opacity-[0.03] border-${currentStep.color}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-5xl mb-4">{currentStep.icon}</div>
                          <CardTitle className="text-3xl">{currentStep.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-lg text-muted-foreground">
                        {currentStep.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Ce que vous découvrirez :</h4>
                        {currentStep.features.map((feature, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-2 bg-white/5 rounded-lg"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-6">
                        <Button size="lg" className="flex-1" asChild>
                          <Link to={currentStep.action.href}>
                            {currentStep.action.label}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>

                        {activeStep < steps.length - 1 && (
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => {
                              handleStepComplete(currentStep.id);
                              setActiveStep(activeStep + 1);
                            }}
                            className="flex-1"
                          >
                            Étape suivante
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Step Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-3 mt-8"
          >
          {steps.map((step, index) => (
              <motion.button
                key={step.id}
                onClick={() => setActiveStep(index)}
                aria-label={`Étape ${index + 1}: ${step.title}${index === activeStep ? ' (active)' : ''}`}
                aria-current={index === activeStep ? 'step' : undefined}
                className={`h-3 rounded-full transition-all ${
                  index === activeStep
                    ? 'w-8 bg-primary'
                    : index < activeStep
                    ? 'w-3 bg-green-500'
                    : 'w-3 bg-muted'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default OnboardingGuide;
