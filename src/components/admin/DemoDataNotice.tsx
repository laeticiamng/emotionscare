// @ts-nocheck
/**
 * DemoDataNotice — bandeau standardisé indiquant qu'un dashboard admin
 * affiche des données de démonstration (mock) et non des données réelles.
 *
 * À placer en haut de tout dashboard utilisant des données fictives,
 * jusqu'à ce que le backend correspondant soit branché.
 */
import React from 'react';
import { Info } from 'lucide-react';

interface DemoDataNoticeProps {
  /** Optional context string explaining what is mocked */
  context?: string;
}

const DemoDataNotice: React.FC<DemoDataNoticeProps> = ({ context }) => (
  <div
    role="status"
    aria-live="polite"
    className="mb-4 flex items-start gap-3 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-sm text-amber-800 dark:text-amber-300"
  >
    <Info className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
    <p>
      <span className="font-semibold">Données de démonstration —</span>{' '}
      {context ??
        'cet écran affiche un jeu de données fictif à des fins d’illustration. Les chiffres ne reflètent pas l’état réel du système.'}
    </p>
  </div>
);

export default DemoDataNotice;
