/**
 * ScannerEmotionnelPage - Questionnaire interactif en 5 étapes
 * Humeur, Énergie, Stress, Sommeil, Charge mentale
 * Résultat graphique radar (Recharts) + recommandation de protocole
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import {
  Smile,
  Battery,
  AlertTriangle,
  Moon,
  Brain,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Heart,
  Sparkles,
} from 'lucide-react';

interface ScanStep {
  id: string;
  label: string;
  question: string;
  icon: React.ReactNode;
  lowLabel: string;
  highLabel: string;
  color: string;
}

const SCAN_STEPS: ScanStep[] = [
  {
    id: 'humeur',
    label: 'Humeur',
    question: 'Comment décrivez-vous votre humeur générale en ce moment ?',
    icon: <Smile className="h-8 w-8" />,
    lowLabel: 'Très basse',
    highLabel: 'Excellente',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'energie',
    label: 'Énergie',
    question: 'Quel est votre niveau d\'énergie physique et mentale ?',
    icon: <Battery className="h-8 w-8" />,
    lowLabel: 'Épuisé(e)',
    highLabel: 'Plein d\'énergie',
    color: 'from-green-400 to-green-600',
  },
  {
    id: 'stress',
    label: 'Stress',
    question: 'À quel point vous sentez-vous stressé(e) ?',
    icon: <AlertTriangle className="h-8 w-8" />,
    lowLabel: 'Très stressé(e)',
    highLabel: 'Détendu(e)',
    color: 'from-red-400 to-red-600',
  },
  {
    id: 'sommeil',
    label: 'Sommeil',
    question: 'Comment évaluez-vous la qualité de votre dernier sommeil ?',
    icon: <Moon className="h-8 w-8" />,
    lowLabel: 'Très mauvais',
    highLabel: 'Réparateur',
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    id: 'charge',
    label: 'Charge mentale',
    question: 'Comment ressentez-vous votre charge mentale actuelle ?',
    icon: <Brain className="h-8 w-8" />,
    lowLabel: 'Submergé(e)',
    highLabel: 'Léger(e)',
    color: 'from-purple-400 to-purple-600',
  },
];

function getRecommendation(scores: Record<string, number>) {
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  const stressScore = scores.stress || 5;
  const sleepScore = scores.sommeil || 5;
  const energyScore = scores.energie || 5;

  if (stressScore <= 3) {
    return {
      protocol: 'Protocole Stop',
      emoji: '🛑',
      description:
        'Votre niveau de stress est élevé. Le protocole Stop vous aidera à interrompre le cycle de stress immédiatement avec une technique de pause en 3 minutes.',
      urgency: 'high' as const,
    };
  }
  if (sleepScore <= 3) {
    return {
      protocol: 'Protocole Night',
      emoji: '🌙',
      description:
        'Votre sommeil semble perturbé. Le protocole Night combine relaxation progressive et exercices de respiration pour améliorer votre endormissement.',
      urgency: 'medium' as const,
    };
  }
  if (energyScore <= 3) {
    return {
      protocol: 'Protocole Reset',
      emoji: '🔄',
      description:
        'Votre énergie est basse. Le protocole Reset propose une micro-récupération guidée pour retrouver votre vitalité en quelques minutes.',
      urgency: 'medium' as const,
    };
  }
  if (avg <= 4) {
    return {
      protocol: 'Protocole Respirez',
      emoji: '🌬️',
      description:
        'Votre état émotionnel global mérite attention. Le protocole Respirez utilise la cohérence cardiaque pour rétablir votre équilibre intérieur.',
      urgency: 'medium' as const,
    };
  }
  return {
    protocol: 'Continuez ainsi',
    emoji: '💙',
    description:
      'Votre état émotionnel est bon ! Continuez à prendre soin de vous. Revenez faire un scan régulièrement pour suivre votre évolution.',
    urgency: 'low' as const,
  };
}

const ScannerEmotionnelPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const step = SCAN_STEPS[currentStep];
  const currentScore = scores[step?.id] ?? 5;

  const handleSliderChange = useCallback(
    (value: number) => {
      setScores((prev) => ({ ...prev, [step.id]: value }));
    },
    [step?.id]
  );

  const handleNext = useCallback(() => {
    if (currentStep < SCAN_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleRestart = useCallback(() => {
    setCurrentStep(0);
    setScores({});
    setShowResults(false);
  }, []);

  const radarData = useMemo(
    () =>
      SCAN_STEPS.map((s) => ({
        dimension: s.label,
        score: scores[s.id] ?? 5,
        fullMark: 10,
      })),
    [scores]
  );

  const recommendation = useMemo(() => getRecommendation(scores), [scores]);

  const progress = ((currentStep + 1) / SCAN_STEPS.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-background py-12 md:py-20">
        <div className="container px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Résultat de votre scan
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Votre bilan{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  émotionnel
                </span>
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart */}
              <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8">
                <h2 className="text-lg font-semibold mb-6 text-center">Profil émotionnel</h2>
                <div className="w-full aspect-square max-w-[400px] mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="dimension"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 10]}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommendation */}
              <div className="space-y-6">
                <div
                  className={cn(
                    'bg-card border rounded-3xl p-6 md:p-8',
                    recommendation.urgency === 'high'
                      ? 'border-red-300 dark:border-red-800'
                      : recommendation.urgency === 'medium'
                        ? 'border-amber-300 dark:border-amber-800'
                        : 'border-green-300 dark:border-green-800'
                  )}
                >
                  <div className="text-4xl mb-4">{recommendation.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{recommendation.protocol}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {recommendation.description}
                  </p>
                </div>

                {/* Scores summary */}
                <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8">
                  <h3 className="text-lg font-semibold mb-4">Détail des scores</h3>
                  <div className="space-y-3">
                    {SCAN_STEPS.map((s) => {
                      const score = scores[s.id] ?? 5;
                      return (
                        <div key={s.id} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-28 shrink-0">
                            {s.label}
                          </span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(score / 10) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                              className={cn(
                                'h-full rounded-full bg-gradient-to-r',
                                s.color
                              )}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">{score}/10</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={handleRestart} variant="outline" className="rounded-full gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Refaire le scan
                  </Button>
                  <Button className="rounded-full gap-2 flex-1">
                    Commencer le protocole
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <div className="container px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            Scanner Émotionnel
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Comment allez-vous{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              vraiment ?
            </span>
          </h1>
          <p className="text-muted-foreground">
            5 dimensions, 3 minutes. Un bilan émotionnel complet.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>
              Étape {currentStep + 1} sur {SCAN_STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {/* Step indicators */}
          <div className="flex justify-between mt-3">
            {SCAN_STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => i <= currentStep && setCurrentStep(i)}
                disabled={i > currentStep}
                className={cn(
                  'flex flex-col items-center gap-1 transition-colors',
                  i <= currentStep ? 'text-primary' : 'text-muted-foreground/40'
                )}
                aria-label={`${s.label} - étape ${i + 1}`}
              >
                <div
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i < currentStep
                      ? 'bg-primary'
                      : i === currentStep
                        ? 'bg-primary ring-4 ring-primary/20'
                        : 'bg-muted-foreground/20'
                  )}
                />
                <span className="text-[10px] hidden sm:block">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 text-center"
          >
            {/* Icon */}
            <div
              className={cn(
                'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 text-white bg-gradient-to-br',
                step.color
              )}
            >
              {step.icon}
            </div>

            {/* Question */}
            <h2 className="text-xl md:text-2xl font-bold mb-2">{step.label}</h2>
            <p className="text-muted-foreground mb-10">{step.question}</p>

            {/* Slider */}
            <div className="max-w-md mx-auto">
              <div className="relative mb-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={currentScore}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30 [&::-webkit-slider-thumb]:cursor-pointer"
                  aria-label={`${step.label} - score de 1 à 10`}
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuenow={currentScore}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{step.lowLabel}</span>
                <span className="text-2xl font-bold text-foreground">{currentScore}</span>
                <span>{step.highLabel}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrev}
            variant="outline"
            className="rounded-full gap-2"
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>
          <Button onClick={handleNext} className="rounded-full gap-2">
            {currentStep === SCAN_STEPS.length - 1 ? 'Voir les résultats' : 'Suivant'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScannerEmotionnelPage;
