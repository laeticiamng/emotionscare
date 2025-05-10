
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EmotionScanner from './EmotionScanner';
import { analyzeEmotion, saveEmotion } from '@/lib/scanService';
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
      const result = await analyzeEmotion({
        user_id: userId,
        text,
        emojis,
        audio_url: audioUrl || undefined,
        is_confidential: isConfidential,
        share_with_coach: true
      });
      
      if (result) {
        // Convertir le résultat en objet Emotion
        const emotion: Emotion = {
          id: result.id,
          user_id: userId,
          date: new Date().toISOString(),
          emotion: result.emotion,
          score: result.score,
          text: result.text || text,
          emojis: result.emojis || emojis,
          audio_url: audioUrl || undefined,
          ai_feedback: result.feedback || result.ai_feedback,
          is_confidential: isConfidential
        };
        
        // Sauvegarder l'émotion
        await saveEmotion(emotion);
        
        // Réinitialiser les champs
        setText('');
        setEmojis('');
        setAudioUrl(null);
        
        // Notifier les composants parents
        await onResultSaved();
        onScanComplete();
      }
      
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
