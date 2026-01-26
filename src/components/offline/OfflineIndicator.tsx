/**
 * Offline Indicator - Affiche le statut de connexion
 */

import { useState } from 'react';
import { AlertCircle, Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOffline } from '@/contexts/OfflineContext';
import { cn } from '@/lib/utils';

export function OfflineIndicator() {
  const { isOnline, isSyncing, syncError, queueStats, sync } = useOffline();
  const [showDetails, setShowDetails] = useState(false);

  // Ne pas afficher si online et pas d'items en queue
  if (isOnline && queueStats.pending === 0) {
    return null;
  }

  const isPending = queueStats.pending > 0;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Indicateur principal */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={cn(
          'flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-200',
          isOnline
            ? 'bg-green-500 hover:bg-green-600'
            : 'bg-red-500 hover:bg-red-600',
          'text-white cursor-pointer'
        )}
      >
        {isOnline ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? 'Connecté' : 'Hors-ligne'}
        </span>

        {(isPending || isSyncing) && (
          <span className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded text-xs font-semibold">
            {isSyncing ? 'Sync...' : `${queueStats.pending}`}
          </span>
        )}
      </button>

      {/* Détails */}
      {showDetails && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* En-tête */}
          <div
            className={cn(
              'px-4 py-3 text-white',
              isOnline ? 'bg-green-500' : 'bg-red-500'
            )}
          >
            <h3 className="font-semibold">
              {isOnline ? 'Vous êtes en ligne' : 'Vous êtes hors-ligne'}
            </h3>
            <p className="text-xs opacity-90 mt-1">
              {isOnline
                ? 'Les changements seront synchronisés automatiquement'
                : 'Vos modifications seront synchronisées dès le retour de la connexion'}
            </p>
          </div>

          {/* Contenu */}
          <div className="p-4 space-y-4">
            {/* Statut de la queue */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">
                Statut de synchronisation
              </h4>

              <div className="space-y-1 text-sm">
                {queueStats.pending > 0 && (
                  <div className="flex items-center justify-between text-gray-700">
                    <span>En attente</span>
                    <span className="font-semibold text-blue-600">
                      {queueStats.pending}
                    </span>
                  </div>
                )}

                {queueStats.syncing > 0 && (
                  <div className="flex items-center justify-between text-gray-700">
                    <span>En cours de synchronisation</span>
                    <span className="font-semibold text-amber-600">
                      {queueStats.syncing}
                    </span>
                  </div>
                )}

                {queueStats.synced > 0 && (
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Synchronisés</span>
                    <span className="font-semibold text-green-600">
                      {queueStats.synced}
                    </span>
                  </div>
                )}

                {queueStats.failed > 0 && (
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Erreurs</span>
                    <span className="font-semibold text-red-600">
                      {queueStats.failed}
                    </span>
                  </div>
                )}

                {queueStats.conflicts > 0 && (
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Conflits</span>
                    <span className="font-semibold text-orange-600">
                      {queueStats.conflicts}
                    </span>
                  </div>
                )}

                {queueStats.total === 0 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aucun changement en attente</span>
                  </div>
                )}
              </div>
            </div>

            {/* Erreur de synchronisation */}
            {syncError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-900">
                      Erreur de synchronisation
                    </p>
                    <p className="text-xs text-red-700 mt-1">{syncError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-2">
              {isOnline && isPending && (
                <button
                  onClick={sync}
                  disabled={isSyncing}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  <RefreshCw className={cn('w-4 h-4', isSyncing && 'animate-spin')} />
                  {isSyncing ? 'Synchronisation...' : 'Synchroniser maintenant'}
                </button>
              )}

              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Fermer
              </button>
            </div>

            {/* Info supplémentaire */}
            {isOnline && queueStats.total > 0 && (
              <p className="text-xs text-gray-600 text-center">
                La synchronisation est automatique. Vous pouvez fermer ce volet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
