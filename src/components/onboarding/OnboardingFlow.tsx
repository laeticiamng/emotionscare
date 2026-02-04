/**
 * OnboardingFlow - Parcours d'onboarding interactif
 * Guide les nouveaux utilisateurs à travers la plateforme
 */

import React, { useState, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, ChevronLeft, Check, Heart, Brain, 
  Sparkles, Target, Calendar, Users, Zap, ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof Heart;
  color: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  tips: string[];
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur EmotionsCare',
    description: 'Votre compagnon pour le bien-être émotionnel. Découvrons ensemble comment tirer le meilleur parti de la plateforme.',
    icon: Heart,
    color: 'bg-pink-500',
    tips: [
      'La plateforme s\'adapte à vos besoins',
      'Toutes vos données sont sécurisées',
      'Commencez par un simple check-in quotidien'
    ]
  },
  {
    id: 'scan',
    title: 'Scan Émotionnel',
    description: 'Analysez votre état émotionnel à travers le texte, la voix ou les expressions faciales.',
    icon: Brain,
    color: 'bg-purple-500',
    tips: [
      'Faites un scan quotidien pour suivre votre évolution',
      'L\'IA détecte les nuances de vos émotions',
      'Recevez des recommandations personnalisées'
    ]
  },
  {
    id: 'journal',
    title: 'Journal Intime',
    description: 'Exprimez-vous librement et analysez vos pensées avec notre journal intelligent.',
    icon: Sparkles,
    color: 'bg-blue-500',
    tips: [
      'Écrivez sans jugement',
      'L\'IA vous aide à identifier des patterns',
      'Dictez vos entrées par la voix'
    ]
  },
  {
    id: 'coach',
    title: 'Coach IA Personnel',
    description: 'Bénéficiez d\'un accompagnement personnalisé 24/7 avec notre coach émotionnel.',
    icon: Target,
    color: 'bg-green-500',
    tips: [
      'Posez n\'importe quelle question',
      'Recevez des exercices adaptés',
      'Le coach apprend de vos préférences'
    ]
  },
  {
    id: 'goals',
    title: 'Objectifs & Défis',
    description: 'Définissez vos objectifs de bien-être et relevez des défis quotidiens.',
    icon: Zap,
    color: 'bg-yellow-500',
    tips: [
      'Commencez par des objectifs simples',
      'Gagnez des points XP',
      'Débloquez des succès'
    ]
  },
  {
    id: 'community',
    title: 'Communauté Bienveillante',
    description: 'Rejoignez une communauté de soignants qui se soutiennent mutuellement.',
    icon: Users,
    color: 'bg-orange-500',
    tips: [
      'Partagez vos expériences',
      'Rejoignez des groupes thématiques',
      'Tout est anonyme par défaut'
    ]
  }
];

const OnboardingFlow: React.FC = memo(() => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  const goNext = useCallback(() => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps(prev => [...prev, step.id]);
    }
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: '🎉 Onboarding terminé !',
        description: 'Vous êtes prêt à utiliser EmotionsCare'
      });
    }
  }, [currentStep, step.id, completedSteps, toast]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipOnboarding = useCallback(() => {
    toast({
      title: 'Onboarding ignoré',
      description: 'Vous pouvez y revenir dans les paramètres'
    });
  }, [toast]);

  const Icon = step.icon;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary">
            Étape {currentStep + 1} sur {ONBOARDING_STEPS.length}
          </Badge>
          <Button variant="ghost" size="sm" onClick={skipOnboarding}>
            Passer
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step Navigation */}
        <div className="flex justify-center gap-2">
          {ONBOARDING_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentStep 
                  ? 'bg-primary scale-125' 
                  : completedSteps.includes(s.id)
                    ? 'bg-green-500'
                    : 'bg-muted'
              }`}
              aria-label={`Aller à l'étape ${idx + 1}`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="text-center py-8">
          <div className={`inline-flex p-4 rounded-full ${step.color} mb-6`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {step.description}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Conseils
          </h4>
          <ul className="space-y-2">
            {step.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>
          
          <Button onClick={goNext}>
            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <>
                Terminer
                <Check className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Quick Actions */}
        {currentStep === ONBOARDING_STEPS.length - 1 && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <h4 className="font-medium mb-3">Prêt à commencer ?</h4>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary">
                <Heart className="h-4 w-4 mr-2" />
                Faire un scan
              </Button>
              <Button size="sm" variant="secondary">
                <Brain className="h-4 w-4 mr-2" />
                Écrire dans le journal
              </Button>
              <Button size="sm" variant="secondary">
                <Target className="h-4 w-4 mr-2" />
                Définir un objectif
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

OnboardingFlow.displayName = 'OnboardingFlow';

export default OnboardingFlow;
