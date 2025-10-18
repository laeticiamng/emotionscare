import { memo } from 'react';
import type { SanitizedNote } from '@/modules/journal/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface JournalNotesPageProps {
  notes: SanitizedNote[];
}

export const JournalNotesPage = memo<JournalNotesPageProps>(({ notes }) => {
  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Mes notes</h2>
        <p className="text-muted-foreground">
          Toutes vos notes de journal
        </p>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Aucune note
            </CardTitle>
            <CardDescription>
              Commencez à écrire pour voir vos notes ici
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
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

JournalNotesPage.displayName = 'JournalNotesPage';
