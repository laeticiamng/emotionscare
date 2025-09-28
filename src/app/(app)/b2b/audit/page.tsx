'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchAuditLogs, exportAuditLogs, AuditLogItem } from '@/services/b2b/suiteClient';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [filters, setFilters] = useState({ from: '', to: '', event: '' });
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadLogs = useCallback(async (params?: { from?: string; to?: string; event?: string }) => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs(params);
      setLogs(data);
      setStatus(data.length === 0 ? 'Aucun journal pour les filtres sélectionnés.' : null);
    } catch (error) {
      console.error('audit.list.failed', error);
      setStatus('Impossible de charger les journaux.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadLogs({
      from: filters.from || undefined,
      to: filters.to || undefined,
      event: filters.event || undefined,
    });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await exportAuditLogs({
        from: filters.from || undefined,
        to: filters.to || undefined,
        event: filters.event || undefined,
      });
      if (result.url) {
        window.open(result.url, '_blank', 'noopener,noreferrer');
        setStatus('Export CSV signé généré.');
      } else if (result.fallback) {
        const blob = new Blob([result.fallback.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `audit-export-${result.fallback.signature.slice(0, 12)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        setStatus('Export CSV généré via signature locale.');
      } else {
        setStatus('Export indisponible.');
      }
    } catch (error) {
      console.error('audit.export.failed', error);
      setStatus('Impossible de générer l’export.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 p-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Journal d’audit</h2>
        <p className="text-sm text-slate-600">
          Chaque action Edge ajoute un résumé textuel sans PII. Les exports autorisent uniquement les colonnes conformes.
        </p>
      </div>

      <form className="grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="audit-from" className="text-sm font-medium text-slate-700">
            Depuis
          </label>
          <Input
            id="audit-from"
            type="datetime-local"
            value={filters.from}
            onChange={(event) => setFilters((prev) => ({ ...prev, from: event.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="audit-to" className="text-sm font-medium text-slate-700">
            Jusqu’à
          </label>
          <Input
            id="audit-to"
            type="datetime-local"
            value={filters.to}
            onChange={(event) => setFilters((prev) => ({ ...prev, to: event.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="audit-event" className="text-sm font-medium text-slate-700">
            Événement (ex: team.invite.sent)
          </label>
          <Input
            id="audit-event"
            value={filters.event}
            onChange={(event) => setFilters((prev) => ({ ...prev, event: event.target.value }))}
          />
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit" disabled={loading}>
            Filtrer
          </Button>
          <Button type="button" variant="outline" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Export…' : 'Exporter CSV signé'}
          </Button>
        </div>
      </form>

      {loading ? (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">Chargement des journaux…</p>
      ) : logs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          {status ?? 'Aucun élément à afficher.'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200" role="table">
            <thead className="bg-slate-100">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Horodatage
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Événement
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Cible
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Résumé
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {logs.map((log, index) => (
                <tr key={`${log.occurred_at}-${index}`}>
                  <td className="px-4 py-3 text-sm text-slate-700">{log.occurred_at}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{log.event}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{log.target ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-900">{log.text_summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p aria-live="polite" className="text-sm text-slate-600">
        {status ??
          'Les exports sont stockés en espace privé et signés. Aucune adresse e-mail ni identifiant brut n’apparaît.'}
      </p>
    </section>
  );
}
