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
    // Get the current authenticated user's ID from Supabase auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logger.warn('logEvent skipped: no authenticated user', null, 'ANALYTICS');
      return;
    }
    
    const { error } = await supabase.from('pwa_metrics').insert({
      user_id: user.id, // Use auth.uid() instead of provided userId to satisfy RLS
      metric_type: event.module,
      metric_value: { action: event.action },
      recorded_at: event.timestamp || new Date().toISOString()
    });
    if (error) throw error;
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
