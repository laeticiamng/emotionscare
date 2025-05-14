
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { saveEmotion, convertToEmotionResult } from '@/lib/scanService';
import { Emotion, EmotionResult } from '@/types';
import { CheckCircle } from 'lucide-react';

interface EmotionScanResultProps {
  result: EmotionResult | null;
  onEmotionSaved?: (emotion: EmotionResult) => void;
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

  // Fonction pour s'assurer que les émojis sont toujours un tableau
  const ensureArrayEmojis = (emojis: string | string[]): string[] => {
    if (Array.isArray(emojis)) {
      return emojis;
    }
    return emojis ? [emojis] : [];
  };

  const saveEmotionResult = async () => {
    if (!result || !result.emotion) return;
    
    // Convert to a consistent format
    const emotionData = convertToEmotionResult(result);
    
    try {
      await saveEmotion(emotionData);
      setIsSaved(true);
      
      if (onEmotionSaved) {
        onEmotionSaved(emotionData);
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
            <p className="text-muted-foreground">Score : {result.score || Math.round((result.confidence || 0) * 100)}</p>
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
