
import { useState, useRef, useCallback } from 'react';
import { useMood } from './useMood';

interface HumeEmotionData {
  valence: number;
  arousal: number;
  emotions: Array<{
    name: string;
    score: number;
  }>;
  timestamp: number;
}

interface HumeConfig {
  enableFace: boolean;
  enableVoice: boolean;
  duration: number; // en secondes
}

export const useHume = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotionData, setEmotionData] = useState<HumeEmotionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { updateMood } = useMood();

  // Simulation WebSocket Hume (stub pour tests)
  const connectHume = useCallback(async (config: HumeConfig = { enableFace: true, enableVoice: true, duration: 10 }) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Demander permissions webcam/micro si nécessaire
      if (config.enableFace || config.enableVoice) {
        const constraints: MediaStreamConstraints = {
          video: config.enableFace,
          audio: config.enableVoice
        };

        streamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
      }

      // Simulation WebSocket connection (remplacer par vraie connexion Hume)
      // const wsUrl = `wss://api.hume.ai/v0/stream/models`;
      // wsRef.current = new WebSocket(wsUrl);
      
      // STUB : Simulation des données Hume
      setTimeout(() => {
        const mockEmotionData: HumeEmotionData = {
          valence: Math.random() * 2 - 1, // -1 à 1
          arousal: Math.random(), // 0 à 1
          emotions: [
            { name: 'joy', score: Math.random() },
            { name: 'calm', score: Math.random() },
            { name: 'excitement', score: Math.random() }
          ],
          timestamp: Date.now()
        };

        setEmotionData(mockEmotionData);
        
        // Mettre à jour useMood() avec les nouvelles données
        updateMood({
          valence: mockEmotionData.valence,
          arousal: mockEmotionData.arousal,
          timestamp: new Date().toISOString(),
          source: 'hume_analysis'
        });

        setIsConnected(true);
        setIsAnalyzing(false);
      }, config.duration * 1000);

    } catch (err: any) {
      setError(err.message || 'Erreur connexion Hume');
      setIsAnalyzing(false);
    }
  }, [updateMood]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsConnected(false);
    setIsAnalyzing(false);
  }, []);

  const startEmotionScan = useCallback((duration: number = 10) => {
    return connectHume({ enableFace: true, enableVoice: true, duration });
  }, [connectHume]);

  return {
    isConnected,
    isAnalyzing,
    emotionData,
    error,
    startEmotionScan,
    disconnect,
    connectHume
  };
};
