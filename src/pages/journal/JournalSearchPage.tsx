import { memo, useState } from 'react';
import type { SanitizedNote } from '@/modules/journal/types';
import { JournalAdvancedSearch } from '@/components/journal/JournalAdvancedSearch';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface JournalSearchPageProps {
  notes: SanitizedNote[];
}

export const JournalSearchPage = memo<JournalSearchPageProps>(({ notes }) => {
  const [searchResults, setSearchResults] = useState<SanitizedNote[]>(notes);
  const [hasSearched, setHasSearched] = useState(false);

  const handleResultsChange = (results: SanitizedNote[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Recherche avancée</h2>
        <p className="text-muted-foreground">
          Trouvez rapidement vos notes avec des filtres puissants
        </p>
      </div>

      <JournalAdvancedSearch notes={notes} onResultsChange={handleResultsChange} />

      {searchResults.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
          </h3>
          <div className="grid gap-4">
            {searchResults.map((note) => (
              <Card key={note.id}>
                <CardContent className="pt-6">
                  <p className="text-sm">{note.text}</p>
                  {note.tags.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {note.tags.map(tag => (
                        <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : hasSearched ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Aucune note ne correspond à vos critères de recherche.
              Essayez de modifier vos filtres ou votre recherche.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
});

JournalSearchPage.displayName = 'JournalSearchPage';
