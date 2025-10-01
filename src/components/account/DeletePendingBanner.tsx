// @ts-nocheck
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Undo } from 'lucide-react';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';

export const DeletePendingBanner: React.FC = () => {
  const { 
    status, 
    canRestore, 
    getDaysUntilPurge, 
    formatPurgeDate, 
    undelete, 
    loading 
  } = useAccountDeletion();

  // Don't show if account is not soft deleted or can't be restored
  if (status !== 'soft_deleted' || !canRestore()) {
    return null;
  }

  const daysLeft = getDaysUntilPurge();
  const purgeDate = formatPurgeDate();

  const handleUndelete = async () => {
    const success = await undelete();
    if (success) {
      // Optionally show success message or refresh page
      window.location.reload();
    }
  };

  return (
    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            
            <div className="space-y-1">
              <p 
                className="font-medium text-amber-800 dark:text-amber-200"
                aria-live="polite"
              >
                Suppression de compte planifiée
              </p>
              
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {daysLeft !== null && daysLeft > 0 ? (
                  <>
                    Ton compte sera supprimé définitivement dans <strong>{daysLeft} jour{daysLeft > 1 ? 's' : ''}</strong>
                    {purgeDate && (
                      <span className="block">
                        Purge prévue le {purgeDate}
                      </span>
                    )}
                  </>
                ) : (
                  'Ton compte va être supprimé définitivement très prochainement'
                )}
              </p>
              
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Tu peux encore annuler cette suppression.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleUndelete}
            disabled={loading}
            className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/40"
            aria-label="Annuler la suppression du compte"
          >
            <Undo className="w-4 h-4 mr-1" />
            {loading ? 'Annulation...' : 'Annuler la suppression'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};