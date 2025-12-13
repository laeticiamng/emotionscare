// @ts-nocheck

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortDirection } from '@/components/dashboard/admin/types/tableTypes';

/** Configuration de tri pour une colonne */
export interface SortConfig<T extends string = string> {
  field: T;
  direction: SortDirection;
  priority?: number;
}

/** Type de filtre */
export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in';

/** Configuration de filtre */
export interface FilterConfig<T extends string = string> {
  field: T;
  operator: FilterOperator;
  value: unknown;
  secondValue?: unknown; // Pour 'between'
}

/** Définition d'une colonne */
export interface ColumnDefinition<T extends string = string> {
  field: T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  type?: 'string' | 'number' | 'date' | 'boolean';
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  pinned?: 'left' | 'right';
}

/** Préréglage de vue */
export interface TablePreset<T extends string = string> {
  id: string;
  name: string;
  sorts: SortConfig<T>[];
  filters: FilterConfig<T>[];
  visibleColumns: T[];
  isDefault?: boolean;
}

/** Options avancées */
export interface SortableTableOptions<T extends string> {
  storageKey?: string;
  persistInUrl?: boolean;
  defaultField: T;
  defaultDirection: SortDirection;
  columns?: ColumnDefinition<T>[];
  enableMultiSort?: boolean;
  maxSortLevels?: number;
  enableFilters?: boolean;
  enableColumnVisibility?: boolean;
  enablePresets?: boolean;
  onSortChange?: (sorts: SortConfig<T>[]) => void;
  onFilterChange?: (filters: FilterConfig<T>[]) => void;
}

const DEFAULT_OPTIONS = {
  enableMultiSort: false,
  maxSortLevels: 3,
  enableFilters: true,
  enableColumnVisibility: true,
  enablePresets: true
};

