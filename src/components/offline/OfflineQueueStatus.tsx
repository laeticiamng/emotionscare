/**
 * Offline Queue Status - Affiche le détail de la queue
 */

import { AlertTriangle, CheckCircle2, Clock, XCircle, Zap } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { cn } from '@/lib/utils';

interface OfflineQueueStatusProps {
  className?: string;
}

export function OfflineQueueStatus({ className }: OfflineQueueStatusProps) {
  const { queueStats, isOnline, isSyncing } = useOffline();

  const totalItems = queueStats.total;

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {queueStats.pending > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-semibold">En attente</span>
            </div>
            <p className="text-xl font-bold text-blue-900">{queueStats.pending}</p>
          </div>
        )}

        {queueStats.syncing > 0 && (
          <div className="p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="text-xs text-amber-600 font-semibold">Sync...</span>
            </div>
            <p className="text-xl font-bold text-amber-900">{queueStats.syncing}</p>
          </div>
        )}

        {queueStats.synced > 0 && (
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-semibold">Syncs</span>
            </div>
            <p className="text-xl font-bold text-green-900">{queueStats.synced}</p>
          </div>
        )}

        {queueStats.failed > 0 && (
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-600 font-semibold">Erreurs</span>
            </div>
            <p className="text-xl font-bold text-red-900">{queueStats.failed}</p>
          </div>
        )}

        {queueStats.conflicts > 0 && (
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-600 font-semibold">Conflits</span>
            </div>
            <p className="text-xl font-bold text-orange-900">{queueStats.conflicts}</p>
          </div>
        )}
      </div>

      {/* Statut de synchronisation */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              Statut global
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              {isOnline
                ? isSyncing
                  ? 'Synchronisation en cours...'
                  : 'Prêt pour la synchronisation'
                : 'Hors-ligne - Synchronisation en attente'}
            </p>
          </div>
          <div
            className={cn(
              'w-3 h-3 rounded-full',
              isOnline
                ? isSyncing
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-green-500'
                : 'bg-red-500'
            )}
          />
        </div>
      </div>

      {/* Message informatif */}
      {queueStats.total > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            {isOnline
              ? 'Vos modifications seront synchronisées automatiquement avec le serveur.'
              : 'Vous êtes hors-ligne. Vos modifications seront synchronisées dès le retour de la connexion.'}
          </p>
        </div>
      )}
    </div>
  );
}
