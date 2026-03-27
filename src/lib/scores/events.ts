// @ts-nocheck
import { SessionEvent } from "@/SCHEMA";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

const KEY = "ec_session_events_v2";
const SYNC_INTERVAL = 30000; // 30 secondes

// Queue en mémoire pour performance
let eventQueue: SessionEvent[] = [];
let syncTimeout: ReturnType<typeof setTimeout> | null = null;

// Charger les événements depuis localStorage (fallback)
export function getEvents(): SessionEvent[] {
  try {
    // D'abord la queue en mémoire
    if (eventQueue.length > 0) {
      return [...eventQueue];
    }
    // Puis localStorage
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

// Enregistrer un événement
export function recordEvent(evt: SessionEvent) {
  const event = {
    ...evt,
    id: evt.id || crypto.randomUUID?.() || String(Date.now()),
    timestamp: evt.timestamp || new Date().toISOString()
  };
  
  eventQueue.push(event);
  
  // Sauvegarder en localStorage immédiatement (fallback)
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || "[]");
    existing.push(event);
    localStorage.setItem(KEY, JSON.stringify(existing.slice(-500))); // Garder max 500
  } catch (e) {
    logger.warn('[ScoreEvents] localStorage save failed', e, 'SCORES');
  }
  
  // Déclencher sync avec debounce
  scheduleSyncToSupabase();
}

// Effacer les événements
export function clearEvents() {
  eventQueue = [];
  localStorage.removeItem(KEY);
}

// Planifier la synchronisation vers Supabase
function scheduleSyncToSupabase() {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  
  syncTimeout = setTimeout(async () => {
    await syncEventsToSupabase();
  }, SYNC_INTERVAL);
}

// Synchroniser vers Supabase
async function syncEventsToSupabase() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  const events = getEvents();
  if (events.length === 0) return;
  
  try {
    // Sauvegarder dans user_settings comme batch
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        key: 'session_events_queue',
        value: JSON.stringify(events.slice(-200)), // Garder les 200 derniers
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,key'
      });
    
    if (!error) {
      // Vider la queue locale après sync réussi
      eventQueue = [];
      localStorage.removeItem(KEY);
      logger.info(`[ScoreEvents] Synced ${events.length} events to Supabase`, {}, 'SCORES');
    }
  } catch (error) {
    logger.error('[ScoreEvents] Sync to Supabase failed', error, 'SCORES');
  }
}

// Charger les événements depuis Supabase au démarrage
export async function loadEventsFromSupabase(): Promise<SessionEvent[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return getEvents();
    
    const { data } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', 'session_events_queue')
      .maybeSingle();
    
    if (data?.value) {
      const events = typeof data.value === 'string' 
        ? JSON.parse(data.value) 
        : data.value;
      return Array.isArray(events) ? events : [];
    }
  } catch (error) {
    logger.error('[ScoreEvents] Load from Supabase failed', error, 'SCORES');
  }
  
  return getEvents();
}

// Forcer la synchronisation (appelé avant fermeture page)
export async function forceSyncEvents() {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  await syncEventsToSupabase();
}

// Sync au unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    // Sauvegarder en localStorage avant fermeture
    const events = getEvents();
    if (events.length > 0) {
      localStorage.setItem(KEY, JSON.stringify(events.slice(-500)));
    }
  });
}
