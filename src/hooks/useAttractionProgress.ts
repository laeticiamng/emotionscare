import { useState, useEffect } from 'react';
import { Attraction } from '@/types/park';

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

const STORAGE_KEY = 'emotional-park-progress';
const SEARCH_HISTORY_KEY = 'emotional-park-search-history';

export const useAttractionProgress = () => {
  const [visitedAttractions, setVisitedAttractions] = useState<Record<string, AttractionVisit>>({});
  const [unlockedBadges, setUnlockedBadges] = useState<ZoneBadge[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [newlyUnlockedZone, setNewlyUnlockedZone] = useState<string | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedSearch = localStorage.getItem(SEARCH_HISTORY_KEY);
    
    if (stored) {
      const data = JSON.parse(stored);
      setVisitedAttractions(data.visits || {});
      setUnlockedBadges(data.badges || []);
    }
    
    if (storedSearch) {
      setSearchHistory(JSON.parse(storedSearch));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (visits: Record<string, AttractionVisit>, badges: ZoneBadge[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ visits, badges }));
  };

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
      ].slice(0, 10); // Keep last 10 searches
      
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
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
