// @ts-nocheck
import { useState, useCallback, useRef, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface HumeVoiceConfig {
  enabled: boolean;
  sampleRate?: number; // samples per second, default 0.5
  onTensionDetected?: (level: number) => void;
  onRelaxationDetected?: (level: number) => void;
}

export const useHumeVoice = (config: HumeVoiceConfig) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTension, setCurrentTension] = useState<number>(0.5);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCapture = useCallback(async () => {
    if (!config.enabled) {
      logger.info('Hume voice disabled by config', undefined, 'SYSTEM');
      return;
    }

    try {
      setError(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      });

      // Set up Web Audio API
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      // Connect to Hume Voice WebSocket (via backend proxy)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
      const wsUrl = `${supabaseUrl.replace('https', 'wss')}/functions/v1/hume-websocket-proxy`;
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        logger.info('Hume Voice WebSocket connected', undefined, 'SYSTEM');
        setIsActive(true);
        startAudioAnalysis();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.prosody && data.prosody.length > 0) {
            // Process voice prosody features
            const prosody = data.prosody[0];
            const tension = calculateTensionLevel(prosody);
            
            setCurrentTension(tension);
            
            if (tension > 0.7) {
              config.onTensionDetected?.(tension);
            } else if (tension < 0.3) {
              config.onRelaxationDetected?.(tension);
            }
          }
        } catch (error) {
          logger.error('Error parsing Hume Voice response', error as Error, 'SYSTEM');
        }
      };

      wsRef.current.onerror = () => {
        setError('Erreur de connexion à l\'analyse vocale');
        setIsActive(false);
      };

    } catch (error) {
      logger.error('Error starting Hume voice capture', error as Error, 'SYSTEM');
      setError('Impossible d\'accéder au microphone');
    }
  }, [config]);

  const stopCapture = useCallback(() => {
    // Stop audio analysis
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Disconnect audio nodes
    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsActive(false);
    setCurrentTension(0.5);
  }, []);

  const startAudioAnalysis = useCallback(() => {
    if (!analyserRef.current || !wsRef.current) return;

    const sampleRate = config.sampleRate || 0.5;
    const interval = 1000 / sampleRate;

    intervalRef.current = setInterval(() => {
      if (!analyserRef.current || !wsRef.current) return;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Send audio features to Hume for prosody analysis
      if (wsRef.current.readyState === WebSocket.OPEN) {
        const audioFeatures = {
          frequencies: Array.from(dataArray),
          timestamp: Date.now()
        };
        wsRef.current.send(JSON.stringify(audioFeatures));
      }
    }, interval);
  }, [config.sampleRate]);

  const calculateTensionLevel = useCallback((prosody: any): number => {
    // Extract tension indicators from prosody features
    // This is a simplified calculation - in reality, Hume provides more sophisticated features
    const pitch = prosody.pitch || 0;
    const intensity = prosody.intensity || 0;
    const speechRate = prosody.speechRate || 0;
    const jitter = prosody.jitter || 0;

    // Higher pitch, intensity, speech rate, and jitter typically indicate tension
    const tensionScore = (
      Math.min(pitch / 300, 1) * 0.3 +
      Math.min(intensity / 80, 1) * 0.25 +
      Math.min(speechRate / 200, 1) * 0.25 +
      Math.min(jitter, 1) * 0.2
    );

    return Math.max(0, Math.min(1, tensionScore));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return {
    isActive,
    error,
    currentTension,
    startCapture,
    stopCapture,
    getTensionLevel: () => currentTension
  };
};