
import React, { useState } from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UserPlus, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OnboardingFlowPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: "Bienvenue sur EmotionsCare",
      description: "Commençons votre parcours de bien-être émotionnel",
      content: (
        <div className="space-y-4">
          <p className="text-center text-lg">
            EmotionsCare vous accompagne dans la gestion et l'amélioration de votre bien-être émotionnel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-medium">Suivi personnalisé</h3>
              <p className="text-sm text-muted-foreground">Analysez vos émotions au quotidien</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-medium">Coach IA</h3>
              <p className="text-sm text-muted-foreground">Conseils personnalisés en temps réel</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-medium">Outils interactifs</h3>
              <p className="text-sm text-muted-foreground">VR, musique, exercices de respiration</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Configurez votre profil",
      description: "Aidez-nous à personnaliser votre expérience",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Objectif principal</label>
              <select className="w-full p-2 border rounded-md">
                <option>Réduire le stress</option>
                <option>Améliorer l'humeur</option>
                <option>Développer la résilience</option>
                <option>Équilibre travail-vie</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau d'expérience</label>
              <select className="w-full p-2 border rounded-md">
                <option>Débutant</option>
                <option>Intermédiaire</option>
                <option>Avancé</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Préférences d'usage",
      description: "Définissez comment vous souhaitez utiliser EmotionsCare",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Fréquence d'utilisation</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="frequency" className="mr-2" />
                  Quotidienne (recommandé)
                </label>
                <label className="flex items-center">
                  <input type="radio" name="frequency" className="mr-2" />
                  Quelques fois par semaine
                </label>
                <label className="flex items-center">
                  <input type="radio" name="frequency" className="mr-2" />
                  Selon mes besoins
                </label>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Notifications</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Rappels quotidiens
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  Conseils personnalisés
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Résumés hebdomadaires
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Première évaluation",
      description: "Évaluons votre état émotionnel actuel",
      content: (
        <div className="space-y-4">
          <p className="text-center">Comment vous sentez-vous aujourd'hui ?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['😊', '😐', '😔', '😰'].map((emoji, index) => (
              <button
                key={index}
                className="p-4 border rounded-lg hover:bg-accent transition-colors text-center"
              >
                <span className="text-4xl block mb-2">{emoji}</span>
                <span className="text-sm">
                  {['Très bien', 'Neutre', 'Difficile', 'Stressé'][index]}
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Cette information nous aide à personnaliser votre expérience
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="space-y-6">
            {/* Header avec progression */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold">Parcours d'intégration</h1>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Étape {currentStep + 1} sur {steps.length}</span>
                  <span>{Math.round(progress)}% complété</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            </div>

            {/* Contenu de l'étape */}
            <Card className="glass-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                <p className="text-muted-foreground">{steps[currentStep].description}</p>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {steps[currentStep].content}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </Button>
              
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-primary'
                        : completedSteps.includes(index)
                        ? 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default OnboardingFlowPage;
