
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Emotion } from '@/types/types';

interface EmotionFeedbackProps {
  emotion: Emotion | null;
}

const EmotionFeedback = ({ emotion }: EmotionFeedbackProps) => {
  const navigate = useNavigate();
  
  if (!emotion?.ai_feedback) return null;
  
  return (
    <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center text-indigo-800">
          Résultat de l'analyse IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-indigo-700">
          {emotion.ai_feedback}
        </div>
        
        <div className="mt-6">
          <Button 
            onClick={() => navigate('/vr')}
            variant="outline"
            className="gap-2 border-indigo-300 hover:bg-indigo-100"
          >
            Planifier une micro-pause VR
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionFeedback;
