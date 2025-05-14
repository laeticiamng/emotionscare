
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuid } from 'uuid';
import { supabase } from '@/integrations/supabase/client'; 
import { EmotionResult } from '@/types/types';

export function useEmotionScanFormState(userId: string, onScanComplete?: () => void) {
  const [text, setText] = useState('');
  const [emojis, setEmojis] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<EmotionResult | null>(null);
  const { toast } = useToast();

  const handleTextChange = useCallback((value: string) => {
    setText(value);
  }, []);

  const handleEmojiChange = useCallback((value: string) => {
    setEmojis(value);
  }, []);

  const handleAudioChange = useCallback((url: string | null) => {
    setAudioUrl(url);
  }, []);

  // Mock function - would be replaced with actual AI analysis in a real app
  const analyzeEmotionData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate AI analysis
    const emotions = ['joy', 'sadness', 'anger', 'surprise', 'fear', 'disgust', 'neutral'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    const randomConfidence = 0.7 + (Math.random() * 0.3);
    
    // Ensure emojis is handled as string[]
    const emojiArray = emojis ? emojis.split('') : [];
    
    return {
      emotion: randomEmotion,
      confidence: randomConfidence,
      intensity: randomConfidence * 100,
      transcript: text,
      date: new Date().toISOString(),
      emojis: emojiArray,
      ai_feedback: `Je détecte une émotion de ${randomEmotion} dans votre analyse. C'est intéressant de voir comment vous exprimez cette émotion.`,
      score: Math.round(randomConfidence * 100),
      id: uuid(),
      user_id: userId,
      audio_url: audioUrl
    } as EmotionResult;
  };

  const saveEmotion = async (emotionData: EmotionResult) => {
    try {
      // Format the data for storage
      const dataToStore = {
        id: emotionData.id || uuid(),
        user_id: userId,
        date: new Date().toISOString(),
        emotion: emotionData.emotion,
        score: emotionData.score || Math.round((emotionData.confidence || 0.5) * 100),
        text: emotionData.text || emotionData.transcript || '',
        emojis: Array.isArray(emotionData.emojis) ? emotionData.emojis : 
               (emotionData.emojis ? emotionData.emojis.toString().split('') : []),
        audio_url: emotionData.audio_url || '',
        ai_feedback: emotionData.ai_feedback || emotionData.feedback || ''
      };

      const { error } = await supabase
        .from('emotions')
        .insert(dataToStore);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error saving emotion:', error);
      return false;
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!text && !emojis && !audioUrl) {
      toast({
        title: "Information manquante",
        description: "Veuillez fournir du texte, des emojis ou un enregistrement audio.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeEmotionData();
      setDetectedEmotion(result);
      
      const saved = await saveEmotion(result);
      
      if (saved) {
        toast({
          title: "Analyse complétée",
          description: `Émotion détectée : ${result.emotion}`,
        });
        
        if (onScanComplete) {
          onScanComplete();
        }
      } else {
        toast({
          title: "Avertissement",
          description: "Analyse complétée mais non sauvegardée.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'analyse.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, emojis, audioUrl, userId, toast, onScanComplete]);

  return {
    text,
    emojis,
    audioUrl,
    isAnalyzing,
    detectedEmotion,
    handleTextChange,
    handleEmojiChange,
    handleAudioChange,
    handleAnalyze
  };
}

export default useEmotionScanFormState;
