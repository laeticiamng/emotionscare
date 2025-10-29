import { useState, useRef, useCallback, useEffect } from 'react';
import { VoiceEmotionResult } from '@/types/realtime-emotion';
import { toast } from 'sonner';

export const useVoiceEmotion = () => {
  const [isActive, setIsActive] = useState(false);
  const [latency, setLatency] = useState(0);
  const [lastResult, setLastResult] = useState<VoiceEmotionResult | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const encodeAudioData = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  };

  const start = useCallback(async () => {
    try {
      // Connexion WebSocket au proxy Hume
      const wsUrl = `wss://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/hume-websocket-proxy`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('[useVoiceEmotion] WebSocket connected');
        toast.success('Connexion Hume établie');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'connected') {
            console.log('[useVoiceEmotion] Hume connected');
            return;
          }

          // Parser les résultats Hume
          if (data.prosody) {
            const result: VoiceEmotionResult = {
              prosody: data.prosody,
              emotions: data.emotions || {},
              confidence: data.confidence || 0.5,
              timestamp: Date.now()
            };
            
            setLastResult(result);
            setLatency(data.latency_ms || 0);
          }
        } catch (error) {
          console.error('[useVoiceEmotion] Parse error:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('[useVoiceEmotion] WebSocket error:', error);
        toast.error('Erreur de connexion Hume');
      };

      wsRef.current.onclose = () => {
        console.log('[useVoiceEmotion] WebSocket closed');
      };

      // Démarrer la capture audio
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processorRef.current.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const encodedAudio = encodeAudioData(new Float32Array(inputData));
          
          // Envoyer au WebSocket
          wsRef.current.send(JSON.stringify({
            data: encodedAudio,
            timestamp: Date.now()
          }));
        }
      };
      
      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      setIsActive(true);
      toast.success('Micro activé');

    } catch (error) {
      console.error('[useVoiceEmotion] Start error:', error);
      toast.error('Erreur d\'accès au micro');
    }
  }, []);

  const stop = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsActive(false);
    setLastResult(null);
    toast.info('Micro désactivé');
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
    start,
    stop
  };
};
