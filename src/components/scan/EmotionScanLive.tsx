
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import EmotionScanner from './EmotionScanner';
import { analyzeText, analyzeEmojis, analyzeAudio, saveEmotion } from '@/lib/scanService';
import { Emotion } from '@/types';

interface EmotionScanLiveProps {
  userId: string;
  isConfidential?: boolean;
  onScanComplete: () => void;
  onResultSaved: () => Promise<void>;
}

const EmotionScanLive: React.FC<EmotionScanLiveProps> = ({
  userId,
  isConfidential = false,
  onScanComplete,
  onResultSaved
}) => {
  const [text, setText] = useState('');
  const [emojis, setEmojis] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyze = async () => {
    if (!text && !emojis && !audioUrl) return;
    
    setIsAnalyzing(true);
    
    try {
      let emotion: Emotion;
      
      if (text) {
        emotion = await analyzeText(text);
      } else if (emojis) {
        emotion = await analyzeEmojis(emojis);
      } else {
        emotion = await analyzeAudio(audioUrl!);
      }
      
      // Ajouter des informations supplémentaires à l'émotion
      const enhancedEmotion: Emotion = {
        ...emotion,
        user_id: userId,
        date: new Date().toISOString(),
        score: emotion.score || 0,
      };
      
      // Sauvegarder l'émotion
      await saveEmotion(enhancedEmotion);
      
      // Réinitialiser les champs
      setText('');
      setEmojis('');
      setAudioUrl(null);
      
      // Notifier les composants parents
      onResultSaved();
      onScanComplete();
      
    } catch (error) {
      console.error('Error analyzing emotion:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="overflow-hidden shadow-md">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Scanner mon émotion actuelle</h2>
        
        <EmotionScanner
          text={text}
          emojis={emojis}
          audioUrl={audioUrl}
          onTextChange={setText}
          onEmojiChange={setEmojis}
          onAudioChange={setAudioUrl}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </CardContent>
    </Card>
  );
};

export default EmotionScanLive;
