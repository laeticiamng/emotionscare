/**
 * useScanSettings - Hook pour persister les settings scan vers Supabase
 * Remplace localStorage pour scan_statistics, scan_history, favorite_scan_methods,
 * onboarding, emoji preferences, weekly reports, etc.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

// Clés pour les différents settings scan
const SCAN_STATS_KEY = 'scan:statistics';
const SCAN_HISTORY_KEY = 'scan:history';
const FAVORITE_METHODS_KEY = 'scan:favorite_methods';
const SCAN_DRAFT_KEY = 'scan:draft';
const ONBOARDING_KEY = 'scan:onboarding_completed';
const EMOJI_FAVORITES_KEY = 'scan:emoji_favorites';
const EMOJI_HISTORY_KEY = 'scan:emoji_history';
const EMOJI_STATS_KEY = 'scan:emoji_stats';
const HISTORY_FAVORITES_KEY = 'scan:history_favorites';
const RESULT_HISTORY_KEY = 'scan:result_history';
const WEEKLY_REPORTS_KEY = 'scan:weekly_reports';
const WEEKLY_GOAL_KEY = 'scan:weekly_goal';
const EXPORT_HISTORY_KEY = 'scan:export_history';
const EMOTION_BOOKMARKS_KEY = 'scan:emotion_bookmarks';
const TEXT_DRAFTS_KEY = 'scan:text_drafts';
const TEXT_HISTORY_KEY = 'scan:text_history';

export interface ScanStats {
  totalScans: number;
  scansByMethod: Record<string, number>;
  lastScanDate: string | null;
  averageEmotionScore: number;
  streakDays: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface ScanHistoryEntry {
  id: string;
  date: string;
  method: string;
  emotion: string;
  score: number;
}

export interface ResultHistoryEntry {
  id: string;
  bucket: string;
  label: string;
  confidence: number;
  timestamp: string;
  isFavorite: boolean;
}

export interface WeekSnapshot {
  weekStart: string;
  stats: any;
}

export interface ExportRecord {
  id: string;
  format: string;
  date: string;
  itemCount: number;
}

export interface TextDraft {
  id: string;
  text: string;
  date: string;
}

export interface TextHistoryEntry {
  text: string;
  date: string;
  sentiment: string;
}

const defaultStats: ScanStats = {
  totalScans: 0,
  scansByMethod: {},
  lastScanDate: null,
  averageEmotionScore: 0,
  streakDays: 0,
  weeklyGoal: 7,
  weeklyProgress: 0
};

export function useScanSettings() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ScanStats>(defaultStats);
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [favoriteMethods, setFavoriteMethods] = useState<string[]>([]);
  const [draft, setDraft] = useState<any>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [emojiFavorites, setEmojiFavorites] = useState<string[]>([]);
  const [emojiHistory, setEmojiHistory] = useState<string[]>([]);
  const [emojiStats, setEmojiStats] = useState<Record<string, number>>({});
  const [historyFavorites, setHistoryFavorites] = useState<string[]>([]);
  const [resultHistory, setResultHistory] = useState<ResultHistoryEntry[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeekSnapshot[]>([]);
  const [weeklyGoal, setWeeklyGoalState] = useState(14);
  const [exportHistory, setExportHistory] = useState<ExportRecord[]>([]);
  const [emotionBookmarks, setEmotionBookmarks] = useState<string[]>([]);
  const [textDrafts, setTextDrafts] = useState<TextDraft[]>([]);
  const [textHistory, setTextHistory] = useState<TextHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load from Supabase
  const loadSettings = useCallback(async () => {
    if (!user) {
      // Fallback localStorage pour utilisateurs non connectés
      try {
        setOnboardingCompleted(localStorage.getItem('scan-onboarding-completed') === 'true');
        const eFav = localStorage.getItem('emoji_favorites');
        if (eFav) setEmojiFavorites(JSON.parse(eFav));
        const eHist = localStorage.getItem('emoji_history');
        if (eHist) setEmojiHistory(JSON.parse(eHist));
        const eStat = localStorage.getItem('emoji_stats');
        if (eStat) setEmojiStats(JSON.parse(eStat));
        const hFav = localStorage.getItem('emotion-history-favorites');
        if (hFav) setHistoryFavorites(JSON.parse(hFav));
        const rHist = localStorage.getItem('scan-result-history');
        if (rHist) setResultHistory(JSON.parse(rHist));
        const wReports = localStorage.getItem('weekly_emotion_reports');
        if (wReports) setWeeklyReports(JSON.parse(wReports));
        const wGoal = localStorage.getItem('weekly_emotion_goals');
        if (wGoal) setWeeklyGoalState(parseInt(wGoal, 10));
        const expHist = localStorage.getItem('scan_export_history');
        if (expHist) setExportHistory(JSON.parse(expHist));
        const emBookmarks = localStorage.getItem('emotion-bookmarks');
        if (emBookmarks) setEmotionBookmarks(JSON.parse(emBookmarks));
        const tDrafts = localStorage.getItem('emotion_text_drafts');
        if (tDrafts) setTextDrafts(JSON.parse(tDrafts));
        const tHist = localStorage.getItem('emotion_text_history');
        if (tHist) setTextHistory(JSON.parse(tHist));
      } catch (e) {
        logger.warn('Failed to load localStorage fallback', {}, 'SCAN');
      }
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('key, value')
        .eq('user_id', user.id)
        .in('key', [
          SCAN_STATS_KEY, SCAN_HISTORY_KEY, FAVORITE_METHODS_KEY, SCAN_DRAFT_KEY,
          ONBOARDING_KEY, EMOJI_FAVORITES_KEY, EMOJI_HISTORY_KEY, EMOJI_STATS_KEY,
          HISTORY_FAVORITES_KEY, RESULT_HISTORY_KEY, WEEKLY_REPORTS_KEY, WEEKLY_GOAL_KEY,
          EXPORT_HISTORY_KEY, EMOTION_BOOKMARKS_KEY, TEXT_DRAFTS_KEY, TEXT_HISTORY_KEY
        ]);

      if (error) {
        logger.error('Failed to load scan settings', error, 'SCAN');
        return;
      }

      data?.forEach((item: { key: string; value: any }) => {
        try {
          const value = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
          switch (item.key) {
            case SCAN_STATS_KEY:
              setStats({ ...defaultStats, ...value });
              break;
            case SCAN_HISTORY_KEY:
              setHistory(Array.isArray(value) ? value : []);
              break;
            case FAVORITE_METHODS_KEY:
              setFavoriteMethods(Array.isArray(value) ? value : []);
              break;
            case SCAN_DRAFT_KEY:
              setDraft(value);
              break;
            case ONBOARDING_KEY:
              setOnboardingCompleted(value === true);
              break;
            case EMOJI_FAVORITES_KEY:
              setEmojiFavorites(Array.isArray(value) ? value : []);
              break;
            case EMOJI_HISTORY_KEY:
              setEmojiHistory(Array.isArray(value) ? value : []);
              break;
            case EMOJI_STATS_KEY:
              setEmojiStats(typeof value === 'object' ? value : {});
              break;
            case HISTORY_FAVORITES_KEY:
              setHistoryFavorites(Array.isArray(value) ? value : []);
              break;
            case RESULT_HISTORY_KEY:
              setResultHistory(Array.isArray(value) ? value : []);
              break;
            case WEEKLY_REPORTS_KEY:
              setWeeklyReports(Array.isArray(value) ? value : []);
              break;
            case WEEKLY_GOAL_KEY:
              setWeeklyGoalState(typeof value === 'number' ? value : 14);
              break;
          }
        } catch (e) {
          logger.warn('Failed to parse scan setting', { key: item.key }, 'SCAN');
        }
      });

      // Migration depuis localStorage si données présentes
      await migrateFromLocalStorage();
    } catch (e) {
      logger.error('Error loading scan settings', e, 'SCAN');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Migration localStorage → Supabase
  const migrateFromLocalStorage = useCallback(async () => {
    if (!user) return;
    
    const migrations = [
      { localKey: 'scan-onboarding-completed', supaKey: ONBOARDING_KEY, transform: (v: string) => v === 'true' },
      { localKey: 'emoji_favorites', supaKey: EMOJI_FAVORITES_KEY, transform: JSON.parse },
      { localKey: 'emoji_history', supaKey: EMOJI_HISTORY_KEY, transform: JSON.parse },
      { localKey: 'emoji_stats', supaKey: EMOJI_STATS_KEY, transform: JSON.parse },
      { localKey: 'emotion-history-favorites', supaKey: HISTORY_FAVORITES_KEY, transform: JSON.parse },
      { localKey: 'scan-result-history', supaKey: RESULT_HISTORY_KEY, transform: JSON.parse },
      { localKey: 'weekly_emotion_reports', supaKey: WEEKLY_REPORTS_KEY, transform: JSON.parse },
      { localKey: 'weekly_emotion_goals', supaKey: WEEKLY_GOAL_KEY, transform: parseInt },
    ];

    for (const m of migrations) {
      const localValue = localStorage.getItem(m.localKey);
      if (localValue) {
        try {
          const value = m.transform(localValue);
          await saveToSupabase(m.supaKey, value);
          localStorage.removeItem(m.localKey);
        } catch (e) {
          // Ignorer les erreurs de parsing
        }
      }
    }
  }, [user]);

  // Save to Supabase
  const saveToSupabase = useCallback(async (key: string, value: any) => {
    if (!user) {
      // Fallback localStorage pour utilisateurs non connectés
      localStorage.setItem(key.replace('scan:', ''), JSON.stringify(value));
      return;
    }

    try {
      const jsonValue = JSON.stringify(value);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key,
          value: jsonValue,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,key'
        });

      if (error) {
        logger.error('Failed to save scan setting', { key, error }, 'SCAN');
      }
    } catch (e) {
      logger.error('Error saving scan setting', { key, e }, 'SCAN');
    }
  }, [user]);

  // Debounced save
  const debouncedSave = useCallback((key: string, value: any) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(key, value);
    }, 500);
  }, [saveToSupabase]);

  // Load on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Update stats
  const updateStats = useCallback((newStats: Partial<ScanStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats };
      debouncedSave(SCAN_STATS_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Add history entry
  const addHistoryEntry = useCallback((entry: Omit<ScanHistoryEntry, 'id'>) => {
    setHistory(prev => {
      const newEntry = { ...entry, id: Date.now().toString() };
      const updated = [newEntry, ...prev].slice(0, 100);
      debouncedSave(SCAN_HISTORY_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Toggle favorite method
  const toggleFavoriteMethod = useCallback((methodId: string) => {
    setFavoriteMethods(prev => {
      const updated = prev.includes(methodId)
        ? prev.filter(m => m !== methodId)
        : [...prev, methodId];
      debouncedSave(FAVORITE_METHODS_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Save draft
  const saveDraft = useCallback((draftData: any) => {
    setDraft(draftData);
    debouncedSave(SCAN_DRAFT_KEY, draftData);
  }, [debouncedSave]);

  // Clear draft
  const clearDraft = useCallback(async () => {
    setDraft(null);
    if (user) {
      await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id)
        .eq('key', SCAN_DRAFT_KEY);
    }
  }, [user]);

  // Onboarding
  const completeOnboarding = useCallback(() => {
    setOnboardingCompleted(true);
    saveToSupabase(ONBOARDING_KEY, true);
  }, [saveToSupabase]);

  // Emoji functions
  const updateEmojiFavorites = useCallback((favorites: string[]) => {
    setEmojiFavorites(favorites);
    debouncedSave(EMOJI_FAVORITES_KEY, favorites);
  }, [debouncedSave]);

  const updateEmojiHistory = useCallback((history: string[]) => {
    setEmojiHistory(history);
    debouncedSave(EMOJI_HISTORY_KEY, history);
  }, [debouncedSave]);

  const updateEmojiStats = useCallback((stats: Record<string, number>) => {
    setEmojiStats(stats);
    debouncedSave(EMOJI_STATS_KEY, stats);
  }, [debouncedSave]);

  // History favorites
  const toggleHistoryFavorite = useCallback((id: string) => {
    setHistoryFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      debouncedSave(HISTORY_FAVORITES_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Result history
  const addResultHistory = useCallback((entry: Omit<ResultHistoryEntry, 'id'>) => {
    setResultHistory(prev => {
      const newEntry = { ...entry, id: Date.now().toString() };
      const updated = [newEntry, ...prev].slice(0, 50);
      debouncedSave(RESULT_HISTORY_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  const toggleResultFavorite = useCallback((id: string) => {
    setResultHistory(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, isFavorite: !h.isFavorite } : h);
      debouncedSave(RESULT_HISTORY_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Weekly reports
  const saveWeeklyReport = useCallback((report: WeekSnapshot) => {
    setWeeklyReports(prev => {
      const filtered = prev.filter(r => r.weekStart !== report.weekStart);
      const updated = [report, ...filtered].slice(0, 12);
      debouncedSave(WEEKLY_REPORTS_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  const setWeeklyGoal = useCallback((goal: number) => {
    setWeeklyGoalState(goal);
    debouncedSave(WEEKLY_GOAL_KEY, goal);
  }, [debouncedSave]);

  // Export history
  const addExportRecord = useCallback((record: Omit<ExportRecord, 'id'>) => {
    setExportHistory(prev => {
      const newRecord = { ...record, id: Date.now().toString() };
      const updated = [newRecord, ...prev].slice(0, 20);
      debouncedSave(EXPORT_HISTORY_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Emotion bookmarks
  const toggleEmotionBookmark = useCallback((id: string) => {
    setEmotionBookmarks(prev => {
      const updated = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      debouncedSave(EMOTION_BOOKMARKS_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  const isEmotionBookmarked = useCallback((id: string) => {
    return emotionBookmarks.includes(id);
  }, [emotionBookmarks]);

  // Text drafts
  const saveTextDraft = useCallback((draft: Omit<TextDraft, 'id'>) => {
    setTextDrafts(prev => {
      const newDraft = { ...draft, id: Date.now().toString() };
      const updated = [newDraft, ...prev.filter(d => d.text !== draft.text)].slice(0, 10);
      debouncedSave(TEXT_DRAFTS_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Text history
  const addTextHistory = useCallback((entry: TextHistoryEntry) => {
    setTextHistory(prev => {
      const updated = [entry, ...prev].slice(0, 50);
      debouncedSave(TEXT_HISTORY_KEY, updated);
      return updated;
    });
  }, [debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    stats,
    history,
    favoriteMethods,
    draft,
    onboardingCompleted,
    emojiFavorites,
    emojiHistory,
    emojiStats,
    historyFavorites,
    resultHistory,
    weeklyReports,
    weeklyGoal,
    exportHistory,
    emotionBookmarks,
    textDrafts,
    textHistory,
    isLoading,
    updateStats,
    addHistoryEntry,
    toggleFavoriteMethod,
    saveDraft,
    clearDraft,
    completeOnboarding,
    updateEmojiFavorites,
    updateEmojiHistory,
    updateEmojiStats,
    toggleHistoryFavorite,
    addResultHistory,
    toggleResultFavorite,
    saveWeeklyReport,
    setWeeklyGoal,
    addExportRecord,
    toggleEmotionBookmark,
    isEmotionBookmarked,
    saveTextDraft,
    addTextHistory,
    reload: loadSettings
  };
}

export default useScanSettings;
