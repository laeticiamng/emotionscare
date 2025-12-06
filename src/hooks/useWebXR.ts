// @ts-nocheck
/**
 * Hook WebXR API native - Architecture minimale
 * Pour VR Galaxy, VR Respiration avec fallback 2D
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';

export interface XRState {
  isSupported: boolean;
  isSessionActive: boolean;
  isImmersive: boolean;
  sessionType: 'immersive-vr' | 'immersive-ar' | 'inline' | null;
  error: string | null;
  isLoading: boolean;
}

export interface XRControllerState {
  connected: boolean;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number; w: number };
  buttons?: boolean[];
}

export const useWebXR = () => {
  const [state, setState] = useState<XRState>({
    isSupported: false,
    isSessionActive: false,
    isImmersive: false,
    sessionType: null,
    error: null,
    isLoading: false
  });

  const sessionRef = useRef<XRSession | null>(null);
  const rendererRef = useRef<any>(null); // Three.js renderer
  const controllersRef = useRef<XRControllerState[]>([]);

  // Vérifier support WebXR
  const checkXRSupport = useCallback(async () => {
    if (!navigator.xr) {
      setState(prev => ({ 
        ...prev, 
        isSupported: false,
        error: 'WebXR non supporté'
      }));
      return false;
    }

    try {
      const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
      const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
      
      setState(prev => ({ 
        ...prev, 
        isSupported: vrSupported || arSupported 
      }));
      
      return vrSupported || arSupported;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isSupported: false,
        error: 'Erreur de vérification WebXR'
      }));
      return false;
    }
  }, []);

  // Démarrer session VR/AR
  const startXRSession = useCallback(async (
    sessionType: 'immersive-vr' | 'immersive-ar' = 'immersive-vr',
    features: string[] = ['local-floor', 'hand-tracking']
  ) => {
    if (!navigator.xr) {
      throw new Error('WebXR non disponible');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const session = await navigator.xr.requestSession(sessionType, {
        requiredFeatures: ['local-floor'],
        optionalFeatures: features
      });

      sessionRef.current = session;
      
      setState(prev => ({
        ...prev,
        isSessionActive: true,
        isImmersive: sessionType.includes('immersive'),
        sessionType,
        isLoading: false
      }));

      // Gérer la fin de session
      session.addEventListener('end', () => {
        setState(prev => ({
          ...prev,
          isSessionActive: false,
          isImmersive: false,
          sessionType: null
        }));
        sessionRef.current = null;
      });

      return session;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur de démarrage WebXR',
        isLoading: false
      }));
      throw error;
    }
  }, []);

  // Terminer session XR
  const endXRSession = useCallback(async () => {
    if (sessionRef.current) {
      try {
        await sessionRef.current.end();
      } catch (error) {
        logger.warn('Erreur lors de la fermeture de session', error as Error, 'VR');
      }
    }
  }, []);

  // Obtenir état des contrôleurs
  const getControllerStates = useCallback((): XRControllerState[] => {
    return controllersRef.current;
  }, []);

  // Hook d'initialisation
  useEffect(() => {
    checkXRSupport();
  }, [checkXRSupport]);

  return {
    ...state,
    startXRSession,
    endXRSession,
    getControllerStates,
    checkXRSupport
  };
};

// Hook spécialisé pour VR Galaxy
export const useVRGalaxy = () => {
  const { isSupported, startXRSession, endXRSession, isSessionActive } = useWebXR();
  const [galaxyState, setGalaxyState] = useState({
    currentPlanet: 'earth',
    explorationTime: 0,
    interactionsCount: 0
  });

  const startGalaxyExploration = useCallback(async (preferFallback = false) => {
    if (!isSupported || preferFallback) {
      // Mode 2D fallback
      setGalaxyState(prev => ({ ...prev, currentPlanet: 'earth' }));
      return { mode: '2d', session: null };
    }

    try {
      const session = await startXRSession('immersive-vr', [
        'local-floor',
        'hand-tracking'
      ]);
      
      return { mode: 'vr', session };
    } catch (error) {
      // Fallback vers 2D en cas d'échec
      logger.warn('VR indisponible, passage en mode 2D', error as Error, 'VR');
      setGalaxyState(prev => ({ ...prev, currentPlanet: 'earth' }));
      return { mode: '2d', session: null };
    }
  }, [isSupported, startXRSession]);

  const navigateToPlanet = useCallback((planet: string) => {
    setGalaxyState(prev => ({ 
      ...prev, 
      currentPlanet: planet,
      interactionsCount: prev.interactionsCount + 1
    }));
  }, []);

  return {
    isSupported,
    isSessionActive,
    galaxyState,
    startGalaxyExploration,
    navigateToPlanet,
    endSession: endXRSession
  };
};

// Hook spécialisé pour VR Respiration
export const useVRBreathing = () => {
  const { isSupported, startXRSession, endXRSession, isSessionActive } = useWebXR();
  const [breathingState, setBreathingState] = useState({
    pattern: 'box' as 'box' | '4-7-8' | 'coherence',
    phase: 'inhale' as 'inhale' | 'hold' | 'exhale' | 'rest',
    cycleCount: 0,
    sessionDuration: 0
  });

  const startBreathingSession = useCallback(async (
    pattern: 'box' | '4-7-8' | 'coherence' = 'box',
    preferFallback = false
  ) => {
    setBreathingState(prev => ({ 
      ...prev, 
      pattern, 
      cycleCount: 0,
      sessionDuration: 0 
    }));

    if (!isSupported || preferFallback) {
      // Mode 2D avec animations CSS/Canvas
      return { mode: '2d', session: null };
    }

    try {
      const session = await startXRSession('immersive-vr', [
        'local-floor'
      ]);
      
      return { mode: 'vr', session };
    } catch (error) {
      // Fallback vers 2D
      logger.warn('VR indisponible, passage en mode 2D', error as Error, 'VR');
      return { mode: '2d', session: null };
    }
  }, [isSupported, startXRSession]);

  const updateBreathingPhase = useCallback((phase: 'inhale' | 'hold' | 'exhale' | 'rest') => {
    setBreathingState(prev => {
      const newCycleCount = phase === 'inhale' && prev.phase === 'rest' 
        ? prev.cycleCount + 1 
        : prev.cycleCount;
        
      return {
        ...prev,
        phase,
        cycleCount: newCycleCount
      };
    });
  }, []);

  // Patterns de respiration
  const getBreathingPattern = useCallback(() => {
    const patterns = {
      box: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }, // 4-4-4-4
      '4-7-8': { inhale: 4, hold1: 7, exhale: 8, hold2: 0 }, // 4-7-8
      coherence: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 } // 5-5
    };
    
    return patterns[breathingState.pattern];
  }, [breathingState.pattern]);

  return {
    isSupported,
    isSessionActive,
    breathingState,
    startBreathingSession,
    updateBreathingPhase,
    getBreathingPattern,
    endSession: endXRSession
  };
};