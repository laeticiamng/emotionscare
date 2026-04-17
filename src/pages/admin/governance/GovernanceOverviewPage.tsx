import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Network, Database, Activity, Boxes, AlertTriangle, ShieldCheck } from 'lucide-react';
import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { runRoutingAudit, governanceService } from '@/lib/governance';

interface ScoreCardProps {
  title: string;
  score: number;
  icon: typeof Network;
  hint: string;
  tone?: 'good' | 'warn' | 'bad';
}

function ScoreCard({ title, score, icon: Icon, hint, tone }: ScoreCardProps) {
  const t = tone ?? (score >= 80 ? 'good' : score >= 60 ? 'warn' : 'bad');
  const colorClass = t === 'good' ? 'text-emerald-600' : t === 'warn' ? 'text-amber-600' : 'text-destructive';
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${colorClass}`} aria-hidden />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
          <span className="text-sm text-muted-foreground">/100</span>
        </div>
        <Progress value={score} className="mt-3 h-2" />
        <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export default function GovernanceOverviewPage() {
  const [routingScore, setRoutingScore] = useState<number>(0);
  const [routingFindings, setRoutingFindings] = useState<number>(0);

  useEffect(() => {
    const report = runRoutingAudit();
    setRoutingScore(report.score);
    setRoutingFindings(report.findings.length);
  }, []);

  const auditsQuery = useQuery({
    queryKey: ['governance', 'audits', 'recent'],
    queryFn: () => governanceService.listAudits(5),
  });

  const modulesQuery = useQuery({
    queryKey: ['governance', 'modules'],
    queryFn: () => governanceService.listModules(),
  });

  const sloQuery = useQuery({
    queryKey: ['governance', 'slo', 'recent'],
    queryFn: () => governanceService.listSLO(undefined, 50),
  });

  const moduleStats = useMemo(() => {
    const modules = modulesQuery.data ?? [];
    const total = modules.length;
    const stable = modules.filter((m) => m.status === 'stable').length;
    const killed = modules.filter((m) => m.kill_switch_enabled).length;
    const score = total === 0 ? 75 : Math.round((stable / total) * 100) - killed * 5;
    return { total, stable, killed, score: Math.max(0, Math.min(100, score)) };
  }, [modulesQuery.data]);

  const observabilityScore = useMemo(() => {
    const m = sloQuery.data ?? [];
    if (m.length === 0) return 70;
    const healthy = m.filter((x) => x.status === 'healthy').length;
    return Math.round((healthy / m.length) * 100);
  }, [sloQuery.data]);

  const dataScore = useMemo(() => {
    // Heuristique : nombre d'audits data_rls récents avec sévérité élevée
    const audits = auditsQuery.data ?? [];
    const dataAudits = audits.filter((a) => a.audit_type === 'data_rls');
    if (dataAudits.length === 0) return 78;
    const last = dataAudits[0];
    return Math.round(last.score ?? 78);
  }, [auditsQuery.data]);

  const globalScore = Math.round((routingScore + dataScore + observabilityScore + moduleStats.score) / 4);

  return (
    <GovernanceLayout
      title="Vue d'ensemble"
      description="Indicateurs synthétiques de gouvernance technique et conformité."
    >
      <section aria-label="Scores globaux" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          title="Routing & Registre"
          score={routingScore}
          icon={Network}
          hint={`${routingFindings} anomalie${routingFindings > 1 ? 's' : ''} détectée${routingFindings > 1 ? 's' : ''}`}
        />
        <ScoreCard
          title="Données & RLS"
          score={dataScore}
          icon={Database}
          hint="Politique d'accès & isolation"
        />
        <ScoreCard
          title="Observabilité"
          score={observabilityScore}
          icon={Activity}
          hint={`${(sloQuery.data ?? []).length} mesures SLO`}
        />
        <ScoreCard
          title="Modules & Flags"
          score={moduleStats.score}
          icon={Boxes}
          hint={`${moduleStats.stable}/${moduleStats.total} stables · ${moduleStats.killed} kill-switchs`}
        />
      </section>

      <section aria-label="Score global" className="mt-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Score global de gouvernance
                </CardTitle>
                <CardDescription>Moyenne pondérée des 4 axes ci-dessus.</CardDescription>
              </div>
              <Badge variant={globalScore >= 80 ? 'default' : globalScore >= 60 ? 'secondary' : 'destructive'}>
                {globalScore >= 80 ? 'Sain' : globalScore >= 60 ? 'À surveiller' : 'Critique'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{globalScore}<span className="text-xl text-muted-foreground">/100</span></div>
            <Progress value={globalScore} className="mt-4 h-3" />
          </CardContent>
        </Card>
      </section>

      <section aria-label="Audits récents" className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Derniers audits</CardTitle>
          </CardHeader>
          <CardContent>
            {auditsQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
            {!auditsQuery.isLoading && (auditsQuery.data ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun audit enregistré pour le moment.</p>
            )}
            <ul className="space-y-3">
              {(auditsQuery.data ?? []).map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 border-b pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.audit_type} · {new Date(a.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <Badge
                    variant={a.severity === 'critical' || a.severity === 'high' ? 'destructive' : 'secondary'}
                  >
                    {a.severity}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Actions recommandées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {routingFindings > 0 && (
                <li>• Examiner {routingFindings} anomalie(s) de routing</li>
              )}
              {moduleStats.killed > 0 && (
                <li>• {moduleStats.killed} module(s) en kill-switch — vérifier l'état</li>
              )}
              {(sloQuery.data ?? []).filter((m) => m.status === 'critical').length > 0 && (
                <li>
                  • {(sloQuery.data ?? []).filter((m) => m.status === 'critical').length} indicateur(s) SLO critique(s)
                </li>
              )}
              {routingFindings === 0 && moduleStats.killed === 0 && (
                <li className="text-muted-foreground">Aucune action critique en attente.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </section>
    </GovernanceLayout>
  );
}
