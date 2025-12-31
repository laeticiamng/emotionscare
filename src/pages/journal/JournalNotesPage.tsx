// @ts-nocheck
/**
 * JournalNotesPage - Page principale des notes enrichie
 */
import { memo } from 'react';
import type { SanitizedNote } from '@/modules/journal/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Calendar, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalNotesPageProps {
  notes: SanitizedNote[];
}

export const JournalNotesPage = memo<JournalNotesPageProps>(({ notes }) => {
  // Group by date
  const groupedNotes = notes.reduce((acc, note) => {
    const dateKey = format(new Date(note.created_at), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(note);
    return acc;
  }, {} as Record<string, SanitizedNote[]>);

  const sortedDates = Object.keys(groupedNotes).sort((a, b) => b.localeCompare(a));

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
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
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
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(note.created_at), 'HH:mm', { locale: fr })}
                            {note.mode === 'voice' && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                🎤 Vocal
                              </Badge>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
});

JournalNotesPage.displayName = 'JournalNotesPage';
