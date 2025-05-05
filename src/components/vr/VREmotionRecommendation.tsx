
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, HeadphonesIcon, Headphones, Video } from 'lucide-react';
import type { Emotion } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { mockVRTemplatesData } from '@/data/mockVRTemplates';

// Map des émotions vers les types de sessions VR
const EMOTION_TO_VR: Record<string, string> = {
  happy: 'Forêt apaisante', // Keep happiness in balance with nature
  sad: 'Plage relaxante',   // Elevate mood with peaceful beach scenes
  angry: 'Plage relaxante',  // Calm anger with soothing waves
  anxious: 'Méditation guidée', // Reduce anxiety with guided meditation
  calm: 'Forêt apaisante',   // Maintain calm with forest environment
  excited: 'Respiration profonde', // Channel excitement with breathing
  stressed: 'Méditation guidée', // Alleviate stress with meditation
  tired: 'Plage relaxante',  // Rejuvenate with beach scenery
  neutral: 'Forêt apaisante', // General wellbeing with nature
  focused: 'Respiration profonde' // Maintain focus with breathing techniques
};

interface VREmotionRecommendationProps {
  emotion?: Emotion | null;
}

const VREmotionRecommendation: React.FC<VREmotionRecommendationProps> = ({ emotion }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!emotion) {
    return null;
  }

  // Determine recommended VR session type based on emotion
  const emotionName = emotion.emotion?.toLowerCase() || 'neutral';
  const recommendedTheme = EMOTION_TO_VR[emotionName] || 'Forêt apaisante';
  
  // Find matching template
  const recommendedTemplate = mockVRTemplatesData.find(template => 
    template.theme === recommendedTheme
  );
  
  // Descriptions of VR benefits by emotion
  const vrDescription = {
    happy: "Prolongez votre bien-être avec une immersion visuelle complète",
    sad: "Une expérience apaisante pour améliorer votre humeur naturellement",
    angry: "Un environnement calme pour retrouver votre sérénité intérieure",
    anxious: "Une méditation guidée pour réduire l'anxiété efficacement",
    neutral: "Une pause immersive pour maintenir votre équilibre émotionnel",
    focused: "Exercices de respiration pour renforcer votre concentration",
    stressed: "Une échappée virtuelle pour diminuer votre niveau de stress"
  };

  const handleStartVRSession = () => {
    toast({
      title: "Session VR recommandée",
      description: `Nous vous dirigeons vers "${recommendedTheme}" pour optimiser votre bien-être`,
    });
    
    // Navigate to VR session page
    navigate('/vr-sessions', { 
      state: { recommendedTemplate } 
    });
  };

  return (
    <Card className="mt-6 border-t-4" style={{ borderTopColor: '#8B5CF6' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Video className="mr-2 h-5 w-5" />
          Recommandation VR
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <h4 className="font-medium mb-1">Basé sur votre état émotionnel: <span className="text-primary">{emotion.emotion}</span></h4>
          <p className="text-sm text-muted-foreground">
            {vrDescription[emotionName] || "Une session VR adaptée à votre état émotionnel actuel"}
          </p>
        </div>
        
        <Button 
          onClick={handleStartVRSession}
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          <Sparkles className="h-5 w-5" />
          Explorer "{recommendedTheme}"
        </Button>
      </CardContent>
    </Card>
  );
};

export default VREmotionRecommendation;
