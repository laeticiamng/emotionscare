import React, { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { saveEmotion } from '@/lib/scanService';
import { Emotion, EmotionResult } from '@/types';
import { processEmotionForBadges } from '@/lib/gamificationService';
import EmojiPicker from './EmojiPicker';

interface EmotionScanFormProps {
  onEmotionDetected?: (emotion: Emotion) => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ onEmotionDetected }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [emojis, setEmojis] = useState('');
  const [mostRecentEmotion, setMostRecentEmotion] = useState<Emotion | null>(null);
  
  const handleEmojiSelect = useCallback((emoji: string) => {
    setEmojis(prevEmojis => prevEmojis + emoji);
  }, []);
  
  // Update the component's handlers to use the correct types
const handleAnalysisComplete = async (result: EmotionResult) => {
  if (!result || !user) return;

  try {
    // Store the emotion
    const emotion: Emotion = {
      id: result.id || uuid(),
      user_id: user.id,
      date: new Date().toISOString(),
      emotion: result.emotion,
      score: result.score,
      // Add other properties from result as needed
      confidence: result.confidence,
      intensity: result.intensity,
      text: result.text,
      ai_feedback: result.feedback || result.ai_feedback,
      category: 'neutral'
    };

    // Process for badges and points
    const gamificationResult = await processEmotionForBadges(result.emotion, user.id);
    
    if (gamificationResult && gamificationResult.newBadges.length > 0) {
      toast({
        title: "Nouveau badge obtenu !",
        description: `Vous avez obtenu le badge "${gamificationResult.newBadges[0].name}"`,
        variant: "default"
      });
    }

    // Save in database
    await saveEmotion(emotion);
    
    // Update state and call callback
    setMostRecentEmotion(emotion);
    if (onEmotionDetected) {
      onEmotionDetected(emotion);
    }
    
  } catch (error) {
    console.error('Error saving emotion:', error);
    toast({
      title: "Erreur",
      description: "Impossible de sauvegarder votre analyse émotionnelle.",
      variant: "destructive"
    });
  }
};

  return (
    <Card className="overflow-hidden shadow-md">
      <CardHeader>
        <CardTitle>Comment vous sentez-vous ?</CardTitle>
        <CardDescription>
          Partagez vos émotions pour un suivi personnalisé
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre état émotionnel..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emojis">Emojis</Label>
            <Input
              id="emojis"
              placeholder="Ajoutez des emojis..."
              value={emojis}
              onChange={(e) => setEmojis(e.target.value)}
            />
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
          </div>
          
          <Button className="w-full">
            Analyser mes émotions
          </Button>
        </div>
        
        {mostRecentEmotion && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-2">Dernière émotion détectée</h3>
            <p>Émotion: {mostRecentEmotion.emotion}</p>
            <p>Score: {mostRecentEmotion.score}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionScanForm;
