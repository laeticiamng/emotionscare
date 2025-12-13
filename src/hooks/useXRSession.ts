// @ts-nocheck
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useVRBreathStore } from '@/store/vrbreath.store';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/** Types de sessions XR supportées */
export type XRSessionMode = 'immersive-vr' | 'immersive-ar' | 'inline';

/** État de la session XR */
export type XRSessionState = 'idle' | 'requesting' | 'active' | 'paused' | 'ending' | 'error';

/** Configuration de la session XR */
export interface XRSessionConfig {
  mode: XRSessionMode;
  requiredFeatures?: string[];
  optionalFeatures?: string[];
  domOverlay?: boolean;
  depthSensing?: boolean;
  handTracking?: boolean;
  environmentBlending?: boolean;
}

/** Capacités XR du device */
export interface XRCapabilities {
  supportsVR: boolean;
  supportsAR: boolean;
  supportsInline: boolean;
  supportsHandTracking: boolean;
  supportsDepthSensing: boolean;
  supportsLightEstimation: boolean;
  supportsHitTest: boolean;
  supportsAnchors: boolean;
  supportsDomOverlay: boolean;
  supportsControllers: boolean;
  deviceType: 'headset' | 'phone' | 'tablet' | 'unknown';
}

/** Métriques de performance XR */
export interface XRPerformanceMetrics {
  fps: number;
  frameTime: number;
  cpuTime: number;
  gpuTime: number;
  droppedFrames: number;
  latency: number;
}

/** Données de session XR */
export interface XRSessionData {
  id: string;
  userId: string;
  mode: XRSessionMode;
  startTime: Date;
  endTime?: Date;
  duration: number;
  experience: string;
  metrics: XRPerformanceMetrics;
  events: XRSessionEvent[];
}

/** Événement de session XR */
export interface XRSessionEvent {
  type: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

/** Configuration par défaut */
const DEFAULT_CONFIG: XRSessionConfig = {
  mode: 'immersive-vr',
  requiredFeatures: ['local-floor'],
  optionalFeatures: ['bounded-floor', 'hand-tracking'],
  domOverlay: false,
  depthSensing: false,
  handTracking: true,
  environmentBlending: false
};

export const useXRSession = (config?: Partial<XRSessionConfig>) => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { xrSupported, inXR, setXRSupported, setInXR } = useVRBreathStore();

  const [xrSystem, setXrSystem] = useState<XRSystem | null>(null);
  const [session, setSession] = useState<XRSession | null>(null);
  const [sessionState, setSessionState] = useState<XRSessionState>('idle');
  const [capabilities, setCapabilities] = useState<XRCapabilities | null>(null);
  const [metrics, setMetrics] = useState<XRPerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    cpuTime: 0,
    gpuTime: 0,
    droppedFrames: 0,
    latency: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  const sessionStartRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const eventsRef = useRef<XRSessionEvent[]>([]);
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  /** Détecter le type de device */
  const detectDeviceType = (): XRCapabilities['deviceType'] => {
    const ua = navigator.userAgent.toLowerCase();
    if (/oculus|quest|vive|valve|hololens|magic leap/i.test(ua)) return 'headset';
    if (/mobile|android|iphone|ipad/i.test(ua)) {
      if (/ipad|tablet/i.test(ua) || (window.innerWidth > 768)) return 'tablet';
      return 'phone';
    }
    return 'unknown';
  };

