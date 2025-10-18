import { memo } from 'react';
import type { SanitizedNote } from '@/modules/journal/types';
import { useJournalFavorites } from '@/hooks/useJournalFavorites';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface JournalFavoritesPageProps {
  notes: SanitizedNote[];
}

export const JournalFavoritesPage = memo<JournalFavoritesPageProps>(({ notes }) => {
  const { favorites, isFavorite } = useJournalFavorites();
  
  const favoriteNotes = notes.filter(note => note.id && isFavorite(note.id));

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notes favorites</h2>
        <p className="text-muted-foreground">
          {favoriteNotes.length} note{favoriteNotes.length > 1 ? 's' : ''} favorite{favoriteNotes.length > 1 ? 's' : ''}
        </p>
      </div>

      {favoriteNotes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Aucune note favorite
            </CardTitle>
            <CardDescription>
              Ajoutez des notes à vos favoris pour les retrouver rapidement
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {favoriteNotes.map((note) => (
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
      )}
    </div>
  );
});

JournalFavoritesPage.displayName = 'JournalFavoritesPage';
