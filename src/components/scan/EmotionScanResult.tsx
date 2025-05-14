
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { saveEmotion } from '@/lib/scanService';
import { Emotion, EmotionResult } from '@/types';
import { CheckCircle } from 'lucide-react';

interface EmotionScanResultProps {
  result: EmotionResult | null;
  onEmotionSaved?: (emotion: Emotion) => void;
}

const EmotionScanResult: React.FC<EmotionScanResultProps> = ({ result, onEmotionSaved }) => {
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  
  if (!result || !result.emotion) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Aucun résultat</CardTitle>
          <CardDescription>Aucune émotion détectée.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Veuillez réessayer.</p>
        </CardContent>
      </Card>
    );
  }

  const saveEmotionResult = async () => {
    if (!result || !result.emotion) return;
    
    const emotion: Emotion = {
      id: result.id || 'temp-id',
      user_id: result.user_id || 'user-id',
      date: result.date || new Date().toISOString(),
      emotion: result.emotion,
      score: result.score,
      text: result.text || result.transcript || '',
      emojis: result.emojis || '',
      ai_feedback: result.feedback || result.ai_feedback || '',
      category: determineEmotionCategory(result.emotion) // Add category
    };
    
    try {
      await saveEmotion(emotion);
      setIsSaved(true);
      
      if (onEmotionSaved) {
        onEmotionSaved(emotion);
      }
      
      toast({
        title: "Émotion sauvegardée",
        description: "Votre état émotionnel a été enregistré avec succès.",
      });
    } catch (error) {
      console.error('Error saving emotion:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre émotion.",
        variant: "destructive"
      });
    }
  };

  // Helper function to determine emotion category
  const determineEmotionCategory = (emotion: string): string => {
    const positiveEmotions = ['joy', 'happiness', 'excitement', 'satisfaction', 'content'];
    const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust', 'anxiety'];
    const neutralEmotions = ['surprise', 'neutral', 'calm'];
    
    const lowerEmotion = emotion.toLowerCase();
    
    if (positiveEmotions.includes(lowerEmotion)) return 'positive';
    if (negativeEmotions.includes(lowerEmotion)) return 'negative';
    if (neutralEmotions.includes(lowerEmotion)) return 'neutral';
    
    return 'other';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Résultat de l'analyse</CardTitle>
        <CardDescription>Votre émotion détectée : {result.emotion}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Émotion : {result.emotion}</h3>
            <p className="text-muted-foreground">Score : {result.score}</p>
          </div>
          <div>
            {isSaved ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-2" />
                Sauvegardé
              </div>
            ) : (
              <Button onClick={saveEmotionResult}>
                Sauvegarder
              </Button>
            )}
          </div>
        </div>
        
        {result.feedback && (
          <div className="rounded-md border p-4">
            <p className="text-sm font-medium">Feedback :</p>
            <p className="text-sm text-muted-foreground">{result.feedback}</p>
          </div>
        )}
        
        {result.ai_feedback && (
          <div className="rounded-md border p-4">
            <p className="text-sm font-medium">Analyse IA :</p>
            <p className="text-sm text-muted-foreground">{result.ai_feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanResult;
