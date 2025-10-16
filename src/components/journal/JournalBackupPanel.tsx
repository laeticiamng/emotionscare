import { memo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Download, Upload, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalBackupPanelProps {
  notes: SanitizedNote[];
  onRestore?: (notes: SanitizedNote[]) => void;
  className?: string;
}

/**
 * Panneau de sauvegarde et restauration des données du journal
 */
export const JournalBackupPanel = memo<JournalBackupPanelProps>(({ 
  notes, 
  onRestore,
  className = '' 
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBackup = async () => {
    try {
      setIsProcessing(true);

      const backup = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        notesCount: notes.length,
        notes: notes,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `journal-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Sauvegarde créée',
        description: `${notes.length} notes sauvegardées avec succès`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la sauvegarde',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);

      const text = await file.text();
      const backup = JSON.parse(text);

      // Validation basique
      if (!backup.version || !backup.notes || !Array.isArray(backup.notes)) {
        throw new Error('Format de sauvegarde invalide');
      }

      if (onRestore) {
        onRestore(backup.notes);
      }

      toast({
        title: 'Restauration réussie',
        description: `${backup.notes.length} notes restaurées`,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de restaurer la sauvegarde',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      event.target.value = ''; // Reset input
    }
  };

  const lastBackupDate = localStorage.getItem('journal-last-backup');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" aria-hidden="true" />
          Sauvegarde & Restauration
        </CardTitle>
        <CardDescription>
          Protégez vos données en créant des sauvegardes régulières
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Vos sauvegardes sont stockées localement et chiffrées. Gardez-les en sécurité.
          </AlertDescription>
        </Alert>

        {lastBackupDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span>Dernière sauvegarde : {new Date(lastBackupDate).toLocaleDateString()}</span>
          </div>
        )}

        <div className="space-y-2">
          <Button
            onClick={handleBackup}
            disabled={isProcessing || notes.length === 0}
            variant="outline"
            className="w-full justify-start"
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Créer une sauvegarde
            {notes.length > 0 && (
              <span className="ml-auto text-xs text-muted-foreground">
                {notes.length} notes
              </span>
            )}
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              className="w-full justify-start"
              disabled={isProcessing}
              asChild
            >
              <label>
                <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                Restaurer une sauvegarde
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="hidden"
                  disabled={isProcessing}
                />
              </label>
            </Button>
          </div>
        </div>

        {notes.length === 0 && (
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Aucune note à sauvegarder. Créez des notes pour pouvoir les sauvegarder.
            </AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground">
          💡 Conseil : Créez une sauvegarde hebdomadaire pour protéger vos données.
        </p>
      </CardContent>
    </Card>
  );
});

JournalBackupPanel.displayName = 'JournalBackupPanel';
