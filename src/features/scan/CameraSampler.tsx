// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useMoodPublisher } from '@/features/mood/useMoodPublisher';
import { scanAnalytics } from '@/lib/analytics/scanEvents';
import { supabase } from '@/integrations/supabase/client';
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
  const queryClient = useQueryClient();
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
          
          await new Promise<void>((resolve, reject) => {
            if (!videoRef.current) {
              reject(new Error('Video ref lost'));
              return;
            }
            
            const handleLoadedMetadata = () => {
              resolve();
            };
            
            const handleError = () => {
              reject(new Error('Video load error'));
            };
            
            videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
            videoRef.current.addEventListener('error', handleError, { once: true });
            
            videoRef.current.play().catch(reject);
          });
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
      if (!videoRef.current) {
        logger.error(new Error('[CameraSampler] Video ref not ready'), 'FEATURE');
        return;
      }

      if (videoRef.current.readyState < 2) {
        logger.warn('[CameraSampler] Video not ready yet, skipping frame', 'FEATURE');
        return;
      }

      if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        logger.warn('[CameraSampler] Video dimensions not loaded yet', 'FEATURE');
        return;
      }

      // Capture frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        logger.error(new Error('[CameraSampler] Canvas context not available'), 'FEATURE');
        return;
      }
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      
      logger.debug('[CameraSampler] Calling analyze-vision with Lovable AI...', 'FEATURE');

      const { data, error } = await supabase.functions.invoke('analyze-vision', {
        body: { 
          imageBase64: dataUrl,
        },
      });

      logger.debug('[CameraSampler] Response:', { data, error }, 'FEATURE');

      if (error) {
        logger.error('[CameraSampler] Edge function error:', error, 'FEATURE');
        setEdgeReady(false);
        return;
      }

      // Vérifier que data contient une émotion valide
      if (!data || !data.label) {
        logger.warn('[CameraSampler] No valid emotion data received, using neutral', 'FEATURE');
        // Continuer avec émotion neutre plutôt que de planter
        const neutralData = { label: 'neutre', confidence: 0.5 };
        Object.assign(data || {}, neutralData);
        if (!data) {
          setEdgeReady(true);
          return;
        }
      }

      // Mapper les émotions vers valence/arousal (panel élargi 40+ émotions comme Hume)
      const emotionToValenceArousal = (label: string) => {
        const map: Record<string, { valence: number; arousal: number }> = {
          // Émotions positives haute énergie
          'joie': { valence: 0.85, arousal: 0.7 },
          'excitation': { valence: 0.8, arousal: 0.85 },
          'amusement': { valence: 0.8, arousal: 0.65 },
          'fierté': { valence: 0.75, arousal: 0.6 },
          'admiration': { valence: 0.7, arousal: 0.55 },
          'détermination': { valence: 0.7, arousal: 0.7 },
          'enthousiasme': { valence: 0.85, arousal: 0.8 },
          'extase': { valence: 0.9, arousal: 0.85 },
          'émerveillement': { valence: 0.8, arousal: 0.75 },
          'inspiration': { valence: 0.75, arousal: 0.65 },
          'ravissement': { valence: 0.88, arousal: 0.8 },
          
          // Émotions positives basse énergie
          'calme': { valence: 0.7, arousal: 0.25 },
          'sérénité': { valence: 0.75, arousal: 0.2 },
          'satisfaction': { valence: 0.75, arousal: 0.4 },
          'contentement': { valence: 0.7, arousal: 0.35 },
          'soulagement': { valence: 0.65, arousal: 0.3 },
          'tendresse': { valence: 0.75, arousal: 0.35 },
          'gratitude': { valence: 0.75, arousal: 0.4 },
          'espoir': { valence: 0.7, arousal: 0.45 },
          
          // Émotions négatives haute énergie
          'colère': { valence: 0.2, arousal: 0.8 },
          'peur': { valence: 0.3, arousal: 0.85 },
          'anxiété': { valence: 0.3, arousal: 0.75 },
          'stress': { valence: 0.35, arousal: 0.8 },
          'frustration': { valence: 0.3, arousal: 0.7 },
          'irritation': { valence: 0.35, arousal: 0.65 },
          'jalousie': { valence: 0.25, arousal: 0.7 },
          'envie': { valence: 0.35, arousal: 0.6 },
          'tourment': { valence: 0.2, arousal: 0.75 },
          'crainte': { valence: 0.28, arousal: 0.72 },
          
          // Émotions négatives basse énergie
          'tristesse': { valence: 0.2, arousal: 0.3 },
          'ennui': { valence: 0.4, arousal: 0.2 },
          'fatigue': { valence: 0.4, arousal: 0.15 },
          'honte': { valence: 0.25, arousal: 0.4 },
          'mélancolie': { valence: 0.35, arousal: 0.3 },
          'inquiétude': { valence: 0.3, arousal: 0.5 },
          'culpabilité': { valence: 0.25, arousal: 0.45 },
          'embarras': { valence: 0.35, arousal: 0.5 },
          'déception': { valence: 0.3, arousal: 0.35 },
          'torpeur': { valence: 0.4, arousal: 0.1 },
          'apathie': { valence: 0.42, arousal: 0.12 },
          
          // Émotions mixtes/complexes
          'surprise': { valence: 0.6, arousal: 0.75 },
          'dégoût': { valence: 0.25, arousal: 0.5 },
          'confusion': { valence: 0.45, arousal: 0.5 },
          'concentration': { valence: 0.55, arousal: 0.6 },
          'nostalgie': { valence: 0.5, arousal: 0.4 },
          'mépris': { valence: 0.3, arousal: 0.4 },
          'désir': { valence: 0.65, arousal: 0.7 },
          
          // Neutre
          'neutre': { valence: 0.5, arousal: 0.5 }
        };
        return map[label] || { valence: 0.5, arousal: 0.5 };
      };

      const { valence: rawValence, arousal: rawArousal } = emotionToValenceArousal(data.label);
      const valencePercent = Math.round(rawValence * 100);
      const arousalPercent = Math.round(rawArousal * 100);

      const emotionLabel = data?.label ? data.label.charAt(0).toUpperCase() + data.label.slice(1) : 'Neutre';
      publishMood('scan_camera', clampNormalized(rawValence), clampNormalized(rawArousal));
      setEdgeReady(true);
      
      // Mettre à jour le message avec l'émotion détectée
      setLiveMessage(emotionLabel);
      
      // Sauvegarder dans clinical_signals
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.id) {
          const valenceLevel = Math.floor(valencePercent / 20); // 0-4
          const arousalLevel = Math.floor(arousalPercent / 20); // 0-4
          const avgLevel = Math.round((valenceLevel + arousalLevel) / 2);
          
          const now = new Date();
          const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 jours

          const { error: insertError } = await supabase.from('clinical_signals').insert({
            user_id: user.id,
            source_instrument: 'scan_camera',
            domain: 'emotional',
            level: avgLevel,
            module_context: 'scan',
            window_type: 'instant',
            expires_at: expiresAt.toISOString(),
            metadata: {
              valence: valencePercent,
              arousal: arousalPercent,
              confidence: data?.confidence ?? 0.8,
              summary: data?.label ? data.label.charAt(0).toUpperCase() + data.label.slice(1) : 'Neutre',
              emotion: data?.label,
              timestamp: new Date().toISOString(),
            },
          });

          if (insertError) {
            logger.error('[CameraSampler] Error saving to clinical_signals:', insertError, 'FEATURE');
          } else {
            logger.debug('[CameraSampler] Successfully saved to clinical_signals', 'FEATURE');
            // Invalider le cache pour rafraîchir l'historique
            queryClient.invalidateQueries({ queryKey: ['scan-history'] });
            window.dispatchEvent(new CustomEvent('scan-saved'));
          }
        }
      } catch (saveError) {
        logger.error('[CameraSampler] Exception saving to DB:', saveError, 'FEATURE');
      }
      
      const duration = Date.now() - startTime;
      logger.debug('[CameraSampler] Analysis completed in', duration, 'ms', 'FEATURE');
      scanAnalytics.cameraAnalysisCompleted(duration);
    } catch (error) {
      logger.error('[CameraSampler] Error during analysis:', error, 'FEATURE');
      setEdgeReady(false);
    } finally {
      setIsAnalyzing(false);
    }
  }, [publishMood]);

  // Auto-recovery when edgeReady is false
  useEffect(() => {
    if (edgeReady || status !== 'streaming') return;
    
    const retryTimer = setTimeout(() => {
      logger.info('[CameraSampler] Auto-recovering edge connection...', 'FEATURE');
      setEdgeReady(true);
    }, 3000);
    
    return () => clearTimeout(retryTimer);
  }, [edgeReady, status]);

  useEffect(() => {
    if (status !== 'streaming') {
      return;
    }

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3;

    const loop = async () => {
      if (!edgeReady) {
        // Skip analysis if edge not ready, but continue loop
        if (!cancelled) {
          timeout = setTimeout(loop, 5000);
        }
        return;
      }
      
      try {
        await sampleFromEdge();
        consecutiveErrors = 0; // Reset on success
      } catch (error) {
        consecutiveErrors++;
        logger.error('[CameraSampler] Loop error:', error, 'FEATURE');
        
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          setEdgeReady(false);
          consecutiveErrors = 0;
        }
      }

      if (cancelled) {
        return;
      }

      timeout = setTimeout(loop, 15000);
    };

    loop();

    return () => {
      cancelled = true;
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [sampleFromEdge, status, edgeReady]);

  const statusLabel = useMemo(() => {
    if (status === 'error') {
      return 'Caméra non disponible';
    }
    if (!edgeReady) {
      return 'Analyse interrompue - Reconnexion...';
    }
    if (status === 'starting') {
      return 'Initialisation de la caméra';
    }
    if (status === 'streaming') {
      return 'Analyse émotionnelle IA en temps réel';
    }
    return 'Préparation...';
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
              ? 'Analyse faciale IA temps réel. Détection précise des émotions.'
              : 'Service temporairement indisponible. Nouvelle tentative...'}
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
