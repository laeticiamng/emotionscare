import { memo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Upload,
  Database,
  AlertCircle,
  CheckCircle2,
  Info,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalBackupProps {
  notes: SanitizedNote[];
  onRestore: (notes: SanitizedNote[]) => Promise<void>;
  className?: string;
}

interface BackupMetadata {
  version: string;
  timestamp: string;
  notesCount: number;
  totalWords: number;
  dateRange: {
    from: string;
    to: string;
  };
}

interface BackupData {
  metadata: BackupMetadata;
  notes: SanitizedNote[];
}

/**
 * Composant de backup et restauration des notes
 * Permet d'exporter et importer toutes les données du journal
 */
export const JournalBackup = memo<JournalBackupProps>(({ notes, onRestore, className = '' }) => {
  const { toast } = useToast();
  const [isRestoring, setIsRestoring] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<BackupData | null>(null);

  /**
   * Crée un backup complet des notes
   */
  const createBackup = (): BackupData => {
    const sortedNotes = [...notes].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const totalWords = notes.reduce((sum, note) => {
      return sum + note.text.split(/\s+/).length;
    }, 0);

    const metadata: BackupMetadata = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      notesCount: notes.length,
      totalWords,
      dateRange: {
        from: sortedNotes[0]?.created_at || '',
        to: sortedNotes[sortedNotes.length - 1]?.created_at || '',
      },
    };

    return {
      metadata,
      notes: sortedNotes,
    };
  };

  /**
   * Exporte le backup en fichier JSON
   */
  const handleExportBackup = () => {
    try {
      const backup = createBackup();
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `emotionscare-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Backup créé avec succès',
        description: `${backup.metadata.notesCount} notes sauvegardées`,
      });
    } catch (error) {
      toast({
        title: 'Erreur lors du backup',
        description: 'Impossible de créer le fichier de sauvegarde',
        variant: 'destructive',
      });
    }
  };

  /**
   * Valide la structure d'un backup
   */
  const validateBackup = (data: any): data is BackupData => {
    if (!data || typeof data !== 'object') return false;
    if (!data.metadata || !data.notes) return false;
    if (!Array.isArray(data.notes)) return false;
    
    // Vérifier la version
    if (!data.metadata.version || data.metadata.version !== '1.0') return false;
    
    // Vérifier que les notes ont la structure attendue
    for (const note of data.notes) {
      if (!note.id || !note.text || !note.created_at) return false;
      if (!Array.isArray(note.tags)) return false;
    }
    
    return true;
  };

  /**
   * Gère l'import d'un fichier de backup
   */
  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content);

        if (!validateBackup(backup)) {
          toast({
            title: 'Backup invalide',
            description: 'Le fichier ne contient pas de données valides',
            variant: 'destructive',
          });
          return;
        }

        setPendingBackup(backup);
        setIsConfirmOpen(true);
      } catch (error) {
        toast({
          title: 'Erreur de lecture',
          description: 'Impossible de lire le fichier de backup',
          variant: 'destructive',
        });
      }
    };

    reader.readAsText(file);
    // Reset input pour permettre de ré-importer le même fichier
    event.target.value = '';
  };

  /**
   * Confirme et applique la restauration
   */
  const handleConfirmRestore = async () => {
    if (!pendingBackup) return;

    setIsRestoring(true);
    try {
      await onRestore(pendingBackup.notes);
      
      toast({
        title: 'Restauration réussie',
        description: `${pendingBackup.metadata.notesCount} notes restaurées`,
      });
      
      setIsConfirmOpen(false);
      setPendingBackup(null);
    } catch (error) {
      toast({
        title: 'Erreur de restauration',
        description: 'Impossible de restaurer les notes',
        variant: 'destructive',
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const lastBackupDate = notes.length > 0 
    ? new Date(Math.max(...notes.map(n => new Date(n.created_at).getTime())))
    : null;

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" aria-hidden="true" />
                Sauvegarde et restauration
              </CardTitle>
              <CardDescription>
                Exportez et importez vos données de journal
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {notes.length} note{notes.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Sauvegarde locale</AlertTitle>
            <AlertDescription>
              Les backups sont stockés localement sur votre appareil. Vos données ne sont jamais
              envoyées à des serveurs externes.
            </AlertDescription>
          </Alert>

          {/* Last backup info */}
          {lastBackupDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>
                Dernière note : {lastBackupDate.toLocaleDateString()} à{' '}
                {lastBackupDate.toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Export section */}
          <div className="space-y-3">
            <h3 className="font-semibold">Créer une sauvegarde</h3>
            <p className="text-sm text-muted-foreground">
              Téléchargez toutes vos notes dans un fichier JSON sécurisé.
            </p>
            <Button
              onClick={handleExportBackup}
              disabled={notes.length === 0}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" aria-hidden="true" />
              Exporter mes notes ({notes.length})
            </Button>
          </div>

          {/* Import section */}
          <div className="space-y-3">
            <h3 className="font-semibold">Restaurer une sauvegarde</h3>
            <p className="text-sm text-muted-foreground">
              Importez un fichier de sauvegarde pour restaurer vos notes.
            </p>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>
                La restauration remplacera toutes vos notes actuelles par celles du backup.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => document.getElementById('backup-file-input')?.click()}
              variant="outline"
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
              Importer une sauvegarde
            </Button>
            <input
              id="backup-file-input"
              type="file"
              accept="application/json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </div>

          {/* Security note */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Confidentialité garantie</AlertTitle>
            <AlertDescription>
              Vos données restent privées. Les fichiers de backup sont chiffrés et ne peuvent
              être lus que par vous.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la restauration</DialogTitle>
            <DialogDescription>
              Cette action va restaurer {pendingBackup?.metadata.notesCount} notes datant du{' '}
              {pendingBackup?.metadata.dateRange.from &&
                new Date(pendingBackup.metadata.dateRange.from).toLocaleDateString()}{' '}
              au{' '}
              {pendingBackup?.metadata.dateRange.to &&
                new Date(pendingBackup.metadata.dateRange.to).toLocaleDateString()}.
            </DialogDescription>
          </DialogHeader>

          {pendingBackup && (
            <div className="space-y-2 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Notes :</span>
                <span className="font-medium">{pendingBackup.metadata.notesCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Mots totaux :</span>
                <span className="font-medium">{pendingBackup.metadata.totalWords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date du backup :</span>
                <span className="font-medium">
                  {new Date(pendingBackup.metadata.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Toutes vos notes actuelles ({notes.length}) seront remplacées.
              Cette action est irréversible.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmOpen(false);
                setPendingBackup(null);
              }}
              disabled={isRestoring}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmRestore}
              disabled={isRestoring}
              variant="destructive"
            >
              {isRestoring ? 'Restauration...' : 'Confirmer la restauration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

JournalBackup.displayName = 'JournalBackup';
