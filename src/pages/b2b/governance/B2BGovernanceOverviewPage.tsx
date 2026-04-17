import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Boxes, ShieldCheck } from 'lucide-react';
import { B2BGovernanceLayout } from '@/components/governance/B2BGovernanceLayout';
import { governanceService } from '@/lib/governance';
import { aggregateSLO, computeGlobalScore } from '@/lib/governance/sloEngine';

export default function B2BGovernanceOverviewPage() {
  const sloQuery = useQuery({
    queryKey: ['b2b-governance', 'slo'],
    queryFn: () => governanceService.listSLO(undefined, 200),
  });
  const modulesQuery = useQuery({
    queryKey: ['b2b-governance', 'modules'],
    queryFn: () => governanceService.listModules(),
  });

  const snapshots = aggregateSLO(sloQuery.data ?? []);
  const globalScore = computeGlobalScore(snapshots);
  const modules = modulesQuery.data ?? [];
  const stableCount = modules.filter((m) => m.status === 'stable').length;
  const killedCount = modules.filter((m) => m.kill_switch_enabled).length;

  return (
    <B2BGovernanceLayout
      title="Vue d'ensemble"
      description="Synthèse de l'état des services consommés par votre organisation."
    >
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Score global services</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{globalScore}/100</p>
            <Badge variant={globalScore >= 90 ? 'default' : globalScore >= 70 ? 'secondary' : 'destructive'} className="mt-2">
              {globalScore >= 90 ? 'Excellent' : globalScore >= 70 ? 'Acceptable' : 'À surveiller'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Modules disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              <Boxes className="mr-2 inline h-6 w-6 text-primary" />
              {modules.length - killedCount}
            </p>
            <p className="text-xs text-muted-foreground">{stableCount} stables · {killedCount} indisponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Conformité données</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              <ShieldCheck className="mr-1 inline h-6 w-6" /> RGPD
            </p>
            <p className="text-xs text-muted-foreground">RLS activée sur l'ensemble des données utilisateur.</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Santé des modules consommés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {snapshots.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucune métrique disponible pour le moment.
            </p>
          ) : (
            <ul className="divide-y">
              {snapshots.map((s) => (
                <li key={s.module_key} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{s.module_key}</p>
                    <p className="text-xs text-muted-foreground">
                      Uptime: {s.uptime !== null ? `${s.uptime.toFixed(1)}%` : '—'} ·
                      Latence p95: {s.latencyP95 !== null ? `${s.latencyP95.toFixed(0)}ms` : '—'}
                    </p>
                  </div>
                  <Badge variant={s.status === 'healthy' ? 'default' : s.status === 'degraded' ? 'secondary' : 'destructive'}>
                    {s.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </B2BGovernanceLayout>
  );
}
