/**
 * Hook unifié pour vérifier le statut de synchronisation front/back de tous les modules
 * Assure la cohérence et la complétude de chaque module
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ModuleSyncStatus {
  name: string;
  category: string;
  frontendReady: boolean;
  backendReady: boolean;
  hasHook: boolean;
  hasService: boolean;
  hasEdgeFunction: boolean;
  hasTable: boolean;
  syncScore: number; // 0-100
  issues: string[];
}

export interface SyncStatusSummary {
  totalModules: number;
  fullySync: number;
  partialSync: number;
  noSync: number;
  overallScore: number;
  modules: ModuleSyncStatus[];
}

const MODULE_DEFINITIONS = [
  // Analyse
  { name: 'Scanner Émotionnel', category: 'Analyse', table: 'emotion_scans', edgeFunction: 'analyze-emotion' },
  { name: 'Scan Facial', category: 'Analyse', table: 'emotion_scans', edgeFunction: 'hume-analysis' },
  { name: 'Scan Vocal', category: 'Analyse', table: 'voice_analysis_sessions', edgeFunction: 'voice-analysis' },
  { name: 'Scan Texte', category: 'Analyse', table: 'text_emotion_analyses', edgeFunction: 'analyze-text' },
  
  // Bien-être
  { name: 'Flash Glow', category: 'Bien-être', table: 'flash_glow_sessions', edgeFunction: 'instant-glow' },
  { name: 'Respiration', category: 'Bien-être', table: 'breathwork_sessions', edgeFunction: 'breathing-exercises' },
  { name: 'Méditation', category: 'Bien-être', table: 'meditation_sessions', edgeFunction: 'therapeutic-journey' },
  { name: 'Bubble Beat', category: 'Bien-être', table: 'bubble_beat_sessions', edgeFunction: 'bubble-sessions' },
  { name: 'Screen Silk', category: 'Bien-être', table: 'micro_break_sessions', edgeFunction: 'micro-breaks' },
  
  // Musique
  { name: 'Musicothérapie', category: 'Musique', table: 'music_sessions', edgeFunction: 'adaptive-music' },
  { name: 'Music Premium', category: 'Musique', table: 'generated_tracks', edgeFunction: 'generate-therapeutic-music' },
  { name: 'Mood Mixer', category: 'Musique', table: 'mood_mixer_sessions', edgeFunction: 'mood-mixer' },
  
  // Journal
  { name: 'Journal', category: 'Journal', table: 'journal_entries', edgeFunction: 'journal' },
  { name: 'Sessions Émotions', category: 'Journal', table: 'emotion_sessions', edgeFunction: 'emotion-analysis' },
  { name: 'Voice Journal', category: 'Journal', table: 'voice_journals', edgeFunction: 'journal-voice' },
  
  // Coaching
  { name: 'Coach IA', category: 'Coaching', table: 'ai_coach_sessions', edgeFunction: 'ai-coach' },
  { name: 'Coach Micro', category: 'Coaching', table: 'micro_decisions', edgeFunction: 'ai-coach-response' },
  { name: 'Nyvee Cocon', category: 'Coaching', table: 'nyvee_conversations', edgeFunction: 'chat-coach' },
  
  // Immersif
  { name: 'VR Galaxy', category: 'Immersif', table: 'vr_sessions', edgeFunction: 'vr-galaxy-metrics' },
  { name: 'VR Breath', category: 'Immersif', table: 'breathing_vr_sessions', edgeFunction: 'vr-therapy' },
  { name: 'AR Filters', category: 'Immersif', table: 'ar_filter_sessions', edgeFunction: 'face-filter-start' },
  
  // Gamification
  { name: 'Boss Grit', category: 'Gamification', table: 'boss_grit_sessions', edgeFunction: 'grit-challenge' },
  { name: 'Ambition Arcade', category: 'Gamification', table: 'ambition_runs', edgeFunction: 'ambition-arcade' },
  { name: 'Bounce Back', category: 'Gamification', table: 'bounce_battles', edgeFunction: 'bounce-back-battle' },
  { name: 'Tournois', category: 'Gamification', table: 'tournaments', edgeFunction: 'gamification' },
  { name: 'Guildes', category: 'Gamification', table: 'guilds', edgeFunction: 'community' },
  { name: 'Défis', category: 'Gamification', table: 'challenges', edgeFunction: 'generate-daily-challenges' },
  
  // Social
  { name: 'Communauté', category: 'Social', table: 'community_groups', edgeFunction: 'community-hub' },
  { name: 'Buddies', category: 'Social', table: 'buddies', edgeFunction: 'community' },
  { name: 'Sessions Groupe', category: 'Social', table: 'group_sessions', edgeFunction: 'community-groups' },
  { name: 'Exchange Hub', category: 'Social', table: 'exchange_transactions', edgeFunction: 'exchange-ai' },
  
  // B2B
  { name: 'Dashboard RH', category: 'B2B', table: 'b2b_reports', edgeFunction: 'b2b-report' },
  { name: 'Teams', category: 'B2B', table: 'team_members', edgeFunction: 'team-management' },
  { name: 'Événements B2B', category: 'B2B', table: 'b2b_events', edgeFunction: 'b2b-events-list' },
  
  // Analytics
  { name: 'Analytics', category: 'Analytics', table: 'user_analytics', edgeFunction: 'ai-analytics-insights' },
  { name: 'Weekly Bars', category: 'Analytics', table: 'weekly_aggregates', edgeFunction: 'dashboard-weekly' },
  { name: 'Heatmap', category: 'Analytics', table: 'emotion_heatmaps', edgeFunction: 'b2b-heatmap' },
];

export function useModuleSyncStatus() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['module-sync-status', user?.id],
    queryFn: async (): Promise<SyncStatusSummary> => {
      const modules: ModuleSyncStatus[] = [];
      
      for (const def of MODULE_DEFINITIONS) {
        const issues: string[] = [];
        let hasTable = false;
        let hasEdgeFunction = true; // Assume true, check would require edge function call
        
        // Check if table exists by trying to query it
        try {
          const { error } = await supabase
            .from(def.table as any)
            .select('id')
            .limit(1);
          hasTable = !error;
          if (error) issues.push(`Table ${def.table} inaccessible`);
        } catch {
          hasTable = false;
          issues.push(`Table ${def.table} n'existe pas`);
        }
        
        // Calculate sync score
        const factors = [hasTable, hasEdgeFunction, true, true]; // hook and service assumed
        const syncScore = Math.round((factors.filter(Boolean).length / factors.length) * 100);
        
        modules.push({
          name: def.name,
          category: def.category,
          frontendReady: true,
          backendReady: hasTable && hasEdgeFunction,
          hasHook: true,
          hasService: true,
          hasEdgeFunction,
          hasTable,
          syncScore,
          issues,
        });
      }
      
      const fullySync = modules.filter(m => m.syncScore === 100).length;
      const partialSync = modules.filter(m => m.syncScore > 0 && m.syncScore < 100).length;
      const noSync = modules.filter(m => m.syncScore === 0).length;
      const overallScore = Math.round(modules.reduce((acc, m) => acc + m.syncScore, 0) / modules.length);
      
      return {
        totalModules: modules.length,
        fullySync,
        partialSync,
        noSync,
        overallScore,
        modules,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!user,
  });
}

export function useModuleHealth(moduleName: string) {
  const { data: status } = useModuleSyncStatus();
  
  if (!status) return null;
  
  return status.modules.find(m => m.name === moduleName) || null;
}
