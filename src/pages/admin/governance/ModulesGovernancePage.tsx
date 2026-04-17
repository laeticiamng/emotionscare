import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Boxes, Power, RefreshCw, Plus, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { governanceService, type ModuleStatus } from '@/lib/governance';
import { DEFAULT_FLAGS } from '@/core/flags';

const statusVariant: Record<ModuleStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  alpha: 'outline',
  beta: 'secondary',
  stable: 'default',
  deprecated: 'destructive',
  sunset: 'destructive',
};

export default function ModulesGovernancePage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const modulesQuery = useQuery({
    queryKey: ['governance', 'modules'],
    queryFn: () => governanceService.listModules(),
  });

  const killSwitchMutation = useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) =>
      governanceService.toggleKillSwitch(key, enabled),
    onSuccess: (_, { enabled, key }) => {
      toast.success(enabled ? `Kill-switch activé pour ${key}` : `Kill-switch désactivé pour ${key}`);
      qc.invalidateQueries({ queryKey: ['governance', 'modules'] });
    },
    onError: (e: Error) => toast.error(`Erreur : ${e.message}`),
  });

  const seedFromFlagsMutation = useMutation({
    mutationFn: async () => {
      const entries = Object.entries(DEFAULT_FLAGS);
      for (const [key, enabled] of entries) {
        await governanceService.upsertModule({
          module_key: key,
          display_name: key.replace(/^FF_/, '').replace(/_/g, ' ').toLowerCase(),
          status: enabled ? 'stable' : 'alpha',
          rollout_percentage: enabled ? 100 : 0,
          kill_switch_enabled: false,
        });
      }
    },
    onSuccess: () => {
      toast.success('Modules synchronisés depuis les feature flags.');
      qc.invalidateQueries({ queryKey: ['governance', 'modules'] });
    },
    onError: (e: Error) => toast.error(`Erreur : ${e.message}`),
  });

  const modules = (modulesQuery.data ?? []).filter((m) =>
    !search.trim() || m.module_key.toLowerCase().includes(search.toLowerCase()) || m.display_name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: (modulesQuery.data ?? []).length,
    stable: (modulesQuery.data ?? []).filter((m) => m.status === 'stable').length,
    beta: (modulesQuery.data ?? []).filter((m) => m.status === 'beta').length,
    killed: (modulesQuery.data ?? []).filter((m) => m.kill_switch_enabled).length,
  };

  return (
    <GovernanceLayout
      title="Modules & Feature Flags"
      description="Cycle de vie des modules : statut, rollout progressif, kill-switch."
    >
      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Modules enregistrés</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{stats.total}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Stables</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-emerald-600">{stats.stable}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">En bêta</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-amber-600">{stats.beta}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Kill-switch actifs</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-destructive">{stats.killed}</p></CardContent>
        </Card>
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Input
          type="search"
          placeholder="Filtrer les modules…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
          aria-label="Filtrer les modules"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => seedFromFlagsMutation.mutate()}
            disabled={seedFromFlagsMutation.isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            Importer depuis feature flags
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => qc.invalidateQueries({ queryKey: ['governance', 'modules'] })}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Boxes className="h-4 w-4" />
            Catalogue des modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modulesQuery.isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
          {!modulesQuery.isLoading && modules.length === 0 && (
            <div className="py-6 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Aucun module enregistré.</p>
              <p className="text-xs text-muted-foreground">Cliquez sur "Importer depuis feature flags" pour initialiser.</p>
            </div>
          )}
          <ul className="divide-y">
            {modules.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono">{m.module_key}</code>
                    <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                    <span className="text-xs text-muted-foreground">v{m.version}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Rollout : {m.rollout_percentage}% · {m.owner ?? 'sans owner'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Power className={`h-4 w-4 ${m.kill_switch_enabled ? 'text-destructive' : 'text-muted-foreground'}`} />
                    <Switch
                      checked={m.kill_switch_enabled}
                      onCheckedChange={(checked) =>
                        killSwitchMutation.mutate({ key: m.module_key, enabled: checked })
                      }
                      aria-label={`Kill-switch pour ${m.module_key}`}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
