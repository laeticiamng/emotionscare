
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Clock, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useVRSession } from '@/hooks/useVRSession';

interface VRPromptWidgetProps {
  userId: string;
  latestEmotion?: {
    emotion: string;
    score: number;
  };
}

const VRPromptWidget: React.FC<VRPromptWidgetProps> = ({ userId, latestEmotion }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedTemplate } = useVRSession(userId);
  
  // Determine recommendation based on emotion
  const getRecommendation = () => {
    if (!latestEmotion) return {
      title: "Besoin d'une pause ?",
      message: "Prenez 5 minutes pour une micro-pause immersive.",
      theme: "Forêt apaisante"
    };
    
    // Map emotions to recommendations
    const emotionMap: Record<string, any> = {
      stressed: {
        title: "Vous semblez stressé(e)",
        message: "Une micro-pause forêt pourrait vous aider à vous détendre.",
        theme: "Forêt apaisante"
      },
      calm: {
        title: "Gardez votre sérénité",
        message: "Maintenez votre état de calme avec une session plage.",
        theme: "Plage relaxante"
      },
      tired: {
        title: "Besoin de recharger ?",
        message: "Essayez une session guidée pour retrouver de l'énergie.",
        theme: "Méditation guidée"
      },
      anxious: {
        title: "Anxiété détectée",
        message: "Une session de respiration pourrait vous aider à vous recentrer.",
        theme: "Respiration profonde"
      },
      focused: {
        title: "Vous êtes concentré(e)",
        message: "Une courte pause pourrait vous aider à maintenir cet état.",
        theme: "Méditation guidée"
      }
    };
    
    const emotionKey = latestEmotion.emotion.toLowerCase();
    return emotionMap[emotionKey] || {
      title: "Prenez un moment pour vous",
      message: "Une micro-pause VR peut améliorer votre bien-être.",
      theme: "Forêt apaisante"
    };
  };
  
  const recommendation = getRecommendation();
  
  return (
    <Card className="overflow-hidden border-2 border-primary/10">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
        <h3 className="font-semibold text-lg flex items-center">
          <PlayCircle className="h-5 w-5 mr-2 text-primary" />
          {recommendation.title}
        </h3>
      </div>
      <CardContent className="p-4 pt-4">
        <div className="space-y-4">
          <p>{recommendation.message}</p>
          
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="bg-muted px-3 py-1 rounded-full flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>5 min</span>
            </div>
            <div className="bg-muted px-3 py-1 rounded-full flex items-center">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
              <span>-8% stress en moyenne</span>
            </div>
          </div>
          
          <div className="pt-2 space-y-2">
            <Button 
              className="w-full"
              onClick={() => navigate('/vr-sessions')}
            >
              Voir toutes les sessions
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Rappel programmé",
                  description: "Nous vous rappellerons de prendre une pause dans 2 heures"
                });
              }}
            >
              Me le rappeler plus tard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRPromptWidget;
