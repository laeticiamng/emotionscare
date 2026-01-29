/**
 * useModuleFilters - Hook pour filtres avancés des modules
 * Permet de filtrer par catégorie, durée, difficulté et recherche
 * @version 1.0.0
 */

import { useMemo, useState, useCallback } from 'react';

export type ModuleDifficulty = 'easy' | 'medium' | 'hard' | 'all';
export type ModuleDuration = '5min' | '15min' | '30min' | 'all';
export type ModuleCategory = 
  | 'all' 
  | 'wellness' 
  | 'analysis' 
  | 'gamification' 
  | 'social' 
  | 'immersive' 
  | 'clinical';

export interface ModuleFilterState {
  search: string;
  category: ModuleCategory;
  difficulty: ModuleDifficulty;
  duration: ModuleDuration;
  showFavoritesOnly: boolean;
}

export interface ModuleData {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty?: string;
  duration?: number; // en minutes
  isFavorite?: boolean;
  tags?: string[];
}

interface UseModuleFiltersOptions {
  modules: ModuleData[];
  initialFilters?: Partial<ModuleFilterState>;
}

interface UseModuleFiltersReturn {
  filters: ModuleFilterState;
  filteredModules: ModuleData[];
  setSearch: (value: string) => void;
  setCategory: (value: ModuleCategory) => void;
  setDifficulty: (value: ModuleDifficulty) => void;
  setDuration: (value: ModuleDuration) => void;
  toggleFavoritesOnly: () => void;
  resetFilters: () => void;
  activeFiltersCount: number;
}

const defaultFilters: ModuleFilterState = {
  search: '',
  category: 'all',
  difficulty: 'all',
  duration: 'all',
  showFavoritesOnly: false,
};

// Fuzzy search simple (tolérance aux fautes de frappe)
function fuzzyMatch(text: string, query: string): boolean {
  const normalizedText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Match exact
  if (normalizedText.includes(normalizedQuery)) return true;
  
  // Match avec 1 caractère de différence (Levenshtein distance = 1)
  if (normalizedQuery.length <= 3) return false;
  
  for (let i = 0; i < normalizedQuery.length; i++) {
    const variant = normalizedQuery.slice(0, i) + normalizedQuery.slice(i + 1);
    if (normalizedText.includes(variant)) return true;
  }
  
  return false;
}

export function useModuleFilters({
  modules,
  initialFilters = {},
}: UseModuleFiltersOptions): UseModuleFiltersReturn {
  const [filters, setFilters] = useState<ModuleFilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  const setSearch = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  }, []);

  const setCategory = useCallback((value: ModuleCategory) => {
    setFilters(prev => ({ ...prev, category: value }));
  }, []);

  const setDifficulty = useCallback((value: ModuleDifficulty) => {
    setFilters(prev => ({ ...prev, difficulty: value }));
  }, []);

  const setDuration = useCallback((value: ModuleDuration) => {
    setFilters(prev => ({ ...prev, duration: value }));
  }, []);

  const toggleFavoritesOnly = useCallback(() => {
    setFilters(prev => ({ ...prev, showFavoritesOnly: !prev.showFavoritesOnly }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      // Filtre par recherche (fuzzy)
      if (filters.search) {
        const searchFields = [
          module.name,
          module.description,
          ...(module.tags || []),
        ].join(' ');
        
        if (!fuzzyMatch(searchFields, filters.search)) {
          return false;
        }
      }

      // Filtre par catégorie
      if (filters.category !== 'all') {
        const categoryMap: Record<ModuleCategory, string[]> = {
          all: [],
          wellness: ['bien-être', 'wellness', 'breath', 'meditation'],
          analysis: ['analyse', 'analysis', 'scan', 'emotion'],
          gamification: ['gamification', 'game', 'challenge', 'arcade'],
          social: ['social', 'community', 'buddy', 'group'],
          immersive: ['immersive', 'vr', 'ar', '3d'],
          clinical: ['clinical', 'assess', 'privacy', 'gdpr'],
        };
        
        const categoryTerms = categoryMap[filters.category];
        const moduleCategory = module.category.toLowerCase();
        if (!categoryTerms.some(term => moduleCategory.includes(term))) {
          return false;
        }
      }

      // Filtre par difficulté
      if (filters.difficulty !== 'all' && module.difficulty) {
        if (module.difficulty.toLowerCase() !== filters.difficulty) {
          return false;
        }
      }

      // Filtre par durée
      if (filters.duration !== 'all' && module.duration) {
        const durationRanges: Record<ModuleDuration, [number, number]> = {
          all: [0, Infinity],
          '5min': [0, 5],
          '15min': [6, 15],
          '30min': [16, 60],
        };
        const [min, max] = durationRanges[filters.duration];
        if (module.duration < min || module.duration > max) {
          return false;
        }
      }

      // Filtre favoris
      if (filters.showFavoritesOnly && !module.isFavorite) {
        return false;
      }

      return true;
    });
  }, [modules, filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category !== 'all') count++;
    if (filters.difficulty !== 'all') count++;
    if (filters.duration !== 'all') count++;
    if (filters.showFavoritesOnly) count++;
    return count;
  }, [filters]);

  return {
    filters,
    filteredModules,
    setSearch,
    setCategory,
    setDifficulty,
    setDuration,
    toggleFavoritesOnly,
    resetFilters,
    activeFiltersCount,
  };
}
