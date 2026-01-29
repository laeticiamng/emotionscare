import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

/**
 * Composant pour restaurer les backups blockchain en un clic
 */
export const BlockchainRestore = () => {
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);

  // Récupérer la liste des backups
  const { data: backups, isLoading, refetch } = useQuery({
    queryKey: ['blockchain-backups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blockchain_backups')
        .select('*')
        .order('backup_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  // Mutation pour restaurer un backup
  const restoreMutation = useMutation({
    mutationFn: async (backupId: string) => {
      const backup = backups?.find(b => b.id === backupId);
      if (!backup) throw new Error('Backup not found');

      // Télécharger le fichier depuis Supabase Storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('blockchain-backups')
        .download(backup.file_path);

      if (downloadError) throw downloadError;

      // Lire le contenu JSON
      const text = await fileData.text();
      const blockchainData = JSON.parse(text);

      logger.debug(`🔄 Restoring ${blockchainData.length} blocks...`, 'COMPONENT');

      // Supprimer tous les blocs existants
      const { error: deleteError } = await supabase
        .from('blockchain_audit_trail')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) throw deleteError;

      // Réinsérer les blocs depuis le backup
      const { error: insertError } = await supabase
        .from('blockchain_audit_trail')
        .insert(blockchainData);

      if (insertError) throw insertError;

      // Mettre à jour la date de restauration
      const { error: updateError } = await supabase
        .from('blockchain_backups')
        .update({ restored_at: new Date().toISOString() })
        .eq('id', backupId);

      if (updateError) throw updateError;

      return { blockCount: blockchainData.length };
    },
    onSuccess: (data) => {
      toast.success(`✅ ${data.blockCount} blocs restaurés avec succès`);
      refetch();
      setSelectedBackupId(null);
    },
    onError: (error: Error) => {
      logger.error('Restore error:', error, 'COMPONENT');
      toast.error(`Erreur lors de la restauration: ${error.message}`);
    },
  });

  const handleRestore = (backupId: string) => {
    if (confirm('⚠️ Cette action va remplacer toute la blockchain actuelle. Continuer ?')) {
      setSelectedBackupId(backupId);
      restoreMutation.mutate(backupId);
    }
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Restauration Blockchain
        </CardTitle>
        <CardDescription>
          Restaurer la blockchain d'audit depuis un backup sécurisé en un clic
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !backups || backups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Aucun backup disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {new Date(backup.backup_date).toLocaleString('fr-FR')}
                    </span>
                    {backup.restored_at && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Restauré
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {backup.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{backup.block_count} blocs</span>
                    <span className="mx-2">•</span>
                    <span>{formatFileSize(backup.file_size_bytes)}</span>
                  </div>
                  {backup.restored_at && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Restauré le {new Date(backup.restored_at).toLocaleString('fr-FR')}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const { data, error } = await supabase.storage
                        .from('blockchain-backups')
                        .download(backup.file_path);
                      
                      if (error) {
                        toast.error('Erreur de téléchargement');
                        return;
                      }

                      const url = URL.createObjectURL(data);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `blockchain-backup-${backup.backup_date}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success('Téléchargement démarré');
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRestore(backup.id)}
                    disabled={restoreMutation.isPending && selectedBackupId === backup.id}
                  >
                    {restoreMutation.isPending && selectedBackupId === backup.id ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        Restauration...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Restaurer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
