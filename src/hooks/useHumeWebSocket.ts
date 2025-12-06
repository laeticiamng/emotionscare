// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import { logger } from '@/lib/logger';

export interface HumeEmotion {
  name: string;
  score: number;
}

export interface HumeFaceResult {
  emotions: HumeEmotion[];
  valence?: number;
  arousal?: number;
}

interface UseHumeWebSocketProps {
  enabled?: boolean;
  onEmotions?: (result: HumeFaceResult) => void;
}

export const useHumeWebSocket = ({ enabled = false, onEmotions }: UseHumeWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<HumeFaceResult | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      logger.info('WebSocket already connected', {}, 'HUME');
      return;
    }

    try {
      // Get project ID from env
      const projectId = 'yaincoxihiqdksxgrsrk';
      const wsUrl = `wss://${projectId}.supabase.co/functions/v1/hume-websocket-proxy`;
      
      logger.info('Connecting to Hume WebSocket proxy', { wsUrl }, 'HUME');
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        logger.info('WebSocket connected', {}, 'HUME');
        setIsConnected(true);
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'connected') {
            logger.info('Hume AI connected', {}, 'HUME');
            return;
          }

          if (data.type === 'error') {
            logger.error('Hume error', new Error(data.message), 'HUME');
            setError(data.message);
            return;
          }

          // Parse Hume face results
          if (data.face?.predictions) {
            const predictions = data.face.predictions[0];
            if (predictions?.emotions) {
              const emotions = predictions.emotions as HumeEmotion[];
              
              // Calculate valence and arousal from emotions
              const { valence, arousal } = calculateValenceArousal(emotions);
              
              const result: HumeFaceResult = {
                emotions,
                valence,
                arousal
              };
              
              setLatestResult(result);
              onEmotions?.(result);
            }
          }
        } catch (err) {
          logger.error('Error parsing WebSocket message', err as Error, 'HUME');
        }
      };

      wsRef.current.onerror = () => {
        logger.error('WebSocket error', new Error('Connection failed'), 'HUME');
        setError('Connection error');
        setIsConnected(false);
      };

      wsRef.current.onclose = () => {
        logger.info('WebSocket closed', {}, 'HUME');
        setIsConnected(false);
      };

    } catch (err) {
      logger.error('Error connecting to WebSocket', err as Error, 'HUME');
      setError('Failed to connect');
    }
  }, [onEmotions]);

  const disconnect = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });

      streamRef.current = stream;

      if (!videoRef.current) {
        videoRef.current = document.createElement('video');
        videoRef.current.autoplay = true;
        videoRef.current.playsInline = true;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
      }

      // Start sending frames every 500ms (2 fps)
      intervalRef.current = setInterval(() => {
        sendFrame();
      }, 500);

      logger.info('Camera started', {}, 'HUME');
    } catch (err) {
      logger.error('Camera access denied', err as Error, 'HUME');
      setError('Camera access denied');
    }
  }, []);

  const sendFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !wsRef.current) return;
    if (wsRef.current.readyState !== WebSocket.OPEN) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture frame
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64
    const base64Frame = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

    // Send to Hume via WebSocket
    const message = {
      models: {
        face: {}
      },
      data: base64Frame
    };

    wsRef.current.send(JSON.stringify(message));
  }, []);

  useEffect(() => {
    if (enabled && !isConnected) {
      connect().then(() => {
        if (enabled) startCamera();
      });
    } else if (!enabled && isConnected) {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, isConnected, connect, disconnect, startCamera]);

  return {
    isConnected,
    error,
    latestResult,
    connect,
    disconnect,
    videoRef
  };
};

// Helper function to calculate valence/arousal from Hume emotions
function calculateValenceArousal(emotions: HumeEmotion[]): { valence: number; arousal: number } {
  // Emotion to valence/arousal mapping (based on circumplex model)
  const emotionMap: Record<string, { valence: number; arousal: number }> = {
    'Joy': { valence: 0.8, arousal: 0.6 },
    'Excitement': { valence: 0.7, arousal: 0.8 },
    'Amusement': { valence: 0.7, arousal: 0.7 },
    'Contentment': { valence: 0.7, arousal: 0.3 },
    'Calmness': { valence: 0.6, arousal: 0.2 },
    'Sadness': { valence: 0.2, arousal: 0.3 },
    'Anger': { valence: 0.2, arousal: 0.8 },
    'Fear': { valence: 0.3, arousal: 0.9 },
    'Disgust': { valence: 0.3, arousal: 0.6 },
    'Surprise': { valence: 0.5, arousal: 0.8 },
    'Confusion': { valence: 0.4, arousal: 0.5 },
    'Concentration': { valence: 0.5, arousal: 0.6 },
    'Neutral': { valence: 0.5, arousal: 0.5 }
  };

  let totalValence = 0;
  let totalArousal = 0;
  let totalWeight = 0;

  emotions.forEach(emotion => {
    const mapping = emotionMap[emotion.name] || { valence: 0.5, arousal: 0.5 };
    totalValence += mapping.valence * emotion.score;
    totalArousal += mapping.arousal * emotion.score;
    totalWeight += emotion.score;
  });

  if (totalWeight === 0) {
    return { valence: 0.5, arousal: 0.5 };
  }

  return {
    valence: totalValence / totalWeight,
    arousal: totalArousal / totalWeight
  };
}
