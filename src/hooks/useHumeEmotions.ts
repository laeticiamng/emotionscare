// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Blend {
  valence: number; // 0-1
  arousal: number;  // 0-1
}

interface UseHumeEmotionsProps {
  enabled?: boolean;
  sampleRate?: number; // fps for emotion detection
}

export const useHumeEmotions = ({ enabled = false, sampleRate = 1 }: UseHumeEmotionsProps) => {
  const [blend, setBlend] = useState<Blend>({ valence: 0.5, arousal: 0.5 });
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startEmotionDetection = async () => {
    if (!enabled) return;

    try {
      // Get camera permission and start stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' 
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Create canvas for frame capture
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
      }

      setIsActive(true);
      
      // Start emotion detection at specified sample rate
      intervalRef.current = setInterval(async () => {
        await captureAndAnalyzeFrame();
      }, 1000 / sampleRate);

    } catch (err) {
      setError('Camera permission denied');
      logger.error('Error accessing camera', err as Error, 'SYSTEM');
    }
  };

  const captureAndAnalyzeFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Capture current frame
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Convert to base64
    const frameData = canvas.toDataURL('image/jpeg', 0.7);
    
    try {
      const { data, error } = await supabase.functions.invoke('hume-ws-proxy', {
        body: {
          session_id: `hume_${Date.now()}`,
          frame: frameData,
          ts: Date.now()
        }
      });

      if (error) throw error;

      // Convert Hume emotion to valence/arousal
      const emotion = data.emotion;
      const confidence = data.confidence || 0.5;
      
      const newBlend = emotionToBlend(emotion, confidence);
      setBlend(newBlend);
      
    } catch (err) {
      logger.error('Error analyzing frame', err as Error, 'SCAN');
    }
  };

  const emotionToBlend = (emotion: string, confidence: number): Blend => {
    // Map emotions to valence/arousal space
    const emotionMap: Record<string, Blend> = {
      'joy': { valence: 0.8, arousal: 0.7 },
      'calm': { valence: 0.6, arousal: 0.3 },
      'sad': { valence: 0.2, arousal: 0.3 },
      'anger': { valence: 0.2, arousal: 0.8 },
      'fear': { valence: 0.3, arousal: 0.9 },
      'surprise': { valence: 0.6, arousal: 0.8 },
      'neutral': { valence: 0.5, arousal: 0.5 }
    };

    const baseBlend = emotionMap[emotion] || { valence: 0.5, arousal: 0.5 };
    
    // Smooth transition based on confidence
    const smoothingFactor = 0.3; // How much to change per update
    const targetBlend = {
      valence: baseBlend.valence * confidence + 0.5 * (1 - confidence),
      arousal: baseBlend.arousal * confidence + 0.5 * (1 - confidence)
    };

    return {
      valence: blend.valence * (1 - smoothingFactor) + targetBlend.valence * smoothingFactor,
      arousal: blend.arousal * (1 - smoothingFactor) + targetBlend.arousal * smoothingFactor
    };
  };

  const stopEmotionDetection = () => {
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

    setIsActive(false);
  };

  useEffect(() => {
    if (enabled && !isActive) {
      startEmotionDetection();
    } else if (!enabled && isActive) {
      stopEmotionDetection();
    }

    return () => {
      stopEmotionDetection();
    };
  }, [enabled]);

  useEffect(() => {
    return () => {
      stopEmotionDetection();
    };
  }, []);

  return {
    blend,
    isActive,
    error,
    videoRef,
    startEmotionDetection,
    stopEmotionDetection
  };
};