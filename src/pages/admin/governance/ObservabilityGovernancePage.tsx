import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { governanceService } from '@/lib/governance';
import { aggregateSLO, computeGlobalScore } from '@/lib/governance/sloEngine';
import { SLOChart } from '@/components/governance/SLOChart';
import { supabase } from '@/integrations/supabase/client';

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
  const qc = useQueryClient();
  const sloQuery = useQuery({
    queryKey: ['governance', 'slo', 'all'],
    queryFn: () => governanceService.listSLO(undefined, 500),
  });

  const collectMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('governance-slo-collect', { body: {} });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Collecte SLO effectuée');
      qc.invalidateQueries({ queryKey: ['governance', 'slo', 'all'] });
    },
    onError: (e: Error) => toast.error(`Collecte échouée : ${e.message}`),
  });

  const snapshots = useMemo(() => aggregateSLO(sloQuery.data ?? []), [sloQuery.data]);
  const globalScore = useMemo(() => computeGlobalScore(snapshots), [snapshots]);

  return (
    <GovernanceLayout
      title="Observabilité & SLO"
      description="Indicateurs de service par module : disponibilité, latence, taux d'erreur."
    >
      <div className="mb-4 flex items-center justify-end">
        <Button size="sm" onClick={() => collectMutation.mutate()} disabled={collectMutation.isPending}>
          <RefreshCw className={`mr-2 h-4 w-4 ${collectMutation.isPending ? 'animate-spin' : ''}`} />
          {collectMutation.isPending ? 'Collecte…' : 'Collecter maintenant'}
        </Button>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Score global</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{globalScore}/100</p>
            <Progress value={globalScore} className="mt-2 h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Modules monitorés</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{snapshots.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Mesures enregistrées</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{(sloQuery.data ?? []).length}</p></CardContent>
        </Card>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Outils externes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Edge Functions Logs</p>
              <p className="text-xs text-muted-foreground">Logs en temps réel.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/functions" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Ouvrir
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {sloQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
      {!sloQuery.isLoading && snapshots.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">Aucune métrique. Cliquez sur "Collecter maintenant".</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {snapshots.map((s) => (
          <Card key={s.module_key}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono">{s.module_key}</CardTitle>
                <Badge variant={statusBadge[s.status]}>{s.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                <div>
                  <p className={`font-mono text-base ${statusColor[s.status]}`}>
                    {s.uptime !== null ? `${s.uptime.toFixed(1)}%` : '—'}
                  </p>
                  <p className="text-muted-foreground">Uptime</p>
                </div>
                <div>
                  <p className="font-mono text-base">{s.latencyP95 !== null ? `${s.latencyP95.toFixed(0)}ms` : '—'}</p>
                  <p className="text-muted-foreground">p95</p>
                </div>
                <div>
                  <p className="font-mono text-base">{s.errorRate !== null ? `${s.errorRate.toFixed(2)}%` : '—'}</p>
                  <p className="text-muted-foreground">Erreurs</p>
                </div>
              </div>
              <SLOChart series={s.series} metric="uptime" unit="%" />
            </CardContent>
          </Card>
        ))}
      </div>
    </GovernanceLayout>
  );
}
