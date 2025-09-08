/**
 * 📋 LISTE VIRTUALISÉE HAUTE PERFORMANCE
 * Composant de liste optimisé pour de grandes quantités de données
 */

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, SortAsc, SortDesc, Grid, List as ListIcon } from 'lucide-react';
import { useOptimizedPerformance } from '@/hooks/useOptimizedPerformance';

// ==================== TYPES ====================

export interface VirtualizedItem {
  id: string | number;
  data: any;
  height?: number;
  searchableFields?: string[];
}

export interface VirtualizedListProps {
  items: VirtualizedItem[];
  renderItem: (item: VirtualizedItem, index: number, style?: React.CSSProperties) => React.ReactNode;
  itemHeight?: number | ((index: number) => number);
  height?: number;
  width?: number;
  
  // Features
  enableSearch?: boolean;
  enableSort?: boolean;
  enableFilter?: boolean;
  enableVirtualization?: boolean;
  enableInfiniteScroll?: boolean;
  
  // Callbacks
  onItemClick?: (item: VirtualizedItem, index: number) => void;
  onLoadMore?: () => Promise<void>;
  onSearch?: (query: string) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  
  // Styling
  className?: string;
  itemClassName?: string;
  emptyStateMessage?: string;
  loadingMessage?: string;
  
