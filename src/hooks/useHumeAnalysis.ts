// @ts-nocheck

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface EmotionAnalysis {
  emotions: Array<{
    name: string;
    confidence: number;
    intensity: number;
  }>;
  dominant_emotion: string;
  overall_sentiment: string;
  confidence_score: number;
}

export const useHumeAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [emotionData, setEmotionData] = useState<EmotionAnalysis | null>(null);

  const analyzeEmotion = async (audioBlob?: Blob) => {
    setIsAnalyzing(true);
    
    try {
      let audioData = null;
      
      if (audioBlob) {
        // Convertir le blob audio en base64
        const reader = new FileReader();
        audioData = await new Promise((resolve, reject) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]); // Enlever le préfixe data:audio/...
          };
          reader.onerror = reject;
          reader.readAsDataURL(audioBlob);
        });
      }

      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { 
          audioData,
          analysisType: 'emotion'
        }
      });

      if (error) throw error;

      if (data.success) {
        setEmotionData(data.analysis);
        setCurrentEmotion(data.analysis.dominant_emotion);
        toast.success(`Émotion détectée: ${data.analysis.dominant_emotion}`);
        return data.analysis;
      }
    } catch (error) {
      logger.error('Erreur analyse Hume', error as Error, 'SCAN');
      toast.error('Erreur lors de l\'analyse émotionnelle');
    } finally {
      setIsAnalyzing(false);
    }
    
    return null;
  };

  const startVoiceAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await analyzeEmotion(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      // Enregistrer pendant 5 secondes
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
      
      toast.info('Analyse vocale en cours... Parlez pendant 5 secondes');
    } catch (error) {
      logger.error('Erreur accès microphone', error as Error, 'SYSTEM');
      toast.error('Impossible d\'accéder au microphone');
    }
  };

  return {
    analyzeEmotion,
    startVoiceAnalysis,
    isAnalyzing,
    currentEmotion,
    emotionData
  };
};
