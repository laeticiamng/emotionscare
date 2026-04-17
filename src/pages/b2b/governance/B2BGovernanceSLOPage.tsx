import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import { B2BGovernanceLayout } from '@/components/governance/B2BGovernanceLayout';
import { governanceService } from '@/lib/governance';
import { aggregateSLO } from '@/lib/governance/sloEngine';
import { SLOChart } from '@/components/governance/SLOChart';

export default function B2BGovernanceSLOPage() {
  const sloQuery = useQuery({
    queryKey: ['b2b-governance', 'slo', 'detailed'],
    queryFn: () => governanceService.listSLO(undefined, 500),
  });

  const snapshots = aggregateSLO(sloQuery.data ?? []);

  return (
    <B2BGovernanceLayout
      title="Santé des services"
      description="Indicateurs de niveau de service (SLO) sur les modules consommés par votre organisation."
    >
      {sloQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
      {!sloQuery.isLoading && snapshots.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            <Activity className="mx-auto mb-2 h-8 w-8" />
            Aucune métrique SLO collectée.
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {snapshots.map((s) => (
          <Card key={s.module_key}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{s.module_key}</CardTitle>
                <Badge variant={s.status === 'healthy' ? 'default' : s.status === 'degraded' ? 'secondary' : 'destructive'}>
                  {s.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="font-mono text-base">{s.uptime !== null ? `${s.uptime.toFixed(1)}%` : '—'}</p>
                  <p className="text-muted-foreground">Uptime</p>
                </div>
                <div>
                  <p className="font-mono text-base">{s.latencyP95 !== null ? `${s.latencyP95.toFixed(0)}ms` : '—'}</p>
                  <p className="text-muted-foreground">Latence p95</p>
                </div>
                <div>
                  <p className="font-mono text-base">{s.errorRate !== null ? `${s.errorRate.toFixed(2)}%` : '—'}</p>
                  <p className="text-muted-foreground">Erreurs</p>
                </div>
              </div>
              <div className="mt-3">
                <SLOChart series={s.series} metric="uptime" unit="%" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </B2BGovernanceLayout>
  );
}