  // Performance
  overscan?: number;
  threshold?: number;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

// ==================== ITEM RENDERER ====================

const VirtualizedItemRenderer = React.memo<{
  index: number;
  style?: React.CSSProperties;
  data: {
    items: VirtualizedItem[];
    renderItem: VirtualizedListProps['renderItem'];
    onItemClick?: VirtualizedListProps['onItemClick'];
    itemClassName?: string;
  };
}>(({ index, style, data }) => {
  const { items, renderItem, onItemClick, itemClassName } = data;
  const item = items[index];

  if (!item) {
    return (
      <div style={style} className="p-2">
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`cursor-pointer hover:bg-accent/50 transition-colors ${itemClassName || ''}`}
      onClick={() => onItemClick?.(item, index)}
    >
      {renderItem(item, index, style)}
    </motion.div>
  );
});

VirtualizedItemRenderer.displayName = 'VirtualizedItemRenderer';

// ==================== MAIN COMPONENT ====================

export const VirtualizedList: React.FC<VirtualizedListProps> = ({
  items: initialItems,
  renderItem,
  itemHeight = 80,
  height = 400,
  width = '100%',
  
  enableSearch = false,
  enableSort = false,
  enableFilter = false,
  enableVirtualization = true,
  enableInfiniteScroll = false,
  
  onItemClick,
  onLoadMore,
  onSearch,
  onSort,
  onFilter,
  
  className = '',
  itemClassName = '',
  emptyStateMessage = 'Aucun élément trouvé',
  loadingMessage = 'Chargement...',
  
  overscan = 5,
  threshold = 0.8
}) => {
  // ==================== PERFORMANCE OPTIMIZATION ====================
  
  const { optimizedMemo, optimizedCallback } = useOptimizedPerformance('VirtualizedList', {
    enableProfiling: true,
    enableCaching: true
  });

  // ==================== STATE ====================

  const [filteredItems, setFilteredItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const listRef = useRef<any>(null);
  const loadingRef = useRef(false);

  // ==================== SEARCH FUNCTIONALITY ====================

  const handleSearch = optimizedCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);

    if (!query.trim()) {
      setFilteredItems(initialItems);
      return;
    }

    const searchResults = initialItems.filter(item => {
      const searchableFields = item.searchableFields || ['data'];
      return searchableFields.some(field => {
        const value = field === 'data' ? JSON.stringify(item.data) : item.data[field];
        return value?.toString().toLowerCase().includes(query.toLowerCase());
      });
    });

    setFilteredItems(searchResults);
  }, [initialItems, onSearch]);

  // ==================== SORT FUNCTIONALITY ====================

  const handleSort = optimizedCallback((key: string) => {
    const direction = sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    const newSortConfig = { key, direction };
    
    setSortConfig(newSortConfig);
    onSort?.(key, direction);

    const sortedItems = [...filteredItems].sort((a, b) => {
      const aValue = a.data[key];
      const bValue = b.data[key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return direction === 'asc' ? comparison : -comparison;
    });

    setFilteredItems(sortedItems);
  }, [filteredItems, sortConfig, onSort]);

  // ==================== INFINITE SCROLL ====================

  const handleScroll = optimizedCallback(async ({ scrollOffset, scrollUpdateWasRequested }: any) => {
    if (!enableInfiniteScroll || !onLoadMore || loadingRef.current || !hasMore) return;

    const scrollThreshold = (height * filteredItems.length * (typeof itemHeight === 'number' ? itemHeight : 80)) * threshold;
    
    if (scrollOffset >= scrollThreshold && !scrollUpdateWasRequested) {
      loadingRef.current = true;
      setIsLoading(true);

      try {
        await onLoadMore();
      } catch (error) {
        console.error('Failed to load more items:', error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    }
  }, [enableInfiniteScroll, onLoadMore, height, filteredItems.length, itemHeight, threshold, hasMore]);

  // ==================== MEMOIZED VALUES ====================

  const itemData = optimizedMemo(() => ({
    items: filteredItems,
    renderItem,
    onItemClick,
    itemClassName
  }), [filteredItems, renderItem, onItemClick, itemClassName]);

  const getItemSize = optimizedCallback((index: number) => {
    if (typeof itemHeight === 'function') {
      return itemHeight(index);
    }
    return itemHeight;
  }, [itemHeight]);

  const searchFilteredItems = optimizedMemo(() => {
    if (!searchQuery) return filteredItems;
    return filteredItems.filter(item => {
      const searchableFields = item.searchableFields || Object.keys(item.data);
      return searchableFields.some(field => 
        String(item.data[field]).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [filteredItems, searchQuery]);

  // ==================== EFFECTS ====================

  useEffect(() => {
    setFilteredItems(initialItems);
  }, [initialItems]);

  // ==================== RENDER METHODS ====================

  const renderControls = () => (
    <div className="flex flex-wrap gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
      {enableSearch && (
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
      
      {enableSort && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort('name')}
            className="flex items-center gap-2"
          >
            {sortConfig?.direction === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            Trier
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
        >
          <ListIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('grid')}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="text-muted-foreground mb-2">
        <Search className="h-12 w-12 mx-auto mb-4" />
        <p className="text-lg font-medium">{emptyStateMessage}</p>
        {searchQuery && (
          <p className="text-sm mt-2">
            Aucun résultat pour "{searchQuery}"
          </p>
        )}
      </div>
      {searchQuery && (
        <Button
          variant="outline"
          onClick={() => handleSearch('')}
          className="mt-4"
        >
          Effacer la recherche
        </Button>
      )}
    </div>
  );

  const renderList = () => {
    if (!enableVirtualization) {
      return (
        <ScrollArea className="h-full">
          <div className="space-y-2">
            <AnimatePresence>
              {searchFilteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  {renderItem(item, index)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      );
    }

    const ListComponent = typeof itemHeight === 'function' ? VariableSizeList : List;

    return (
      <ListComponent
        ref={listRef}
        height={height}
        width={width}
        itemCount={searchFilteredItems.length}
        itemSize={typeof itemHeight === 'function' ? getItemSize : itemHeight}
        itemData={itemData}
        overscanCount={overscan}
        onScroll={handleScroll}
      >
        {VirtualizedItemRenderer}
      </ListComponent>
    );
  };

  // ==================== MAIN RENDER ====================

  if (isLoading && filteredItems.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {(enableSearch || enableSort) && renderControls()}
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Skeleton className="h-8 w-8 rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">{loadingMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {(enableSearch || enableSort) && renderControls()}
      
      <div className="relative">
        {searchFilteredItems.length === 0 ? renderEmptyState() : renderList()}
        
        {isLoading && (
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-background/80 backdrop-blur">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        )}
      </div>

      {searchFilteredItems.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {searchFilteredItems.length} élément{searchFilteredItems.length !== 1 ? 's' : ''} affiché{searchFilteredItems.length !== 1 ? 's' : ''}
          {searchQuery && (
            <>
              {' '}• Recherche: <Badge variant="secondary">{searchQuery}</Badge>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VirtualizedList;