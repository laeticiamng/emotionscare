/**
 * useParkModuleSymbiosis - Hook pour la symbiose Parc <-> Modules
 * Synchronise les activités du parc avec tous les modules de l'application
 */

import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useModuleInterconnect } from '@/hooks/useModuleInterconnect';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ModuleActivity {
  moduleId: string;
  moduleName: string;
  sessionType: string;
  completedAt: string;
  duration?: number;
  moodImpact?: number;
  xpEarned?: number;
}

export interface ParkZoneActivity {
  zoneKey: string;
  zoneName: string;
  attractionId: string;
  attractionName: string;
  visitedAt: string;
}

/**
 * Mapping des attractions du parc vers les modules de l'application
 */
const ATTRACTION_MODULE_MAP: Record<string, {
  moduleType: string;
  route: string;
  zone: string;
}> = {
  // Zone Calm
  'calm-lake': { moduleType: 'breathing', route: '/app/breath', zone: 'calm' },
  'calm-garden': { moduleType: 'meditation', route: '/app/nyvee', zone: 'calm' },
  'meditation-temple': { moduleType: 'meditation', route: '/app/nyvee', zone: 'calm' },
  
  // Zone Joy
  'joy-carousel': { moduleType: 'music_therapy', route: '/app/music', zone: 'joy' },
  'joy-fountain': { moduleType: 'mood_mixer', route: '/app/mood-mixer', zone: 'joy' },
  
  // Zone Courage
  'courage-arena': { moduleType: 'bounce_back', route: '/app/bounce', zone: 'courage' },
  'challenge-tower': { moduleType: 'flash_glow', route: '/app/flash-glow', zone: 'courage' },
  
  // Zone Wonder
  'wonder-cave': { moduleType: 'emotion_scan', route: '/app/scan', zone: 'wonder' },
  'discovery-lab': { moduleType: 'coach', route: '/app/coach', zone: 'wonder' },
  
  // Zone Connection
  'connection-plaza': { moduleType: 'community', route: '/app/community', zone: 'connection' },
  'buddy-garden': { moduleType: 'community', route: '/app/buddies', zone: 'connection' },
  
  // Zone Growth
  'growth-library': { moduleType: 'journal', route: '/app/journal', zone: 'growth' },
  'wisdom-tree': { moduleType: 'coach', route: '/app/coach', zone: 'growth' },
  
  // VR Zone
  'vr-dome': { moduleType: 'vr_galaxy', route: '/app/vr-galaxy', zone: 'immersive' },
  'ar-portal': { moduleType: 'ar_filter', route: '/app/ar-filters', zone: 'immersive' },
};

