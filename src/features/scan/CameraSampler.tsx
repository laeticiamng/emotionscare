// @ts-nocheck
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import { useMoodPublisher } from '@/features/mood/useMoodPublisher';
import { scanAnalytics } from '@/lib/analytics/scanEvents';
import { logger } from '@/lib/logger';

const clampNormalized = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0.5;
  }
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

type PermissionStatus = 'allowed' | 'denied';

type UnavailableReason = 'edge' | 'hardware';

interface CameraSamplerProps {
  onPermissionChange?: (status: PermissionStatus) => void;
  onUnavailable?: (reason: UnavailableReason) => void;
  summary?: string;
}

const prefersMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const CameraSampler: React.FC<CameraSamplerProps> = ({ onPermissionChange, onUnavailable, summary }) => {
  const publishMood = useMoodPublisher();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'starting' | 'streaming' | 'error'>('idle');
  const [liveMessage, setLiveMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [latestEmotions, setLatestEmotions] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const motionEnabled = useMemo(() => prefersMotion(), []);

  useEffect(() => {
    if (summary) {
      setLiveMessage(summary);
    }
  }, [summary]);

  // Start camera first
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      onPermissionChange?.('denied');
      onUnavailable?.('hardware');
      return;
    }

    let active = true;
    let stream: MediaStream | null = null;

    const start = async () => {
      setStatus('starting');
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: 'user'
          },
          audio: false,
        });
        
        if (!active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
          canvasRef.current.width = 640;
          canvasRef.current.height = 480;
        }

        setStatus('streaming');
        onPermissionChange?.('allowed');
        scanAnalytics.cameraPermissionGranted();
      } catch (error) {
        logger.error('Camera access denied', error as Error, 'HUME');
        setStatus('error');
        onPermissionChange?.('denied');
        onUnavailable?.('hardware');
        scanAnalytics.cameraPermissionDenied();
      }
    };

    start();

    return () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onPermissionChange, onUnavailable]);

  // Connect to WebSocket after camera is streaming
  useEffect(() => {
    if (status !== 'streaming') return;

    const projectId = 'yaincoxihiqdksxgrsrk';
    const wsUrl = `wss://${projectId}.supabase.co/functions/v1/hume-websocket-proxy`;
    
    logger.info('Connecting to Hume WebSocket', { wsUrl }, 'HUME');
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      logger.info('WebSocket connected', {}, 'HUME');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'connected') {
          logger.info('Hume AI ready', {}, 'HUME');
          return;
        }

        if (data.face?.predictions) {
          const predictions = data.face.predictions[0];
          if (predictions?.emotions) {
            const emotions = predictions.emotions;
            setLatestEmotions(emotions.slice(0, 3));
            
            // Calculate valence/arousal
            const valenceMap: Record<string, number> = {
              'Joy': 0.8, 'Excitement': 0.7, 'Contentment': 0.7,
              'Sadness': 0.2, 'Anger': 0.2, 'Fear': 0.3,
              'Surprise': 0.5, 'Neutral': 0.5
            };
            const arousalMap: Record<string, number> = {
              'Joy': 0.6, 'Excitement': 0.8, 'Contentment': 0.3,
              'Sadness': 0.3, 'Anger': 0.8, 'Fear': 0.9,
              'Surprise': 0.8, 'Neutral': 0.5
            };
            
            let totalValence = 0;
            let totalArousal = 0;
            let totalWeight = 0;
            
            emotions.forEach((e: any) => {
              const v = valenceMap[e.name] || 0.5;
              const a = arousalMap[e.name] || 0.5;
              totalValence += v * e.score;
              totalArousal += a * e.score;
              totalWeight += e.score;
            });
            
            if (totalWeight > 0) {
              publishMood('scan_camera', totalValence / totalWeight, totalArousal / totalWeight);
            }
          }
        }
      } catch (err) {
        logger.error('Error parsing WS message', err as Error, 'HUME');
      }
    };

    wsRef.current.onerror = () => {
      logger.error('WebSocket error', new Error('Connection failed'), 'HUME');
      setIsConnected(false);
    };

    wsRef.current.onclose = () => {
      logger.info('WebSocket closed', {}, 'HUME');
      setIsConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [status, publishMood]);

  // Send frames to Hume via WebSocket
  const sendFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !wsRef.current) return;
    if (wsRef.current.readyState !== WebSocket.OPEN) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const base64Frame = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

    const message = {
      models: {
        face: {}
      },
      data: base64Frame
    };

    wsRef.current.send(JSON.stringify(message));
  }, []);

  // Send frames every 500ms when streaming and connected
  useEffect(() => {
    if (status !== 'streaming' || !isConnected) return;

    intervalRef.current = setInterval(() => {
      sendFrame();
    }, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, isConnected, sendFrame]);

  const statusLabel = useMemo(() => {
    if (status === 'error') {
      return 'Caméra non disponible';
    }
    if (!isConnected && status === 'streaming') {
      return 'Connexion à Hume AI...';
    }
    if (status === 'starting') {
      return 'Demande d\'accès à la caméra';
    }
    if (status === 'streaming' && isConnected) {
      return 'Analyse faciale en temps réel';
    }
    return 'Initialisation...';
  }, [isConnected, status]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-transparent bg-white/5 shadow-xl backdrop-blur mood-surface dark:bg-slate-800/40">
      <div className="relative aspect-video w-full">
        <video
          ref={videoRef}
          muted
          playsInline
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-background/40 to-transparent" />
        {isConnected && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-green-600/90 px-3 py-2 text-xs font-medium text-white">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Hume AI actif
          </div>
        )}
        {latestEmotions.length > 0 && (
          <div className="absolute top-16 right-4 rounded-lg bg-background/90 px-3 py-2 text-xs max-w-[200px]">
            <div className="font-semibold mb-1">Émotions:</div>
            {latestEmotions.map((emotion: any, idx: number) => (
              <div key={idx} className="flex justify-between gap-2">
                <span className="text-muted-foreground">{emotion.name}</span>
                <span className="font-mono">{(emotion.score * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/70 p-4 text-sm text-foreground shadow-lg">
          <p className="font-medium">{statusLabel}</p>
          <p className="mt-1 text-muted-foreground text-sm">
            {isConnected
              ? 'Analyse faciale en temps réel via WebSocket. Détection de 48 émotions par Hume AI.'
              : status === 'error'
                ? 'Erreur de connexion. Veuillez réessayer.'
                : 'Connexion au service d\'analyse émotionnelle...'}
          </p>
        </div>
      </div>
      {motionEnabled && (
        <div className="pointer-events-none absolute -inset-12 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent blur-3xl" />
      )}
      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>
    </section>
  );
};

export default CameraSampler;
