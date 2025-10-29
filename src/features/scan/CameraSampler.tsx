// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from 'react';

import { useMoodPublisher } from '@/features/mood/useMoodPublisher';
import { scanAnalytics } from '@/lib/analytics/scanEvents';
import { useHumeWebSocket } from '@/hooks/useHumeWebSocket';

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
  const [status, setStatus] = useState<'idle' | 'starting' | 'streaming' | 'error'>('starting');
  const [liveMessage, setLiveMessage] = useState('');
  const motionEnabled = useMemo(() => prefersMotion(), []);
  
  // Use Hume WebSocket for real-time facial analysis
  const { isConnected, error, latestResult, videoRef } = useHumeWebSocket({
    enabled: true, // Always enabled when component is mounted
    onEmotions: (result) => {
      console.log('[CameraSampler] Hume emotions:', result);
      scanAnalytics.cameraAnalysisCompleted(500); // approximate
      
      // Publish to mood system
      if (result.valence !== undefined && result.arousal !== undefined) {
        publishMood('scan_camera', result.valence, result.arousal);
      }
    }
  });

  useEffect(() => {
    if (summary) {
      setLiveMessage(summary);
    }
  }, [summary]);

  // Handle connection status
  useEffect(() => {
    if (error) {
      console.error('[CameraSampler] Hume WebSocket error:', error);
      setStatus('error');
      onUnavailable?.('edge');
    }
  }, [error, onUnavailable]);
  
  // Set streaming status when connected
  useEffect(() => {
    if (isConnected) {
      setStatus('streaming');
      onPermissionChange?.('allowed');
      scanAnalytics.cameraPermissionGranted();
    }
  }, [isConnected, onPermissionChange]);

  // Update live message based on latest results
  useEffect(() => {
    if (latestResult?.emotions && latestResult.emotions.length > 0) {
      const topEmotion = latestResult.emotions[0];
      setLiveMessage(`${topEmotion.name}: ${(topEmotion.score * 100).toFixed(0)}%`);
    }
  }, [latestResult]);

  const statusLabel = useMemo(() => {
    if (status === 'error' || error) {
      return error || 'Caméra non disponible';
    }
    if (!isConnected && status === 'streaming') {
      return 'Connexion à Hume AI...';
    }
    if (status === 'starting') {
      return 'Initialisation douce de la caméra';
    }
    if (status === 'streaming' && isConnected) {
      return 'Analyse en temps réel avec Hume AI';
    }
    return 'Caméra prête à écouter les micro-expressions.';
  }, [error, isConnected, status]);

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
            Hume AI connecté
          </div>
        )}
        {latestResult?.emotions && latestResult.emotions.length > 0 && (
          <div className="absolute top-16 right-4 rounded-lg bg-background/90 px-3 py-2 text-xs max-w-[200px]">
            <div className="font-semibold mb-1">Émotions détectées:</div>
            {latestResult.emotions.slice(0, 3).map((emotion, idx) => (
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
              : error 
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