export function useParkModuleSymbiosis() {
  const { user } = useAuth();
  const { syncFromModule, notifyModules, refreshAll, insights } = useModuleInterconnect();

  /**
   * Synchronise une visite d'attraction avec le système unifié
   */
  const syncAttractionVisit = useCallback(async (
    attractionId: string,
    attractionName: string,
    zoneKey: string
  ) => {
    if (!user) return;

    const mapping = ATTRACTION_MODULE_MAP[attractionId];
    const moduleType = mapping?.moduleType || 'meditation';

    try {
      // Créer une session unifiée pour cette visite
      await syncFromModule(moduleType as Parameters<typeof syncFromModule>[0], `park-${attractionId}-${Date.now()}`, {
        duration_seconds: 0, // Sera mis à jour quand l'utilisateur termine
        metadata: {
          source: 'emotional_park',
          attraction_id: attractionId,
          attraction_name: attractionName,
          zone: zoneKey,
          visited_at: new Date().toISOString()
        }
      });

      // Notifier les modules connectés
      await notifyModules('emotional_park', 'triggers', {
        event: 'attraction_visited',
        attraction_id: attractionId,
        zone: zoneKey,
        recommended_module: moduleType
      });

      // Mettre à jour l'aura de l'utilisateur basée sur l'activité
      await updateUserAura(zoneKey);

      logger.info(`[ParkSymbiosis] Synced attraction visit: ${attractionId}`, {}, 'PARK');
    } catch (error) {
      logger.error('[ParkSymbiosis] Failed to sync attraction visit', error as Error, 'PARK');
    }
  }, [user, syncFromModule, notifyModules]);

  /**
   * Met à jour l'aura utilisateur basée sur les zones visitées
   */
  const updateUserAura = useCallback(async (zoneKey: string) => {
    if (!user) return;

    try {
      // Déterminer la teinte basée sur la zone
      const zoneHues: Record<string, number> = {
        joy: 45,      // Jaune/Orange
        calm: 200,    // Bleu
        courage: 0,   // Rouge
        wonder: 280,  // Violet
        connection: 120, // Vert
        growth: 160,  // Cyan/Vert
        immersive: 260 // Indigo
      };

      const hue = zoneHues[zoneKey] || 180;
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      // Upsert l'aura de la semaine
      const { error } = await supabase
        .from('aura_history')
        .upsert({
          user_id: user.id,
          week_start: weekStart.toISOString().split('T')[0],
          week_end: weekEnd.toISOString().split('T')[0],
          color_hue: hue,
          luminosity: 70, // Base luminosity
          size_scale: 1.0
        }, {
          onConflict: 'user_id,week_start'
        });

      if (error) {
        logger.warn('[ParkSymbiosis] Failed to update aura', error, 'PARK');
      }
    } catch (error) {
      logger.error('[ParkSymbiosis] Aura update error', error as Error, 'PARK');
    }
  }, [user]);

  /**
   * Récupère les activités récentes de tous les modules
   */
  const getRecentModuleActivities = useCallback(async (): Promise<ModuleActivity[]> => {
    if (!user) return [];

    try {
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!data) return [];

      return data.map(session => ({
        moduleId: session.id,
        moduleName: session.session_type,
        sessionType: session.session_type,
        completedAt: session.ended_at || session.created_at,
        duration: session.duration_seconds,
        moodImpact: session.mood_after && session.mood_before 
          ? session.mood_after - session.mood_before 
          : undefined,
        xpEarned: session.xp_earned
      }));
    } catch (error) {
      logger.error('[ParkSymbiosis] Failed to get module activities', error as Error, 'PARK');
      return [];
    }
  }, [user]);

  /**
   * Synchronise un événement depuis n'importe quel module vers le parc
   */
  const syncModuleEvent = useCallback(async (
    moduleType: string,
    eventType: 'session_completed' | 'achievement_unlocked' | 'mood_logged',
    eventData: Record<string, unknown>
  ) => {
    if (!user) return;

    try {
      // Mettre à jour les stats du parc basées sur l'événement
      if (eventType === 'session_completed') {
        // Incrémenter les XP globaux
        await supabase.rpc('increment_user_xp', {
          p_user_id: user.id,
          p_xp_amount: (eventData.xp_earned as number) || 10
        });
      }

      if (eventType === 'mood_logged') {
        // Mettre à jour la météo du parc
        const moodScore = eventData.mood_score as number;
        if (moodScore) {
          await updateUserAura(moodScore > 70 ? 'joy' : moodScore > 40 ? 'calm' : 'courage');
        }
      }

      // Notifier les autres modules
      await notifyModules(moduleType, 'shares_data', {
        event_type: eventType,
        ...eventData,
        synced_to_park: true
      });

      refreshAll();
    } catch (error) {
      logger.error('[ParkSymbiosis] Failed to sync module event', error as Error, 'PARK');
    }
  }, [user, notifyModules, refreshAll, updateUserAura]);

  /**
   * Obtient les recommandations de zones basées sur l'historique
   */
  const getZoneRecommendations = useCallback((): Array<{
    zone: string;
    reason: string;
    priority: number;
  }> => {
    if (!insights) return [];

    const recommendations: Array<{ zone: string; reason: string; priority: number }> = [];

    // Basé sur les modules les plus utilisés
    for (const rec of insights.recommendedModules) {
      // Trouver la zone correspondante
      const zoneEntry = Object.entries(ATTRACTION_MODULE_MAP)
        .find(([, value]) => value.moduleType === rec.module);
      
      if (zoneEntry) {
        recommendations.push({
          zone: zoneEntry[1].zone,
          reason: rec.reason,
          priority: rec.priority
        });
      }
    }

    return recommendations
      .filter((r, i, arr) => arr.findIndex(x => x.zone === r.zone) === i)
      .slice(0, 3);
  }, [insights]);

  /**
   * Écouter les événements inter-modules
   */
  useEffect(() => {
    const handleModuleEvent = (event: CustomEvent) => {
      const { source, type, data } = event.detail || {};
      
      // Réagir aux événements des autres modules
      if (source !== 'emotional_park' && type === 'shares_data') {
        logger.debug(`[ParkSymbiosis] Received event from ${source}`, data, 'PARK');
        
        // Mettre à jour le parc si nécessaire
        if (data?.mood_score) {
          updateUserAura(data.mood_score > 70 ? 'joy' : 'calm');
        }
      }
    };

    window.addEventListener('module-event', handleModuleEvent as EventListener);
    return () => {
      window.removeEventListener('module-event', handleModuleEvent as EventListener);
    };
  }, [updateUserAura]);

  return {
    // Sync functions
    syncAttractionVisit,
    syncModuleEvent,
    updateUserAura,
    
    // Data functions
    getRecentModuleActivities,
    getZoneRecommendations,
    
    // Module map for reference
    attractionModuleMap: ATTRACTION_MODULE_MAP,
    
    // Insights from interconnect
    crossModuleInsights: insights
  };
}

export default useParkModuleSymbiosis;
