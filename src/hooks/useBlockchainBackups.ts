import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBlockchainBackup } from './useUnifiedApi';

/**
 * Hook pour gérer les backups blockchain
 */
export const useBlockchainBackups = () => {
  const queryClient = useQueryClient();
  const backupMutation = useBlockchainBackup();

  const { data: backups, isLoading, refetch } = useQuery({
    queryKey: ['blockchain-backups-full'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blockchain_backups')
        .select('*')
        .order('backup_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: integrityStats } = useQuery({
    queryKey: ['blockchain-integrity'],
    queryFn: async () => {
      // Récupérer tous les blocs pour vérifier l'intégrité
      const { data: blocks, error } = await supabase
        .from('blockchain_audit_trail')
        .select('*')
        .order('block_number', { ascending: true });

      if (error) throw error;

      // Calculer les statistiques d'intégrité
      let validBlocks = 0;
      let brokenChainCount = 0;

      if (blocks && blocks.length > 1) {
        for (let i = 1; i < blocks.length; i++) {
          if (blocks[i].previous_hash === blocks[i - 1].block_hash) {
            validBlocks++;
          } else {
            brokenChainCount++;
          }
        }
      }

      return {
        totalBlocks: blocks?.length || 0,
        validBlocks,
        brokenChainCount,
        integrityScore: blocks?.length > 1 
          ? Math.round((validBlocks / (blocks.length - 1)) * 100) 
          : 100,
        firstBlock: blocks?.[0],
        lastBlock: blocks?.[blocks.length - 1],
      };
    },
    refetchInterval: 60000, // Rafraîchir toutes les minutes
  });

  const createBackupMutation = useMutation({
    mutationFn: async () => {
      // Récupérer toute la blockchain
      const { data: blockchainData, error } = await supabase
        .from('blockchain_audit_trail')
        .select('*')
        .order('block_number', { ascending: true });

      if (error) throw error;

      // Utiliser l'API unifiée pour créer le backup
      return backupMutation.mutateAsync(blockchainData);
    },
    onSuccess: () => {
      toast.success('Backup blockchain créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['blockchain-backups-full'] });
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors du backup: ${error.message}`);
    },
  });

  const deleteBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      const backup = backups?.find(b => b.id === backupId);
      if (!backup) throw new Error('Backup not found');

      // Supprimer le fichier du storage
      const { error: storageError } = await supabase.storage
        .from('blockchain-backups')
        .remove([backup.file_path]);

      if (storageError) throw storageError;

      // Supprimer l'entrée de la base
      const { error: dbError } = await supabase
        .from('blockchain_backups')
        .delete()
        .eq('id', backupId);

      if (dbError) throw dbError;

      return backupId;
    },
    onSuccess: () => {
      toast.success('Backup supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['blockchain-backups-full'] });
      refetch();
    },
    onError: (error: Error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
  });

  return {
    backups,
    integrityStats,
    isLoading,
    createBackup: createBackupMutation.mutate,
    deleteBackup: deleteBackupMutation.mutate,
    isCreatingBackup: createBackupMutation.isPending,
    isDeletingBackup: deleteBackupMutation.isPending,
    refetch,
  };
};
