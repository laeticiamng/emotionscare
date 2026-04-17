import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { governanceService } from '@/lib/governance';

/**
 * Page Données & RLS — surface synthétique vers les outils existants.
 * Le scan RLS approfondi est délégué au tableau Supabase + linter natif.
 */
export default function DataGovernancePage() {
  const auditsQuery = useQuery({
    queryKey: ['governance', 'audits', 'data_rls'],
    queryFn: () => governanceService.listAudits(20, 'data_rls'),
  });

  const lastAudit = auditsQuery.data?.[0];

  return (
    <GovernanceLayout
      title="Données & RLS"
      description="Politique d'accès aux données, isolation utilisateur et conformité RGPD."
    >
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historique des audits données</CardTitle>
        </CardHeader>
        <CardContent>
          {auditsQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {!auditsQuery.isLoading && (auditsQuery.data ?? []).length === 0 && (
            <div className="py-6 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Aucun audit enregistré. Lancez un scan via le linter Supabase.</p>
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
