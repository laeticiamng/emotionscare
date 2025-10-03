import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'breath:preset:mode';

interface SleepPresetProps {
  active: boolean;
  onToggle: (next: boolean) => void;
}

export const SleepPreset: React.FC<SleepPresetProps> = ({ active, onToggle }) => {
  const [stored, setStored] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const value = window.localStorage.getItem(STORAGE_KEY);
    setStored(value);
    if (value === 'sleep' && !active) {
      onToggle(true);
    }
  }, [active, onToggle]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, active ? 'sleep' : 'default');
  }, [active]);

  const label = useMemo(
    () => (active ? 'Mode Sommeil activé' : 'Activer le mode Sommeil'),
    [active],
  );

  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-950/80 p-6 text-slate-100" data-zero-number-check="true">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-amber-200/80">Routine du soir</p>
          <p className="text-base text-slate-100/90">
            {active
              ? 'Fond sonore feutré, voix basse et visuels ambrés pour guider l’endormissement.'
              : 'Active une ambiance douce, chaleur visuelle et guidance minimale pour glisser vers le sommeil.'}
          </p>
        </div>
        <Button
          variant={active ? 'secondary' : 'default'}
          className="self-start"
          onClick={() => onToggle(!active)}
          aria-pressed={active}
          aria-label={label}
        >
          {label}
        </Button>
        {stored === 'sleep' ? (
          <p className="text-xs text-slate-400/80">
            Préférence mémorisée : ambiance nocturne choisie récemment.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default SleepPreset;
