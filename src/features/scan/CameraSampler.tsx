// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMoodPublisher } from '@/features/mood/useMoodPublisher';
import { scanAnalytics } from '@/lib/analytics/scanEvents';

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
  const [edgeReady, setEdgeReady] = useState(true);
  const [liveMessage, setLiveMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const motionEnabled = useMemo(() => prefersMotion(), []);

  useEffect(() => {
    if (summary) {
      setLiveMessage(summary);
    }
  }, [summary]);

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
          video: { facingMode: 'user' },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setStatus('streaming');
        onPermissionChange?.('allowed');
        scanAnalytics.cameraPermissionGranted();
      } catch (error) {
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

  const sampleFromEdge = useCallback(async () => {
    const startTime = Date.now();
    setIsAnalyzing(true);
    scanAnalytics.cameraAnalysisStarted();
    
    try {
      const response = await fetch('/functions/v1/ai-emotion-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'sam-camera', ts: new Date().toISOString() }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('edge_unavailable');
      }

      const payload = await response.json().catch(() => ({}));
      const rawValence = payload?.valence ?? payload?.data?.valence ?? 0.5;
      const rawArousal = payload?.arousal ?? payload?.data?.arousal ?? 0.5;

      publishMood('scan_camera', clampNormalized(rawValence), clampNormalized(rawArousal));
      setEdgeReady(true);
      
      const duration = Date.now() - startTime;
      scanAnalytics.cameraAnalysisCompleted(duration);
    } catch (error) {
      setEdgeReady(false);
      onUnavailable?.('edge');
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [onUnavailable, publishMood]);

  useEffect(() => {
    if (status !== 'streaming') {
      return;
    }

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const loop = async () => {
      try {
        await sampleFromEdge();
      } catch {
        if (!cancelled) {
          setStatus('error');
        }
        return;
      }

      if (cancelled) {
        return;
      }

      timeout = setTimeout(loop, 4000);
    };

    loop();

    return () => {
      cancelled = true;
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [sampleFromEdge, status]);

  const statusLabel = useMemo(() => {
    if (status === 'error') {
      return 'Caméra non disponible';
    }
    if (!edgeReady) {
      return 'Analyse interrompue côté Edge';
    }
    if (status === 'starting') {
      return 'Initialisation douce de la caméra';
    }
    if (status === 'streaming') {
      return 'Capture en cours, aucune donnée chiffrée.';
    }
    return 'Caméra prête à écouter les micro-expressions.';
  }, [edgeReady, status]);

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
        {isAnalyzing && (
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-primary/90 px-3 py-2 text-xs font-medium text-primary-foreground animate-pulse">
            <div className="h-2 w-2 rounded-full bg-white animate-ping" />
            Analyse en cours...
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/70 p-4 text-sm text-foreground shadow-lg">
          <p className="font-medium">{statusLabel}</p>
          <p className="mt-1 text-muted-foreground text-sm">
            {edgeReady
              ? 'Le flux reste local : seul le signal émotionnel anonymisé alimente les gestes et les couleurs.'
              : 'Le relais Edge est indisponible. Repassez sur les curseurs sensoriels pour continuer.'}
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
