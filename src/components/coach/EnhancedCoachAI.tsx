
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmotionResult, Emotion } from '@/types';
import { Loader2, RefreshCcw } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { saveEmotion } from '@/lib/scanService';

interface EnhancedCoachAIProps {
  emotionResult: EmotionResult;
  onRequestNewScan?: () => void;
}

/**
 * AI Coach component that provides personalized feedback based on emotional scan
 */
const EnhancedCoachAI: React.FC<EnhancedCoachAIProps> = ({
  emotionResult,
  onRequestNewScan
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(
    emotionResult.feedback || emotionResult.ai_feedback || null
  );
  
  const generateMoreFeedback = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // In a real app, this would call an API with the emotion data
      // For demo purposes, we'll generate some basic feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const emotion = emotionResult.emotion || emotionResult.primaryEmotion || 'neutral';
      const intensity = emotionResult.score || 5;
      
      const newFeedback = `
        J'ai analysé plus en profondeur votre état de ${emotion}.
        
        Pour un état émotionnel d'intensité ${intensity}/10, voici quelques recommandations supplémentaires :
        
        ${getRecommendationsForEmotion(emotion)}
        
        N'hésitez pas à me solliciter si vous souhaitez approfondir un aspect particulier.
      `;
      
      setAiFeedback(newFeedback);
      
      // Save the enhanced feedback
      const emotionToSave: Emotion = {
        id: emotionResult.id || uuid(),
        user_id: emotionResult.user_id || 'user-id',
        date: new Date().toISOString(),
        emotion: emotionResult.emotion || emotionResult.primaryEmotion || 'neutral',
        score: emotionResult.score || 5,
        text: emotionResult.text || '',
        emojis: emotionResult.emojis || '',
        ai_feedback: newFeedback
      };
      
      // In a real app, we would save this to the database
      await saveEmotion(emotionToSave);
      
    } catch (error) {
      console.error('Error generating feedback:', error);
      setAiFeedback("Désolé, je n'ai pas pu générer plus de conseils pour le moment. Veuillez réessayer plus tard.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const getRecommendationsForEmotion = (emotion: string): string => {
    // Simple recommendations based on emotion type
    const recommendations: {[key: string]: string} = {
      joy: "Profitez de cette énergie positive pour accomplir des tâches créatives ou socialiser. La joie est contagieuse, partagez-la avec votre entourage.",
      sadness: "Accordez-vous du temps pour ressentir cette émotion. La méditation et l'écriture peuvent vous aider à comprendre sa source. N'hésitez pas à contacter un proche.",
      anger: "Pratiquez des exercices de respiration profonde. L'activité physique peut aussi être un excellent moyen de canaliser cette énergie.",
      fear: "Identifiez la source de cette peur et évaluez si elle est fondée. La pleine conscience peut vous aider à rester ancré dans le présent.",
      surprise: "Profitez de cette ouverture d'esprit pour explorer de nouvelles idées ou perspectives.",
      calm: "C'est un excellent moment pour pratiquer la pleine conscience ou pour vous concentrer sur des tâches qui demandent de l'attention.",
      anxious: "Essayez des techniques de respiration 4-7-8 : inspirez pendant 4 secondes, retenez pendant 7, expirez pendant 8. Répétez 3-4 fois.",
      neutral: "C'est un bon moment pour faire le point sur vos objectifs et vos priorités. La neutralité offre une clarté cognitive précieuse."
    };
    
    return recommendations[emotion.toLowerCase()] || 
      "Prenez un moment pour observer cette émotion sans jugement. Qu'est-ce qu'elle essaie de vous communiquer ?";
  };
  
  return (
    <Card className="border border-primary/20 bg-background/50">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Feedback IA personnalisé :</p>
            <p className="whitespace-pre-line">
              {aiFeedback || (
                emotionResult.feedback || 
                emotionResult.ai_feedback ||
                `Je détecte une émotion de type ${emotionResult.emotion || emotionResult.primaryEmotion || 'neutre'}. 
                Souhaitez-vous des conseils personnalisés ?`
              )}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {onRequestNewScan && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRequestNewScan}
                className="text-xs"
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                Nouveau scan
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={generateMoreFeedback}
              disabled={isGenerating}
              className="text-xs ml-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Génération...
                </>
              ) : (
                "Plus de conseils"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCoachAI;
