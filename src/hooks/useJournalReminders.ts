import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  journalRemindersService, 
  type CreateReminderParams 
} from '@/services/journalReminders';
import { toast } from 'sonner';

/**
 * Hook pour gérer les rappels de journal
 */
export const useJournalReminders = () => {
  const queryClient = useQueryClient();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['journal-reminders'],
    queryFn: () => journalRemindersService.getUserReminders(),
  });

  const createReminderMutation = useMutation({
    mutationFn: (params: CreateReminderParams) =>
      journalRemindersService.createReminder(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-reminders'] });
      toast.success('Rappel créé avec succès');
    },
    onError: () => {
      toast.error('Erreur lors de la création du rappel');
    },
  });

  const updateReminderMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateReminderParams> }) =>
      journalRemindersService.updateReminder(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-reminders'] });
      toast.success('Rappel mis à jour');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  const toggleReminderMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      journalRemindersService.toggleReminder(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-reminders'] });
    },
  });

  const deleteReminderMutation = useMutation({
    mutationFn: (id: string) => journalRemindersService.deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-reminders'] });
      toast.success('Rappel supprimé');
    },
    onError: () => {
      toast.error('Erreur lors de la suppression');
    },
  });

  return {
    reminders,
    isLoading,
    createReminder: createReminderMutation.mutateAsync,
    updateReminder: updateReminderMutation.mutateAsync,
    toggleReminder: toggleReminderMutation.mutateAsync,
    deleteReminder: deleteReminderMutation.mutateAsync,
  };
};
