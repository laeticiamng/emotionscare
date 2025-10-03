import { useState, useCallback, useRef, useEffect } from 'react';
import { HumeSummary } from '@/store/grit.store';

interface HumeFacesConfig {
  enabled: boolean;
  frameRate?: number; // frames per second, default 1
  onEmotionDetected?: (emotion: string, confidence: number) => void;
  onSummaryUpdate?: (summary: HumeSummary) => void;
}

export const useHumeFaces = (config: HumeFacesConfig) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const samplesRef = useRef<Array<{ t: number; emo: string; conf: number }>>([]);

  const startCapture = useCallback(async () => {
    if (!config.enabled) {
      console.log('Hume faces disabled by config');
      return;
    }

    try {
      setError(null);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 320, 
          height: 240, 
          frameRate: { ideal: config.frameRate || 1 }
        }
      });

      // Set up video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Set up canvas for frame capture
      if (canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 320;
        canvas.height = 240;
      }

      // Connect to Hume WebSocket (via backend proxy)
      const wsUrl = `${process.env.VITE_SUPABASE_URL?.replace('https', 'wss')}/functions/v1/hume-proxy`;
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('Hume WebSocket connected');
        setIsActive(true);
        startFrameCapture();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.emotions && data.emotions.length > 0) {
            const topEmotion = data.emotions[0];
            const emotion = topEmotion.name;
            const confidence = topEmotion.score;
            
            setCurrentEmotion(emotion);
            config.onEmotionDetected?.(emotion, confidence);
            
            // Add to samples
            samplesRef.current.push({
              t: Date.now(),
              emo: emotion,
              conf: confidence
            });

            // Update summary periodically
            updateSummary();
          }
        } catch (error) {
          console.error('Error parsing Hume response:', error);
        }
      };

      wsRef.current.onerror = () => {
        setError('Erreur de connexion aux capteurs émotionnels');
        setIsActive(false);
      };

    } catch (error) {
      console.error('Error starting Hume capture:', error);
      setError('Impossible d\'accéder à la caméra');
    }
  }, [config]);

  const stopCapture = useCallback(() => {
    // Stop frame capture
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop video stream
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsActive(false);
    setCurrentEmotion(null);
  }, []);

  const startFrameCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !wsRef.current) return;

    const frameRate = config.frameRate || 1;
    const interval = 1000 / frameRate;

    intervalRef.current = setInterval(() => {
      if (!videoRef.current || !canvasRef.current || !wsRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Capture frame
      ctx.drawImage(videoRef.current, 0, 0, 320, 240);
      
      // Convert to base64 and send to Hume
      canvas.toBlob((blob) => {
        if (blob && wsRef.current?.readyState === WebSocket.OPEN) {
          blob.arrayBuffer().then(buffer => {
            wsRef.current?.send(buffer);
          });
        }
      }, 'image/jpeg', 0.8);
    }, interval);
  }, [config.frameRate]);

  const updateSummary = useCallback(() => {
    const samples = samplesRef.current;
    if (samples.length === 0) return;

    // Calculate frustration and focus indices
    const frustrationEmotions = ['anger', 'frustration', 'annoyance'];
    const focusEmotions = ['concentration', 'engagement', 'determination'];
    
    const frustrationSamples = samples.filter(s => 
      frustrationEmotions.some(e => s.emo.toLowerCase().includes(e))
    );
    const focusSamples = samples.filter(s => 
      focusEmotions.some(e => s.emo.toLowerCase().includes(e))
    );

    const frustrationIndex = frustrationSamples.length > 0 
      ? frustrationSamples.reduce((acc, s) => acc + s.conf, 0) / frustrationSamples.length
      : 0;
    
    const focusIndex = focusSamples.length > 0
      ? focusSamples.reduce((acc, s) => acc + s.conf, 0) / focusSamples.length
      : 0;

    const summary: HumeSummary = {
      frustration_index: Math.min(1, frustrationIndex),
      focus_index: Math.min(1, focusIndex),
      samples: samples.slice(-10) // Keep last 10 samples
    };

    config.onSummaryUpdate?.(summary);
  }, [config]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return {
    isActive,
    error,
    currentEmotion,
    startCapture,
    stopCapture,
    videoRef,
    canvasRef,
    getSummary: () => {
      const samples = samplesRef.current;
      if (samples.length === 0) return null;
      
      const frustrationEmotions = ['anger', 'frustration', 'annoyance'];
      const focusEmotions = ['concentration', 'engagement', 'determination'];
      
      const frustrationSamples = samples.filter(s => 
        frustrationEmotions.some(e => s.emo.toLowerCase().includes(e))
      );
      const focusSamples = samples.filter(s => 
        focusEmotions.some(e => s.emo.toLowerCase().includes(e))
      );

      return {
        frustration_index: frustrationSamples.length > 0 
          ? frustrationSamples.reduce((acc, s) => acc + s.conf, 0) / frustrationSamples.length
          : 0,
        focus_index: focusSamples.length > 0
          ? focusSamples.reduce((acc, s) => acc + s.conf, 0) / focusSamples.length
          : 0,
        samples: samples.slice(-10)
      };
    }
  };
};