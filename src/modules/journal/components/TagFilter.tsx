import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Hash, TrendingUp } from 'lucide-react';

type TagFilterProps = {
  tags: string[];
  active: string[];
  onToggle: (tag: string) => void;
  onReset: () => void;
  isLoading?: boolean;
  tagCounts?: Record<string, number>;
};

export function TagFilter({ tags, active, onToggle, onReset, isLoading, tagCounts = {} }: TagFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'alpha' | 'count'>('alpha');

  const filteredAndSortedTags = useMemo(() => {
    let result = tags.filter(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'count') {
      result = result.sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0));
    } else {
      result = result.sort((a, b) => a.localeCompare(b, 'fr'));
    }

    return result;
  }, [tags, searchQuery, sortBy, tagCounts]);

  const totalActiveCount = useMemo(() => 
    active.reduce((sum, tag) => sum + (tagCounts[tag] || 0), 0),
    [active, tagCounts]
  );

  if (!tags.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium flex items-center gap-2">
          <Hash className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Filtrer par tags
        </span>
        {active.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {active.length} sélectionné{active.length > 1 ? 's' : ''} 
            {totalActiveCount > 0 && ` • ${totalActiveCount} entrée${totalActiveCount > 1 ? 's' : ''}`}
          </Badge>
        )}
      </div>

      {/* Recherche et tri */}
      {tags.length > 5 && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Rechercher un tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
              aria-label="Rechercher un tag"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Effacer la recherche"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            variant={sortBy === 'count' ? 'default' : 'outline'}
            onClick={() => setSortBy(sortBy === 'alpha' ? 'count' : 'alpha')}
            className="h-8 px-2"
            aria-label={sortBy === 'count' ? 'Trier alphabétiquement' : 'Trier par popularité'}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Liste des tags */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtres de tags">
        <Button
          type="button"
          size="sm"
          variant={active.length === 0 ? 'default' : 'outline'}
          onClick={onReset}
          disabled={isLoading}
          data-testid="journal-tag-all"
          className="h-7"
        >
          Tous
        </Button>
        {filteredAndSortedTags.map(tag => {
          const selected = active.includes(tag);
          const count = tagCounts[tag] || 0;
          return (
            <Button
              key={tag}
              type="button"
              size="sm"
              variant={selected ? 'default' : 'outline'}
              onClick={() => onToggle(tag)}
              disabled={isLoading}
              data-testid={`journal-tag-${tag}`}
              className="h-7 gap-1"
            >
              #{tag}
              {count > 0 && (
                <span className={`text-xs ${selected ? 'opacity-80' : 'text-muted-foreground'}`}>
                  ({count})
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Message si aucun résultat */}
      {searchQuery && filteredAndSortedTags.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          Aucun tag ne correspond à « {searchQuery} »
        </p>
      )}
    </div>
  );
}
