'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchOptimisation, OptimisationSuggestion } from '@/services/b2b/suiteClient';

export default function OptimisationPage() {
  const [suggestions, setSuggestions] = useState<OptimisationSuggestion[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [period, setPeriod] = useState('');
  const [loading, setLoading] = useState(true);

  const loadSuggestions = async (targetPeriod?: string) => {
    setLoading(true);
    try {
      const data = await fetchOptimisation(targetPeriod && targetPeriod.length > 0 ? targetPeriod : undefined);
      setSuggestions(data);
      setStatus(data.length === 0 ? 'Aucune optimisation textuelle disponible pour cette période.' : null);
    } catch (error) {
      console.error('optimisation.fetch.failed', error);
      setStatus('Impossible de charger les suggestions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  return (
    <section className="flex flex-col gap-6 p-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Optimisations suggérées</h2>
        <p className="text-sm text-slate-600">
          Les propositions sont générées à partir d’agrégats textuels (WEMWBS, CBI, UWES). Aucune valeur chiffrée n’est exposée.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"
        onSubmit={(event) => {
          event.preventDefault();
          loadSuggestions(period);
        }}
      >
        <div className="flex-1 space-y-1">
          <label htmlFor="period" className="text-sm font-medium text-slate-700">
            Période (AAAA-MM)
          </label>
          <Input
            id="period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            placeholder="2025-06"
          />
        </div>
        <Button type="submit" className="self-start sm:self-auto">
          Actualiser
        </Button>
      </form>

      {loading ? (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">Chargement des suggestions…</p>
      ) : suggestions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          {status ?? 'Aucun texte disponible. Réessayez plus tard.'}
        </p>
      ) : (
        <div className="grid gap-4" role="list">
          {suggestions.map((suggestion) => (
            <article
              key={suggestion.id}
              role="listitem"
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">{suggestion.title}</h3>
              {suggestion.period && (
                <p className="text-xs uppercase tracking-wide text-slate-500">Période {suggestion.period}</p>
              )}
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                {suggestion.description.length > 320
                  ? `${suggestion.description.slice(0, 320)}…`
                  : suggestion.description}
              </p>
            </article>
          ))}
        </div>
      )}

      <p aria-live="polite" className="text-sm text-slate-600">
        {status ??
          'Les optimisations restent purement textuelles et ne contiennent aucune donnée émotionnelle individuelle ou chiffrée.'}
      </p>
    </section>
  );
}
