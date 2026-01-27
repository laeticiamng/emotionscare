/**
 * Hook pour les sessions WebXR immersives
 * Gère l'état de la session VR et les interactions
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  WebXREnhancementService,
  type WebXRCapabilities,
  type VRTherapeuticZone,
  type ImmersiveSessionStats,
  type HapticFeedback,
  type XRSessionConfig
} from '../webxrEnhancements';

export interface UseWebXRSessionOptions {
  environmentType?: 'nature' | 'cosmic' | 'abstract';
  enableHaptics?: boolean;
}

export function useWebXRSession(options: UseWebXRSessionOptions = {}) {
  const { environmentType = 'cosmic', enableHaptics = true } = options;

  const [capabilities, setCapabilities] = useState<WebXRCapabilities | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isCheckingCapabilities, setIsCheckingCapabilities] = useState(false);
  const [therapeuticZones, setTherapeuticZones] = useState<VRTherapeuticZone[]>([]);
  const [currentZone, setCurrentZone] = useState<VRTherapeuticZone | null>(null);
  const [sessionStats, setSessionStats] = useState<ImmersiveSessionStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceRef = useRef<WebXREnhancementService>(new WebXREnhancementService());
  const sessionIdRef = useRef<string | null>(null);

  // Vérifier les capacités WebXR au montage
  useEffect(() => {
    const checkCapabilities = async () => {
      setIsCheckingCapabilities(true);
      try {
        const caps = await WebXREnhancementService.checkCapabilities();
        setCapabilities(caps);
        
        if (!caps.isSupported) {
          setError('WebXR n\'est pas supporté par votre navigateur');
        } else if (!caps.immersiveVR) {
          setError('Mode VR immersif non disponible');
        }
      } catch (err) {
        setError('Erreur lors de la vérification des capacités VR');
      } finally {
        setIsCheckingCapabilities(false);
      }
    };

    checkCapabilities();
  }, []);

  // Générer les zones thérapeutiques
  useEffect(() => {
    const zones = WebXREnhancementService.generateTherapeuticZones(environmentType);
    setTherapeuticZones(zones);
  }, [environmentType]);

  // Démarrer une session VR immersive
  const startSession = useCallback(async (config?: Partial<XRSessionConfig>) => {
    if (!capabilities?.immersiveVR) {
      toast.error('VR immersive non disponible');
      return null;
    }

    try {
      setError(null);
      const session = await serviceRef.current.startImmersiveSession(config);
      sessionIdRef.current = crypto.randomUUID();
      setIsSessionActive(true);
      toast.success('Session VR démarrée');
      
      // Retour haptique de bienvenue
      if (enableHaptics) {
        await serviceRef.current.triggerHapticFeedback('left', { intensity: 0.3, duration: 200 });
        await serviceRef.current.triggerHapticFeedback('right', { intensity: 0.3, duration: 200 });
      }

      return session;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur VR inconnue';
      setError(message);
      toast.error(message);
      return null;
    }
  }, [capabilities, enableHaptics]);

  // Terminer la session
  const endSession = useCallback(async () => {
    try {
      const stats = await serviceRef.current.endSession();
      setIsSessionActive(false);
      setSessionStats(stats);
      setCurrentZone(null);
      toast.info('Session VR terminée');
      return stats;
    } catch (err) {
      console.error('Error ending session:', err);
      setIsSessionActive(false);
      return null;
    }
  }, []);

  // Démarrer une séance de respiration guidée
  const startBreathingGuidance = useCallback(async (config: {
    inhaleSeconds: number;
    holdSeconds: number;
    exhaleSeconds: number;
    cycles: number;
  }) => {
    if (!isSessionActive) {
      toast.error('Session VR non active');
      return;
    }

    toast.info('Respiration guidée commencée');
    await serviceRef.current.startBreathingGuidance(config);
    toast.success('Respiration guidée terminée');
  }, [isSessionActive]);

  // Déclencher un retour haptique
  const triggerHaptic = useCallback(async (
    hand: 'left' | 'right',
    feedback: HapticFeedback
  ) => {
    if (!isSessionActive || !enableHaptics) return;
    await serviceRef.current.triggerHapticFeedback(hand, feedback);
  }, [isSessionActive, enableHaptics]);

  // Entrer dans une zone thérapeutique
  const enterZone = useCallback((zoneId: string) => {
    const zone = therapeuticZones.find(z => z.id === zoneId);
    if (zone) {
      setCurrentZone(zone);
      
      // Retour haptique selon l'effet thérapeutique
      if (enableHaptics && isSessionActive) {
        const hapticConfig: Record<string, HapticFeedback> = {
          calming: { intensity: 0.2, duration: 500 },
          energizing: { intensity: 0.6, duration: 300 },
          grounding: { intensity: 0.4, duration: 800 },
          releasing: { intensity: 0.3, duration: 600 }
        };
        
        const feedback = hapticConfig[zone.therapeuticEffect] || { intensity: 0.3, duration: 400 };
        serviceRef.current.triggerHapticFeedback('left', feedback);
        serviceRef.current.triggerHapticFeedback('right', feedback);
      }
    }
  }, [therapeuticZones, enableHaptics, isSessionActive]);

  // Quitter la zone actuelle
  const exitZone = useCallback(() => {
    setCurrentZone(null);
  }, []);

  // Calculer les statistiques de session
  const calculateStats = useCallback(async () => {
    if (!sessionIdRef.current) return null;
    
    try {
      const stats = await serviceRef.current.calculateSessionStats(sessionIdRef.current);
      setSessionStats(stats);
      return stats;
    } catch (err) {
      console.error('Error calculating stats:', err);
      return null;
    }
  }, []);

  // Démarrer une session duo
  const startDuoSession = useCallback(async (partnerId: string) => {
    if (!isSessionActive) {
      toast.error('Démarrez d\'abord une session VR');
      return null;
    }

    try {
      const { channelId, syncState } = await serviceRef.current.startDuoSession(partnerId);
      toast.success('Session duo connectée');
      return { channelId, syncState };
    } catch (err) {
      toast.error('Erreur connexion duo');
      return null;
    }
  }, [isSessionActive]);

  return {
    // État
    capabilities,
    isSessionActive,
    isCheckingCapabilities,
    therapeuticZones,
    currentZone,
    sessionStats,
    error,
    
    // Disponibilité
    isVRAvailable: capabilities?.immersiveVR ?? false,
    isARAvailable: capabilities?.immersiveAR ?? false,

    // Actions
    startSession,
    endSession,
    startBreathingGuidance,
    triggerHaptic,
    enterZone,
    exitZone,
    calculateStats,
    startDuoSession
  };
}

export default useWebXRSession;
