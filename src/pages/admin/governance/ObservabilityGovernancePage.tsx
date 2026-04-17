import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, ExternalLink, AlertCircle } from 'lucide-react';
import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { governanceService } from '@/lib/governance';

const statusColor = {
  healthy: 'text-emerald-600',
  degraded: 'text-amber-600',
  critical: 'text-destructive',
} as const;

const statusBadge = {
  healthy: 'default',
  degraded: 'secondary',
  critical: 'destructive',
} as const;

export default function ObservabilityGovernancePage() {
  const sloQuery = useQuery({
    queryKey: ['governance', 'slo', 'all'],
    queryFn: () => governanceService.listSLO(undefined, 200),
  });

  const grouped = useMemo(() => {
    const map = new Map<string, ReturnType<typeof Array.prototype.filter>>();
    for (const m of sloQuery.data ?? []) {
      const arr = (map.get(m.module_key) as any[]) ?? [];
      arr.push(m);
      map.set(m.module_key, arr as any);
    }
    return Array.from(map.entries()).map(([k, v]) => ({ module: k, metrics: v as any[] }));
  }, [sloQuery.data]);

  const globalUptime = useMemo(() => {
    const m = (sloQuery.data ?? []).filter((x) => x.metric_type === 'uptime');
    if (m.length === 0) return null;
    return Math.round(m.reduce((acc, x) => acc + Number(x.value), 0) / m.length);
  }, [sloQuery.data]);

  return (
    <GovernanceLayout
      title="Observabilité & SLO"
      description="Indicateurs de service par module : disponibilité, latence, taux d'erreur."
    >
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Uptime moyen</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{globalUptime !== null ? `${globalUptime}%` : '—'}</p>
            {globalUptime !== null && <Progress value={globalUptime} className="mt-2 h-2" />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Modules monitorés</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{grouped.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Mesures (24h)</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{(sloQuery.data ?? []).length}</p>
          </CardContent>
        </Card>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Outils d'observabilité externes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Edge Functions Logs</p>
              <p className="text-xs text-muted-foreground">Logs en temps réel des 273 fonctions.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Ouvrir
              </a>
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Database Logs</p>
              <p className="text-xs text-muted-foreground">Performance et erreurs PostgreSQL.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/logs/postgres-logs" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Ouvrir
              </a>
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Dashboard de santé interne</p>
              <p className="text-xs text-muted-foreground">Métriques applicatives EmotionsCare.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/system-health">Consulter</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">SLO par module</CardTitle></CardHeader>
        <CardContent>
          {sloQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {!sloQuery.isLoading && grouped.length === 0 && (
            <div className="py-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Aucune métrique SLO enregistrée.</p>
              <p className="text-xs text-muted-foreground">Configurez la collecte via une edge function planifiée.</p>
            </div>
          )}
          <ul className="space-y-3">
            {grouped.map(({ module, metrics }) => {
              const latest = metrics[0];
              const tone = latest?.status ?? 'healthy';
              return (
                <li key={module} className="flex items-center justify-between border-b py-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{module}</p>
                    <p className="text-xs text-muted-foreground">
                      {metrics.length} mesure(s) · dernière : {new Date(latest.recorded_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-mono ${statusColor[tone as keyof typeof statusColor] ?? ''}`}>
                      {Number(latest.value).toFixed(2)}{latest.unit === 'percent' ? '%' : ` ${latest.unit}`}
                    </span>
                    <Badge variant={statusBadge[tone as keyof typeof statusBadge] ?? 'secondary' as any}>{tone}</Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
