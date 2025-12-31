// @ts-nocheck
/**
 * JournalSearchPage - Recherche avancée enrichie
 */
import { memo, useState, useMemo } from 'react';
import type { SanitizedNote } from '@/modules/journal/types';
import { JournalAdvancedSearch } from '@/components/journal/JournalAdvancedSearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileText, Calendar, Tag, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalSearchPageProps {
  notes: SanitizedNote[];
}

export const JournalSearchPage = memo<JournalSearchPageProps>(({ notes }) => {
  const [searchResults, setSearchResults] = useState<SanitizedNote[]>(notes);
  const [hasSearched, setHasSearched] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  // Quick search filter
  const filteredResults = useMemo(() => {
    if (!quickSearch.trim()) return searchResults;
    const query = quickSearch.toLowerCase();
    return searchResults.filter(
      n => n.text?.toLowerCase().includes(query) || 
           n.tags?.some(t => t.toLowerCase().includes(query))
    );
  }, [searchResults, quickSearch]);

  // All available tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(n => n.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [notes]);

  const handleResultsChange = (results: SanitizedNote[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleTagClick = (tag: string) => {
    setQuickSearch(`#${tag}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Search className="h-7 w-7 text-primary" aria-hidden="true" />
          Recherche
        </h1>
        <p className="text-muted-foreground mt-1">
          Trouvez rapidement vos notes
        </p>
      </header>

      {/* Quick Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Recherche rapide dans les résultats..."
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              className="pl-10 pr-10"
              aria-label="Recherche rapide"
            />
            {quickSearch && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setQuickSearch('')}
                aria-label="Effacer la recherche"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags Quick Filter */}
      {allTags.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4" aria-hidden="true" />
              Filtrer par tag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 15).map((tag) => (
                <Badge
                  key={tag}
                  variant={quickSearch === `#${tag}` ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleTagClick(tag)}
                >
                  #{tag}
                </Badge>
              ))}
              {allTags.length > 15 && (
                <Badge variant="secondary">+{allTags.length - 15} autres</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Search */}
      <JournalAdvancedSearch notes={notes} onResultsChange={handleResultsChange} />

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" aria-hidden="true" />
              Résultats
            </span>
            <Badge variant="secondary">{filteredResults.length} notes</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResults.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredResults.map((note) => (
                <div
                  key={note.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm whitespace-pre-wrap line-clamp-3">{note.text}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1">
                      {note.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {format(new Date(note.created_at), 'd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-30" aria-hidden="true" />
              <p>{hasSearched ? 'Aucun résultat trouvé' : 'Lancez une recherche pour voir les résultats'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

JournalSearchPage.displayName = 'JournalSearchPage';
