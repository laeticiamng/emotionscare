/**
 * Tests pour useModuleFilters
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModuleFilters, type ModuleData } from '../useModuleFilters';

const mockModules: ModuleData[] = [
  {
    id: '1',
    name: 'Respiration guidée',
    description: 'Exercices de respiration pour la relaxation',
    category: 'bien-être',
    difficulty: 'easy',
    duration: 5,
    isFavorite: true,
    tags: ['breath', 'calm'],
  },
  {
    id: '2',
    name: 'Scan émotionnel',
    description: 'Analyse de vos émotions par IA',
    category: 'analyse',
    difficulty: 'medium',
    duration: 10,
    isFavorite: false,
    tags: ['emotion', 'scan'],
  },
  {
    id: '3',
    name: 'Challenge Boss Grit',
    description: 'Défiez vos limites avec des challenges',
    category: 'gamification',
    difficulty: 'hard',
    duration: 30,
    isFavorite: false,
    tags: ['game', 'challenge'],
  },
  {
    id: '4',
    name: 'VR Nebula',
    description: 'Expérience immersive en réalité virtuelle',
    category: 'immersive',
    difficulty: 'medium',
    duration: 20,
    isFavorite: true,
    tags: ['vr', '3d'],
  },
];

describe('useModuleFilters', () => {
  it('should return all modules by default', () => {
    const { result } = renderHook(() =>
      useModuleFilters({ modules: mockModules })
    );

    expect(result.current.filteredModules).toHaveLength(4);
    expect(result.current.activeFiltersCount).toBe(0);
  });

  it('should filter by search term', () => {
    const { result } = renderHook(() =>
      useModuleFilters({ modules: mockModules })
    );

    act(() => {
      result.current.setSearch('respiration');
    });

    expect(result.current.filteredModules).toHaveLength(1);
    expect(result.current.filteredModules[0].id).toBe('1');
    expect(result.current.activeFiltersCount).toBe(1);
  });

  it('should handle fuzzy search with typos', () => {
    const { result } = renderHook(() =>
      useModuleFilters({ modules: mockModules })
    );

    act(() => {
      result.current.setSearch('respiraton'); // Typo: missing 'i'
    });

    expect(result.current.filteredModules).toHaveLength(1);
  });

  it('should filter by category', () => {
    const { result } = renderHook(() =>
      useModuleFilters({ modules: mockModules })
    );

    act(() => {
      result.current.setCategory('wellness');
    });

    expect(result.current.filteredModules).toHaveLength(1);
    expect(result.current.filteredModules[0].category).toBe('bien-être');
  });

  it('should filter by difficulty', () => {
    const { result } = renderHook(() =>
      useModuleFilters({ modules: mockModules })
    );

    act(() => {
      result.current.setDifficulty('hard');
    });

    expect(result.current.filteredModules).toHaveLength(1);
    expect(result.current.filteredModules[0].id).toBe('3');
  });

  it('should filter by duration', () => {
    const { result } = renderHook(() =>
      useModuleFilters({ modules: mockModules })
    );

    act(() => {
      result.current.setDuration('5min');
    });

    expect(result.current.filteredModules).toHaveLength(1);
    expect(result.current.filteredModules[0].duration).toBeLessThanOrEqual(5);
  });

  it('should filter favorites only', () => {
    const { result } = renderHook(() =>
      useModuleFilters({ modules: mockModules })
    );

    act(() => {
      result.current.toggleFavoritesOnly();
    });

    expect(result.current.filteredModules).toHaveLength(2);
    expect(result.current.filteredModules.every(m => m.isFavorite)).toBe(true);
  });

  it('should combine multiple filters', () => {
    const { result } = renderHook(() =>
      useModuleFilters({ modules: mockModules })
    );

    act(() => {
      result.current.setDifficulty('medium');
      result.current.toggleFavoritesOnly();
    });

    expect(result.current.filteredModules).toHaveLength(1);
    expect(result.current.filteredModules[0].id).toBe('4');
    expect(result.current.activeFiltersCount).toBe(2);
  });

  it('should reset all filters', () => {
    const { result } = renderHook(() =>
      useModuleFilters({ modules: mockModules })
    );

    act(() => {
      result.current.setSearch('test');
      result.current.setCategory('wellness');
      result.current.setDifficulty('easy');
      result.current.toggleFavoritesOnly();
    });

    expect(result.current.activeFiltersCount).toBe(4);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.activeFiltersCount).toBe(0);
    expect(result.current.filteredModules).toHaveLength(4);
  });
});
