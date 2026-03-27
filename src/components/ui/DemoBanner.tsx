// @ts-nocheck
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DemoBannerProps {
  message?: string;
}

/**
 * Bandeau d'avertissement affiché sur les pages contenant des données de démonstration.
 * Empêche l'utilisateur de confondre données fictives et données réelles.
 */
export const DemoBanner: React.FC<DemoBannerProps> = ({
  message = 'Cette page affiche des données de démonstration. Les fonctionnalités réelles seront disponibles prochainement.',
}) => (
  <div
    role="alert"
    className="mb-6 flex items-center gap-3 rounded-lg border border-yellow-400/50 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-900/20 dark:text-yellow-200"
  >
    <AlertTriangle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
    <span>{message}</span>
  </div>
);

export default DemoBanner;
