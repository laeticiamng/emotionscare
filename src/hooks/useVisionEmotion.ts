import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VisionEmotionResult } from '@/types/realtime-emotion';
import { toast } from 'sonner';

export const useVisionEmotion = () => {
  const [isActive, setIsActive] = useState(false);
  const [latency, setLatency] = useState(0);
  const [lastResult, setLastResult] = useState<VisionEmotionResult | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const captureFrame = useCallback(async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Resize à 256px pour réduire latence
    canvas.width = 256;
    canvas.height = 256;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const analyzeFrame = useCallback(async () => {
    const frameData = await captureFrame();
    if (!frameData) return;

    try {
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('analyze-vision', {
        body: { imageBase64: frameData }
      });

      if (error) throw error;

      const result: VisionEmotionResult = {
        ...data,
        timestamp: Date.now()
      };

      setLatency(Date.now() - startTime);
      setLastResult(result);

    } catch (error) {
      console.error('[useVisionEmotion] Error:', error);
    }
  }, [captureFrame]);

  const start = useCallback(async () => {
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
      }
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setIsActive(true);

      // Analyser 1 frame par seconde
      intervalRef.current = setInterval(analyzeFrame, 1000);

      toast.success('Vision activée');

    } catch (error) {
      console.error('[useVisionEmotion] Start error:', error);
      toast.error('Erreur d\'accès à la caméra');
    }
  }, [analyzeFrame]);

  const stop = useCallback(() => {
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
    setLastResult(null);
    toast.info('Vision désactivée');
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isActive,
    latency,
    lastResult,
    videoRef,
    start,
    stop
  };
};
