/**
 * useCoachMemory - Mémoire persistante cross-session pour le coach IA
 * Stocke contexte émotionnel, préférences et historique d'interactions
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface CoachMemoryEntry {
  id: string;
  type: 'emotion' | 'preference' | 'insight' | 'goal' | 'technique';
  content: string;
  context?: string;
  importance: 'low' | 'medium' | 'high';
  created_at: string;
  expires_at?: string;
}

export interface UserContext {
  recentEmotions: string[];
  preferredTechniques: string[];
  activeGoals: string[];
  avoidTopics: string[];
  lastSessionSummary?: string;
  sessionCount: number;
  relationshipDuration: number; // days
}

interface CoachMemoryState {
  entries: CoachMemoryEntry[];
  context: UserContext;
  isLoading: boolean;
}

const DEFAULT_CONTEXT: UserContext = {
  recentEmotions: [],
  preferredTechniques: [],
  activeGoals: [],
  avoidTopics: [],
  sessionCount: 0,
  relationshipDuration: 0,
};

export function useCoachMemory() {
  const { user } = useAuth();
  const [state, setState] = useState<CoachMemoryState>({
    entries: [],
    context: DEFAULT_CONTEXT,
    isLoading: true,
  });

  // Charger la mémoire depuis Supabase
  useEffect(() => {
    if (!user) {
      setState(s => ({ ...s, isLoading: false }));
      return;
    }

    loadMemory();
  }, [user]);

  const loadMemory = useCallback(async () => {
    if (!user) return;

    try {
      // Charger les entrées mémoire
      const { data: settingsData } = await supabase
        .from('user_settings')
        .select('value')
        .eq('user_id', user.id)
        .eq('key', 'coach_memory')
        .maybeSingle();

      // Charger les sessions de coaching
      const { data: sessionsData } = await supabase
        .from('ai_coach_sessions')
        .select('created_at, emotions_detected, techniques_suggested')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      let entries: CoachMemoryEntry[] = [];
      if (settingsData?.value) {
        try {
          entries = JSON.parse(settingsData.value);
        } catch {}
      }

      // Construire le contexte utilisateur
      const recentEmotions = new Set<string>();
      const preferredTechniques = new Set<string>();

      sessionsData?.forEach(session => {
        if (session.emotions_detected) {
          const emotions = typeof session.emotions_detected === 'string' 
            ? JSON.parse(session.emotions_detected) 
            : session.emotions_detected;
          if (Array.isArray(emotions)) {
            emotions.slice(0, 3).forEach(e => recentEmotions.add(e));
          }
        }
        if (session.techniques_suggested) {
          const techniques = Array.isArray(session.techniques_suggested) 
            ? session.techniques_suggested 
            : [];
          techniques.forEach(t => preferredTechniques.add(t));
        }
      });

      // Calculer durée relation
      const firstSession = sessionsData?.[sessionsData.length - 1];
      const relationshipDuration = firstSession
        ? Math.floor((Date.now() - new Date(firstSession.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      const context: UserContext = {
        recentEmotions: Array.from(recentEmotions).slice(0, 5),
        preferredTechniques: Array.from(preferredTechniques).slice(0, 5),
        activeGoals: entries.filter(e => e.type === 'goal').map(e => e.content),
        avoidTopics: entries.filter(e => e.type === 'preference' && e.content.startsWith('avoid:')).map(e => e.content.replace('avoid:', '')),
        sessionCount: sessionsData?.length || 0,
        relationshipDuration,
        lastSessionSummary: entries.find(e => e.type === 'insight')?.content,
      };

      setState({
        entries,
        context,
        isLoading: false,
      });

      logger.info('[CoachMemory] Loaded', { entriesCount: entries.length, sessionCount: context.sessionCount }, 'COACH');
    } catch (error) {
      logger.error('[CoachMemory] Load error', error as Error, 'COACH');
      setState(s => ({ ...s, isLoading: false }));
    }
  }, [user]);

  // Ajouter une entrée mémoire
  const addMemory = useCallback(async (
    type: CoachMemoryEntry['type'],
    content: string,
    options?: { context?: string; importance?: 'low' | 'medium' | 'high'; expiresInDays?: number }
  ) => {
    if (!user) return;

    const newEntry: CoachMemoryEntry = {
      id: crypto.randomUUID(),
      type,
      content,
      context: options?.context,
      importance: options?.importance || 'medium',
      created_at: new Date().toISOString(),
      expires_at: options?.expiresInDays 
        ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000).toISOString() 
        : undefined,
    };

    const updatedEntries = [...state.entries, newEntry]
      .filter(e => !e.expires_at || new Date(e.expires_at) > new Date())
      .slice(-50); // Garder les 50 dernières

    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key: 'coach_memory',
          value: JSON.stringify(updatedEntries),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,key' });

      setState(s => ({ ...s, entries: updatedEntries }));
      logger.debug('[CoachMemory] Added entry', { type, content: content.substring(0, 50) }, 'COACH');
    } catch (error) {
      logger.error('[CoachMemory] Add error', error as Error, 'COACH');
    }
  }, [user, state.entries]);

  // Récupérer le contexte formaté pour le prompt IA
  const getContextForPrompt = useCallback((): string => {
    const { context, entries } = state;
    const lines: string[] = [];

    if (context.sessionCount > 0) {
      lines.push(`Tu connais cet utilisateur depuis ${context.relationshipDuration} jours (${context.sessionCount} sessions).`);
    }

    if (context.recentEmotions.length > 0) {
      lines.push(`Émotions récentes: ${context.recentEmotions.join(', ')}.`);
    }

    if (context.preferredTechniques.length > 0) {
      lines.push(`Techniques préférées: ${context.preferredTechniques.join(', ')}.`);
    }

    if (context.activeGoals.length > 0) {
      lines.push(`Objectifs actifs: ${context.activeGoals.join(', ')}.`);
    }

    if (context.avoidTopics.length > 0) {
      lines.push(`Éviter ces sujets: ${context.avoidTopics.join(', ')}.`);
    }

    // Ajouter les insights importants
    const importantInsights = entries
      .filter(e => e.type === 'insight' && e.importance === 'high')
      .slice(-3)
      .map(e => e.content);

    if (importantInsights.length > 0) {
      lines.push(`Insights importants: ${importantInsights.join(' | ')}`);
    }

    return lines.join('\n');
  }, [state]);

  // Enregistrer un résumé de fin de session
  const saveSessionSummary = useCallback(async (summary: string, emotions: string[]) => {
    await addMemory('insight', summary, { importance: 'high', expiresInDays: 30 });
    
    for (const emotion of emotions.slice(0, 3)) {
      await addMemory('emotion', emotion, { expiresInDays: 7 });
    }
  }, [addMemory]);

  // Ajouter un objectif
  const addGoal = useCallback(async (goal: string) => {
    await addMemory('goal', goal, { importance: 'high' });
  }, [addMemory]);

  // Marquer une technique comme préférée
  const addPreferredTechnique = useCallback(async (technique: string) => {
    await addMemory('technique', technique, { importance: 'medium' });
  }, [addMemory]);

  return {
    ...state,
    addMemory,
    getContextForPrompt,
    saveSessionSummary,
    addGoal,
    addPreferredTechnique,
    reload: loadMemory,
  };
}

export default useCoachMemory;
