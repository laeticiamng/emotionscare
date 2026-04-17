import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Network, RefreshCw, AlertTriangle, ShieldAlert, Copy, Trash2, Camera, Loader2 } from 'lucide-react';
import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { runRoutingAudit, type AuditFinding, governanceService } from '@/lib/governance';
import { ROUTES_REGISTRY } from '@/routerV2/registry';
import { toast } from 'sonner';

const severityColor: Record<AuditFinding['severity'], string> = {
  info: 'secondary',
  low: 'secondary',
  medium: 'outline',
  high: 'destructive',
  critical: 'destructive',
};

export default function RoutingGovernancePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [snapshotLoading, setSnapshotLoading] = useState(false);

  const report = useMemo(() => runRoutingAudit(ROUTES_REGISTRY), [refreshKey]);

  const persistSnapshot = async () => {
    setSnapshotLoading(true);
    try {
      const severity =
        report.unguardedSensitive.length > 0
          ? 'high'
          : report.findings.some((f) => f.severity === 'high' || f.severity === 'critical')
          ? 'medium'
          : report.findings.length > 0
          ? 'low'
          : 'info';
      await governanceService.createAudit({
        audit_type: 'routing',
        title: `Snapshot routing — ${new Date().toLocaleString('fr-FR')}`,
        summary: `Score ${report.score}/100 · ${report.findings.length} anomalies · ${report.totalRoutes} routes`,
        score: report.score,
        severity: severity as any,
        findings: report.findings.slice(0, 100) as any,
        metadata: {
          totalRoutes: report.totalRoutes,
          duplicates: report.duplicates.length,
          missingRedirects: report.missingRedirects.length,
          unguardedSensitive: report.unguardedSensitive.length,
          segmentDistribution: report.segmentDistribution,
        },
        triggered_by: null,
      });
      toast.success('Snapshot enregistré dans l\'historique des audits');
    } catch (e: any) {
      toast.error(`Échec snapshot : ${e.message ?? e}`);
    } finally {
      setSnapshotLoading(false);
    }
  };

  const filteredFindings = useMemo(() => {
    if (!search.trim()) return report.findings;
    const q = search.toLowerCase();
    return report.findings.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q),
    );
  }, [report.findings, search]);

  return (
    <GovernanceLayout
      title="Routing & Registre"
      description={`Audit statique des ${report.totalRoutes} routes du registre routerV2.`}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Network className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Score routing : <span className="text-2xl font-bold">{report.score}</span>/100</p>
            <p className="text-xs text-muted-foreground">Calculé localement à chaque rendu, sans appel réseau.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
            <RefreshCw className="mr-2 h-4 w-4" /> Recalculer
          </Button>
          <Button size="sm" onClick={persistSnapshot} disabled={snapshotLoading}>
            {snapshotLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Camera className="mr-2 h-4 w-4" />
            )}
            Snapshot
          </Button>
        </div>
      </div>
      <Progress value={report.score} className="mb-8 h-2" />

      <section className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Routes totales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{report.totalRoutes}</p>
            <p className="text-xs text-muted-foreground">{report.visibleRoutes} visibles · {report.hiddenRoutes} masquées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Doublons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{report.duplicates.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Dépréciées sans redirect</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{report.missingRedirects.length}</p>
            <p className="text-xs text-muted-foreground">sur {report.deprecatedRoutes} dépréciées</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Routes sensibles non gardées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{report.unguardedSensitive.length}</p>
          </CardContent>
        </Card>
      </section>

      <Tabs defaultValue="findings">
        <TabsList>
          <TabsTrigger value="findings">Anomalies ({report.findings.length})</TabsTrigger>
          <TabsTrigger value="duplicates">Doublons ({report.duplicates.length})</TabsTrigger>
          <TabsTrigger value="security">Sécurité ({report.unguardedSensitive.length})</TabsTrigger>
          <TabsTrigger value="distribution">Répartition</TabsTrigger>
        </TabsList>

        <TabsContent value="findings" className="mt-4">
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Filtrer les anomalies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filtrer les anomalies"
            />
          </div>
          {filteredFindings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Aucune anomalie. Le registre est propre. ✨
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {filteredFindings.map((f) => (
                <li key={f.id}>
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-sm">{f.title}</CardTitle>
                        <Badge variant={severityColor[f.severity] as any}>{f.severity}</Badge>
                      </div>
                      {f.category && <CardDescription className="text-xs">{f.category}</CardDescription>}
                    </CardHeader>
                    <CardContent className="text-sm">
                      {f.description && <p className="mb-2 text-muted-foreground">{f.description}</p>}
                      {f.remediation && (
                        <p className="text-xs">
                          <strong>Remédiation :</strong> {f.remediation}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="duplicates" className="mt-4">
          {report.duplicates.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Aucun doublon détecté.</CardContent></Card>
          ) : (
            <ul className="space-y-2">
              {report.duplicates.map((d) => (
                <li key={d.path} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-amber-600" />
                    <code className="text-sm font-mono">{d.path}</code>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {d.count}× ({d.names.join(', ')})
                  </div>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          {report.unguardedSensitive.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Toutes les routes sensibles sont gardées. ✓</CardContent></Card>
          ) : (
            <ul className="space-y-2">
              {report.unguardedSensitive.map((r) => (
                <li key={r.name} className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 p-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-destructive" />
                    <code className="text-sm font-mono">{r.path}</code>
                    <span className="text-xs text-muted-foreground">({r.name})</span>
                  </div>
                  <Badge variant="outline">{r.segment}</Badge>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="distribution" className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-sm">Par segment</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(report.segmentDistribution).map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{k}</span>
                    <Badge variant="secondary">{v}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Par statut</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {Object.entries(report.statusDistribution).map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{k}</span>
                    <Badge variant="secondary">{v}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </GovernanceLayout>
  );
}
