import { useState, useCallback } from 'react';

interface Filter {
  name: string;
  emoji: string;
}

interface UseARFiltersReturn {
  currentFilter: Filter;
  isActive: boolean;
  applyFilter: () => void;
  removeFilter: () => void;
}

const FILTERS: Filter[] = [
  { name: 'Joyeux', emoji: '😊' },
  { name: 'Calme', emoji: '😌' },
  { name: 'Énergique', emoji: '⚡' },
  { name: 'Zen', emoji: '🧘' },
];

/**
 * Hook pour gérer les filtres AR
 */
export const useARFilters = (): UseARFiltersReturn => {
  const [currentFilter, setCurrentFilter] = useState<Filter>(FILTERS[0]);
  const [isActive, setIsActive] = useState(false);

  const applyFilter = useCallback(() => {
    const randomFilter = FILTERS[Math.floor(Math.random() * FILTERS.length)];
    setCurrentFilter(randomFilter);
    setIsActive(true);
  }, []);

  const removeFilter = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    currentFilter,
    isActive,
    applyFilter,
    removeFilter,
  };
};
