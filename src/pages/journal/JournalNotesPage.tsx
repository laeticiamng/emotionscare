// @ts-nocheck
/**
 * JournalNotesPage - Page principale des notes enrichie
 */
import { memo } from 'react';
import { useJournalEnriched } from '@/modules/journal/useJournalEnriched';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Calendar, Heart, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const JournalNotesPage = memo(() => {
  const { 
    notes, 
    isLoading, 
    handleDelete, 
    handleToggleFavorite, 
    isFavorite,
    setEditingNote,
    loadMore,
    hasMore,
    isFetchingMore 
  } = useJournalEnriched();

  // Group by date
  const groupedNotes = notes.reduce((acc, note) => {
    const dateKey = format(new Date(note.created_at), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  const sortedDates = Object.keys(groupedNotes).sort((a, b) => b.localeCompare(a));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" aria-hidden="true" />
          Mes Notes
        </h1>
        <p className="text-muted-foreground mt-1">
          {notes.length} note{notes.length > 1 ? 's' : ''} au total
        </p>
      </header>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" aria-hidden="true" />
            <h2 className="text-xl font-semibold mb-2">Aucune note</h2>
            <p className="text-muted-foreground">
              Commencez à écrire pour voir vos notes ici
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((dateKey) => (
            <section key={dateKey}>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {format(new Date(dateKey), 'EEEE d MMMM yyyy', { locale: fr })}
                <Badge variant="secondary" className="ml-2">
                  {groupedNotes[dateKey].length}
                </Badge>
              </h2>
              <div className="grid gap-4">
                {groupedNotes[dateKey].map((note) => (
                  <Card key={note.id} className="hover:shadow-md transition-shadow group">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {note.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(note.created_at), 'HH:mm', { locale: fr })}
                              {note.mode === 'voice' && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  🎤 Vocal
                                </Badge>
                              )}
                            </p>
                            {/* Actions */}
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleToggleFavorite(note.id)}
                                aria-label={isFavorite(note.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                              >
                                <Heart 
                                  className={`h-4 w-4 ${isFavorite(note.id) ? 'text-destructive fill-destructive' : 'text-muted-foreground'}`} 
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setEditingNote(note)}
                                aria-label="Modifier"
                              >
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleDelete(note.id)}
                                aria-label="Supprimer"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={loadMore}
                disabled={isFetchingMore}
              >
                {isFetchingMore ? 'Chargement...' : 'Voir plus'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

JournalNotesPage.displayName = 'JournalNotesPage';

export default JournalNotesPage;
