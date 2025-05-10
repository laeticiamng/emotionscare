
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      let emotion: Emotion | undefined;
      
      if (text) {
        emotion = await analyzeText(text);
        emotion.user_id = userId;
      } else if (emojis) {
        const result = await analyzeEmojis(emojis, userId);
        // Convertir EmotionResult en Emotion
        emotion = {
          id: result.id || crypto.randomUUID(),
          user_id: userId,
          date: result.date?.toString() || new Date().toISOString(),
          emotion: result.emotion,
          confidence: result.confidence,
          score: result.score,
          text: result.text,
          name: result.emotion,
          intensity: 5,
          category: 'Basic'
        };
      } else if (audioUrl) {
        const result = await analyzeAudio(audioUrl, userId);
        // Convertir EmotionResult en Emotion
        emotion = {
          id: result.id || crypto.randomUUID(),
          user_id: userId,
          date: result.date?.toString() || new Date().toISOString(),
          emotion: result.emotion,
          confidence: result.confidence,
          score: result.score,
          text: result.text,
          audio_url: audioUrl,
          name: result.emotion,
          intensity: 5,
          category: 'Basic'
        };
      }
      
      if (emotion) {
        // Ajouter des informations supplémentaires à l'émotion
        const enhancedEmotion: Emotion = {
          ...emotion,
          is_confidential: isConfidential,
        };
        
        // Sauvegarder l'émotion
        await saveEmotion(enhancedEmotion);
        
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
