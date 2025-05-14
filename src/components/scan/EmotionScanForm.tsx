
import React, { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { saveEmotion, analyzeEmotion } from '@/lib/scanService';
import { Emotion, EmotionResult } from '@/types/emotion';
import EmojiPicker from './EmojiPicker';

interface EmotionScanFormProps {
  onEmotionDetected?: (emotion: Emotion) => void;
  onScanComplete?: () => void;
  onClose?: () => void;
  userId?: string;
}

// Mock gamification service function
const processEmotionForBadges = async (emotion: string, userId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Randomly decide if a new badge is earned (20% chance)
  const earnedNewBadge = Math.random() < 0.2;
  
  if (earnedNewBadge) {
    return {
      points: Math.floor(Math.random() * 50) + 10,
      newBadges: [
        {
          id: uuid(),
          name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Explorer`,
          description: `Vous avez exploré l'émotion ${emotion} de manière consciente.`,
          image_url: '',
          icon: 'award'
        }
      ]
    };
  }
  
  return {
    points: Math.floor(Math.random() * 20) + 5,
    newBadges: []
  };
};

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ 
  onEmotionDetected, 
  onScanComplete,
  onClose,
  userId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [emojis, setEmojis] = useState('');
  const [mostRecentEmotion, setMostRecentEmotion] = useState<Emotion | null>(null);
  
  const handleEmojiSelect = useCallback((emoji: string) => {
    setEmojis(prevEmojis => prevEmojis + emoji);
  }, []);
  
  // Convert EmotionResult to Emotion
  const resultToEmotion = (result: EmotionResult, userId: string): Emotion => {
    return {
      id: result.id || uuid(),
      user_id: userId,
      date: result.date || new Date().toISOString(),
      emotion: result.emotion,
      score: result.score || Math.round((result.confidence || 0.5) * 100),
      confidence: result.confidence,
      intensity: result.intensity || result.score,
      text: result.text || result.transcript || '',
      ai_feedback: result.feedback || result.ai_feedback || '',
      category: result.category || 'neutral',
      emojis: Array.isArray(result.emojis) ? result.emojis : 
              (typeof result.emojis === 'string' ? result.emojis.split('') : [])
    };
  };
  
  const handleAnalysisComplete = async (result: EmotionResult) => {
    if (!result || (!user && !userId)) return;

    try {
      // Get the correct user ID
      const currentUserId = userId || user?.id || '';
      
      // Convert result to Emotion
      const emotion = resultToEmotion(result, currentUserId);

      // Process for badges and points
      const gamificationResult = await processEmotionForBadges(result.emotion || 'neutral', currentUserId);
      
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
      
      // Call completion handler if provided
      if (onScanComplete) {
        onScanComplete();
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

  const handleAnalyze = async () => {
    try {
      // Convert emojis string to array
      const emojiArray = emojis.split('');
      
      // Analyze the text and emojis
      const result = await analyzeEmotion(text, emojiArray);
      
      // Process the analysis result
      await handleAnalysisComplete(result);
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur s'est produite lors de l'analyse de votre émotion.",
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
          
          <Button className="w-full" onClick={handleAnalyze}>
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
