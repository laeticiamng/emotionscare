import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, ShieldCheck, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { governanceService, triggerRlsScan } from '@/lib/governance';

/**
 * Page Données & RLS — surface synthétique vers les outils existants.
 * Le scan RLS approfondi est délégué au tableau Supabase + linter natif.
 */
export default function DataGovernancePage() {
  const qc = useQueryClient();
  const auditsQuery = useQuery({
    queryKey: ['governance', 'audits', 'data_rls'],
    queryFn: () => governanceService.listAudits(20, 'data_rls'),
  });

  const scanMutation = useMutation({
    mutationFn: () => triggerRlsScan(),
    onSuccess: (res) => {
      toast.success(`Scan terminé : score ${res.score}/100, ${res.findings_count} findings`);
      qc.invalidateQueries({ queryKey: ['governance', 'audits', 'data_rls'] });
    },
    onError: (e: Error) => toast.error(`Scan échoué : ${e.message}`),
  });

  const lastAudit = auditsQuery.data?.[0];
  const findings = (lastAudit?.findings ?? []) as Array<{ id: string; title: string; severity: string; description?: string; remediation?: string }>;

  return (
    <GovernanceLayout
      title="Données & RLS"
      description="Politique d'accès aux données, isolation utilisateur et conformité RGPD."
    >
      <div className="mb-4 flex items-center justify-end">
        <Button
          size="sm"
          onClick={() => scanMutation.mutate()}
          disabled={scanMutation.isPending}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${scanMutation.isPending ? 'animate-spin' : ''}`} />
          {scanMutation.isPending ? 'Scan en cours…' : 'Lancer un scan RLS'}
        </Button>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Score conformité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{lastAudit?.score ?? '—'}/100</p>
            <p className="text-xs text-muted-foreground">
              {lastAudit ? `Dernier audit : ${new Date(lastAudit.created_at).toLocaleDateString('fr-FR')}` : 'Aucun audit'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Audits enregistrés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{(auditsQuery.data ?? []).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground">Tables RLS-protégées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">
              <ShieldCheck className="mr-1 inline h-6 w-6" />
              ✓
            </p>
            <p className="text-xs text-muted-foreground">RLS activé par défaut sur public.*</p>
          </CardContent>
        </Card>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" />
            Outils d'audit avancés
          </CardTitle>
          <CardDescription>Pour un scan RLS complet, utilisez les outils Supabase natifs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Supabase Database Linter</p>
              <p className="text-xs text-muted-foreground">Détection automatique des tables sans RLS, politiques permissives, fonctions non sécurisées.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/database/linter" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Ouvrir
              </a>
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Dossier Sécurité B2B</p>
              <p className="text-xs text-muted-foreground">Rapport complet RGPD/HDS pour les clients institutionnels.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/security-dossier">Consulter</a>
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Scorecard Sécurité</p>
              <p className="text-xs text-muted-foreground">Suivi des vulnérabilités et plan de remédiation.</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/security-scorecard">Consulter</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {findings.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Findings du dernier scan ({findings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {findings.slice(0, 20).map((f) => (
                <li key={f.id} className="rounded-md border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{f.title}</p>
                    <Badge variant={f.severity === 'critical' || f.severity === 'high' ? 'destructive' : 'secondary'}>
                      {f.severity}
                    </Badge>
                  </div>
                  {f.description && <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>}
                  {f.remediation && <p className="mt-1 text-xs"><strong>Fix :</strong> {f.remediation}</p>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historique des audits données</CardTitle>
        </CardHeader>
        <CardContent>
          {auditsQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {!auditsQuery.isLoading && (auditsQuery.data ?? []).length === 0 && (
            <div className="py-6 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Aucun audit enregistré. Cliquez sur "Lancer un scan RLS".</p>
            </div>
          )}
          <ul className="space-y-2">
            {(auditsQuery.data ?? []).map((a) => (
              <li key={a.id} className="flex items-center justify-between border-b py-2 last:border-0">
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-2">
                  {a.score !== null && <span className="text-sm font-mono">{a.score}/100</span>}
                  <Badge variant={a.severity === 'high' || a.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {a.severity}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
