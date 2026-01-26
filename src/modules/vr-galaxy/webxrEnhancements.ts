/**
 * VR Galaxy WebXR Enhancements - Améliorations expérience immersive
 * Fonctionnalités avancées pour sessions VR thérapeutiques
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export interface WebXRCapabilities {
  isSupported: boolean;
  immersiveVR: boolean;
  immersiveAR: boolean;
  inlineSession: boolean;
  handTracking: boolean;
  boundedFloor: boolean;
}

export interface XRSessionConfig {
  mode: 'immersive-vr' | 'immersive-ar' | 'inline';
  referenceSpaceType: 'local' | 'local-floor' | 'bounded-floor' | 'unbounded';
  requiredFeatures: string[];
  optionalFeatures: string[];
}

export interface XRControllerState {
  hand: 'left' | 'right';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  grip: number;
  trigger: number;
  thumbstick: { x: number; y: number };
  buttons: boolean[];
}

export interface HapticFeedback {
  intensity: number;
  duration: number;
  pattern?: number[];
}

export interface VRTherapeuticZone {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  radius: number;
  therapeuticEffect: 'calming' | 'energizing' | 'grounding' | 'releasing';
  visualTheme: {
    primaryColor: string;
    particleType: string;
    ambientSound: string;
  };
}

export interface ImmersiveSessionStats {
  totalImmersiveTime: number;
  zonesVisited: string[];
  interactionsCount: number;
  coherenceScoreAvg: number;
  peakRelaxation: number;
  breathingCompliance: number;
}

// ============================================================================
// WEBXR ENHANCEMENT SERVICE
// ============================================================================

export class WebXREnhancementService {
  private xrSession: XRSession | null = null;
  private referenceSpace: XRReferenceSpace | null = null;
  private controllers: Map<string, XRControllerState> = new Map();

  /**
   * Vérifier les capacités WebXR du navigateur
   */
  static async checkCapabilities(): Promise<WebXRCapabilities> {
    if (!navigator.xr) {
      return {
        isSupported: false,
        immersiveVR: false,
        immersiveAR: false,
        inlineSession: false,
        handTracking: false,
        boundedFloor: false
      };
    }

    const [immersiveVR, immersiveAR, inlineSession] = await Promise.all([
      navigator.xr.isSessionSupported('immersive-vr').catch(() => false),
      navigator.xr.isSessionSupported('immersive-ar').catch(() => false),
      navigator.xr.isSessionSupported('inline').catch(() => false)
    ]);

    return {
      isSupported: true,
      immersiveVR,
      immersiveAR,
      inlineSession,
      handTracking: false, // À vérifier lors de la session
      boundedFloor: false
    };
  }

  /**
   * Démarrer une session VR immersive
   */
  async startImmersiveSession(config: Partial<XRSessionConfig> = {}): Promise<XRSession> {
    if (!navigator.xr) {
      throw new Error('WebXR non supporté');
    }

    const sessionInit: XRSessionInit = {
      requiredFeatures: config.requiredFeatures || ['local-floor'],
      optionalFeatures: config.optionalFeatures || [
        'hand-tracking',
        'bounded-floor',
        'layers'
      ]
    };

    const mode = config.mode || 'immersive-vr';
    this.xrSession = await navigator.xr.requestSession(mode, sessionInit);

    // Configurer les gestionnaires d'événements
    this.xrSession.addEventListener('end', this.handleSessionEnd.bind(this));
    this.xrSession.addEventListener('inputsourceschange', this.handleInputSourcesChange.bind(this));

    // Obtenir l'espace de référence
    const refSpaceType = config.referenceSpaceType || 'local-floor';
    this.referenceSpace = await this.xrSession.requestReferenceSpace(refSpaceType);

    // Logger le démarrage de session
    await this.logSessionStart();

    return this.xrSession;
  }

  /**
   * Créer des zones thérapeutiques dans l'environnement VR
   */
  static generateTherapeuticZones(environmentType: string): VRTherapeuticZone[] {
    const baseZones: VRTherapeuticZone[] = [
      {
        id: 'zone-calming-1',
        name: 'Oasis de Sérénité',
        position: { x: 0, y: 0, z: -5 },
        radius: 3,
        therapeuticEffect: 'calming',
        visualTheme: {
          primaryColor: '#00b4d8',
          particleType: 'softGlow',
          ambientSound: 'ocean-waves'
        }
      },
      {
        id: 'zone-grounding-1',
        name: 'Forêt Ancienne',
        position: { x: 5, y: 0, z: 0 },
        radius: 4,
        therapeuticEffect: 'grounding',
        visualTheme: {
          primaryColor: '#2d6a4f',
          particleType: 'leaves',
          ambientSound: 'forest-birds'
        }
      },
      {
        id: 'zone-releasing-1',
        name: 'Cascade Libératrice',
        position: { x: -5, y: 0, z: 0 },
        radius: 3.5,
        therapeuticEffect: 'releasing',
        visualTheme: {
          primaryColor: '#7209b7',
          particleType: 'waterfall',
          ambientSound: 'waterfall'
        }
      },
      {
        id: 'zone-energizing-1',
        name: 'Sommet Lumineux',
        position: { x: 0, y: 3, z: -8 },
        radius: 2.5,
        therapeuticEffect: 'energizing',
        visualTheme: {
          primaryColor: '#fca311',
          particleType: 'sunrays',
          ambientSound: 'morning-birds'
        }
      }
    ];

    // Adapter selon le type d'environnement
    if (environmentType === 'cosmic') {
      return baseZones.map(zone => ({
        ...zone,
        visualTheme: {
          ...zone.visualTheme,
          particleType: zone.visualTheme.particleType === 'leaves' ? 'stardust' : zone.visualTheme.particleType,
          ambientSound: 'cosmic-ambience'
        }
      }));
    }

    return baseZones;
  }

  /**
   * Activer le retour haptique sur les contrôleurs
   */
  async triggerHapticFeedback(
    hand: 'left' | 'right',
    feedback: HapticFeedback
  ): Promise<void> {
    if (!this.xrSession) return;

    for (const source of this.xrSession.inputSources) {
      if (source.handedness === hand && source.gamepad?.hapticActuators) {
        const actuator = source.gamepad.hapticActuators[0];
        if (actuator) {
          await actuator.pulse(feedback.intensity, feedback.duration);
        }
      }
    }
  }

  /**
   * Déclencher une séquence de respiration guidée en VR
   */
  async startBreathingGuidance(config: {
    inhaleSeconds: number;
    holdSeconds: number;
    exhaleSeconds: number;
    cycles: number;
  }): Promise<void> {
    const { inhaleSeconds, holdSeconds, exhaleSeconds, cycles } = config;

    for (let cycle = 0; cycle < cycles; cycle++) {
      // Inspiration - retour haptique doux croissant
      await this.triggerHapticFeedback('left', { intensity: 0.3, duration: inhaleSeconds * 1000 });
      await this.triggerHapticFeedback('right', { intensity: 0.3, duration: inhaleSeconds * 1000 });
      await this.sleep(inhaleSeconds * 1000);

      // Rétention - vibration légère
      await this.triggerHapticFeedback('left', { intensity: 0.1, duration: holdSeconds * 1000 });
      await this.triggerHapticFeedback('right', { intensity: 0.1, duration: holdSeconds * 1000 });
      await this.sleep(holdSeconds * 1000);

      // Expiration - retour décroissant
      await this.triggerHapticFeedback('left', { intensity: 0.2, duration: exhaleSeconds * 1000 });
      await this.triggerHapticFeedback('right', { intensity: 0.2, duration: exhaleSeconds * 1000 });
      await this.sleep(exhaleSeconds * 1000);
    }
  }

  /**
   * Calculer les statistiques de la session immersive
   */
  async calculateSessionStats(sessionId: string): Promise<ImmersiveSessionStats> {
    const { data: session } = await supabase
      .from('vr_nebula_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (!session) {
      return {
        totalImmersiveTime: 0,
        zonesVisited: [],
        interactionsCount: 0,
        coherenceScoreAvg: 0,
        peakRelaxation: 0,
        breathingCompliance: 0
      };
    }

    const discoveries = session.discoveries || [];
    const uniqueZones = [...new Set(discoveries.map((d: any) => d.zone_id).filter(Boolean))] as string[];

    return {
      totalImmersiveTime: session.duration_seconds || 0,
      zonesVisited: uniqueZones,
      interactionsCount: discoveries.length,
      coherenceScoreAvg: session.coherence_score || 0,
      peakRelaxation: this.calculatePeakRelaxation(discoveries),
      breathingCompliance: this.calculateBreathingCompliance(session)
    };
  }

  /**
   * Synchroniser la session avec un partenaire (mode duo)
   */
  async startDuoSession(partnerId: string): Promise<{
    channelId: string;
    syncState: () => void;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Non authentifié');

    const channelId = `vr-duo:${[user.id, partnerId].sort().join('-')}`;
    const channel = supabase.channel(channelId);

    channel
      .on('broadcast', { event: 'controller_state' }, ({ payload }) => {
        // Mettre à jour la position du partenaire
        console.log('Partner state:', payload);
      })
      .subscribe();

    const syncState = () => {
      channel.send({
        type: 'broadcast',
        event: 'controller_state',
        payload: {
          userId: user.id,
          controllers: Object.fromEntries(this.controllers),
          timestamp: Date.now()
        }
      });
    };

    return { channelId, syncState };
  }

  /**
   * Terminer la session VR
   */
  async endSession(): Promise<ImmersiveSessionStats | null> {
    if (!this.xrSession) return null;

    await this.xrSession.end();
    this.xrSession = null;
    this.referenceSpace = null;
    this.controllers.clear();

    return null;
  }

  // --------------------------------------------------------------------------
  // PRIVATE HELPERS
  // --------------------------------------------------------------------------

  private handleSessionEnd(): void {
    console.log('XR Session ended');
    this.xrSession = null;
    this.referenceSpace = null;
  }

  private handleInputSourcesChange(event: XRInputSourcesChangeEvent): void {
    for (const source of event.added) {
      console.log('Controller added:', source.handedness);
    }
    for (const source of event.removed) {
      console.log('Controller removed:', source.handedness);
      this.controllers.delete(source.handedness || 'unknown');
    }
  }

  private async logSessionStart(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('vr_session_logs').insert({
          user_id: user.id,
          event_type: 'immersive_session_start',
          metadata: { timestamp: new Date().toISOString() }
        });
      }
    } catch (error) {
      console.error('Error logging session start:', error);
    }
  }

  private calculatePeakRelaxation(discoveries: any[]): number {
    const relaxationScores = discoveries
      .filter(d => d.therapeutic_value)
      .map(d => d.therapeutic_value);
    
    return relaxationScores.length > 0
      ? Math.max(...relaxationScores)
      : 0;
  }

  private calculateBreathingCompliance(session: any): number {
    // Calculer le taux de conformité basé sur les données de respiration
    const targetRate = 6; // Respirations par minute idéales
    const actualRate = session.resp_rate_avg || 0;
    
    if (actualRate === 0) return 0;
    
    const deviation = Math.abs(actualRate - targetRate) / targetRate;
    return Math.max(0, 1 - deviation);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const webxrEnhancementService = new WebXREnhancementService();
