// @ts-nocheck
/**
 * FIRST TIME GUIDE - EMOTIONSCARE
 * Composant de découverte guidée pour les nouveaux utilisateurs
 * Guide vers: Scan Émotionnel → Coach IA → Journal
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  MessageCircle, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FirstTimeGuideProps {
  onComplete?: () => void;
  onDismiss?: () => void;
}

const FirstTimeGuide: React.FC<FirstTimeGuideProps> = ({ onComplete, onDismiss }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const steps = [
    {
      id: 'scan',
      title: '🎭 Scan Émotionnel',
      description: 'Découvrez vos émotions en temps réel grâce à notre IA Hume',
      route: '/app/scan',
      icon: Camera,
      benefit: 'Compréhension de soi',
      duration: '2 min',
      xpReward: 50
    },
    {
      id: 'coach',
      title: '💬 Coach IA',
      description: 'Échangez avec votre coach personnel bienveillant',
      route: '/app/coach',
      icon: MessageCircle,
      benefit: 'Accompagnement personnalisé',
      duration: '5 min',
      xpReward: 75
    },
    {
      id: 'journal',
      title: '📝 Journal Émotionnel',
      description: 'Capturez vos pensées et suivez votre évolution',
      route: '/app/journal',
      icon: BookOpen,
      benefit: 'Introspection guidée',
      duration: '3 min',
      xpReward: 50
    }
  ];

  const progress = ((completedSteps.length) / steps.length) * 100;

  const handleStartStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    navigate(steps[stepIndex].route);
  };

  const handleCompleteStep = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    
    // Si tous les steps sont complétés
    if (completedSteps.length + 1 >= steps.length) {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Marquer le guide comme complété
        await supabase.from('discovery_log').insert({
          user_id: user.id,
          module_name: 'first_time_guide',
          action: 'completed',
          context: { steps_completed: steps.map(s => s.id) }
        });
      }
    } catch (error) {
      console.error('Error logging completion:', error);
    }
    
    setIsVisible(false);
    onComplete?.();
  };

  const handleDismiss = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('discovery_log').insert({
          user_id: user.id,
          module_name: 'first_time_guide',
          action: 'dismissed',
          context: { steps_completed: completedSteps.map(i => steps[i].id) }
        });
      }
    } catch (error) {
      console.error('Error logging dismissal:', error);
    }
    
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-300">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleDismiss}
            aria-label="Fermer le guide"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-accent" />
              <CardTitle className="text-xl">Votre Parcours Découverte</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Explorez les 3 fonctionnalités essentielles pour commencer
            </p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progression</span>
              <span className="font-medium text-accent">
                {completedSteps.length}/{steps.length} complétées
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStep && !isCompleted;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isCompleted 
                    ? 'border-success/50 bg-success/5' 
                    : isCurrent
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-success text-success-foreground' : 'bg-accent/10 text-accent'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        +{step.xpReward} XP
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>⏱️ {step.duration}</span>
                      <span>✨ {step.benefit}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={isCompleted ? "outline" : "default"}
                    onClick={() => isCompleted ? handleStartStep(index) : handleStartStep(index)}
                    className="flex-shrink-0"
                    disabled={isCompleted}
                  >
                    {isCompleted ? (
                      'Terminé'
                    ) : (
                      <>
                        Commencer
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}

          {completedSteps.length === steps.length && (
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="font-semibold text-success">Félicitations !</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Vous avez découvert les fonctionnalités essentielles d'EmotionsCare
              </p>
              <Badge variant="outline" className="text-success border-success">
                +175 XP gagnés
              </Badge>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="ghost" onClick={handleDismiss}>
              Explorer plus tard
            </Button>
            {completedSteps.length === steps.length && (
              <Button onClick={handleComplete} className="bg-accent hover:bg-accent/90">
                Terminer le guide
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstTimeGuide;
