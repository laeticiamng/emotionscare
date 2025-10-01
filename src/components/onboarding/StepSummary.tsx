// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, Wind, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StepSummaryProps {
  onFinish: () => void;
  onBack: () => void;
}

export const StepSummary: React.FC<StepSummaryProps> = ({ onFinish, onBack }) => {
  const navigate = useNavigate();

  const recommendations = [
    {
      id: 'breathwork',
      title: 'Breathwork',
      description: 'Exercices de respiration guidés',
      icon: Wind,
      deeplink: '/breathwork',
      reason: 'Parfait pour commencer en douceur'
    },
    {
      id: 'gamification',
      title: 'Défis wellness',
      description: 'Gamification de ton bien-être',
      icon: Zap,
      deeplink: '/gamification',
      reason: 'Idéal pour rester motivé·e'
    },
    {
      id: 'emotion-scan',
      title: 'Scan émotionnel',
      description: 'Analyse de ton état émotionnel',
      icon: Heart,
      deeplink: '/scan',
      reason: 'Pour mieux te connaître'
    }
  ];

  const handleTryModule = (deeplink: string) => {
    onFinish();
    navigate(deeplink);
  };

  const handleFinish = () => {
    onFinish();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl">✨</div>
        <h2 className="text-2xl font-semibold">C'est parti !</h2>
        <p className="text-muted-foreground">
          Ton profil EmotionsCare est prêt. Voici quelques modules recommandés pour commencer.
        </p>
      </div>

      <div className="grid gap-4">
        {recommendations.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{module.title}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {module.description}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {module.reason}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTryModule(module.deeplink)}
                  >
                    Essayer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-primary mx-auto" />
          <div>
            <h3 className="font-medium">Prêt·e à découvrir EmotionsCare ?</h3>
            <p className="text-sm text-muted-foreground">
              Tu peux toujours modifier tes préférences dans les réglages.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Précédent
        </Button>
        <Button onClick={handleFinish} className="bg-gradient-to-r from-primary to-primary/80">
          Commencer l'aventure
        </Button>
      </div>
    </div>
  );
};