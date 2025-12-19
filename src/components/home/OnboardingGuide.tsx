/**
 * OnboardingGuide - Onboarding ultra court, orienté action immédiate
 * Vision: L'utilisateur lance une session AVANT toute explication
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Zap, AlertTriangle, ArrowRight, Play } from 'lucide-react';

interface Situation {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  sessionPath: string;
}

const situations: Situation[] = [
  {
    id: 'pressure',
    label: '😰 Sous pression',
    description: 'Examens, gardes, responsabilités qui s\'accumulent',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-amber-500',
    gradient: 'from-amber-500/20 to-orange-500/10',
    sessionPath: '/app/scan?context=pressure',
  },
  {
    id: 'exhausted',
    label: '💤 Épuisé',
    description: 'Fatigue physique et émotionnelle après des jours intenses',
    icon: <Moon className="h-6 w-6" />,
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/20 to-purple-500/10',
    sessionPath: '/app/scan?context=exhausted',
  },
  {
    id: 'overloaded',
    label: '🧠 Surchargé',
    description: 'Trop d\'informations, de patients, de décisions à prendre',
    icon: <AlertTriangle className="h-6 w-6" />,
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    sessionPath: '/app/scan?context=overloaded',
  },
  {
    id: 'fragile',
    label: '🙂 Stable mais fragile',
    description: 'Ça va, mais tu sens que ça pourrait basculer',
    icon: <Sun className="h-6 w-6" />,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    sessionPath: '/app/scan?context=fragile',
  },
];

const OnboardingGuide: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [step, setStep] = useState<'situation' | 'action'>('situation');

  const handleSituationSelect = (situation: Situation) => {
    setSelectedSituation(situation.id);
    setStep('action');
  };

  const handleStartSession = () => {
    const situation = situations.find(s => s.id === selectedSituation);
    if (situation) {
      navigate(situation.sessionPath);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
      <div className="container max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-10"
        >
          <AnimatePresence mode="wait">
            {step === 'situation' && (
              <motion.div
                key="situation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                {/* Étape 1 - Question directe */}
                <motion.div variants={itemVariants} className="text-center space-y-4">
                  <p className="text-sm font-medium text-primary uppercase tracking-wider">
                    Comment tu te sens ?
                  </p>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                    Comment tu te sens en ce moment dans ton rôle de soignant ?
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    On adapte la session à ton état. Pas de formulaire, pas d'explication.
                  </p>
                </motion.div>

                {/* Choix des situations */}
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {situations.map((situation) => (
                    <motion.div key={situation.id} variants={itemVariants}>
                      <Card
                        onClick={() => handleSituationSelect(situation)}
                        className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg group ${
                          selectedSituation === situation.id
                            ? 'border-primary shadow-lg'
                            : 'border-border/50 hover:border-primary/50'
                        }`}
                      >
                        <CardContent className="p-6 text-center space-y-3">
                          <div
                            className={`mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br ${situation.gradient} flex items-center justify-center ${situation.color} group-hover:scale-110 transition-transform`}
                          >
                            {situation.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{situation.label}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {situation.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {step === 'action' && (
              <motion.div
                key="action"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Étape 2 - Action immédiate */}
                <motion.div variants={itemVariants} className="text-center space-y-4">
                  <p className="text-sm font-medium text-primary uppercase tracking-wider">
                    Étape 2
                  </p>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                    On te propose une session adaptée
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Tu n'as rien à réussir. Laisse faire.<br />
                    <span className="text-sm">Tu peux arrêter quand tu veux.</span>
                  </p>
                </motion.div>

                {/* Session préparée */}
                <motion.div variants={itemVariants}>
                  <Card className="max-w-md mx-auto border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-8 text-center space-y-6">
                      <div className="mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Play className="h-10 w-10 text-primary" />
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xl font-semibold text-foreground">
                          Session personnalisée
                        </p>
                        <p className="text-muted-foreground">
                          Basée sur ton contexte : <span className="text-primary font-medium">
                            {situations.find(s => s.id === selectedSituation)?.label}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground/70">
                          Durée estimée : 2-5 minutes
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button
                          size="lg"
                          onClick={handleStartSession}
                          className="w-full py-6 text-lg font-semibold"
                        >
                          Lancer la session
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setStep('situation');
                            setSelectedSituation(null);
                          }}
                          className="text-muted-foreground"
                        >
                          Changer de contexte
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Note de réassurance */}
                <motion.p
                  variants={itemVariants}
                  className="text-center text-sm text-muted-foreground/70 italic"
                >
                  "Note ce qui a changé. Même légèrement."
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default OnboardingGuide;