  // Vérifier les capacités XR au montage
  useEffect(() => {
    const checkXRCapabilities = async () => {
      if (!('xr' in navigator)) {
        setCapabilities({
          supportsVR: false,
          supportsAR: false,
          supportsInline: false,
          supportsHandTracking: false,
          supportsDepthSensing: false,
          supportsLightEstimation: false,
          supportsHitTest: false,
          supportsAnchors: false,
          supportsDomOverlay: false,
          supportsControllers: false,
          deviceType: 'unknown'
        });
        setXRSupported(false);
        return;
      }

      try {
        const xr = navigator.xr;
        setXrSystem(xr);

        const [supportsVR, supportsAR, supportsInline] = await Promise.all([
          xr.isSessionSupported('immersive-vr').catch(() => false),
          xr.isSessionSupported('immersive-ar').catch(() => false),
          xr.isSessionSupported('inline').catch(() => false)
        ]);

        const deviceType = detectDeviceType();

        const caps: XRCapabilities = {
          supportsVR,
          supportsAR,
          supportsInline,
          supportsHandTracking: false,
          supportsDepthSensing: false,
          supportsLightEstimation: false,
          supportsHitTest: supportsAR,
          supportsAnchors: supportsAR,
          supportsDomOverlay: supportsAR,
          supportsControllers: supportsVR,
          deviceType
        };

        setCapabilities(caps);
        setXRSupported(supportsVR || supportsAR);

        logger.info('XR capabilities detected', { caps }, 'VR');
      } catch (error) {
        logger.warn('XR capability check failed', error as Error, 'VR');
        setXRSupported(false);
      }
    };

    checkXRCapabilities();
  }, [setXRSupported]);

  /** Enregistrer un événement */
  const logEvent = useCallback((type: string, data?: Record<string, unknown>) => {
    eventsRef.current.push({
      type,
      timestamp: Date.now() - sessionStartRef.current,
      data
    });
  }, []);

