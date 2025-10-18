import { memo, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalBackupProps {
  notes: SanitizedNote[];
  onRestore: (notes: SanitizedNote[]) => Promise<void>;
}

export const JournalBackup = memo<JournalBackupProps>(({ notes, onRestore }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createBackup = () => {
    setIsProcessing(true);
    try {
      const backup = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        notesCount: notes.length,
        notes: notes,
      };

      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `journal-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Backup créé',
        description: `${notes.length} notes sauvegardées`,
      });
    } catch (error) {
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Impossible de créer le backup',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.notes || !Array.isArray(backup.notes)) {
        throw new Error('Format de backup invalide');
      }

      const validNotes = backup.notes.filter((note: any) => {
        return (
          note.text &&
          typeof note.text === 'string' &&
          Array.isArray(note.tags) &&
          note.created_at
        );
      });

      if (validNotes.length === 0) {
        throw new Error('Aucune note valide trouvée dans le backup');
      }

      await onRestore(validNotes);

      toast({
        title: 'Backup restauré',
        description: `${validNotes.length} notes importées avec succès`,
      });
    } catch (error) {
      toast({
        title: 'Erreur de restauration',
        description: error instanceof Error ? error.message : 'Format de fichier invalide',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const hasNotes = notes.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Sauvegarde & Restauration
        </CardTitle>
        <CardDescription>
          Créez des backups de sécurité de vos notes
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <Button
          onClick={createBackup}
          disabled={!hasNotes || isProcessing}
          className="w-full justify-start"
          variant="outline"
        >
          <Download className="h-4 w-4 mr-2" />
          Créer un backup
        </Button>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
            id="backup-file-input"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full justify-start"
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Restaurer un backup
          </Button>
        </div>

        {!hasNotes && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            Aucune note à sauvegarder
          </p>
        )}

        {isProcessing && (
          <p className="text-xs text-primary text-center pt-2">
            Traitement en cours...
          </p>
        )}
      </CardContent>
    </Card>
  );
});

JournalBackup.displayName = 'JournalBackup';
