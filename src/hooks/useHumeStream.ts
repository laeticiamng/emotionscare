// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from 'react';
import { HumeStreamClient } from '@/services/hume/stream';
import { toast } from '@/hooks/use-toast';

interface EmotionData {
  valence: number;
  arousal: number;
  dominantEmotion: string;
  confidence: number;
  timestamp: number;
}

export const useHumeStream = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<HumeStreamClient | null>(null);

  const connect = useCallback(() => {
    try {
      const apiKey = import.meta.env.VITE_HUME_API_KEY;

      if (!apiKey) {
        throw new Error('Hume API key not configured. Please set VITE_HUME_API_KEY in your environment variables.');
      }

      clientRef.current = new HumeStreamClient({ apiKey });
      
      clientRef.current.connect((emotion: EmotionData) => {
        setCurrentEmotion(emotion);
        setIsConnected(true);
      });

      toast({
        title: '🎭 Analyse émotionnelle activée',
        description: 'Votre état émotionnel est maintenant suivi en temps réel',
      });

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMsg);
      toast({
        title: '❌ Erreur de connexion',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setIsConnected(false);
    setCurrentEmotion(null);
    
    toast({
      title: 'Analyse désactivée',
      description: 'L\'analyse émotionnelle a été arrêtée',
    });
  }, []);

  const sendAudioChunk = useCallback((audioData: ArrayBuffer) => {
    if (clientRef.current) {
      clientRef.current.sendAudioChunk(audioData);
    }
  }, []);

  const sendText = useCallback((text: string) => {
    if (clientRef.current) {
      clientRef.current.sendText(text);
    }
  }, []);

  const getSmoothedEmotion = useCallback(() => {
    return clientRef.current?.getSmoothedEmotion() || { valence: 0.5, arousal: 0.5 };
  }, []);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return {
    isConnected,
    currentEmotion,
    error,
    connect,
    disconnect,
    sendAudioChunk,
    sendText,
    getSmoothedEmotion
  };
};
