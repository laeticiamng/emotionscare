import { memo, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  X,
  Calendar,
  Hash,
  FileText,
  SlidersHorizontal,
  ArrowUpDown,
} from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { parseISO } from 'date-fns';

interface JournalAdvancedSearchProps {
  notes: SanitizedNote[];
  onResultsChange: (results: SanitizedNote[]) => void;
  className?: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'length-desc' | 'length-asc';

/**
 * Composant de recherche avancée pour le journal
 * Permet de filtrer et trier les notes avec plusieurs critères
 */
export const JournalAdvancedSearch = memo<JournalAdvancedSearchProps>(({
  notes,
  onResultsChange,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minLength, setMinLength] = useState('');
  const [maxLength, setMaxLength] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  // Extraire tous les tags disponibles
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filtrer et trier les résultats
  const searchResults = useMemo(() => {
    let results = [...notes];

    // Filtre par texte
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(note =>
        note.text.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (note.summary && note.summary.toLowerCase().includes(query))
      );
    }

    // Filtre par tags
    if (selectedTags.length > 0) {
      results = results.filter(note =>
        selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    // Filtre par date
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      results = results.filter(note => parseISO(note.created_at) >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      results = results.filter(note => parseISO(note.created_at) <= toDate);
    }

    // Filtre par longueur
    if (minLength) {
      const min = parseInt(minLength, 10);
      results = results.filter(note => note.text.length >= min);
    }
    if (maxLength) {
      const max = parseInt(maxLength, 10);
      results = results.filter(note => note.text.length <= max);
    }

    // Tri
    results.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime();
        case 'date-asc':
          return parseISO(a.created_at).getTime() - parseISO(b.created_at).getTime();
        case 'length-desc':
          return b.text.length - a.text.length;
        case 'length-asc':
          return a.text.length - b.text.length;
        default:
          return 0;
      }
    });

    return results;
  }, [notes, searchQuery, selectedTags, dateFrom, dateTo, minLength, maxLength, sortBy]);

  // Notifier les changements de résultats
  useMemo(() => {
    onResultsChange(searchResults);
  }, [searchResults, onResultsChange]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setDateFrom('');
    setDateTo('');
    setMinLength('');
    setMaxLength('');
    setSortBy('date-desc');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedTags.length > 0 ||
    dateFrom !== '' ||
    dateTo !== '' ||
    minLength !== '' ||
    maxLength !== '' ||
    sortBy !== 'date-desc';

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" aria-hidden="true" />
              Recherche avancée
            </CardTitle>
            <CardDescription>
              Trouvez rapidement vos notes avec des filtres puissants
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barre de recherche principale */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              type="search"
              placeholder="Rechercher dans vos notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-accent' : ''}
            aria-label="Afficher les filtres"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="space-y-4 p-4 rounded-lg border bg-muted/50">
            {/* Tags */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Hash className="h-4 w-4" aria-hidden="true" />
                Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.length > 0 ? (
                  availableTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Aucun tag disponible</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Du
                </Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Au
                </Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* Longueur */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-length" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Longueur min
                </Label>
                <Input
                  id="min-length"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minLength}
                  onChange={(e) => setMinLength(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-length" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Longueur max
                </Label>
                <Input
                  id="max-length"
                  type="number"
                  min="0"
                  placeholder="∞"
                  value={maxLength}
                  onChange={(e) => setMaxLength(e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* Tri */}
            <div className="space-y-2">
              <Label htmlFor="sort-by" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
                Trier par
              </Label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
              >
                <option value="date-desc">Date (plus récent)</option>
                <option value="date-asc">Date (plus ancien)</option>
                <option value="length-desc">Longueur (plus long)</option>
                <option value="length-asc">Longueur (plus court)</option>
              </select>
            </div>
          </div>
        )}

        {/* Actions */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              Filtres actifs
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" aria-hidden="true" />
              Réinitialiser
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

JournalAdvancedSearch.displayName = 'JournalAdvancedSearch';