export function useSortableTable<T extends string>({
  storageKey,
  persistInUrl = false,
  defaultField,
  defaultDirection = 'asc',
  columns = [],
  enableMultiSort = false,
  maxSortLevels = 3,
  enableFilters = true,
  enableColumnVisibility = true,
  enablePresets = true,
  onSortChange,
  onFilterChange
}: SortableTableOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialisation depuis URL ou localStorage
  const initSorts = (): SortConfig<T>[] => {
    if (persistInUrl) {
      const urlSort = searchParams.get('sort');
      if (urlSort) {
        try {
          return JSON.parse(urlSort);
        } catch {}
      }
    }

    if (storageKey) {
      const saved = localStorage.getItem(`${storageKey}-sorts`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }

    return [{ field: defaultField, direction: defaultDirection, priority: 0 }];
  };

  const initFilters = (): FilterConfig<T>[] => {
    if (persistInUrl) {
      const urlFilters = searchParams.get('filters');
      if (urlFilters) {
        try {
          return JSON.parse(urlFilters);
        } catch {}
      }
    }

    if (storageKey) {
      const saved = localStorage.getItem(`${storageKey}-filters`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }

    return [];
  };

  const initVisibleColumns = (): T[] => {
    if (storageKey) {
      const saved = localStorage.getItem(`${storageKey}-columns`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }

    return columns.filter(c => !c.hidden).map(c => c.field);
  };

  // État
  const [sorts, setSorts] = useState<SortConfig<T>[]>(initSorts);
  const [filters, setFilters] = useState<FilterConfig<T>[]>(initFilters);
  const [visibleColumns, setVisibleColumns] = useState<T[]>(initVisibleColumns);
  const [presets, setPresets] = useState<TablePreset<T>[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Compatibilité avec l'ancienne API
  const sortField = sorts[0]?.field || defaultField;
  const sortDirection = sorts[0]?.direction || defaultDirection;

  // Persister les changements
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(`${storageKey}-sorts`, JSON.stringify(sorts));
      localStorage.setItem(`${storageKey}-filters`, JSON.stringify(filters));
      localStorage.setItem(`${storageKey}-columns`, JSON.stringify(visibleColumns));
    }

    if (persistInUrl) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('sort', JSON.stringify(sorts));
        if (filters.length > 0) {
          newParams.set('filters', JSON.stringify(filters));
        } else {
          newParams.delete('filters');
        }
        return newParams;
      });
    }
  }, [sorts, filters, visibleColumns, storageKey, persistInUrl, setSearchParams]);

  // Notifier les changements
  useEffect(() => {
    onSortChange?.(sorts);
  }, [sorts, onSortChange]);

  useEffect(() => {
    onFilterChange?.(filters);
  }, [filters, onFilterChange]);

  // Tri simple (compatibilité)
  const handleSort = useCallback((field: T) => {
    setSorts(prevSorts => {
      const existingIndex = prevSorts.findIndex(s => s.field === field);

      if (existingIndex === 0) {
        // Toggle direction
        const current = prevSorts[0];
        return [
          { ...current, direction: current.direction === 'asc' ? 'desc' : 'asc' },
          ...prevSorts.slice(1)
        ];
      } else if (existingIndex > 0 && enableMultiSort) {
        // Déplacer en premier
        const [existing] = prevSorts.splice(existingIndex, 1);
        return [{ ...existing, direction: 'asc' }, ...prevSorts];
      } else {
        // Nouveau tri
        if (enableMultiSort) {
          return [
            { field, direction: 'asc', priority: 0 },
            ...prevSorts.slice(0, maxSortLevels - 1)
          ];
        }
        return [{ field, direction: 'asc', priority: 0 }];
      }
    });
  }, [enableMultiSort, maxSortLevels]);

  // Ajouter un niveau de tri
  const addSort = useCallback((field: T, direction: SortDirection = 'asc') => {
    if (!enableMultiSort) {
      setSorts([{ field, direction, priority: 0 }]);
      return;
    }

    setSorts(prev => {
      if (prev.length >= maxSortLevels) return prev;
      if (prev.some(s => s.field === field)) return prev;
      return [...prev, { field, direction, priority: prev.length }];
    });
  }, [enableMultiSort, maxSortLevels]);

  // Supprimer un niveau de tri
  const removeSort = useCallback((field: T) => {
    setSorts(prev => {
      const filtered = prev.filter(s => s.field !== field);
      if (filtered.length === 0) {
        return [{ field: defaultField, direction: defaultDirection, priority: 0 }];
      }
      return filtered;
    });
  }, [defaultField, defaultDirection]);

  // Effacer tous les tris
  const clearSorts = useCallback(() => {
    setSorts([{ field: defaultField, direction: defaultDirection, priority: 0 }]);
  }, [defaultField, defaultDirection]);

  // Vérifier si une colonne est triée
  const isSorted = useCallback((field: T): SortDirection => {
    const sort = sorts.find(s => s.field === field);
    return sort ? sort.direction : null;
  }, [sorts]);

  // Obtenir la priorité de tri
  const getSortPriority = useCallback((field: T): number | null => {
    const index = sorts.findIndex(s => s.field === field);
    return index >= 0 ? index + 1 : null;
  }, [sorts]);

  // Filtres
  const addFilter = useCallback((filter: FilterConfig<T>) => {
    if (!enableFilters) return;

    setFilters(prev => {
      // Remplacer si même champ et opérateur
      const existingIndex = prev.findIndex(
        f => f.field === filter.field && f.operator === filter.operator
      );

      if (existingIndex >= 0) {
        const newFilters = [...prev];
        newFilters[existingIndex] = filter;
        return newFilters;
      }

      return [...prev, filter];
    });
  }, [enableFilters]);

  const removeFilter = useCallback((field: T, operator?: FilterOperator) => {
    setFilters(prev => prev.filter(f =>
      !(f.field === field && (!operator || f.operator === operator))
    ));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const getFiltersForField = useCallback((field: T): FilterConfig<T>[] => {
    return filters.filter(f => f.field === field);
  }, [filters]);

  // Visibilité des colonnes
  const toggleColumnVisibility = useCallback((field: T) => {
    if (!enableColumnVisibility) return;

    setVisibleColumns(prev => {
      if (prev.includes(field)) {
        // Garder au moins une colonne visible
        if (prev.length <= 1) return prev;
        return prev.filter(f => f !== field);
      }
      return [...prev, field];
    });
  }, [enableColumnVisibility]);

  const setColumnsVisibility = useCallback((fields: T[]) => {
    if (fields.length > 0) {
      setVisibleColumns(fields);
    }
  }, []);

  const showAllColumns = useCallback(() => {
    setVisibleColumns(columns.map(c => c.field));
  }, [columns]);

  // Préréglages
  const savePreset = useCallback((name: string, isDefault = false) => {
    if (!enablePresets) return null;

    const preset: TablePreset<T> = {
      id: `preset_${Date.now()}`,
      name,
      sorts,
      filters,
      visibleColumns,
      isDefault
    };

    setPresets(prev => {
      const newPresets = isDefault
        ? prev.map(p => ({ ...p, isDefault: false }))
        : prev;
      return [...newPresets, preset];
    });

    if (storageKey) {
      const existing = localStorage.getItem(`${storageKey}-presets`);
      const existingPresets = existing ? JSON.parse(existing) : [];
      localStorage.setItem(
        `${storageKey}-presets`,
        JSON.stringify([...existingPresets, preset])
      );
    }

    return preset.id;
  }, [enablePresets, sorts, filters, visibleColumns, storageKey]);

  const loadPreset = useCallback((presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return false;

    setSorts(preset.sorts);
    setFilters(preset.filters);
    setVisibleColumns(preset.visibleColumns);
    setActivePresetId(presetId);

    return true;
  }, [presets]);

  const deletePreset = useCallback((presetId: string) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));

    if (storageKey) {
      const existing = localStorage.getItem(`${storageKey}-presets`);
      if (existing) {
        const existingPresets = JSON.parse(existing);
        localStorage.setItem(
          `${storageKey}-presets`,
          JSON.stringify(existingPresets.filter((p: TablePreset<T>) => p.id !== presetId))
        );
      }
    }

    if (activePresetId === presetId) {
      setActivePresetId(null);
    }
  }, [storageKey, activePresetId]);

  // Charger les préréglages au montage
  useEffect(() => {
    if (storageKey && enablePresets) {
      const saved = localStorage.getItem(`${storageKey}-presets`);
      if (saved) {
        try {
          setPresets(JSON.parse(saved));
        } catch {}
      }
    }
  }, [storageKey, enablePresets]);

  // Réinitialiser
  const reset = useCallback(() => {
    setSorts([{ field: defaultField, direction: defaultDirection, priority: 0 }]);
    setFilters([]);
    setVisibleColumns(columns.filter(c => !c.hidden).map(c => c.field));
    setActivePresetId(null);
  }, [defaultField, defaultDirection, columns]);

  // Colonnes visibles avec définitions
  const visibleColumnDefs = useMemo(() => {
    return columns.filter(c => visibleColumns.includes(c.field));
  }, [columns, visibleColumns]);

  // Fonction de tri pour les données
  const sortData = useCallback(<D extends Record<string, any>>(data: D[]): D[] => {
    if (sorts.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const sort of sorts) {
        const aVal = a[sort.field];
        const bVal = b[sort.field];

        if (aVal === bVal) continue;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return sort.direction === 'asc' ? comparison : -comparison;
      }
      return 0;
    });
  }, [sorts]);

  // Fonction de filtre pour les données
  const filterData = useCallback(<D extends Record<string, any>>(data: D[]): D[] => {
    if (filters.length === 0) return data;

    return data.filter(item => {
      return filters.every(filter => {
        const value = item[filter.field];

        switch (filter.operator) {
          case 'equals':
            return value === filter.value;
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
          case 'gt':
            return value > filter.value;
          case 'lt':
            return value < filter.value;
          case 'gte':
            return value >= filter.value;
          case 'lte':
            return value <= filter.value;
          case 'between':
            return value >= filter.value && value <= filter.secondValue;
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(value);
          default:
            return true;
        }
      });
    });
  }, [filters]);

  return {
    // Compatibilité ancienne API
    sortField,
    sortDirection,
    handleSort,
    isSorted,

    // Tri avancé
    sorts,
    addSort,
    removeSort,
    clearSorts,
    getSortPriority,
    isMultiSortEnabled: enableMultiSort,

    // Filtres
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    getFiltersForField,
    hasActiveFilters: filters.length > 0,

    // Colonnes
    columns,
    visibleColumns,
    visibleColumnDefs,
    toggleColumnVisibility,
    setColumnsVisibility,
    showAllColumns,
    isColumnVisible: (field: T) => visibleColumns.includes(field),

    // Préréglages
    presets,
    activePresetId,
    savePreset,
    loadPreset,
    deletePreset,

    // Utilitaires
    reset,
    sortData,
    filterData
  };
}
