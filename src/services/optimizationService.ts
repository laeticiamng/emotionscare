import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

export interface OptimizationEvent {
  userId: string;
  module: string;
  action: string;
  timestamp?: string;
}

export interface OptimizationSuggestion {
  id: string;
  module: string;
  description: string;
  priority: number;
}

export async function logEvent(event: OptimizationEvent): Promise<void> {
  try {
    // Get the current authenticated user's ID from Supabase auth (optional for PWA metrics)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Generate a unique session ID for this event
    const sessionId = `${event.module}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { error } = await supabase.from('pwa_metrics').insert({
      session_id: sessionId,
      user_id: user?.id || null, // null for anonymous users (RLS allows this)
      device_type: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop',
      is_pwa: window.matchMedia('(display-mode: standalone)').matches,
      page_views: 1
    });
    
    if (error) {
      logger.warn('pwa_metrics insert failed', { error: error.message }, 'ANALYTICS');
    }
  } catch (err) {
    logger.warn('logEvent failed, using fallback', err, 'ANALYTICS');
  }
}

export async function fetchUsageReport(userId: string): Promise<{ module: string; usageCount: number; }[]> {
  try {
    // Fetch real usage from multiple tables
    const [journalResult, coachResult, musicResult, breathResult] = await Promise.all([
      supabase.from('journal_entries').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('coach_conversations').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('listening_sessions').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('breath_sessions').select('id', { count: 'exact' }).eq('user_id', userId)
    ]);

    return [
      { module: 'Journal', usageCount: journalResult.count || 0 },
      { module: 'Coach', usageCount: coachResult.count || 0 },
      { module: 'Music', usageCount: musicResult.count || 0 },
      { module: 'Respiration', usageCount: breathResult.count || 0 }
    ];
  } catch (err) {
    logger.warn('fetchUsageReport failed', err, 'ANALYTICS');
    return [
      { module: 'Journal', usageCount: 0 },
      { module: 'Coach', usageCount: 0 },
      { module: 'Music', usageCount: 0 },
      { module: 'Respiration', usageCount: 0 }
    ];
  }
}

export async function generateOptimizationSuggestions(userId: string): Promise<OptimizationSuggestion[]> {
  const report = await fetchUsageReport(userId);
  
  // Sort by usage (lowest first) to prioritize underused modules
  const sorted = [...report].sort((a, b) => a.usageCount - b.usageCount);
  
  return sorted.map((r, idx) => ({
    id: `${r.module}-${idx}`,
    module: r.module,
    priority: 10 - idx,
    description: r.usageCount === 0 
      ? `Découvrez le module ${r.module} pour enrichir votre parcours bien-être.`
      : r.usageCount < 5
      ? `Explorez davantage le module ${r.module} (${r.usageCount} utilisations).`
      : `Continuez avec le module ${r.module} - vous l'utilisez bien !`
  }));
}
