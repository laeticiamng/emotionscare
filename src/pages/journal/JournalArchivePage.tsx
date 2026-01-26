// @ts-nocheck
/**
 * JournalArchivePage - Archive & Export enrichi avec notes archivées
 */
import { memo, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listArchivedNotes, unarchiveNote } from '@/services/journal/journalApi';
import { useJournalEnriched } from '@/modules/journal/useJournalEnriched';
import { useToast } from '@/hooks/use-toast';
import { JournalExportPanel } from '@/components/journal/JournalExportPanel';
import { JournalBackup } from '@/components/journal/JournalBackup';
import { JournalAdvancedExport } from '@/components/journal/JournalAdvancedExport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Archive, FileText, Database, Shield, Calendar, RotateCcw } from 'lucide-react';
import { logger } from '@/lib/logger';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const JournalArchivePage = memo(() => {
  const { notes } = useJournalEnriched();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch archived notes
  const { data: archivedNotes = [], isLoading: isLoadingArchived } = useQuery({
    queryKey: ['journal', 'archived'],
    queryFn: listArchivedNotes,
    staleTime: 60_000,
  });

  // Unarchive mutation
  const unarchiveMutation = useMutation({
    mutationFn: unarchiveNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      toast({ title: 'Note restaurée', description: 'La note a été restaurée avec succès.' });
    },
    onError: () => {
      toast({ title: 'Erreur', description: 'Impossible de restaurer la note.', variant: 'destructive' });
    },
  });

  // Calculate archive stats
  const stats = useMemo(() => {
    const totalSize = notes.reduce((acc, n) => acc + (n.text?.length || 0), 0);
    const oldestNote = notes.length > 0 
      ? notes.reduce((oldest, n) => 
          new Date(n.created_at) < new Date(oldest.created_at) ? n : oldest
        )
      : null;
    
    return {
      totalNotes: notes.length,
      archivedCount: archivedNotes.length,
      totalSizeKB: Math.round(totalSize / 1024 * 100) / 100,
      oldestDate: oldestNote ? new Date(oldestNote.created_at) : null,
    };
  }, [notes, archivedNotes]);

  if (isLoadingArchived) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Archive className="h-7 w-7 text-primary" aria-hidden="true" />
          Archive & Export
        </h1>
        <p className="text-muted-foreground mt-1">
          Sauvegardez et exportez vos données
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalNotes}</p>
                <p className="text-xs text-muted-foreground">Notes actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Archive className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.archivedCount}</p>
                <p className="text-xs text-muted-foreground">Archivées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Database className="h-5 w-5 text-success" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalSizeKB} KB</p>
                <p className="text-xs text-muted-foreground">Taille données</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Calendar className="h-5 w-5 text-secondary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.oldestDate 
                    ? format(stats.oldestDate, 'MMM yyyy', { locale: fr })
                    : '-'
                  }
                </p>
                <p className="text-xs text-muted-foreground">Première note</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Archived Notes */}
      {archivedNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" aria-hidden="true" />
              Notes archivées
              <Badge variant="secondary">{archivedNotes.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {archivedNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{note.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(note.created_at), 'd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => unarchiveMutation.mutate(note.id)}
                    disabled={unarchiveMutation.isPending}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restaurer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RGPD Notice */}
      <Card className="border-success/30 bg-success/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-success mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-medium text-success">Conformité RGPD</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Vos données sont chiffrées et vous pouvez les exporter ou les supprimer à tout moment.
                Nous ne partageons jamais vos informations personnelles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export & Backup */}
      <div className="grid gap-6 md:grid-cols-2">
        <JournalExportPanel notes={notes} />
        <JournalBackup 
          notes={notes} 
          onRestore={async (importedNotes) => {
            logger.info('Restored notes', { count: importedNotes.length }, 'UI');
          }} 
        />
      </div>

      {/* Advanced Export */}
      <JournalAdvancedExport notes={notes} />
    </div>
  );
});

JournalArchivePage.displayName = 'JournalArchivePage';

export default JournalArchivePage;
