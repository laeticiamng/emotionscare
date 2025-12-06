import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Sparkles, ArrowRight, SkipForward } from 'lucide-react';

interface StepWelcomeProps {
  onNext: () => void;
  onSkip: () => void;
}

export const StepWelcome: React.FC<StepWelcomeProps> = ({ onNext, onSkip }) => {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Bienvenue 👋</h1>
        <p className="text-muted-foreground">
          Quelques questions pour personnaliser ton expérience bien-être
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ⏱️ Moins de 2 minutes • 🔒 Tes données restent privées
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={onNext}
            className="w-full h-12"
            size="lg"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Commencer
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onSkip}
            className="w-full"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Passer l'introduction
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Tu peux modifier ces réglages à tout moment dans les paramètres
          </p>
        </div>
      </CardContent>
    </Card>
  );
};