  /** Sauvegarder le début de session */
  const saveSessionStart = useCallback(async (experience: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return;

      await supabase.from('xr_sessions').insert({
        id: sessionIdRef.current,
        user_id: userData.user.id,
        mode: mergedConfig.mode,
        experience,
        started_at: new Date().toISOString(),
        device_type: capabilities?.deviceType || 'unknown'
      });
    } catch (error) {
      logger.error('Failed to save XR session start', error as Error, 'VR');
    }
  }, [mergedConfig.mode, capabilities?.deviceType]);

  /** Sauvegarder la fin de session */
  const saveSessionEnd = useCallback(async (duration: number) => {
    try {
      if (!sessionIdRef.current) return;

      await supabase.from('xr_sessions').update({
        ended_at: new Date().toISOString(),
        duration_seconds: duration,
        metrics: metrics,
        events: eventsRef.current
      }).eq('id', sessionIdRef.current);
    } catch (error) {
      logger.error('Failed to save XR session end', error as Error, 'VR');
    }
  }, [metrics]);

  /** Gérer la fin de session */
  const handleSessionEnd = useCallback(async () => {
    const duration = Math.floor((Date.now() - sessionStartRef.current) / 1000);

    setSession(null);
    setSessionState('idle');
    setInXR(false);
    setSessionDuration(duration);

    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
    }

    await saveSessionEnd(duration);

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'xr_session_end', {
        duration,
        fps: metrics.fps
      });
    }

    logger.info('XR session ended', { duration, fps: metrics.fps }, 'VR');
  }, [setInXR, metrics.fps, saveSessionEnd]);

  /** Gérer le changement de visibilité */
  const handleVisibilityChange = useCallback((event: any) => {
    const visible = event?.session?.visibilityState === 'visible';
    setSessionState(visible ? 'active' : 'paused');
    logEvent('visibility_change', { visible });
  }, [logEvent]);

  /** Démarrer le suivi des métriques */
  const startMetricsTracking = useCallback(() => {
    let lastTime = performance.now();
    let frames = 0;

    metricsIntervalRef.current = setInterval(() => {
      const now = performance.now();
      const elapsed = now - lastTime;
      const fps = Math.round((frames / elapsed) * 1000);

      setMetrics(prev => ({
        ...prev,
        fps,
        frameTime: elapsed / Math.max(frames, 1)
      }));

      setSessionDuration(Math.floor((Date.now() - sessionStartRef.current) / 1000));

      frames = 0;
      lastTime = now;
    }, 1000);
  }, []);

  /** Démarrer une session XR */
  const enterXR = useCallback(async (experience: string = 'default') => {
    if (!xrSystem || sessionState !== 'idle') {
      logger.warn('Cannot enter XR: system not ready or session active', {}, 'VR');
      return false;
    }

    try {
      setSessionState('requesting');
      setError(null);

      const features: string[] = [...(mergedConfig.requiredFeatures || [])];
      const optional: string[] = [...(mergedConfig.optionalFeatures || [])];

      if (mergedConfig.handTracking) optional.push('hand-tracking');
      if (mergedConfig.depthSensing) optional.push('depth-sensing');
      if (mergedConfig.domOverlay && document.body) {
        optional.push('dom-overlay');
      }

      const sessionInit: XRSessionInit = {
        requiredFeatures: features,
        optionalFeatures: optional
      };

      if (mergedConfig.domOverlay && document.body) {
        (sessionInit as any).domOverlay = { root: document.body };
      }

      const xrSession = await xrSystem.requestSession(mergedConfig.mode, sessionInit);
      setSession(xrSession);
      setSessionState('active');
      setInXR(true);

      sessionStartRef.current = Date.now();
      frameCountRef.current = 0;
      eventsRef.current = [];

      sessionIdRef.current = `xr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      xrSession.addEventListener('end', handleSessionEnd);
      xrSession.addEventListener('visibilitychange', handleVisibilityChange);

      startMetricsTracking();
      logEvent('session_start', { mode: mergedConfig.mode, experience });

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'xr_session_start', {
          mode: mergedConfig.mode,
          experience
        });
      }

      await saveSessionStart(experience);

      logger.info('XR session started', { mode: mergedConfig.mode, experience }, 'VR');
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMsg);
      setSessionState('error');
      logger.error('Failed to enter XR', error as Error, 'VR');
      return false;
    }
  }, [xrSystem, sessionState, mergedConfig, setInXR, handleSessionEnd, handleVisibilityChange, startMetricsTracking, logEvent, saveSessionStart]);

  /** Quitter la session XR */
  const exitXR = useCallback(async () => {
    if (!session || sessionState !== 'active') return;

    try {
      setSessionState('ending');
      logEvent('session_end', { duration: sessionDuration });

      await session.end();
    } catch (error) {
      logger.error('Failed to exit XR gracefully', error as Error, 'VR');
    }
  }, [session, sessionState, sessionDuration, logEvent]);

  /** Récupérer l'historique des sessions */
  const getSessionHistory = useCallback(async (limit: number = 20): Promise<XRSessionData[]> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user?.id) return [];

      const { data, error } = await supabase
        .from('xr_sessions')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        mode: s.mode,
        startTime: new Date(s.started_at),
        endTime: s.ended_at ? new Date(s.ended_at) : undefined,
        duration: s.duration_seconds || 0,
        experience: s.experience,
        metrics: s.metrics || {},
        events: s.events || []
      }));
    } catch (error) {
      logger.error('Failed to get XR session history', error as Error, 'VR');
      return [];
    }
  }, []);

  /** Statistiques de sessions */
  const sessionStats = useMemo(() => {
    return {
      isSupported: xrSupported,
      isActive: sessionState === 'active',
      isPaused: sessionState === 'paused',
      currentDuration: sessionDuration,
      totalFrames: frameCountRef.current
    };
  }, [xrSupported, sessionState, sessionDuration]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
      if (session) {
        session.end().catch(() => {});
      }
    };
  }, [session]);

  return {
    // État
    xrSupported,
    inXR,
    xrSystem,
    session,
    sessionState,
    capabilities,
    metrics,
    error,
    sessionDuration,
    sessionStats,

    // Actions
    enterXR,
    exitXR,
    logEvent,

    // Historique
    getSessionHistory,

    // Utilitaires
    isVRSupported: capabilities?.supportsVR || false,
    isARSupported: capabilities?.supportsAR || false,
    deviceType: capabilities?.deviceType || 'unknown'
  };
};

export default useXRSession;