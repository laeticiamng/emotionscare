import { useState, useEffect, useCallback } from 'react';
import { Attraction } from '@/types/park';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export interface AttractionVisit {
  id: string;
  visitedAt: number;
  visitCount: number;
}

export interface ZoneBadge {
  zoneKey: string;
  zoneName: string;
  unlockedAt: number;
  totalAttractions: number;
}

export interface SearchHistory {
  term: string;
  timestamp: number;
  resultCount: number;
}

export const useAttractionProgress = () => {
  const { user } = useAuth();
  const [visitedAttractions, setVisitedAttractions] = useState<Record<string, AttractionVisit>>({});
  const [unlockedBadges, setUnlockedBadges] = useState<ZoneBadge[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [newlyUnlockedZone, setNewlyUnlockedZone] = useState<string | null>(null);

  // Load progress from Supabase first, then localStorage fallback
  useEffect(() => {
    const loadProgress = async () => {
      try {
        if (user) {
          const { data } = await supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', 'emotional_park_progress')
            .maybeSingle();

          if (data?.value) {
            const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
            setVisitedAttractions(parsed.visits || {});
            setUnlockedBadges(parsed.badges || []);
            setSearchHistory(parsed.searchHistory || []);
            return;
          }
        }
        // Fallback: try to load from Supabase user_settings without auth (for legacy data)
        // No localStorage fallback to avoid unencrypted data storage
      } catch (error) {
        logger.error('Failed to load attraction progress', error as Error, 'PARK');
      }
    };
    loadProgress();
  }, [user]);

  // Save progress to Supabase
  const saveProgress = useCallback(async (visits: Record<string, AttractionVisit>, badges: ZoneBadge[], history?: SearchHistory[]) => {
    const data = { visits, badges, searchHistory: history || searchHistory };
    
    if (user) {
      try {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            key: 'emotional_park_progress',
            value: JSON.stringify(data),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,key' });
      } catch (error) {
        logger.error('Failed to save progress to Supabase', error as Error, 'PARK');
      }
    }
  }, [user, searchHistory]);

  // Mark attraction as visited
  const markVisited = (attractionId: string) => {
    setVisitedAttractions(prev => {
      const existing = prev[attractionId];
      const updated = {
        ...prev,
        [attractionId]: {
          id: attractionId,
          visitedAt: Date.now(),
          visitCount: (existing?.visitCount || 0) + 1
        }
      };
      saveProgress(updated, unlockedBadges);
      return updated;
    });
  };

  // Check and unlock zone badge
  const checkZoneCompletion = (
    zoneKey: string,
    zoneName: string,
    zoneAttractions: string[]
  ) => {
    // Check if already unlocked
    if (unlockedBadges.some(b => b.zoneKey === zoneKey)) {
      return false;
    }

    // Check if all attractions in zone are visited
    const allVisited = zoneAttractions.every(id => visitedAttractions[id]);
    
    if (allVisited) {
      const newBadge: ZoneBadge = {
        zoneKey,
        zoneName,
        unlockedAt: Date.now(),
        totalAttractions: zoneAttractions.length
      };
      
      setUnlockedBadges(prev => {
        const updated = [...prev, newBadge];
        saveProgress(visitedAttractions, updated);
        return updated;
      });
      
      setNewlyUnlockedZone(zoneKey);
      return true;
    }
    
    return false;
  };

  // Clear newly unlocked notification
  const clearNewlyUnlocked = () => {
    setNewlyUnlockedZone(null);
  };

  // Get zone progress
  const getZoneProgress = (zoneAttractions: string[]) => {
    const visitedCount = zoneAttractions.filter(id => visitedAttractions[id]).length;
    return {
      visited: visitedCount,
      total: zoneAttractions.length,
      percentage: Math.round((visitedCount / zoneAttractions.length) * 100)
    };
  };

  // Add search term to history
  const addSearchHistory = (term: string, resultCount: number) => {
    if (!term.trim()) return;
    
    setSearchHistory(prev => {
      const newHistory = [
        { term, timestamp: Date.now(), resultCount },
        ...prev.filter(h => h.term !== term)
      ].slice(0, 10);
      
      // Save with main progress data via Supabase
      saveProgress(visitedAttractions, unlockedBadges, newHistory);
      return newHistory;
    });
  };

  // Get search suggestions
  const getSearchSuggestions = (query: string, allAttractions: Attraction[]) => {
    const lowerQuery = query.toLowerCase();
    
    // Prioritize search history
    const historySuggestions = searchHistory
      .filter(h => h.term.toLowerCase().includes(lowerQuery))
      .map(h => h.term);
    
    // Add attraction titles
    const attractionSuggestions = allAttractions
      .filter(a => 
        a.title.toLowerCase().includes(lowerQuery) ||
        a.subtitle.toLowerCase().includes(lowerQuery)
      )
      .map(a => a.title)
      .slice(0, 5);
    
    // Combine and deduplicate
    return [...new Set([...historySuggestions, ...attractionSuggestions])].slice(0, 8);
  };

  return {
    visitedAttractions,
    unlockedBadges,
    newlyUnlockedZone,
    searchHistory,
    markVisited,
    checkZoneCompletion,
    clearNewlyUnlocked,
    getZoneProgress,
    addSearchHistory,
    getSearchSuggestions
  };
};
