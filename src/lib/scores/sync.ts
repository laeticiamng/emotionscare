// @ts-nocheck
import { getEvents, clearEvents } from "./events";
import { hasConsent } from "@/ui/CookieConsent";
import { ff } from "@/lib/flags/ff";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export async function trySyncScores() {
  const canSend = (ff?.("telemetry-opt-in") ?? false) && (hasConsent?.("analytics") ?? false);
  if (!canSend) return { sent: 0 };
  
  const events = getEvents();
  if (!events.length) return { sent: 0 };
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Store locally for later sync
      return { sent: 0 };
    }

    // Insert events into Supabase
    const { error } = await supabase
      .from('user_analytics_events')
      .insert(events.map(event => ({
        user_id: user.id,
        event_type: event.type || 'score',
        event_data: event,
        created_at: event.timestamp || new Date().toISOString(),
      })));

    if (error) {
      logger.warn('Score sync failed', { error: error.message }, 'ANALYTICS');
      return { sent: 0 };
    }

    // Clear synced events
    clearEvents?.();
    
    return { sent: events.length };
  } catch (error) {
    logger.error('Score sync error', error as Error, 'ANALYTICS');
    return { sent: 0 };
  }
}
