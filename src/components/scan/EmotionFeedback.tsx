
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { EmotionResult } from '@/types';

interface EmotionFeedbackProps {
  emotion: EmotionResult | null;
}

const EmotionFeedback = ({ emotion }: EmotionFeedbackProps) => {
  const navigate = useNavigate();
  
  if (!emotion) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Votre état émotionnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">Émotion détectée : {emotion.emotion}</p>
          {emotion.score && <p>Intensité : {emotion.score} / 100</p>}
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Recommandations personnalisées</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Prenez un moment pour respirer profondément</li>
            <li>Essayez une session de relaxation guidée</li>
            <li>Écrivez dans votre journal ce qui vous a affecté</li>
          </ul>
        </div>
        
        <Button 
          className="w-full"
          onClick={() => navigate('/journal/new')}
        >
          Exprimer cette émotion dans mon journal
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionFeedback;
