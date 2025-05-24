
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface EmotionResult {
  emotion: string;
  confidence: number;
  timestamp: Date;
  details?: {
    joy?: number;
    sadness?: number;
    anger?: number;
    fear?: number;
    surprise?: number;
    disgust?: number;
  };
}

export const useEmotionScan = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const { toast } = useToast();

  const performScan = useCallback(async (): Promise<EmotionResult | null> => {
    setIsScanning(true);
    try {
      // Simuler un scan émotionnel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const emotions = ['happy', 'calm', 'focused', 'stressed', 'tired', 'energetic'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const confidence = Math.random() * 0.4 + 0.6; // 60-100%
      
      const result: EmotionResult = {
        emotion: randomEmotion,
        confidence,
        timestamp: new Date(),
        details: {
          joy: Math.random(),
          sadness: Math.random() * 0.3,
          anger: Math.random() * 0.2,
          fear: Math.random() * 0.3,
          surprise: Math.random() * 0.4,
          disgust: Math.random() * 0.1,
        }
      };

      setCurrentEmotion(result);
      setScanHistory(prev => [result, ...prev].slice(0, 10)); // Garder les 10 derniers

      toast({
        title: "Scan terminé",
        description: `Émotion détectée: ${randomEmotion} (${Math.round(confidence * 100)}% de confiance)`,
      });

      return result;
    } catch (error) {
      console.error('Error during emotion scan:', error);
      toast({
        title: "Erreur de scan",
        description: "Impossible d'effectuer le scan émotionnel",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsScanning(false);
    }
  }, [toast]);

  const getEmotionDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      happy: "Vous semblez joyeux et optimiste",
      sad: "Vous paraissez mélancolique",
      angry: "Une certaine frustration est détectée",
      calm: "Vous êtes dans un état serein",
      stressed: "Un niveau de stress est perceptible",
      focused: "Vous semblez concentré et déterminé",
      tired: "De la fatigue est détectée",
      energetic: "Vous débordez d'énergie",
      neutral: "Votre état émotionnel est équilibré",
    };

    return descriptions[emotion] || "État émotionnel indéterminé";
  }, []);

  const clearHistory = useCallback(() => {
    setScanHistory([]);
    setCurrentEmotion(null);
    toast({
      title: "Historique effacé",
      description: "L'historique des scans a été supprimé",
    });
  }, [toast]);

  return {
    isScanning,
    currentEmotion,
    scanHistory,
    performScan,
    getEmotionDescription,
    clearHistory,
  };
};

export default useEmotionScan;
